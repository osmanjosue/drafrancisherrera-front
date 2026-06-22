/**
 * chatCore.ts — Núcleo del módulo de chat (toda la lógica NO-UI).
 *
 * Co-localiza en un solo archivo: contrato/tipos, configuración, sesión
 * (store + manager), transporte de red, utilidades (ids, WhatsApp), el
 * armado del payload, la composición de servicios y los hooks de React.
 *
 * El diseño interno sigue siendo modular (clases/funciones con una sola
 * responsabilidad e interfaces para inyección de dependencias); solo se
 * agrupa físicamente para facilitar la navegación.
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { SITE_CONFIG } from '../config/site';

/* ============================================================================
 * 1. CONTRATO / TIPOS
 * ========================================================================== */

/** Tipo de evento que el widget envía al webhook de n8n. */
export type ChatEventType = 'session_start' | 'message' | 'escalation_request';

/** Datos de la sesión anónima (sin login). Llave: `id`. */
export interface SessionInfo {
  id: string;
  createdAt: string;
  expiresAt: string;
}

/** Un mensaje saliente dentro del payload. */
export interface MessagePayload {
  id: string;
  text: string;
  timestamp: string;
}

/** Metadata de contexto para la IA y la atribución. */
export interface ContextPayload {
  pageUrl: string;
  referrer: string;
  language: string;
  userAgent: string;
}

/** Cuerpo exacto que recibe el nodo de n8n. */
export interface WebhookPayload {
  event: ChatEventType;
  session: SessionInfo;
  message?: MessagePayload;
  context: ContextPayload;
  escalationReason?: string;
}

/** Respuesta que n8n devuelve al widget tras procesar un mensaje. */
export interface WebhookResponse {
  reply: string;
  escalate?: boolean;
  escalation?: {
    reason?: string;
    whatsappUrl?: string;
  };
}

/** Modelo de mensaje para la UI (incluye estado de envío). */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  whatsappUrl?: string;
}

/** Abstracción de persistencia de la sesión (DIP). */
export interface ISessionStore {
  load(): SessionInfo | null;
  save(session: SessionInfo): void;
  clear(): void;
}

/** Abstracción del envío al webhook (DIP). */
export interface IChatTransport {
  send(payload: WebhookPayload): Promise<WebhookResponse>;
}

/* ============================================================================
 * 2. CONFIGURACIÓN
 * ========================================================================== */

const env = (key: string, fallback = ''): string => {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return value ?? fallback;
};

export interface ChatConfig {
  webhook: {
    url: string;
    token: string;
    timeoutMs: number;
    maxRetries: number;
  };
  /** Anti-bot opcional (Cloudflare Turnstile). siteKey vacío = desactivado. */
  turnstile: {
    siteKey: string;
  };
  session: {
    ttlMs: number;
    storageKey: string;
    slidingExpiration: boolean;
  };
  whatsapp: {
    phone: string;
    defaultMessage: string;
  };
  ui: {
    title: string;
    subtitle: string;
    placeholder: string;
    welcomeMessage: string;
    bubbleLabel: string;
    whatsappButtonLabel: string;
    disclaimer: string;
    errorMessage: string;
  };
}

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export const CHAT_CONFIG: ChatConfig = {
  webhook: {
    // Apunta al BACKEND propio (Express), no a n8n directo. El backend agrega
    // el secreto hacia n8n y valida CORS/rate-limit/anti-bot.
    url: env('VITE_CHAT_WEBHOOK_URL', 'https://CAMBIAR-tu-backend/api/webhook_chatbot_drafrancisherrera'),
    token: env('VITE_CHAT_WEBHOOK_TOKEN', ''),
    timeoutMs: 15000,
    maxRetries: 2,
  },
  turnstile: {
    // Site key pública de Cloudflare Turnstile. Vacío = anti-bot desactivado.
    siteKey: env('VITE_TURNSTILE_SITE_KEY', ''),
  },
  session: {
    ttlMs: TWO_HOURS_MS,
    storageKey: 'dfh_chat_session',
    slidingExpiration: false,
  },
  whatsapp: {
    phone: SITE_CONFIG.whatsapp.phone,
    defaultMessage: SITE_CONFIG.whatsapp.defaultMessage,
  },
  ui: {
    title: 'Asistente del Consultorio',
    subtitle: 'Dra. Francis Herrera · Ginecología',
    placeholder: 'Escribe tu pregunta…',
    welcomeMessage:
      '¡Hola! Soy la asistente virtual de la Dra. Francis Herrera. Puedo ayudarte con ' +
      'horarios, ubicación, servicios y cómo agendar tu cita. ¿En qué te ayudo?',
    bubbleLabel: 'Abrir chat de ayuda',
    whatsappButtonLabel: 'Continuar por WhatsApp',
    disclaimer:
      'Este asistente brinda información general y no reemplaza una consulta médica. ' +
      'Ante síntomas o urgencias, te conectaremos con recepción.',
    errorMessage:
      'Lo siento, hubo un problema de conexión. Intenta de nuevo o continúa por WhatsApp.',
  },
};

