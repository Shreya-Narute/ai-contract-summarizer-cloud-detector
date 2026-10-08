import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const features = [
  { icon: "🔍", color: "#ede9fe", label: "Instant Analysis", desc: "Upload any PDF or DOCX contract and get a full AI-powered summary in seconds." },
  { icon: "⚖️", color: "#dbeafe", label: "Clause Detection", desc: "Automatically identify termination, payment, confidentiality, and governing-law clauses." },
  { icon: "📝", color: "#d1fae5", label: "Contract Generation", desc: "Fill in a form and generate professional rental, service, or affidavit contracts." },
  { icon: "🔒", color: "#fef3c7", label: "Secure & Private", desc: "JWT authentication protects every request. Your contracts stay yours." },
  { icon: "⚡", color: "#fee2e2", label: "Async Processing", desc: "Long analysis jobs run in the background via Celery so the UI stays responsive." },
  { icon: "📊", color: "#e0e7ff", label: "Full History", desc: "Every uploaded contract is saved to PostgreSQL for future reference." },
];

const steps = [
  { n: "1", title: "Create an account", desc: "Register with your email and password. No credit card required." },
  { n: "2", title: "Upload your contract", desc: "Drag and drop a PDF or DOCX file onto the Analyze page." },
  { n: "3", title: "Review the analysis", desc: "Read the AI-generated summary and detected clause breakdown." },
  { n: "4", title: "Download or generate", desc: "Create new contracts from templates and download them instantly." },
];

export default function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="section-label" style={{ background: "rgba(79,70,229,.25)", color: "#a5b4fc" }}>
              AI · Contracts · Automation
            </div>
            <h1 style={{ marginTop: 8 }}>
              Understand any contract <span>in seconds</span>
            </h1>
            <p>
              ContractAI reads, summarizes, and detects critical clauses in your
              legal documents — powered by NLP and delivered through a clean
              modern interface.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
              <Link to="/login"    className="btn btn-lg" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.2)" }}>
                Sign In →
              </Link>
            </div>
            <div className="hero-stats">
              {[["3", "Template types"], ["4+", "Clause categories"], ["100%", "Private & secure"], ["~2s", "Analysis time"]].map(
                ([n, l]) => (
                  <div key={l}>
                    <div className="hero-stat-number">{n}</div>
                    <div className="hero-stat-label">{l}</div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label">Features</div>
            <h2 className="section-title">Everything you need for contracts</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>
              From upload to analysis to generation — ContractAI covers the full lifecycle.
            </p>
          </div>
          <div className="grid-3">
            {features.map((f) => (
              <div key={f.label} className="card card-hover">
                <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
                <h4 style={{ marginBottom: 8 }}>{f.label}</h4>
                <p style={{ fontSize: ".9rem" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-label">How it works</div>
            <h2 className="section-title">Up and running in 4 steps</h2>
          </div>
          <div className="grid-2" style={{ maxWidth: 800, margin: "0 auto" }}>
            {steps.map((s) => (
              <div key={s.n} className="flex gap-4" style={{ alignItems: "flex-start" }}>
                <div className="step-number">{s.n}</div>
                <div>
                  <h4 style={{ marginBottom: 6 }}>{s.title}</h4>
                  <p style={{ fontSize: ".9rem" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link to="/register" className="btn btn-primary btn-lg">Start Analyzing Contracts →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
