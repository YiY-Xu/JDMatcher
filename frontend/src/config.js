// src/config.js
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:8000/api";

// Endpoints for your backend
export const UPLOAD_RESUME_ENDPOINT = `${BACKEND_BASE_URL}/upload-resume`;
export const ANALYZE_ENDPOINT = `${BACKEND_BASE_URL}/analyze`;
export const RESULT_STATUS_ENDPOINT = `${BACKEND_BASE_URL}/result-status`;
export const GET_RESULT_ENDPOINT = `${BACKEND_BASE_URL}/get-result`;