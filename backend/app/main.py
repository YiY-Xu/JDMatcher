# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import upload_resume, receive_result, result_status, analyze, get_result

app = FastAPI(title="JDMatcher Backend")

origins = [
    "http://127.0.0.1:5678",
    "http://127.0.0.1:5173",
    "https://jdmatcher.umagicv.com"  # Add your S3 bucket URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Only allow requests from these origins
    allow_credentials=True,
    allow_methods=["*"],  # Explicitly allow required methods
    allow_headers=["*"], 
)

app.include_router(upload_resume.router, prefix="/api", tags=["upload-resume"])
app.include_router(receive_result.router, prefix="/api", tags=["receive-result"])
app.include_router(result_status.router, prefix="/api", tags=["result-status"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(get_result.router, prefix="/api", tags=["get-result"])

@app.get("/")
def read_root():
    return {"message": "Hello from JDMatcher backend!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}