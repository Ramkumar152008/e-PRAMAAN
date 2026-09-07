# Multi-Stage Container Definition for e-BID PRAMAAN

# ── Stage 1: Build Frontend ──
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY sih\ 26/package*.json ./
RUN npm ci
COPY sih\ 26/ ./
RUN npm run build

# ── Stage 2: Production Backend & Web Server ──
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY backend/ ./backend/
WORKDIR /app/backend

# Copy static frontend build
COPY --from=frontend-builder /app/frontend/dist /app/backend/static

EXPOSE 8000

ENV PORT=8000
ENV ENVIRONMENT=production

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
