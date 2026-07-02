FROM python:3.11-slim

WORKDIR /app

# Install dependencies directly, wrapped in double quotes to prevent shell redirection errors (< and >)
RUN pip install --no-cache-dir \
    "fastapi>=0.115.0" \
    "uvicorn>=0.30.0" \
    "pydantic>=2.8.0" \
    "pydantic-settings>=2.4.0" \
    "python-dotenv>=1.0.1" \
    "python-multipart>=0.0.9" \
    "websockets>=13.0" \
    "google-adk[gcp]>=2.0.0,<3.0.0" \
    "google-genai>=0.1.1" \
    "google-cloud-aiplatform>=1.156.0" \
    "google-auth>=2.30.0" \
    "protobuf>=5.27.0,<7.0.0" \
    "mcp>=1.0.0" \
    "opentelemetry-instrumentation-google-genai>=0.1b0,<1.0.0" \
    "gcsfs>=2024.11.0" \
    "google-cloud-logging>=3.12.0,<4.0.0"

# Copy consolidated application packages and frontend build
COPY src ./src
COPY frontend/dist ./frontend/dist

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start uvicorn directly from the root src package
CMD ["sh", "-c", "uvicorn src.server.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