/* ============================================================================
 * 3. UTILIDADES (ids + WhatsApp)
 * ========================================================================== */

/** UUID v4. Usa crypto nativo y cae a un fallback si no existe. */
export const newId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/** ISO-8601 del instante actual (o de un Date dado). */
export const nowIso = (date: Date = new Date()): string => date.toISOString();

export interface WhatsAppLinkParams {
  phone: string;
  message: string;
  sessionRef?: string;
}

/** Devuelve una URL https://wa.me/... con el mensaje pre-cargado. */
export const buildWhatsAppUrl = ({
  phone,
  message,
  sessionRef,
}: WhatsAppLinkParams): string => {
  const text = sessionRef ? `${message} [REF:${sessionRef}]` : message;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

/* ============================================================================
 * 4. SESIÓN (store + manager)
 * ========================================================================== */

/** Persistencia de la sesión en localStorage. Único módulo que lo conoce. */
export class LocalStorageSessionStore implements ISessionStore {
  private readonly storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  load(): SessionInfo | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<SessionInfo>;
      if (!parsed.id || !parsed.createdAt || !parsed.expiresAt) return null;
      return parsed as SessionInfo;
    } catch {
      return null;
    }
  }

  save(session: SessionInfo): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(session));
    } catch {
      // Silencioso: sin persistencia la sesión vive solo en memoria.
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // no-op
    }
  }
}

export interface SessionManagerOptions {
  ttlMs: number;
  slidingExpiration: boolean;
}

/** Garantiza siempre una SessionInfo válida (no expirada). */
export class SessionManager {
  private readonly store: ISessionStore;
  private readonly options: SessionManagerOptions;

  constructor(store: ISessionStore, options: SessionManagerOptions) {
    this.store = store;
    this.options = options;
  }

  private isExpired(session: SessionInfo, now: number): boolean {
    return now >= new Date(session.expiresAt).getTime();
  }

  private create(now: number): SessionInfo {
    const session: SessionInfo = {
      id: newId(),
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + this.options.ttlMs).toISOString(),
    };
    this.store.save(session);
    return session;
  }

  getOrCreate(now: number = Date.now()): SessionInfo {
    const existing = this.store.load();

    if (!existing || this.isExpired(existing, now)) {
      return this.create(now);
    }

    if (this.options.slidingExpiration) {
      const renewed: SessionInfo = {
        ...existing,
        expiresAt: new Date(now + this.options.ttlMs).toISOString(),
      };
      this.store.save(renewed);
      return renewed;
    }

    return existing;
  }

  reset(now: number = Date.now()): SessionInfo {
    this.store.clear();
    return this.create(now);
  }

  remainingMs(now: number = Date.now()): number {
    const existing = this.store.load();
    if (!existing) return 0;
    return Math.max(0, new Date(existing.expiresAt).getTime() - now);
  }
}

