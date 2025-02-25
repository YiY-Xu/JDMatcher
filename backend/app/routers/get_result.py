# backend/app/routers/get_result.py
from fastapi import APIRouter, HTTPException, Query
import redis.asyncio as redis
from app.core import config
from app.services.aws_services import get_s3_object

router = APIRouter()
r = redis.from_url(config.REDIS_URL)

@router.get("/get-result", summary="Retrieve analysis result from S3")
async def get_result(key: str = Query(..., description="Compound key with .json suffix")):
    # Remove the ".json" suffix to get the Redis key.
    redis_key = key.replace(".json", "")
    status = await r.get(redis_key)
    if status is None:
        raise HTTPException(status_code=404, detail="Status not found in Redis.")
    
    # Decode the status value.
    if status.decode("utf-8") != "COMPLETED":
        return {"status": status.decode("utf-8"), "message": "Result not ready."}
    
    # Retrieve the S3 object by calling our service function.
    result_obj = get_s3_object(key)
    if "error" in result_obj:
        raise HTTPException(status_code=500, detail=result_obj["error"])
    
    return result_obj