# backend/app/services/result_parser.py
import json
import redis
from app.core.config import REDIS_URL
from app.services.aws_services import persist_json_result

def parse_json_result(text: str) -> dict:
    """
    Parses a JSON string containing candidate evaluation data that is wrapped
    in markdown code fences (```json ... ```). It removes the fences and returns
    a Python dictionary. Also converts 'fitScore' from a string like '9 / 10'
    to an integer.
    """
    text = text.strip()
    if text.startswith("```json"):
        text = text[len("```json"):].strip()
    if text.endswith("```"):
        text = text[:-len("```")].strip()
    
    data = json.loads(text)
    
    if "fitScore" in data and isinstance(data["fitScore"], str):
        score_str = data["fitScore"].split('/')[0].strip()
        if score_str.isdigit():
            data["fitScore"] = int(score_str)
    
    return data

def parse_and_persist_result(text: str, key: str) -> dict:
    """
    Parses the evaluation text into a dictionary, persists the result as JSON to S3,
    and then stores a status value ("COMPLETED" if successful) in Redis using the generated key.
    Returns the parsed result with added 's3_url' and 'redis_key' fields.
    """
    try:
        parsed = parse_json_result(text)
        persist_result = persist_json_result(parsed, key)
        
        # Connect to Redis using the URL from your config.
        r = redis.Redis.from_url(REDIS_URL)
        
        if "error" in persist_result:
            parsed["s3_error"] = persist_result["error"]
            parsed["s3_url"] = None
            parsed["redis_key"] = key
            r.set(key, "ERROR")
        else:
            s3_url = persist_result["url"]
            parsed["s3_url"] = s3_url
            parsed["redis_key"] = key
            # Store only the status (e.g., "COMPLETED") in Redis under the given key.
            r.set(key, "COMPLETED")
        
        return parsed

    except Exception as e:
        return {}