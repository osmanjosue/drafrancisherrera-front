/**
 * ChatWidget.tsx — Toda la interfaz del widget en un solo archivo.
 *
 * Co-localiza el componente principal `ChatWidget` y sus subcomponentes de
 * presentación (ChatBubble, ChatWindow, MessageList, MessageBubble,
 * MessageInput). La lógica vive en `chatCore.ts`; aquí solo hay UI.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  CHAT_CONFIG,
  createChatServices,
  useChat,
} from './chatCore';
import type { ChatConfig, ChatMessage } from './chatCore';
import './chat.css';

/* ----------------------------------------------------------------------------
 * ChatBubble — botón flotante que abre/cierra el chat.
 * -------------------------------------------------------------------------- */
interface ChatBubbleProps {
  isOpen: boolean;
  unread: boolean;
  label: string;
  onClick: () => void;
}

function ChatBubble({ isOpen, unread, label, onClick }: ChatBubbleProps) {
  return (
    <button
      type="button"
      className={`dfh-chat-bubble${isOpen ? ' is-open' : ''}`}
      onClick={onClick}
      aria-label={label}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      ) : (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      )}
      {!isOpen && unread && <span className="dfh-chat-bubble__dot" aria-hidden="true" />}
    </button>
  );
}

/* ----------------------------------------------------------------------------
 * MessageBubble — render de un único mensaje + botón de escalado opcional.
 * -------------------------------------------------------------------------- */
interface MessageBubbleProps {
  message: ChatMessage;
  whatsappButtonLabel: string;
}

function MessageBubble({ message, whatsappButtonLabel }: MessageBubbleProps) {
  const { role, text, status, whatsappUrl } = message;

  return (
    <div className={`dfh-msg dfh-msg--${role}`}>
      <div className="dfh-msg__bubble">
        <p className="dfh-msg__text">{text}</p>

        {whatsappUrl && (
          <a
            className="dfh-msg__wa"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2a9.9 9.9 0 0 0-8.46 15.06L2 22l5.07-1.33A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 0 1 6.86 12.4l-.2.32.6 2.2-2.26-.59-.3.18A8.1 8.1 0 1 1 12.04 3.8zm-3.1 3.4c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.7 4.18 3.68 2.06.82 2.48.66 2.93.62.45-.04 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.32-.74-1.8-.2-.48-.4-.41-.54-.42h-.46z" />
            </svg>
            {whatsappButtonLabel}
          </a>
        )}
      </div>

      {status === 'sending' && <span className="dfh-msg__status">Enviando…</span>}
      {status === 'error' && <span className="dfh-msg__status is-error">No se pudo enviar</span>}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * MessageList — lista de mensajes con auto-scroll al último.
 * -------------------------------------------------------------------------- */
interface MessageListProps {
  messages: ChatMessage[];
  isSending: boolean;
  whatsappButtonLabel: string;
}

function MessageList({ messages, isSending, whatsappButtonLabel }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  return (
    <div className="dfh-chat__messages" role="log" aria-live="polite">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} whatsappButtonLabel={whatsappButtonLabel} />
      ))}

      {isSending && (
        <div className="dfh-msg dfh-msg--assistant">
          <div className="dfh-msg__bubble dfh-msg__bubble--typing">
            <span /><span /><span />
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * MessageInput — caja de texto + botón enviar (Enter envía, Shift+Enter salto).
 * -------------------------------------------------------------------------- */
interface MessageInputProps {
  placeholder: string;
  disabled: boolean;
  onSend: (text: string) => void;
}

function MessageInput({ placeholder, disabled, onSend }: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) textareaRef.current?.focus();
  }, [disabled]);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="dfh-chat__input">
      <textarea
        ref={textareaRef}
        className="dfh-chat__textarea"
        rows={1}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Escribe tu mensaje"
      />
      <button
        type="button"
        className="dfh-chat__send"
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label="Enviar mensaje"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      </button>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * ChatWindow — ventana del chat (header + lista + escalado + input).
 * -------------------------------------------------------------------------- */
interface ChatWindowProps {
  config: ChatConfig;
  messages: ChatMessage[];
  isSending: boolean;
  onSend: (text: string) => void;
  onEscalate: () => void;
  onClose: () => void;
}

function ChatWindow({
  config,
  messages,
  isSending,
  onSend,
  onEscalate,
  onClose,
}: ChatWindowProps) {
  return (
    <div className="dfh-chat" role="dialog" aria-label={config.ui.title}>
      <header className="dfh-chat__header">
        <div className="dfh-chat__header-info">
          <span className="dfh-chat__avatar" aria-hidden="true">⚕️</span>
          <div>
            <strong className="dfh-chat__title">{config.ui.title}</strong>
            <span className="dfh-chat__subtitle">{config.ui.subtitle}</span>
          </div>
        </div>
        <button
          type="button"
          className="dfh-chat__close"
          onClick={onClose}
          aria-label="Cerrar chat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <MessageList
        messages={messages}
        isSending={isSending}
        whatsappButtonLabel={config.ui.whatsappButtonLabel}
      />

      <div className="dfh-chat__escalate-row">
        <button type="button" className="dfh-chat__escalate" onClick={onEscalate}>
          {config.ui.whatsappButtonLabel}
        </button>
      </div>

      <MessageInput
        placeholder={config.ui.placeholder}
        disabled={isSending}
        onSend={onSend}
      />

      <p className="dfh-chat__disclaimer">{config.ui.disclaimer}</p>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * ChatWidget — orquestador raíz. Único componente que se monta en la app.
 * -------------------------------------------------------------------------- */
interface ChatWidgetProps {
  /** Permite inyectar una config alternativa (tests, multi-sitio). */
  config?: ChatConfig;
}

export function ChatWidget({ config = CHAT_CONFIG }: ChatWidgetProps) {
  const services = useMemo(() => createChatServices(config), [config]);
  const { messages, isSending, send, requestEscalation, notifyOpen } =
    useChat(services);

  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
    notifyOpen();
  };

  const toggle = () => (isOpen ? setIsOpen(false) : open());

  return (
    <div className="dfh-chat-widget">
      {isOpen && (
        <ChatWindow
          config={config}
          messages={messages}
          isSending={isSending}
          onSend={send}
          onEscalate={() => void requestEscalation()}
          onClose={() => setIsOpen(false)}
        />
      )}

      <ChatBubble
        isOpen={isOpen}
        unread={false}
        label={config.ui.bubbleLabel}
        onClick={toggle}
      />
    </div>
  );
}