/* ============================================================================
 * 5. TRANSPORTE DE RED
 * ========================================================================== */

export interface WebhookTransportOptions {
  url: string;
  token: string;
  timeoutMs: number;
  maxRetries: number;
  /**
   * Proveedor opcional de cabeceras de autenticación (p.ej. el token anti-bot
   * de Turnstile). Se invoca antes de cada intento para obtener un token fresco.
   */
  authProvider?: () => Promise<Record<string, string>>;
}

/** Error con código HTTP para diferenciar 4xx (no reintentar) de 5xx. */
export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Backoff exponencial: 400ms, 800ms, 1600ms... */
const backoffMs = (attempt: number): number => 400 * 2 ** attempt;

/** POST al webhook con token, timeout, reintentos e idempotencia. */
export class WebhookTransport implements IChatTransport {
  private readonly options: WebhookTransportOptions;

  constructor(options: WebhookTransportOptions) {
    this.options = options;
  }

  async send(payload: WebhookPayload): Promise<WebhookResponse> {
    const { maxRetries } = this.options;
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.attempt(payload);
      } catch (err) {
        lastError = err;
        if (err instanceof HttpError && err.status >= 400 && err.status < 500) {
          throw err;
        }
        if (attempt < maxRetries) {
          await delay(backoffMs(attempt));
        }
      }
    }
    throw lastError instanceof Error
      ? lastError
      : new Error('Fallo de red desconocido al contactar el webhook.');
  }

  private async attempt(payload: WebhookPayload): Promise<WebhookResponse> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.options.timeoutMs);

    // Cabeceras de autenticación dinámicas (p.ej. token anti-bot Turnstile).
    // Token fresco por intento, porque los tokens son de un solo uso.
    const authHeaders = this.options.authProvider
      ? await this.options.authProvider()
      : {};

    try {
      const res = await fetch(this.options.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...(this.options.token
            ? { 'X-Webhook-Token': this.options.token }
            : {}),
          ...(payload.message?.id
            ? { 'Idempotency-Key': payload.message.id }
            : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new HttpError(res.status, `Webhook respondió ${res.status}`);
      }

      return await this.parseResponse(res);
    } finally {
      clearTimeout(timer);
    }
  }

  private async parseResponse(res: Response): Promise<WebhookResponse> {
    const text = await res.text();
    if (!text) return { reply: '' };
    try {
      const data = JSON.parse(text) as Partial<WebhookResponse>;
      return {
        reply: data.reply ?? '',
        escalate: data.escalate,
        escalation: data.escalation,
      };
    } catch {
      return { reply: text };
    }
  }
}

/* ============================================================================
 * 6. ARMADO DEL PAYLOAD
 * ========================================================================== */

/** Captura el contexto actual del navegador. Tolerante a SSR. */
const buildContext = (): ContextPayload => {
  if (typeof window === 'undefined') {
    return { pageUrl: '', referrer: '', language: 'es', userAgent: '' };
  }
  return {
    pageUrl: window.location.href,
    referrer: document.referrer,
    language: navigator.language || 'es',
    userAgent: navigator.userAgent,
  };
};

/** Única fuente de verdad del FORMATO del payload. */
export class PayloadBuilder {
  static sessionStart(session: SessionInfo): WebhookPayload {
    return { event: 'session_start', session, context: buildContext() };
  }

  static message(session: SessionInfo, message: MessagePayload): WebhookPayload {
    return { event: 'message', session, message, context: buildContext() };
  }

  static escalation(
    session: SessionInfo,
    reason: string,
    lastMessage?: MessagePayload,
  ): WebhookPayload {
    return {
      event: 'escalation_request',
      session,
      message: lastMessage,
      context: buildContext(),
      escalationReason: reason,
    };
  }

  static makeMessage(id: string, text: string): MessagePayload {
    return { id, text, timestamp: nowIso() };
  }
}

/* ============================================================================
 * 7. ANTI-BOT (Cloudflare Turnstile) — opcional
 * ========================================================================== */

