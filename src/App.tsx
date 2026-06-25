import { useState } from 'react';
import { SERVICES } from './data/services';
import { CREDENTIALS } from './data/credentials';
import { CONTACT_INFO } from './data/contact';
import { CONTACT_FORM_FIELDS } from './data/contactForm';
import { DOCTOR_INFO } from './data/doctor';
import { ChatWidget } from './chat';
import { BookingModal, useBooking } from './booking';
import { useContact } from './contact';
import { SITE_CONFIG } from './config/site';

/** Estilo compartido para la máscara CSS del logo: inyecta la URL del asset desde el config. */
const logoMaskStyle = { '--logo-url': `url('${SITE_CONFIG.logoUrl}')` } as React.CSSProperties;

export default function App() {
  const contact = useContact();

  const booking = useBooking();
  const [activeServiceId, setActiveServiceId] = useState(1);
  const activeService = SERVICES.find(s => s.id === activeServiceId);

  return (
    <div className="app-wrapper">
      {/* Header / Navbar */}
      <header className="main-header">
        <div className="container header-container">
          <a href="#" className="logo">

            <span className="logo-image logo-mask" style={logoMaskStyle}></span>

            <div className="logo-text">
              <span className="logo-title">{DOCTOR_INFO.fullName}</span>
              <span className="logo-sub">Ginecología & Obstetricia</span>
            </div>
          </a>

          <nav className="desktop-nav">
            <a href="#inicio" className="nav-link">Inicio</a>
            <a href="#servicios" className="nav-link">Servicios</a>
            <a href="#acerca" className="nav-link">Sobre Mí</a>
            <a href="#contacto" className="nav-link">Contacto</a>
          </nav>

          <button className="btn btn-primary btn-header" onClick={() => booking.open()}>
            Agendar Consulta
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="profile-header">
              <span className="profile-colegiacion">
                <span className="colegiacion-icon">⚕️</span> Colegiación: {DOCTOR_INFO.colegiacion.join(' - ')}
              </span>
            </div>
            <h1 className="hero-title">
              Salud femenina, equilibrio hormonal y <span className="highlight">bienestar íntimo</span> con respaldo científico y atención humana.
            </h1>

            {/* Resumen Profesional */}
            <div className="glass-card hero-profile-summary">

              <div className="profile-cards-container">
                {/* Especialidades Card */}
                <div className="profile-sub-card">
                  <div className="sub-card-header">
                    <span className="sub-card-icon">🩺</span>
                    <h4>Especialidades Médicas</h4>
                  </div>
                  <div className="sub-card-content">
                    {DOCTOR_INFO.specialties.map((spec, index) => (
                      <div className="profile-badge-item" key={index}>
                        <span className="badge-bullet">✦</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experiencia Card */}
                <div className="profile-sub-card">
                  <div className="sub-card-header">
                    <span className="sub-card-icon">⏳</span>
                    <h4>Experiencia & Trayectoria</h4>
                  </div>
                  <div className="sub-card-content">
                    {DOCTOR_INFO.experience.map((exp, index) => (
                      <div className="profile-badge-item" key={index}>
                        <span className="badge-bullet">✦</span>
                        <span>{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-image-container">
            <div className="doctor-visual-card">
              <div className="visual-bg-glow"></div>
              <div className="visual-graphic">
                {/* Modern graphic card representing healthcare & technology */}
                <div className="stethoscope-glow">
                  <span className="logo-mask hero-logo" style={logoMaskStyle}></span>
                </div>
                <div className="floating-health-bubble">
                  <div className="bubble-icon">❤️</div>
                  <div className="bubble-text">
                    <strong>Salud Femenina</strong>
                    <span>Cuidado Integral</span>
                  </div>
                </div>
                <div className="floating-health-bubble bubble-alt">
                  <div className="bubble-icon">🩺</div>
                  <div className="bubble-text">
                    <strong>Control Preventivo</strong>
                    <span>Chequeo Anual</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="metrics-grid glass-card">
              <div className="profile-sub-card metric-item">
                <span className="metric-num">12+</span>
                <span className="metric-label">Años de Experiencia</span>
              </div>
              <div className="profile-sub-card metric-item">
                <span className="metric-num">1,000+</span>
                <span className="metric-label">Pacientes Atendidas</span>
              </div>
              <div className="profile-sub-card metric-item">
                <span className="metric-num">100%</span>
                <span className="metric-label">Atención Humana</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ marginTop: '40px' }}>
          <div className="hero-actions" style={{ justifyContent: 'center', marginBottom: '0' }}>
            <button className="btn btn-primary" onClick={() => booking.open()}>
              Reservar cita online
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <a href="#servicios" className="btn btn-secondary">
              Ver especialidades
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Servicios profesionales</span>
            <h2 className="section-title">Especialidades & Servicios</h2>
            <p className="section-subtitle">
              Soluciones integrales de salud adaptadas a las necesidades particulares de cada etapa de tu vida.
            </p>
          </div>

          <div className="services-layout">
            {/* Tabs Selector */}
            <div className="services-tabs">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  className={`service-tab-button ${activeServiceId === service.id ? 'active' : ''}`}
                  onClick={() => setActiveServiceId(service.id)}
                >
                  <div className="tab-icon-wrapper">
                    {service.icon}
                  </div>
                  <span className="tab-title">{service.title}</span>
                  <span className="tab-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="services-detail-container">
              {activeService && (
                <div className="glass-card services-detail-panel animate-fade-in">
                  <div className="detail-header">
                    <div className="detail-icon-bg">
                      {activeService.icon}
                    </div>
                    <div className="detail-header-text">
                      <h3 className="detail-title">{activeService.title}</h3>
                      <p className="detail-subtitle-meta">Servicio de Especialidad Médica</p>
                    </div>
                  </div>

                  <p className="detail-description">{activeService.description}</p>

                  <div className="services-list-divider"></div>

                  <h4 className="procedures-title">Procedimientos & Tratamientos</h4>
                  <div className="services-list-grid">
                    {activeService.items.map((item, index) => (
                      <div key={index} className="service-item">
                        <span className="service-item-bullet">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </span>
                        <span className="service-item-text">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="detail-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => booking.open(`Consulta de Especialidad: ${activeService.title}`)}
                    >
                      Solicitar consulta para {activeService.title}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="acerca" className="about-section">
        <div className="container about-container">
          <div className="about-graphic">
            <div className="about-img-frame">
              <div className="experience-tag">
                <span className="exp-years">12+</span>
                <span className="exp-text">Años cuidando tu salud</span>
              </div>
              <img 
                src="/dra_francis_herrera.webp" 
                alt="Dra. Francis Herrera" 
                className="about-doctor-img"
              />
            </div>
          </div>

          <div className="about-content">
            <span className="section-tag">Sobre Mí</span>
            <h2 className="section-title">{DOCTOR_INFO.name}</h2>
            <p className="about-subtitle-meta">Médica Cirujana y Especialista en Ginecología y Obstetricia</p>

            <div className="about-paragraphs">
              <p>
                Me dedico a brindar una medicina de excelencia, fundamentada en la empatía, la rigurosidad científica y el acompañamiento constante a mis pacientes. Mi objetivo es que cada consulta sea un espacio de seguridad y confianza.
              </p>
              <p>
                Entiendo la salud no solo como la ausencia de enfermedad, sino como un estado de completo bienestar físico, mental y emocional. Por ello, mis tratamientos se centran de forma personalizada en el estilo de vida, prevención e intervenciones integrales.
              </p>
            </div>

            <div className="colegiacion-badge">
              <span className="colegiacion-label">Colegiación:</span>
              <span className="colegiacion-value">{DOCTOR_INFO.colegiacion.join(', ')}</span>
            </div>

            <button className="btn btn-primary" onClick={() => booking.open()}>
              Agendar una consulta conmigo
            </button>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="container credentials-container">
          <div className="credentials-grid">
            {CREDENTIALS.map((cred, idx) => (
              <div key={idx} className="glass-card credential-card">
                <div className="credential-card-header">
                  <span className="cred-icon">{cred.icon}</span>
                  <h3>{cred.title}</h3>
                </div>
                <ul className="cred-list">
                  {cred.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <strong>{item.title}</strong>
                      {item.distinction && <span className="cred-distinction">{item.distinction}</span>}
                      <span>{item.institution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info-panel">
              <span className="section-tag">Ubicación y Datos</span>
              <h2 className="section-title text-white">¿Dónde puedes encontrarme?</h2>
              <p className="contact-desc text-muted">
                Visítame en mi consultorio principal o comunícate directamente para urgencias y coordinar turnos.
              </p>

              <div className="contact-details">
                {CONTACT_INFO.map((info, idx) => (
                  <div key={idx} className="contact-detail-item">
                    <div className="detail-icon">{info.icon}</div>
                    <div>
                      <h4>{info.title}</h4>
                      {Array.isArray(info.content) ? (
                        <p>
                          {info.content.map((line, lineIdx) => (
                            <span key={lineIdx}>
                              {line}
                              {lineIdx < info.content.length - 1 && <br />}
                            </span>
                          ))}
                        </p>
                      ) : (
                        <p>{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-form-panel">
              <div className="glass-card contact-form-card">
                {contact.step === 'success' ? (
                  <div className="booking-success-view">
                    <div className="success-icon">✓</div>
                    <h3>¡Mensaje Enviado!</h3>
                    <p className="success-details">
                      Gracias por tu confianza. Hemos recibido tu consulta y nos pondremos en
                      contacto contigo muy pronto.
                    </p>
                    <button className="btn btn-primary" onClick={contact.reset}>
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : contact.step === 'error' ? (
                  <div className="booking-success-view">
                    <div className="success-icon error">!</div>
                    <h3>Servicio no disponible</h3>
                    <p className="success-details">
                      No pudimos enviar tu mensaje en este momento. Puedes escribirnos directamente
                      por WhatsApp o llamada al{' '}
                      <a
                        className="whatsapp-link"
                        href={SITE_CONFIG.whatsapp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {SITE_CONFIG.contact.phoneFormatted}
                      </a>
                      . ¡Con gusto te atenderemos!
                    </p>
                    <button className="btn btn-primary" onClick={() => contact.setStep('form')}>
                      Intentar de nuevo
                    </button>
                  </div>
                ) : (
                  <>
                    <h3>Envía un Mensaje Directo</h3>
                    <form onSubmit={contact.submit} noValidate>
                      {CONTACT_FORM_FIELDS.map((field) => {
                        const InputComponent = field.as === 'textarea' ? 'textarea' : 'input';
                        const error = contact.errors[field.id];
                        return (
                          <div className={`form-group${error ? ' has-error' : ''}`} key={field.id}>
                            <label htmlFor={field.id}>{field.label}</label>
                            <InputComponent
                              id={field.id}
                              name={field.id}
                              type={field.as === 'input' ? field.type : undefined}
                              placeholder={field.placeholder}
                              {...(field.as === 'textarea' ? { rows: field.rows } : {})}
                              value={contact.data[field.id]}
                              onChange={contact.handleChange}
                            />
                            {error && <span className="form-error">{error}</span>}
                          </div>
                        );
                      })}
                      <button type="submit" className="btn btn-primary w-full" disabled={contact.loading}>
                        {contact.loading ? 'Enviando...' : 'Enviar Consulta'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">

              <span className="logo-image logo-mask" style={logoMaskStyle}></span>

              <h3>{DOCTOR_INFO.name}</h3>
              <p>Tu bienestar integral y tu salud ginecológica son nuestra máxima prioridad profesional.</p>
            </div>
            <div className="footer-links">
              <h4>Enlaces Rápidos</h4>
              <ul>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#servicios">Servicios</a></li>
                <li><a href="#acerca">Sobre Mí</a></li>
                <li><a href="#contacto">Contacto</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Legales</h4>
              <ul>
                <li><a href="#privacidad">Política de Privacidad</a></li>
                <li><a href="#terminos">Términos de Servicio</a></li>
                <li><a href="#cookies">Configuración de Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} {DOCTOR_INFO.name}. Todos los derechos reservados. Diseñado para un cuidado médico de calidad.</p>
          </div>
        </div>
      </footer>

      {/* Modal de reserva de cita (formulario + estados de éxito/error) */}
      <BookingModal booking={booking} />

      {/* Widget de chat con IA (sesión anónima de 2h + escalado a WhatsApp) */}
      <ChatWidget />
    </div>
  );
}
