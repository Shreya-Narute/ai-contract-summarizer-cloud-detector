import React, { useState, useRef } from "react";
import api from "../api";

const CLAUSE_COLORS: Record<string, string> = {
  termination:    "badge-red",
  payment:        "badge-green",
  confidentiality:"badge-yellow",
  governing_law:  "badge-blue",
};

const BORDER: Record<string, string> = {
  termination:    "#ef4444",
  payment:        "#10b981",
  confidentiality:"#f59e0b",
  governing_law:  "#0ea5e9",
};

interface Clause { clause_type: string; text: string; line_no: number; }
interface Result  { contract_id: number; summary: string; clauses: Clause[]; }

export default function Summarize() {
  const [file, setFile]       = useState<File | null>(null);
  const [drag, setDrag]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState<Result | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null) => { if (f) setFile(f); };

  const upload = async () => {
    if (!file) { setError("Please select a file first."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api.post("/files/upload", fd);
      setResult(r.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clauseGroups = result
    ? result.clauses.reduce<Record<string, Clause[]>>((acc, c) => {
        (acc[c.clause_type] = acc[c.clause_type] || []).push(c);
        return acc;
      }, {})
    : {};

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-label">AI Analysis</div>
          <h2 style={{ marginTop: 8, marginBottom: 6 }}>Analyze Contract</h2>
          <p>Upload a PDF or DOCX file to get an instant summary and clause breakdown.</p>
        </div>

        {/* Upload card */}
        <div className="card" style={{ marginBottom: 32 }}>
          <div
            className={`upload-zone${drag ? " drag-over" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={e  => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]); }}
          >
            <div className="upload-zone-icon">📄</div>
            <h4 style={{ marginBottom: 6 }}>
              {file ? file.name : "Drop your contract here"}
            </h4>
            <p style={{ fontSize: ".875rem" }}>
              {file
                ? `${(file.size / 1024).toFixed(1)} KB · Click to change`
                : "Supports PDF and DOCX · Click or drag & drop"}
            </p>
            <input
              ref={inputRef} type="file" accept=".pdf,.docx"
              style={{ display: "none" }}
              onChange={e => handleFile(e.target.files?.[0] || null)}
            />
          </div>

          {error && <div className="alert alert-error" style={{ marginTop: 16 }}>⚠️ {error}</div>}

          <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center" }}>
            <button
              className="btn btn-primary"
              onClick={upload}
              disabled={loading || !file}
            >
              {loading
                ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing…</>
                : "🔍 Analyze Contract"}
            </button>
            {file && (
              <button className="btn btn-outline btn-sm" onClick={() => { setFile(null); setResult(null); setError(""); }}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div className="spinner spinner-lg" style={{ margin: "0 auto 16px" }} />
            <p>Extracting text and analysing clauses…</p>
          </div>
        )}

        {result && !loading && (
          <>
            <div className="alert alert-success" style={{ marginBottom: 24 }}>
              ✅ Analysis complete · Contract ID #{result.contract_id} saved to your account
            </div>

            {/* Summary */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="flex items-center gap-4" style={{ marginBottom: 16 }}>
                <h3>📋 Summary</h3>
              </div>
              <div style={{
                padding: "18px 20px", background: "var(--bg)",
                borderRadius: "var(--radius-sm)", lineHeight: 1.8,
                fontSize: ".9375rem", whiteSpace: "pre-wrap",
              }}>
                {result.summary || "No summary available."}
              </div>
            </div>

            {/* Clauses */}
            <div className="card">
              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <h3>⚖️ Detected Clauses</h3>
                <span className="badge badge-purple">{result.clauses.length} found</span>
              </div>

              {/* Summary badges */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                {Object.entries(clauseGroups).map(([type, items]) => (
                  <span key={type} className={`badge ${CLAUSE_COLORS[type] || "badge-gray"}`}>
                    {type.replace("_", " ")} ({items.length})
                  </span>
                ))}
              </div>

              <div className="clause-list">
                {result.clauses.map((c, i) => (
                  <div key={i} className="clause-item" style={{ borderLeftColor: BORDER[c.clause_type] || "var(--primary)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span className={`badge ${CLAUSE_COLORS[c.clause_type] || "badge-gray"}`}>
                        {c.clause_type.replace("_", " ")}
                      </span>
                      <span style={{ fontSize: ".75rem", color: "var(--text-light)" }}>Line {c.line_no}</span>
                    </div>
                    <p style={{ color: "var(--text)", fontSize: ".875rem", marginTop: 4 }}>{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
