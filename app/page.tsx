import PropertyGallery from "../components/PropertyGallery";
import { getPropiedades } from "../lib/notion";
import Image from "next/image";
import Script from "next/script";
const InstagramIcon = ({ size, color }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size, color }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const LinkedinIcon = ({ size, color }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export const dynamic = 'force-dynamic'; // Forzar lectura en vivo de la BD siempre

export default async function Page() {
  const propiedades = await getPropiedades();

  return (
    <>
      {/* Redes Sociales Flotantes */}
      <div className="fixed top-1/2 right-0 -translate-y-1/2 z-40 flex flex-col gap-4 pr-4">
        <a href="https://www.instagram.com/venterjenks_inmobiliaria?igsh=anR1YmJ2em9xZHNi" target="_blank" rel="noopener noreferrer" 
           className="transition-transform duration-300 hover:scale-125 drop-shadow-lg">
          <InstagramIcon size={32} color="#4E9A6A" />
        </a>
        <a href="https://www.facebook.com/corredorinmobiliario.venterjenks.7" target="_blank" rel="noopener noreferrer"
           className="transition-transform duration-300 hover:scale-125 drop-shadow-lg">
          <FacebookIcon size={32} color="#4E9A6A" />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer"
           className="transition-transform duration-300 hover:scale-125 drop-shadow-lg">
          <LinkedinIcon size={32} color="#4E9A6A" />
        </a>
      </div>

      {/* Header & Nav */}
      <header>
        <nav>
          <div className="logo">
            <Image src="/img/logo.PNG" alt="Venter Jenks" width={150} height={100} className="logo-img" />
          </div>
          <div className="hamburger">☰</div>
          <ul className="nav-links">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#inmobiliaria">Inmobiliaria</a></li>
            <li><a href="#tasaciones">Tasaciones</a></li>
            <li><a href="#contable">Estudio Contable</a></li>
            <li><a href="#abogacia">Abogacía</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="hero">
        <div className="hero-content">
          <h1>Tu hogar, nuestra misión</h1>
          <p>Excelencia en servicios inmobiliarios, contables y jurídicos.</p>
          <a href="#inmobiliaria" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '15px 30px' }}>Ver propiedades</a>
        </div>
      </section>

      {/* Sección Inmobiliaria (Galería con Hover Glassmorphism) */}
      <section id="inmobiliaria" className="properties-section" style={{ backgroundColor: '#f5f7fa' }}>
        <div className="container">
          <h2 className="section-title">Propiedades Destacadas</h2>
          <PropertyGallery initialProperties={propiedades} />
        </div>
      </section>

      {/* Sección Tasaciones */}
      <section id="tasaciones" className="service-section">
        <div className="container">
          <h2 className="section-title">Tasaciones Profesionales</h2>
          <p style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
            Conocé el valor real de tu propiedad en el mercado actual. Contamos con tasadores matriculados que evaluarán tu inmueble con máxima precisión y profesionalismo.
          </p>
          
          <div className="form-container">
            <form id="form-tasaciones" action="#">
              <div className="form-group">
                <input type="text" id="tas-nombre" className="form-control" placeholder="Nombre completo" required />
              </div>
              <div className="form-group">
                <input type="email" id="tas-email" className="form-control" placeholder="Correo electrónico" required />
              </div>
              <div className="form-group">
                <input type="text" id="tas-direccion" className="form-control" placeholder="Dirección del inmueble" required />
              </div>
              <div className="form-group">
                <textarea id="tas-detalles" className="form-control" placeholder="Detalles de la propiedad (ambientes, m2, estado...)" required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Solicitar Tasación por WhatsApp</button>
            </form>
          </div>
        </div>
      </section>

      {/* Sección Estudio Contable */}
      <section id="contable" className="service-section">
        <div className="container">
          <h2 className="section-title">Estudio Contable</h2>
          <div className="service-grid">
            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>Balances</h3>
              <p>Confección y auditoría de estados contables para empresas y Pymes.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📝</div>
              <h3>Liquidación de Impuestos</h3>
              <p>Asesoramiento tributario, DDJJ, AFIP, Ingresos Brutos y más.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">💼</div>
              <h3>Asesoramiento</h3>
              <p>Consultoría financiera, sueldos y jornales, planificación fiscal estratégica.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Abogacía */}
      <section id="abogacia" className="service-section">
        <div className="container">
          <h2 className="section-title">Servicios Legales y Jurídicos</h2>
          <div className="service-grid">
            <div className="service-card">
              <div className="service-icon">✍️</div>
              <h3>Contratos</h3>
              <p>Redacción y revisión de contratos de locación, compraventa y fideicomisos.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🏛️</div>
              <h3>Escrituras</h3>
              <p>Acompañamiento legal integral en procesos de escrituración y titularidad.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">⚖️</div>
              <h3>Sucesiones</h3>
              <p>Trámites sucesorios ágiles para disposición de bienes inmuebles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Contacto */}
      <section id="contacto" className="contact-section">
        <div className="container">
          <h2 className="section-title">Contactanos</h2>
          <div className="contact-content">
            <div className="contact-info">
              <p><strong>📍 Dirección:</strong> Pto Moreno 113, Sarmiento, Chubut, Argentina</p>
              <p><strong>📞 Teléfono:</strong> +54 9 297 436-5975</p>
              <p><strong>📱 WhatsApp:</strong> +54 9 297 436-5975</p>
              <p><strong>✉️ Email:</strong> info@venterjenks.com.ar</p>
              <br />
              <div className="map-container">
                <iframe src="https://maps.google.com/maps?q=Perito%20Moreno%20113,%20Sarmiento,%20Chubut,%20Argentina&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
            <div className="form-container">
              <form id="form-contacto" action="#">
                <div className="form-group">
                  <input type="text" id="con-nombre" className="form-control" placeholder="Tu Nombre" required />
                </div>
                <div className="form-group">
                  <input type="email" id="con-email" className="form-control" placeholder="Tu Email" required />
                </div>
                <div className="form-group">
                  <input type="tel" id="con-tel" className="form-control" placeholder="Tu Teléfono (opcional)" />
                </div>
                <div className="form-group">
                  <textarea id="con-mensaje" className="form-control" placeholder="Tu Mensaje" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Enviar por WhatsApp</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div>
              <div className="footer-logo">
                <Image src="/img/logo2.JPEG" alt="Venter Jenks" width={150} height={100} className="logo-img" style={{ width: '100%', maxWidth: '150px', borderRadius: '8px' }} />
              </div>
              <p>Tu socio de confianza en bienes raíces, servicios legales y contables.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Enlaces Rápidos</h4>
              <ul className="footer-links">
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#inmobiliaria">Propiedades</a></li>
                <li><a href="#tasaciones">Tasaciones</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Servicios</h4>
              <ul className="footer-links">
                <li><a href="#contable">Estudio Contable</a></li>
                <li><a href="#abogacia">Abogacía</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Seguinos</h4>
              <div className="social-links">
                <a href="https://www.instagram.com/venterjenks_inmobiliaria?igsh=anR1YmJ2em9xZHNi" target="_blank" rel="noopener noreferrer" className="social-ig" aria-label="Instagram"></a>
                <a href="https://www.facebook.com/corredorinmobiliario.venterjenks.7" target="_blank" rel="noopener noreferrer" className="social-fb" aria-label="Facebook"></a>
                <a href="#" className="social-in" aria-label="LinkedIn"></a>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2026 Venter Jenks. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/5492974365975" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="WhatsApp"></a>

      {/* Scroll to Top Button */}
      <button id="scroll-top" className="scroll-top" aria-label="Volver arriba">↑</button>

      {/* Client Scripts */}
      <Script src="/js/main.js" strategy="lazyOnload" />
      <Script src="/js/particles.js" strategy="lazyOnload" />
      <Script src="/js/chatbot.js" strategy="lazyOnload" />
    </>
  );
}
