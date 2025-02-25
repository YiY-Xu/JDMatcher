# backend/app/routers/receive_result.py
from fastapi import APIRouter, HTTPException, Request
import redis
import json

from app.services.result_parser import parse_and_persist_result
from app.services.aws_services import persist_json_result
from app.core import config

router = APIRouter()
r = redis.Redis.from_url(config.REDIS_URL)

@router.post("/receive-result", summary="Receive, persist candidate evaluation result without Pydantic")
async def receive_result(request: Request):
    try:
        # Parse the incoming JSON payload into a dictionary.
        data = await request.json()
        
        # Ensure compoundKey is provided.
        if "compoundKey" not in data.keys():
            raise HTTPException(status_code=400, detail="compoundKey is required in the request body.")
        
        # Extract the compoundKey and remove it from the data to avoid duplication in S3.
        compound_key = data.pop("compoundKey")
        id = compound_key.get("id","")
        
        # Persist the JSON result to S3 using the compound key as a prefix.
        result = parse_and_persist_result(data.get('result',''), key=id)
        persist_result = persist_json_result(result, key=id)
        if "error" in persist_result:
            raise HTTPException(status_code=500, detail=persist_result["error"])
       
        return {
            "message": "Result persisted successfully",
            "compoundKey": id,
            "s3PersistedUrl": persist_result["url"]
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=f"Parsing error: {str(e)}")