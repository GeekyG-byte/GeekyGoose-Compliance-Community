"""
Celery configuration for background task processing.
"""
import os
from celery import Celery
from kombu import Queue

# Redis URL from environment
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')

# Create Celery app
celery_app = Celery(
    'compliance_scanner',
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=['worker_tasks']
)

# Configuration
celery_app.conf.update(
    # Task serialization
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    
    # Task routing
    task_routes={
        'worker_tasks.extract_document_text': {'queue': 'extraction'},
        'worker_tasks.process_scan': {'queue': 'scanning'},
    },
    
    # Define queues
    task_queues=(
        Queue('extraction', routing_key='extraction'),
        Queue('scanning', routing_key='scanning'),
        Queue('celery', routing_key='celery'),  # default queue
    ),
    
    # Worker configuration
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    
    # Task time limits
    task_soft_time_limit=300,  # 5 minutes
    task_time_limit=600,       # 10 minutes
    
    # Result backend settings
    result_expires=3600,  # 1 hour
)