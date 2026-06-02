FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    libpq-dev \
    tesseract-ocr \
    poppler-utils \
    libfreetype6-dev \
    libjpeg-dev \
    libopenjp2-7-dev \
    zlib1g-dev \
    libffi-dev \
    libmupdf-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip first
RUN pip install --upgrade pip

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run as non-root user
RUN useradd -r -u 1000 -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Default command — no --reload in production
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]