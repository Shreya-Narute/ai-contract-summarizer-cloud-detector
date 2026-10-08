import React from "react";
import { Link, useNavigate } from "react-router-dom";

const actions = [
  {
    icon: "🔍", title: "Analyze Contract",
    desc: "Upload a PDF or DOCX and get an instant AI-powered summary with clause detection.",
    to: "/summarize", cta: "Upload & Analyze", color: "#ede9fe",
  },
  {
    icon: "📝", title: "Create Contract",
    desc: "Generate a professional rental, affidavit, or service agreement from a template.",
    to: "/create", cta: "Create Now", color: "#d1fae5",
  },
  {
    icon: "📋", title: "Contract History",
    desc: "View all previously uploaded and analyzed contracts saved to your account.",
    to: "/history", cta: "View History", color: "#dbeafe",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("token"); navigate("/"); };

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: "1.875rem", marginBottom: 6 }}>Dashboard</h1>
          <p>Welcome back. What would you like to do today?</p>
        </div>

        {/* Stat strip */}
        <div className="grid-4" style={{ marginBottom: 40 }}>
          {[
            { icon: "📄", label: "Templates Available", value: "3", bg: "#ede9fe" },
            { icon: "⚡", label: "AI Clause Categories", value: "4", bg: "#dbeafe" },
            { icon: "🔒", label: "Auth Status",          value: "Active", bg: "#d1fae5" },
            { icon: "🚀", label: "Celery Worker",        value: "Online", bg: "#fef3c7" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action cards */}
        <h3 style={{ marginBottom: 20 }}>Quick Actions</h3>
        <div className="grid-3">
          {actions.map(a => (
            <div key={a.title} className="card card-hover" style={{ display: "flex", flexDirection: "column" }}>
              <div className="feature-icon" style={{ background: a.color }}>{a.icon}</div>
              <h4 style={{ marginBottom: 8 }}>{a.title}</h4>
              <p style={{ fontSize: ".9rem", flex: 1 }}>{a.desc}</p>
              <Link to={a.to} className="btn btn-primary btn-sm" style={{ marginTop: 20, alignSelf: "flex-start" }}>
                {a.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Info strip */}
        <div className="alert alert-info" style={{ marginTop: 40 }}>
          ℹ️ This platform uses <strong>extractive summarization</strong> as the AI backend. For neural
          summarization, add <code>transformers</code> and <code>torch</code> to
          requirements.txt and rebuild.
        </div>
      </div>
    </div>
  );
}
