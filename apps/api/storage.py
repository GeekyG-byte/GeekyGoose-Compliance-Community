import os
import hashlib
import uuid
from typing import BinaryIO
import boto3
from botocore.client import Config

class MinIOStorage:
    def __init__(self):
        self.endpoint = os.getenv("MINIO_ENDPOINT", "minio:9000")
        self.access_key = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
        self.secret_key = os.getenv("MINIO_SECRET_KEY", "minioadmin123")
        self.bucket = os.getenv("MINIO_BUCKET", "geekygoose-docs")
        self.use_ssl = os.getenv("MINIO_USE_SSL", "false").lower() == "true"
        
        self.client = boto3.client(
            's3',
            endpoint_url=f"{'https' if self.use_ssl else 'http'}://{self.endpoint}",
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            config=Config(signature_version='s3v4'),
            region_name='us-east-1'
        )
        
        # Create bucket if it doesn't exist
        try:
            self.client.head_bucket(Bucket=self.bucket)
        except:
            self.client.create_bucket(Bucket=self.bucket)
    
    def upload_file(self, file: BinaryIO, filename: str, mime_type: str = None) -> tuple[str, str, int]:
        """Upload file and return (storage_key, sha256_hash, file_size)"""
        # Read file content
        file_content = file.read()
        file_size = len(file_content)
        
        # Calculate SHA256
        sha256_hash = hashlib.sha256(file_content).hexdigest()
        
        # Generate unique storage key
        storage_key = f"{uuid.uuid4()}/{filename}"
        
        # Upload to MinIO
        extra_args = {}
        if mime_type:
            extra_args['ContentType'] = mime_type
            
        self.client.put_object(
            Bucket=self.bucket,
            Key=storage_key,
            Body=file_content,
            **extra_args
        )
        
        return storage_key, sha256_hash, file_size
    
    def get_download_url(self, storage_key: str, expires_in: int = 3600) -> str:
        """Generate presigned URL for file download"""
        return self.client.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket, 'Key': storage_key},
            ExpiresIn=expires_in
        )
    
    def download_file(self, storage_key: str) -> bytes:
        """Download file content from storage"""
        response = self.client.get_object(Bucket=self.bucket, Key=storage_key)
        return response['Body'].read()
    
    def delete_file(self, storage_key: str):
        """Delete file from storage"""
        self.client.delete_object(Bucket=self.bucket, Key=storage_key)

storage = MinIOStorage()