/** API mínima de Turnstile que usamos (evita 'any'). */
interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  execute: (id: string) => void;
  reset: (id: string) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileScriptPromise: Promise<void> | null = null;

/** Carga el script de Turnstile una sola vez. */
const loadTurnstileScript = (): Promise<void> => {
  if (turnstileScriptPromise) return turnstileScriptPromise;
  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    if (typeof document === 'undefined') return resolve();
    if (window.turnstile) return resolve();
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('No se pudo cargar Turnstile.'));
    document.head.appendChild(s);
  });
  return turnstileScriptPromise;
};

/**
 * Crea un proveedor de cabeceras anti-bot. Renderiza un widget invisible una
 * vez y, en cada llamada, obtiene un token fresco (reset + execute). Devuelve
 * { 'cf-turnstile-response': token } o {} si algo falla (el backend decide).
 */
export const createTurnstileTokenProvider = (
  siteKey: string,
): (() => Promise<Record<string, string>>) => {
  let widgetId: string | undefined;
  let pending: ((headers: Record<string, string>) => void) | null = null;

  const resolvePending = (headers: Record<string, string>) => {
    if (pending) {
      pending(headers);
      pending = null;
    }
  };

  return async () => {
    try {
      await loadTurnstileScript();
    } catch {
      return {};
    }
    const turnstile = typeof window !== 'undefined' ? window.turnstile : undefined;
    if (!turnstile) return {};

    return new Promise<Record<string, string>>((resolve) => {
      pending = resolve;
      if (widgetId === undefined) {
        const container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);
        widgetId = turnstile.render(container, {
          sitekey: siteKey,
          size: 'invisible',
          callback: (token: string) =>
            resolvePending(token ? { 'cf-turnstile-response': token } : {}),
          'error-callback': () => resolvePending({}),
        });
      } else {
        turnstile.reset(widgetId);
        turnstile.execute(widgetId);
      }
    });
  };
};

/* ============================================================================
 * 8. COMPOSITION ROOT (inyección de dependencias)
 * ========================================================================== */

export interface ChatServices {
  config: ChatConfig;
  sessionManager: SessionManager;
  transport: IChatTransport;
}

/** Ensambla los servicios del chat a partir de la configuración. */
export const createChatServices = (
  config: ChatConfig = CHAT_CONFIG,
): ChatServices => {
  const store = new LocalStorageSessionStore(config.session.storageKey);

  const sessionManager = new SessionManager(store, {
    ttlMs: config.session.ttlMs,
    slidingExpiration: config.session.slidingExpiration,
  });

  // Anti-bot opcional: solo se activa si hay site key configurada.
  const authProvider = config.turnstile.siteKey
    ? createTurnstileTokenProvider(config.turnstile.siteKey)
    : undefined;

  const transport = new WebhookTransport({
    url: config.webhook.url,
    token: config.webhook.token,
    timeoutMs: config.webhook.timeoutMs,
    maxRetries: config.webhook.maxRetries,
    authProvider,
  });

  return { config, sessionManager, transport };
};

/* ============================================================================
 * 8. HOOKS DE REACT
 * ========================================================================== */

export interface UseSessionResult {
  session: SessionInfo;
  ensureValid: () => SessionInfo;
  reset: () => SessionInfo;
}

/** Expone la sesión vigente a React (envuelve SessionManager). */
export const useSession = (manager: SessionManager): UseSessionResult => {
  const [session, setSession] = useState<SessionInfo>(() =>
    manager.getOrCreate(),
  );

  const ensureValid = useCallback((): SessionInfo => {
    const fresh = manager.getOrCreate();
    setSession((prev) => (prev.id !== fresh.id ? fresh : prev));
    return fresh;
  }, [manager]);

  const reset = useCallback((): SessionInfo => {
    const fresh = manager.reset();
    setSession(fresh);
    return fresh;
  }, [manager]);

  return useMemo(
    () => ({ session, ensureValid, reset }),
    [session, ensureValid, reset],
  );
};

