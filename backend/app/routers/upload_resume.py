# backend/app/routers/upload_resume.py
from fastapi import APIRouter, Query
from app.services.aws_services import generate_presigned_url

router = APIRouter()

@router.get("/upload-resume", summary="Get Presigned URL for Resume Upload")
def get_presigned_url(
    filename: str = Query(..., description="Name of the file to upload"),
    content_type: str = Query(..., description="The MIME type of the file"),
    file_hash: str = Query("", description="MD5 hash of the file (hex digest); leave empty if not provided")
):
    """
    Generate a presigned URL for uploading a resume to S3.
    
    This endpoint requires the filename and content type. If a file_hash is provided,
    it checks if an object with the same key already exists in S3 and whether its ETag
    matches the provided file_hash. If they match, it indicates that the file already exists.
    
    Otherwise, it returns a new presigned URL that includes the Content-Type in its signature.
    """
    result = generate_presigned_url(filename, content_type, file_hash)
    return result