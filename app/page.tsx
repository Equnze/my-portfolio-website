"use client";

import { useEffect, useState } from "react";
import ChatTwin from "./components/ChatTwin";

const career = [
  {
    years: "2023 — PRESENT",
    company: "DIGITALMART",
    role: "AI / ML Engineer",
    text: "Building production AI pipelines, multimodal generative systems, RAG workflows, and scalable enterprise LLM applications.",
    result: "30% task-efficiency improvement",
  },
  {
    years: "2019 — 2023",
    company: "PGN",
    role: "Machine Learning Engineer",
    text: "Designed fraud-detection and forecasting systems, automated feature engineering, and deployed models with Docker and Kubernetes.",
    result: "35% fewer false positives",
  },
  {
    years: "2012 — 2019",
    company: "AT&T",
    role: "Cloud Engineer",
    text: "Engineered secure AWS infrastructure, networking, observability, and Jenkins-based delivery pipelines for resilient applications.",
    result: "7 years in cloud engineering",
  },
];

function PortraitGraphic() {
  return (
    <svg className="editorial-portrait-svg" viewBox="0 0 620 650" aria-hidden="true">
      <defs>
        <linearGradient id="portraitFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#162d2c" />
          <stop offset="1" stopColor="#071312" />
        </linearGradient>
        <linearGradient id="portraitGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#44d9d3" />
          <stop offset="1" stopColor="#75fff5" />
        </linearGradient>
      </defs>
      <circle cx="302" cy="210" r="122" fill="url(#portraitFill)" />
      <path d="M115 650c13-177 77-270 188-270s177 93 193 270H115Z" fill="url(#portraitFill)" />
      <path d="M197 185c20-88 69-132 142-124 53 6 94 49 102 106-61-35-163-33-244 18Z" fill="#081817" />
      <path d="M216 210c20 83 51 124 93 124 43 0 76-43 97-130" fill="none" stroke="#44d9d3" strokeWidth="3" opacity=".65" />
      <path d="M187 164c24-91 83-130 176-116M173 191c25-74 81-111 168-111M197 136c57-49 127-54 211-14" fill="none" stroke="#75fff5" strokeWidth="2" opacity=".36" />
      <circle cx="260" cy="215" r="7" fill="#75fff5" />
      <circle cx="358" cy="215" r="7" fill="#75fff5" />
      <path d="M283 274c18 13 37 13 56 0" fill="none" stroke="#75fff5" strokeWidth="3" strokeLinecap="round" />
      <g fill="url(#portraitGlow)">
        <circle cx="148" cy="115" r="6" /><circle cx="452" cy="101" r="5" />
        <circle cx="493" cy="231" r="7" /><circle cx="124" cy="269" r="4" />
      </g>
      <g stroke="#44d9d3" strokeWidth="1" opacity=".5">
        <path d="M148 115 224 167M452 101l-55 76M493 231l-82 6M124 269l92-29" />
        <circle cx="302" cy="210" r="169" fill="none" strokeDasharray="3 10" />
      </g>
      <text x="303" y="570" textAnchor="middle" fill="#75fff5" fontSize="62" fontFamily="Arial" fontWeight="700" letterSpacing="-4">OI</text>
    </svg>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="editorial-site">
      <header className="editorial-nav">
        <a className="signature-logo" href="#home">
          <span>Okechukwu</span><b>@AI</b>
        </a>
        <nav className={menuOpen ? "editorial-links open" : "editorial-links"}>
          <a className="active" href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#journey" onClick={() => setMenuOpen(false)}>Career</a>
          <a href="#expertise" onClick={() => setMenuOpen(false)}>Expertise</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <button
          className="editorial-menu"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <i /><i /><i />
        </button>
      </header>

      <section className="reference-hero" id="home">
        <div className="portrait-stage">
          <div className="portrait-code">OI / 01</div>
          <PortraitGraphic />
          <div className="portrait-caption">
            <span>APPLIED INTELLIGENCE</span>
            <b>WASHINGTON DC — HOUSTON</b>
          </div>
        </div>
        <div className="reference-pitch">
          <p className="script-kicker">You bring the ambition.</p>
          <h1>I BUILD THE<br />INTELLIGENCE.</h1>
          <p className="pitch-lead">
            Applied AI/ML engineering for ideas that need to work
            <strong> beyond the prototype.</strong>
          </p>
          <p className="pitch-note">Enterprise systems. Real outcomes. Built to scale.</p>
          <a className="brush-button" href="#journey">EXPLORE MY WORK</a>
        </div>
      </section>

      <section className="reference-intro" id="about">
        <p className="profile-url">
          profile: <a href="https://www.linkedin.com/in/okechukwu-ikwunze-1aba3135" target="_blank" rel="noreferrer">linkedin.com/in/okechukwu-ikwunze</a>
        </p>
        <p className="reference-summary reveal">
          Okechukwu is an AI/ML engineer whose work connects advanced models
          with the cloud systems that make them useful. He brings more than a
          decade of engineering experience to every challenge.
        </p>
        <p className="reference-signoff reveal">Intelligence, engineered.</p>
      </section>

      <section className="reference-quote">
        <p className="quote-mark">“</p>
        <blockquote className="reveal">
          Advanced technology only matters when it creates
          <em> real-world impact.</em>
        </blockquote>
        <p>MY ENGINEERING PHILOSOPHY</p>
      </section>

      <section className="reference-journey" id="journey">
        <div className="reference-section-title reveal">
          <span>CAREER / 02</span>
          <h2>From cloud foundations<br />to intelligent systems.</h2>
        </div>
        <div className="reference-career-list">
          {career.map((item, index) => (
            <article className="reference-career-row reveal" key={item.company}>
              <span className="career-number">0{index + 1}</span>
              <p className="career-years">{item.years}</p>
              <div>
                <p className="career-company">{item.company}</p>
                <h3>{item.role}</h3>
                <p className="career-copy">{item.text}</p>
              </div>
              <p className="career-result">{item.result}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reference-expertise" id="expertise">
        <div className="expertise-copy reveal">
          <span>CAPABILITIES / 03</span>
          <p className="script-kicker">Built for what&apos;s next.</p>
          <h2>STRATEGY TO<br />PRODUCTION.</h2>
          <p>From a blank page to a dependable platform, I connect the strategic view with the engineering details.</p>
        </div>
        <div className="expertise-board reveal">
          {[
            ["01", "Applied AI", "LLMs · Agents · RAG · Multimodal"],
            ["02", "ML Systems", "TensorFlow · Scikit-learn · MLOps"],
            ["03", "Cloud", "AWS · Kubernetes · CI/CD"],
            ["04", "Leadership", "Architecture · Workshops · Delivery"],
          ].map(([number, title, tools]) => (
            <div key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{tools}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reference-contact" id="contact">
        <p className="script-kicker reveal">Let&apos;s make it real.</p>
        <h2 className="reveal">HAVE AN AMBITIOUS<br />PROBLEM TO SOLVE?</h2>
        <a className="brush-button light" href="mailto:oikwunze@gmail.com">START A CONVERSATION</a>
        <div className="contact-details">
          <a href="mailto:oikwunze@gmail.com">oikwunze@gmail.com</a>
          <a href="https://www.linkedin.com/in/okechukwu-ikwunze-1aba3135" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
      </section>

      <footer className="reference-footer">
        <a className="signature-logo" href="#home"><span>Okechukwu</span><b>@AI</b></a>
        <p>APPLIED AI / ML ENGINEER</p>
        <p>© {new Date().getFullYear()}</p>
      </footer>

      <ChatTwin />
    </main>
  );
}
