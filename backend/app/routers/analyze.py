# backend/app/routers/analyze.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import redis.asyncio as redis  # asynchronous Redis client
import httpx  # asynchronous HTTP client
from app.core import config

router = APIRouter()
r = redis.from_url(config.REDIS_URL)

class AnalyzeRequest(BaseModel):
    compound_key: str
    unique_resume_identifier: str  # e.g. "filename_versionId"
    job_url: str

@router.post("/analyze", summary="Initiate analysis for resume and job description")
async def initiate_analysis(request: AnalyzeRequest):
    compound_key = request.compound_key

    # Check if status already exists in Redis.
    status = await r.get(compound_key)
    if status:
        return {"status": status.decode("utf-8"), "compound_key": compound_key}
    
    # Construct the parameter value as "resumeName,jobUrl"
    # Here, we use the unique_resume_identifier (which should be like "filename_versionId")
    param_value = f"{request.compound_key},{request.job_url}"
    try:
        # Set status to SUBMITTED in Redis
        await r.set(compound_key, "SUBMITTED")
        
        # Use httpx AsyncClient to call the remote analysis endpoint
        async with httpx.AsyncClient() as client:
            response = await client.get("http://127.0.0.1:5678/webhook/job-description", params={"data": param_value})
        
        remote_result = response.json()
        print(f"remote wf triggered : {remote_result}")
        # Update Redis status to PROCESSING
        await r.set(compound_key, "PROCESSING")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling remote analysis endpoint: {str(e)}")
    
    return {"compound_key": compound_key, "id": remote_result}