import React, { useEffect, useState } from "react";
import api from "../api";

interface Contract {
  id: number;
  filename: string;
  storage_path: string;
  created_at?: string;
}

export default function History() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    api.get("/files/history")
      .then(r => setContracts(r.data))
      .catch(err => {
        if (err.response?.status === 404) {
          // Endpoint may not exist yet — show empty state gracefully
          setContracts([]);
        } else {
          setError(err.response?.data?.detail || "Failed to load history.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-label">Records</div>
          <h2 style={{ marginTop: 8, marginBottom: 6 }}>Contract History</h2>
          <p>All contracts you have uploaded and analyzed are listed here.</p>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div className="spinner spinner-lg" style={{ margin: "0 auto 16px" }} />
            <p>Loading your contracts…</p>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && contracts.length === 0 && (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📄</div>
              <h3 style={{ marginBottom: 8 }}>No contracts yet</h3>
              <p style={{ marginBottom: 24 }}>Upload your first contract to see it appear here.</p>
              <a href="/summarize" className="btn btn-primary">Upload a Contract →</a>
            </div>
          </div>
        )}

        {!loading && contracts.length > 0 && (
          <div className="card" style={{ padding: 0 }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>File Name</th>
                    <th>Storage Path</th>
                    <th>Uploaded</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((c, i) => (
                    <tr key={c.id}>
                      <td style={{ color: "var(--text-muted)", fontSize: ".8rem" }}>{c.id}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: "1.25rem" }}>
                            {c.filename?.endsWith(".pdf") ? "📕" : "📘"}
                          </span>
                          <span style={{ fontWeight: 500 }}>{c.filename}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: ".825rem", fontFamily: "monospace" }}>
                        {c.storage_path}
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: ".875rem" }}>
                        {c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td><span className="badge badge-green">Analyzed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && contracts.length === 0 && !error && (
          <div className="alert alert-info" style={{ marginTop: 20 }}>
            ℹ️ The <code>/files/history</code> endpoint is not yet implemented in the backend.
            Contracts are saved to PostgreSQL on upload — add a <code>GET /files/history</code>
            endpoint to list them here.
          </div>
        )}
      </div>
    </div>
  );
}
