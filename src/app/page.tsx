import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  Check,
  Code2,
  Gauge,
  LayoutTemplate,
  LineChart,
  Megaphone,
  MousePointer2,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Davide Rossi | Digital Strategist & Web Developer",
  description:
    "Consulente freelance in advertising, landing page, sviluppo web, vibe coding, web analytics e strategie di marketing orientate alla crescita.",
  alternates: { canonical: "/" },
};

const services = [
  {
    icon: Megaphone,
    number: "01",
    title: "Digital Advertising",
    text: "Campagne Google e Meta Ads costruite per trasformare il budget in opportunità reali, non in semplici impression.",
    tags: ["Google Ads", "Meta Ads", "Funnel"],
  },
  {
    icon: LayoutTemplate,
    number: "02",
    title: "Landing page",
    text: "Pagine veloci, persuasive e progettate intorno a un obiettivo: convertire visite in contatti e vendite.",
    tags: ["UX/UI", "CRO", "Copy"],
  },
  {
    icon: Code2,
    number: "03",
    title: "Web & vibe coding",
    text: "Siti e prodotti digitali moderni, sviluppati rapidamente con AI e tecnologie solide, senza sacrificare qualità.",
    tags: ["Next.js", "AI tools", "No-code"],
  },
  {
    icon: BarChart3,
    number: "04",
    title: "Web analytics",
    text: "Tracking affidabile e dashboard leggibili per capire cosa funziona e prendere decisioni basate sui dati.",
    tags: ["GA4", "GTM", "Dashboard"],
  },
  {
    icon: Target,
    number: "05",
    title: "Piani marketing",
    text: "Roadmap concrete che allineano posizionamento, canali, contenuti e investimenti ai tuoi obiettivi.",
    tags: ["Strategia", "Roadmap", "KPI"],
  },
  {
    icon: LineChart,
    number: "06",
    title: "Consulenza strategica",
    text: "Un punto di vista esterno e operativo per sbloccare la crescita e mettere ordine nelle priorità digitali.",
    tags: ["Audit", "Growth", "Advisory"],
  },
];

const process = [
  ["01", "Ascolto", "Partiamo dal business, dalle persone e dai risultati che vuoi raggiungere."],
  ["02", "Strategia", "Definisco priorità, canali e una roadmap sostenibile, con KPI chiari."],
  ["03", "Esecuzione", "Porto il piano online con cicli rapidi, feedback continui e massima trasparenza."],
  ["04", "Ottimizzazione", "Misuro ciò che conta e miglioro ogni attività sulla base dei dati."],
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Davide Rossi — Digital Strategist & Web Developer",
  description:
    "Consulenza freelance in digital advertising, sviluppo web, landing page, web analytics e strategia marketing.",
  areaServed: "IT",
  founder: { "@type": "Person", name: "Davide Rossi", jobTitle: "Digital Strategist & Web Developer" },
  knowsAbout: [
    "Digital advertising",
    "Landing page",
    "Web development",
    "Vibe coding",
    "Web analytics",
    "Marketing strategy",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="site-header">
        <a className="brand" href="#home" aria-label="Davide Rossi, torna all'inizio">
          DR<span>.</span>
        </a>
        <nav aria-label="Navigazione principale">
          <a href="#servizi">Servizi</a>
          <a href="#approccio">Approccio</a>
          <a href="#chi-sono">Chi sono</a>
        </nav>
        <a className="nav-cta" href="#contatti">
          Parliamone <ArrowRight size={16} aria-hidden="true" />
        </a>
      </header>

      <main>
        <section className="hero section" id="home">
          <div className="hero-glow" aria-hidden="true" />
          <div className="eyebrow reveal"><span /> Digital strategist · Web developer</div>
          <h1 className="reveal delay-1">
            Idee digitali.<br />
            <em>Risultati concreti.</em>
          </h1>
          <div className="hero-bottom reveal delay-2">
            <p>
              Aiuto aziende e professionisti a crescere online con strategia, creatività,
              tecnologia e una sana ossessione per i dati.
            </p>
            <a className="button button-primary" href="#contatti">
              Raccontami il tuo progetto <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-proof reveal delay-3">
            <span>Strategia</span><i /> <span>Design</span><i /> <span>Tecnologia</span><i /> <span>Dati</span>
          </div>
        </section>

        <section className="section services" id="servizi">
          <div className="section-heading">
            <div><span className="section-index">01</span><p className="kicker">Cosa posso fare per te</p></div>
            <h2>Competenze diverse.<br /><em>Un unico obiettivo.</em></h2>
            <p>Mettere insieme i pezzi giusti per far crescere il tuo business in modo misurabile.</p>
          </div>
          <div className="services-grid">
            {services.map(({ icon: Icon, number, title, text, tags }) => (
              <article className="service-card" key={title}>
                <div className="card-top"><span>{number}</span><Icon size={27} strokeWidth={1.6} aria-hidden="true" /></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="statement section" aria-label="Il mio metodo">
          <Sparkles aria-hidden="true" />
          <p>Non ti serve <span>più rumore.</span><br />Ti serve una direzione.</p>
        </section>

        <section className="section approach" id="approccio">
          <div className="section-heading compact">
            <div><span className="section-index">02</span><p className="kicker">Come lavoro</p></div>
            <h2>Un processo semplice,<br /><em>senza scatole nere.</em></h2>
          </div>
          <div className="process-list">
            {process.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span><h3>{title}</h3><p>{text}</p><ArrowRight aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="section about" id="chi-sono">
          <div className="about-visual" aria-hidden="true">
            <div className="orbit orbit-one"><span /></div>
            <div className="orbit orbit-two"><span /></div>
            <div className="monogram">DR</div>
            <div className="availability"><i /> Disponibile per nuovi progetti</div>
          </div>
          <div className="about-copy">
            <div><span className="section-index">03</span><p className="kicker">Chi sono</p></div>
            <h2>Ciao, sono<br /><em>Davide Rossi.</em></h2>
            <p className="lead">Stratega quando serve visione, developer quando è il momento di costruire.</p>
            <p>Lavoro al fianco di aziende e professionisti per trasformare obiettivi complessi in esperienze digitali efficaci. Unisco marketing, design e tecnologia con un approccio diretto: meno presentazioni, più cose che funzionano.</p>
            <div className="values">
              <span><Gauge aria-hidden="true" /> Velocità</span>
              <span><MousePointer2 aria-hidden="true" /> Concretezza</span>
              <span><Zap aria-hidden="true" /> Curiosità</span>
            </div>
          </div>
        </section>

        <section className="cta-section section" id="contatti">
          <p className="kicker">Hai un progetto in mente?</p>
          <h2>Facciamolo<br /><em>succedere.</em></h2>
          <p>Raccontami dove vuoi arrivare. La prima chiacchierata è semplice, concreta e senza impegno.</p>
          <a className="button button-light" href="mailto:ciao@daviderossi.it?subject=Parliamo%20del%20mio%20progetto">
            Scrivimi una mail <ArrowRight size={20} aria-hidden="true" />
          </a>
          <div className="cta-note"><Check size={15} aria-hidden="true" /> Di solito rispondo entro 24 ore</div>
        </section>
      </main>

      <footer>
        <a className="brand" href="#home">DR<span>.</span></a>
        <p>Strategia, design e tecnologia<br />per far crescere idee ambiziose.</p>
        <div className="footer-links">
          <a href="mailto:ciao@daviderossi.it">Email</a>
          <a href="#home">Torna su ↑</a>
        </div>
        <small>© {new Date().getFullYear()} Davide Rossi. Fatto con cura in Italia.</small>
      </footer>
    </>
  );
}