export interface UseChatResult {
  messages: ChatMessage[];
  isSending: boolean;
  send: (text: string) => Promise<void>;
  requestEscalation: (reason?: string) => Promise<void>;
  notifyOpen: () => void;
  whatsappFallbackUrl: string;
}

const addMessage = (list: ChatMessage[], msg: ChatMessage): ChatMessage[] => [
  ...list,
  msg,
];

const patchMessage = (
  list: ChatMessage[],
  id: string,
  patch: Partial<ChatMessage>,
): ChatMessage[] => list.map((m) => (m.id === id ? { ...m, ...patch } : m));

/** Orquesta la conversación: estado de mensajes, envío y escalado. */
export const useChat = (services: ChatServices): UseChatResult => {
  const { sessionManager, transport, config } = services;
  const { session, ensureValid } = useSession(sessionManager);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: newId(),
      role: 'assistant',
      text: config.ui.welcomeMessage,
      timestamp: nowIso(),
      status: 'sent',
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const openNotified = useRef(false);

  const whatsappFallbackUrl = buildWhatsAppUrl({
    phone: config.whatsapp.phone,
    message: config.whatsapp.defaultMessage,
    sessionRef: session.id,
  });

  const notifyOpen = useCallback(() => {
    if (openNotified.current) return;
    openNotified.current = true;
    const fresh = ensureValid();
    void transport.send(PayloadBuilder.sessionStart(fresh))
      .then((res) => console.log('[chat] session_start response:', res))
      .catch((err) => console.error('[chat] session_start error:', err));
  }, [ensureValid, transport]);

  const appendAssistant = useCallback(
    (text: string, whatsappUrl?: string) => {
      setMessages((prev) =>
        addMessage(prev, {
          id: newId(),
          role: 'assistant',
          text,
          timestamp: nowIso(),
          status: 'sent',
          whatsappUrl,
        }),
      );
    },
    [],
  );

  const send = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isSending) return;

      const fresh = ensureValid();
      const messageId = newId();

      setMessages((prev) =>
        addMessage(prev, {
          id: messageId,
          role: 'user',
          text,
          timestamp: nowIso(),
          status: 'sending',
        }),
      );
      setIsSending(true);

      try {
        const payload = PayloadBuilder.message(
          fresh,
          PayloadBuilder.makeMessage(messageId, text),
        );
        const res = await transport.send(payload);

        setMessages((prev) => patchMessage(prev, messageId, { status: 'sent' }));

        const whatsappUrl = res.escalate
          ? res.escalation?.whatsappUrl ?? whatsappFallbackUrl
          : undefined;

        if (res.reply) {
          appendAssistant(res.reply, whatsappUrl);
        } else if (whatsappUrl) {
          appendAssistant(config.ui.disclaimer, whatsappUrl);
        }
      } catch {
        setMessages((prev) => patchMessage(prev, messageId, { status: 'error' }));
        appendAssistant(config.ui.errorMessage, whatsappFallbackUrl);
      } finally {
        setIsSending(false);
      }
    },
    [
      isSending,
      ensureValid,
      transport,
      appendAssistant,
      whatsappFallbackUrl,
      config.ui.errorMessage,
      config.ui.disclaimer,
    ],
  );

  const requestEscalation = useCallback(
    async (reason = 'El paciente solicitó hablar con recepción.') => {
      const fresh = ensureValid();
      try {
        const res = await transport.send(
          PayloadBuilder.escalation(fresh, reason),
        );
        appendAssistant(
          res.reply || 'Te conecto con recepción.',
          res.escalation?.whatsappUrl ?? whatsappFallbackUrl,
        );
      } catch {
        appendAssistant(config.ui.errorMessage, whatsappFallbackUrl);
      }
    },
    [ensureValid, transport, appendAssistant, whatsappFallbackUrl, config.ui.errorMessage],
  );

  return {
    messages,
    isSending,
    send,
    requestEscalation,
    notifyOpen,
    whatsappFallbackUrl,
  };
};
