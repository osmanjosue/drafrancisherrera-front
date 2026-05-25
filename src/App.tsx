import { useState } from 'react';

// Specialities or Services data
const SERVICES = [
  {
    id: 1,
    title: 'Medicina General y Preventiva',
    description: 'Chequeos médicos integrales, control de enfermedades crónicas, prevención y asesoramiento de salud familiar.',
    icon: (
      <svg className="service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Evaluación y Diagnóstico Especializado',
    description: 'Diagnóstico preciso mediante evaluación de sintomatología clínica detallada y prescripción de estudios correspondientes.',
    icon: (
      <svg className="service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Consultas Online (Telemedicina)',
    description: 'Atención a distancia desde la comodidad de tu hogar, ideal para seguimientos, revisión de estudios y recetas.',
    icon: (
      <svg className="service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Bienestar y Nutrición Integral',
    description: 'Planes personalizados orientados a un estilo de vida saludable enfocado en la prevención metabólica.',
    icon: (
      <svg className="service-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'clinic' | 'online'>('all');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    fecha: '',
    motivo: '',
    tipo: 'Presencial'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep(2);
  };

  const resetBooking = () => {
    setIsBookingOpen(false);
    setBookingStep(1);
    setFormData({
      nombre: '',
      telefono: '',
      email: '',
      fecha: '',
      motivo: '',
      tipo: 'Presencial'
    });
  };

  return (
    <div className="app-wrapper">
      {/* Header / Navbar */}
      <header className="main-header">
        <div className="container header-container">
          <a href="#" className="logo">
            <span className="logo-icon">+</span>
            <div className="logo-text">
              <span className="logo-title">Dra. Francis Herrera</span>
              <span className="logo-sub">Medicina General & Bienestar</span>
            </div>
          </a>
          
          <nav className="desktop-nav">
            <a href="#inicio" className="nav-link">Inicio</a>
            <a href="#servicios" className="nav-link">Servicios</a>
            <a href="#acerca" className="nav-link">Sobre Mí</a>
            <a href="#contacto" className="nav-link">Contacto</a>
          </nav>
          
          <button className="btn btn-primary btn-header" onClick={() => setIsBookingOpen(true)}>
            Agendar Consulta
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="badge">
              <span className="badge-dot"></span>
              Atención Médica de Confianza
            </span>
            <h1 className="hero-title">
              Tu salud y bienestar en manos de <span className="highlight">profesionales</span>.
            </h1>
            <p className="hero-subtitle">
              Ofrezco una atención médica cercana, de alta calidad y completamente personalizada. 
              Enfocada en prevenir, diagnosticar y acompañar a cada paciente en su camino hacia una vida más saludable.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => setIsBookingOpen(true)}>
                Reservar cita online
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <a href="#servicios" className="btn btn-secondary">
                Ver especialidades
              </a>
            </div>
            
            {/* Quick Metrics */}
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-num">10+</span>
                <span className="metric-label">Años de Experiencia</span>
              </div>
              <div className="metric-item">
                <span className="metric-num">5k+</span>
                <span className="metric-label">Pacientes Satisfechos</span>
              </div>
              <div className="metric-item">
                <span className="metric-num">100%</span>
                <span className="metric-label">Atención Humana</span>
              </div>
            </div>
          </div>
          
          <div className="hero-image-container">
            <div className="doctor-visual-card">
              <div className="visual-bg-glow"></div>
              <div className="visual-graphic">
                {/* Modern graphic card representing healthcare & technology */}
                <div className="stethoscope-glow">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="stethoscope-svg">
                    <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5v2h20v-2c0-2.31-1-4.24-2.5-5.5" />
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                </div>
                <div className="floating-health-bubble">
                  <div className="bubble-icon">❤️</div>
                  <div className="bubble-text">
                    <strong>Salud Familiar</strong>
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

          <div className="services-grid">
            {SERVICES.map((service) => (
              <div key={service.id} className="glass-card service-card">
                <div className="service-icon-wrapper">
                  {service.icon}
                </div>
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-desc">{service.description}</p>
                <span className="service-learn-more" onClick={() => setIsBookingOpen(true)}>
                  Solicitar este servicio
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="acerca" className="about-section">
        <div className="container about-container">
          <div className="about-graphic">
            <div className="about-img-frame">
              <div className="experience-tag">
                <span className="exp-years">10+</span>
                <span className="exp-text">Años cuidando tu salud</span>
              </div>
              <div className="abstract-doctor-illustration">
                {/* A stylish aesthetic vector representation of a doctor */}
                <div className="avatar-circle">
                  <span className="avatar-initials">DH</span>
                </div>
                <div className="quote-badge">
                  "El primer paso para la sanación es un diagnóstico con empatía."
                </div>
              </div>
            </div>
          </div>

          <div className="about-content">
            <span className="section-tag">Sobre Mí</span>
            <h2 className="section-title">Dra. Francis Herrera</h2>
            <p className="about-subtitle-meta">Médico Cirujano y Especialista en Salud Familiar</p>
            
            <div className="about-paragraphs">
              <p>
                Me dedico a brindar una medicina de excelencia, fundamentada en la empatía, la rigurosidad científica y el acompañamiento constante a mis pacientes. Mi objetivo es que cada consulta sea un espacio de seguridad y confianza.
              </p>
              <p>
                Entiendo la salud no solo como la ausencia de enfermedad, sino como un estado de completo bienestar físico, mental y emocional. Por ello, mis tratamientos se centran de forma personalizada en el estilo de vida, prevención e intervenciones integrales.
              </p>
            </div>

            <div className="credentials-list">
              <div className="credential-item">
                <span className="cred-bullet">✓</span>
                <div>
                  <strong>Título en Medicina y Cirugía</strong>
                  <p>Universidad Nacional Autónoma de Honduras (UNAH)</p>
                </div>
              </div>
              <div className="credential-item">
                <span className="cred-bullet">✓</span>
                <div>
                  <strong>Especialización en Gestión de Servicios de Salud</strong>
                  <p>Estudios avanzados en atención médica de calidad y seguridad del paciente.</p>
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary" onClick={() => setIsBookingOpen(true)}>
              Agendar una consulta conmigo
            </button>
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
                <div className="contact-detail-item">
                  <div className="detail-icon">📍</div>
                  <div>
                    <h4>Dirección del Consultorio</h4>
                    <p>Torre Médica del Bosque, Consultorio 402, Tegucigalpa, Honduras</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">📞</div>
                  <div>
                    <h4>Teléfono & WhatsApp</h4>
                    <p>+504 9999-8888 / +504 2222-3333</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">✉️</div>
                  <div>
                    <h4>Correo Electrónico</h4>
                    <p>contacto@drafrancisherrera.com</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="detail-icon">⏰</div>
                  <div>
                    <h4>Horarios de Atención</h4>
                    <p>Lunes a Viernes: 9:00 AM - 5:00 PM <br/> Sábados: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-panel">
              <div className="glass-card contact-form-card">
                <h3>Envía un Mensaje Directo</h3>
                <form onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por tu mensaje! Nos comunicaremos contigo muy pronto.'); }}>
                  <div className="form-group">
                    <label htmlFor="name">Nombre Completo</label>
                    <input type="text" id="name" required placeholder="Ej. Juan Pérez" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input type="email" id="email" required placeholder="juan@ejemplo.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Mensaje / Consulta</label>
                    <textarea id="message" rows={4} required placeholder="Describe brevemente tu motivo de consulta..." />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">Enviar Consulta</button>
                </form>
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
              <span className="logo-icon">+</span>
              <h3>Dra. Francis Herrera</h3>
              <p>Tu bienestar integral y tu salud familiar son nuestra máxima prioridad profesional.</p>
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
            <p>&copy; {new Date().getFullYear()} Dra. Francis Herrera. Todos los derechos reservados. Diseñado para un cuidado médico de calidad.</p>
          </div>
        </div>
      </footer>

      {/* Appointment Booking Modal */}
      {isBookingOpen && (
        <div className="modal-overlay" onClick={resetBooking}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={resetBooking}>×</button>
            
            {bookingStep === 1 ? (
              <>
                <h3 className="modal-title">Agendar Tu Cita Médica</h3>
                <p className="modal-subtitle">Completa este breve formulario y confirmaremos tu espacio médico de inmediato.</p>
                
                <form onSubmit={handleFormSubmit} className="booking-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nombre Completo</label>
                      <input 
                        type="text" 
                        name="nombre" 
                        required 
                        value={formData.nombre} 
                        onChange={handleInputChange} 
                        placeholder="Ej. María López" 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Número de Teléfono</label>
                      <input 
                        type="tel" 
                        name="telefono" 
                        required 
                        value={formData.telefono} 
                        onChange={handleInputChange} 
                        placeholder="Ej. +504 9999-1111" 
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Correo Electrónico</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        placeholder="maria@ejemplo.com" 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Fecha Deseada</label>
                      <input 
                        type="date" 
                        name="fecha" 
                        required 
                        value={formData.fecha} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Tipo de Consulta</label>
                      <select name="tipo" value={formData.tipo} onChange={handleInputChange}>
                        <option value="Presencial">Presencial (Consultorio Torre Médica)</option>
                        <option value="Online">Online / Telemedicina</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Motivo de Consulta / Síntomas</label>
                    <textarea 
                      name="motivo" 
                      rows={3} 
                      required 
                      value={formData.motivo} 
                      onChange={handleInputChange} 
                      placeholder="Ej. Chequeo general rutinario, dolor de cabeza constante, etc."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full">
                    Solicitar Agenda
                  </button>
                </form>
              </>
            ) : (
              <div className="booking-success-view">
                <div className="success-icon">✓</div>
                <h3>¡Solicitud Recibida Exitosamente!</h3>
                <p>
                  Gracias por tu confianza, <strong>{formData.nombre}</strong>. Hemos registrado tu solicitud para el día <strong>{formData.fecha}</strong> de forma <strong>{formData.tipo}</strong>.
                </p>
                <p className="success-details">
                  Te enviaremos un mensaje de confirmación por WhatsApp o correo electrónico dentro de los próximos 30 minutos con las horas específicas disponibles.
                </p>
                <button className="btn btn-primary" onClick={resetBooking}>
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
