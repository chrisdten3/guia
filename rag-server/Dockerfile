FROM python:3.11

# Install system dependencies for SQLite (needed for ChromaDB) and other system utilities
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the requirements file first, to leverage Docker caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create a directory for SQLite data
RUN mkdir -p /app/chroma

# Expose a port if your Python script serves a model via an API (adjust the port if necessary)
EXPOSE 5000

# Run the Python script (entrypoint for your application)
CMD ["python", "model_script.py"]
