/**
 * Shared axios instance for the AI Contract System API.
 *
 * - baseURL points to the FastAPI backend at localhost:8000.
 *   This is the browser-facing address. Do NOT use the Docker-network
 *   hostname "backend" here — the browser cannot resolve it.
 *
 * - The request interceptor automatically attaches the JWT stored in
 *   localStorage as "Authorization: Bearer <token>" on every request,
 *   so individual pages do not have to manage headers themselves.
 */

import axios from "axios";

// REACT_APP_API_URL is set at Docker build time for production deployments.
// Falls back to localhost:8000 for local development with docker compose.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000",
});

// Attach JWT on every outgoing request if one is present in localStorage.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export default api;
