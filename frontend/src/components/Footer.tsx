import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid-3" style={{ gap: 40 }}>
          <div>
            <div className="footer-brand">⚡ ContractAI</div>
            <p style={{ fontSize: ".9rem", lineHeight: 1.7, marginTop: 8 }}>
              AI-powered contract analysis and generation platform. Understand
              your contracts in seconds.
            </p>
          </div>
          <div>
            <h4 style={{ color: "#fff", marginBottom: 16 }}>Product</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/summarize" style={{ color: "#94a3b8", fontSize: ".9rem" }}>Analyze Contract</Link>
              <Link to="/create"    style={{ color: "#94a3b8", fontSize: ".9rem" }}>Create Contract</Link>
              <Link to="/history"   style={{ color: "#94a3b8", fontSize: ".9rem" }}>History</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: "#fff", marginBottom: 16 }}>Account</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/login"    style={{ color: "#94a3b8", fontSize: ".9rem" }}>Sign In</Link>
              <Link to="/register" style={{ color: "#94a3b8", fontSize: ".9rem" }}>Register</Link>
            </div>
          </div>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} ContractAI. Built with FastAPI · React · PostgreSQL · Celery.
        </div>
      </div>
    </footer>
  );
}
