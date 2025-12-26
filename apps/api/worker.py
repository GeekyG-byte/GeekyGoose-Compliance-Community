#!/usr/bin/env python3
"""
Celery worker entry point.
This file provides the celery app instance for the worker command.
"""

from celery_app import celery_app

# Import all tasks to register them
import worker_tasks

# This makes the celery app available for the worker command:
# celery -A worker worker --loglevel=info
app = celery_app

if __name__ == '__main__':
    app.start()