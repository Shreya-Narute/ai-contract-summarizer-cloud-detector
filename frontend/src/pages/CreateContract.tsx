import React, { useState } from "react";
import api from "../api";

type Template = "rental" | "affidavit" | "service";

const TEMPLATES: { value: Template; label: string; icon: string; desc: string }[] = [
  { value: "rental",   label: "Rental Agreement",   icon: "🏠", desc: "Landlord–tenant residential or commercial lease." },
  { value: "affidavit",label: "Affidavit",           icon: "📜", desc: "Sworn declaration for legal proceedings." },
  { value: "service",  label: "Service Agreement",  icon: "🤝", desc: "Contractor services agreement with payment terms." },
];

const FIELDS: Record<Template, { key: string; label: string; placeholder: string }[]> = {
  rental: [
    { key: "landlord",      label: "Landlord Name",   placeholder: "e.g. John Doe" },
    { key: "tenant",        label: "Tenant Name",     placeholder: "e.g. Jane Smith" },
    { key: "start_date",    label: "Start Date",      placeholder: "e.g. 2025-10-01" },
    { key: "rent",          label: "Monthly Rent",    placeholder: "e.g. ₹20,000 per month" },
    { key: "term",          label: "Lease Term",      placeholder: "e.g. 12 months" },
    { key: "deposit",       label: "Security Deposit",placeholder: "e.g. ₹40,000" },
    { key: "governing_law", label: "Governing Law",   placeholder: "e.g. State of Maharashtra" },
  ],
  affidavit: [
    { key: "deponent",      label: "Deponent Name",   placeholder: "Full legal name" },
    { key: "age",           label: "Age",             placeholder: "e.g. 30" },
    { key: "address",       label: "Address",         placeholder: "Residential address" },
    { key: "statement",     label: "Statement",       placeholder: "I solemnly affirm that…" },
    { key: "place",         label: "Place",           placeholder: "e.g. Mumbai" },
    { key: "date",          label: "Date",            placeholder: "e.g. 2025-10-01" },
  ],
  service: [
    { key: "client",        label: "Client Name",     placeholder: "e.g. Acme Corp" },
    { key: "provider",      label: "Provider Name",   placeholder: "e.g. TechSolutions Pvt. Ltd." },
    { key: "services",      label: "Services",        placeholder: "e.g. Software development" },
    { key: "fee",           label: "Fee",             placeholder: "e.g. ₹75,000 per month" },
    { key: "start_date",    label: "Start Date",      placeholder: "e.g. 2025-10-01" },
    { key: "governing_law", label: "Governing Law",   placeholder: "e.g. India" },
  ],
};

export default function CreateContract() {
  const [template, setTemplate] = useState<Template>("rental");
  const [fields, setFields]     = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const handleTemplateChange = (t: Template) => {
    setTemplate(t);
    setFields({});
    setError("");
    setSuccess(false);
  };

  const setField = (key: string, val: string) =>
    setFields(prev => ({ ...prev, [key]: val }));

  const generate = async () => {
    setError(""); setSuccess(false);
    const missing = FIELDS[template].filter(f => !fields[f.key]?.trim()).map(f => f.label);
    if (missing.length) { setError(`Please fill in: ${missing.join(", ")}`); return; }

    setLoading(true);
    try {
      const resp = await api.post("/generate/", { template, fields }, { responseType: "blob" });
      const url  = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", `${template}_filled.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      setSuccess(true);
    } catch (err: any) {
      setError("Generation failed. " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const current = TEMPLATES.find(t => t.value === template)!;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-label">Contract Builder</div>
          <h2 style={{ marginTop: 8, marginBottom: 6 }}>Create Contract</h2>
          <p>Choose a template, fill in the details, and download a ready-to-sign DOCX file.</p>
        </div>

        {/* Template selector */}
        <div className="card" style={{ marginBottom: 28 }}>
          <h4 style={{ marginBottom: 16 }}>1. Choose Template</h4>
          <div className="grid-3">
            {TEMPLATES.map(t => (
              <div
                key={t.value}
                onClick={() => handleTemplateChange(t.value)}
                style={{
                  padding: "20px", borderRadius: "var(--radius-sm)", cursor: "pointer",
                  border: `2px solid ${template === t.value ? "var(--primary)" : "var(--border)"}`,
                  background: template === t.value ? "var(--primary-light)" : "var(--bg)",
                  transition: "all .15s",
                }}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontWeight: 600, fontSize: ".9375rem", color: "var(--text)", marginBottom: 4 }}>{t.label}</div>
                <div style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h4 style={{ marginBottom: 20 }}>
            2. Fill in {current.icon} {current.label} Details
          </h4>
          <div className="grid-2">
            {FIELDS[template].map(f => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                <input
                  className="form-input"
                  placeholder={f.placeholder}
                  value={fields[f.key] || ""}
                  onChange={e => setField(f.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {error   && <div className="alert alert-error"   style={{ marginBottom: 16 }}>⚠️ {error}</div>}
        {success && <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ Contract generated and downloaded successfully!</div>}

        <button
          className="btn btn-primary btn-lg"
          onClick={generate}
          disabled={loading}
        >
          {loading
            ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Generating…</>
            : `⬇️ Generate & Download ${current.label}`}
        </button>
      </div>
    </div>
  );
}
