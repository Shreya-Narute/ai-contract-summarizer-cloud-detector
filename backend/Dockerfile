FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

COPY app /app/app

# Copy contract templates so /generate endpoint can find them at runtime.
# generate.py resolves "templates/<name>.docx" relative to WORKDIR (/app).
COPY templates /app/templates

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]