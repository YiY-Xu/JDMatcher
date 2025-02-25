# backend/app/services/aws_services.py

import boto3
from botocore.exceptions import BotoCoreError, NoCredentialsError, ClientError
from datetime import datetime, timezone
import json
from app.core import config

def generate_presigned_url(filename: str, content_type: str, file_hash: str = '', expires_in: int = 3600) -> dict:
    """
    Generates a presigned URL for uploading a file to S3.
    The Content-Type is included in the signature so that the subsequent PUT request matches.
    
    If file_hash is provided, the function performs a HEAD request to check if an object
    with the same key exists and if its ETag matches the provided file_hash.
      - If a match is found, it retrieves the object's VersionId (the unique version string)
        and returns it along with a message indicating that the file already exists.
      - Otherwise, it generates and returns a new presigned URL.
    """
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=config.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
        region_name=config.AWS_REGION,
    )
    
    # If a file hash is provided, check if the object exists and matches.
    if file_hash:
        try:
            head_response = s3_client.head_object(Bucket=config.S3_BUCKET_NAME, Key=filename)
            existing_etag = head_response.get("ETag", "").strip('"')
            if existing_etag == file_hash:
                # Retrieve the VersionId of the existing object.
                version_id = head_response.get("VersionId", None)
                return {
                    "message": "File already exists",
                    "url": None,
                    "file_exists": True,
                    "version_id": version_id
                }
        except ClientError as e:
            # If error code is 404, the file does not exist; otherwise, return the error.
            if e.response["Error"]["Code"] != "404":
                return {"error": str(e)}
    
    # Generate a presigned URL to put the object including the content type.
    try:
        response = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": config.S3_BUCKET_NAME,
                "Key": filename,
                "ContentType": content_type,
            },
            ExpiresIn=expires_in
        )
        return {"url": response, "file_exists": False}
    except (BotoCoreError, NoCredentialsError) as e:
        return {"error": str(e)}

def persist_json_result(data: dict, key: str, expires_in: int = 3600) -> dict:
    """
    Dumps the provided dictionary as JSON, persists it to S3, and returns a presigned URL.
    If no key is provided, a key is generated using the current UTC timestamp.
    """
    key = f"{key}.json"
    
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=config.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
        region_name=config.AWS_REGION,
    )
    
    print(f"persisting {key}")

    try:
        json_data = json.dumps(data)
        s3_client.put_object(
            Bucket=config.S3_BUCKET_NAME,
            Key=key,
            Body=json_data,
            ContentType="application/json"
        )
        
        # Generate a presigned URL for GET requests.
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": config.S3_BUCKET_NAME, "Key": key},
            ExpiresIn=expires_in
        )
        print("persisted")
        return {"url": url, "key": key}
    except (BotoCoreError, NoCredentialsError) as e:
        return {"error": str(e)}
    
def get_s3_object(key: str, expires_in: int = 3600) -> dict:
    """
    Retrieves an object from S3 using the given key, decodes its content, 
    and parses it as JSON.
    """
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=config.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
        region_name=config.AWS_REGION,
    )
    try:
        response = s3_client.get_object(Bucket=config.S3_BUCKET_NAME, Key=key)
        content = response["Body"].read().decode("utf-8")
        return json.loads(content)
    except (BotoCoreError, NoCredentialsError, ClientError) as e:
        return {"error": str(e)}