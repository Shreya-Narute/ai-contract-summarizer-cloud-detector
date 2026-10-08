import pdfplumber
from docx import Document

def extract_from_pdf(path):
    text = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            p = page.extract_text()
            if p:
                text.append(p)
    return "\n\n".join(text)

def extract_from_docx(path):
    doc = Document(path)
    return "\n\n".join([p.text for p in doc.paragraphs])
