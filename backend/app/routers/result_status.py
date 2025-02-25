# backend/app/routers/result_status.py
from fastapi import APIRouter, HTTPException, Query
import redis.asyncio as redis
from app.core.config import REDIS_URL

router = APIRouter()
r = redis.from_url(REDIS_URL)

@router.get("/result-status", summary="Check the status of the evaluation result")
async def get_result_status(key: str = Query(..., description="The Redis key for the result")):
    """
    Checks Redis for the status of the evaluation result.
    Returns a JSON response with the status.
    """
    status = await r.get(key)
    if status is None:
        return {"status": "NOT SUBMITTED"}
    
    try:
        status_str = status.decode("utf-8")
        return {"status": status_str}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error decoding status: {str(e)}")