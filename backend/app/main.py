import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import auth, files, generate, jobs
from .db import Base, engine

# --------------------------------------------------
# Create database tables
# --------------------------------------------------
Base.metadata.create_all(bind=engine)

# --------------------------------------------------
# Create FastAPI application
# --------------------------------------------------
app = FastAPI(title="AI Contract System API")

# --------------------------------------------------
# CORS Configuration
#
# ALLOWED_ORIGINS env var controls which origins are permitted.
# For local development it defaults to localhost on any port.
# For production set:
#   ALLOWED_ORIGINS=https://your-frontend.up.railway.app
# Multiple origins: comma-separated, e.g.:
#   ALLOWED_ORIGINS=https://app.example.com,https://staging.example.com
# --------------------------------------------------
_raw_origins = os.getenv("ALLOWED_ORIGINS", "")

if _raw_origins:
    # Production: explicit list of allowed origins
    allow_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]
    allow_origin_regex = None
else:
    # Local development: allow any localhost port (3000, 3001, 8080, etc.)
    allow_origins = []
    allow_origin_regex = r"http://localhost:\d+"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_origin_regex=allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# API Routers
# --------------------------------------------------
app.include_router(auth.router)
app.include_router(files.router)
app.include_router(generate.router)
app.include_router(jobs.router)
