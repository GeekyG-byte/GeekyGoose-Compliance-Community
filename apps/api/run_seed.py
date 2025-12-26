#!/usr/bin/env python3
"""
Standalone script to seed the database with Essential Eight framework.
Can be run independently or as part of setup process.
"""
import os
import sys
from pathlib import Path

# Add the current directory to Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

# Set environment variables for local development
os.environ.setdefault('DATABASE_URL', 'postgresql://geekygoose:dev_password_123@localhost:5432/geekygoose')
os.environ.setdefault('REDIS_URL', 'redis://localhost:6379')
os.environ.setdefault('MINIO_ENDPOINT', 'localhost:9000')
os.environ.setdefault('MINIO_ACCESS_KEY', 'minioadmin')
os.environ.setdefault('MINIO_SECRET_KEY', 'minioadmin123')
os.environ.setdefault('MINIO_BUCKET', 'geekygoose-docs')

def main():
    try:
        # Import after setting environment variables
        from seed_data import run_seed
        
        print("Starting database seeding...")
        run_seed()
        print("Database seeding completed successfully!")
        
    except ImportError as e:
        print(f"Import error: {e}")
        print("Make sure all required dependencies are installed.")
        sys.exit(1)
    except Exception as e:
        print(f"Error during seeding: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()