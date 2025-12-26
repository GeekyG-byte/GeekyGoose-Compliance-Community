FROM python:3.15-rc-alpine3.22

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    gcc \
    g++ \
    musl-dev \
    postgresql-dev \
    tesseract-ocr \
    poppler-utils

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Default command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]