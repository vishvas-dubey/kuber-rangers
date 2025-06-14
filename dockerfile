
FROM python:3.11-slim

# -----------------------------
# 📁 Set working directory
# -----------------------------
ENV STREAMLIT_HOME=/app
WORKDIR $STREAMLIT_HOME

# -----------------------------
# ⚙️ System dependencies
# -----------------------------
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# 📄 Copy dependency file
# -----------------------------
COPY requirements.txt .

# -----------------------------
# 🐍 Install Python dependencies
# -----------------------------
RUN pip install --upgrade pip && pip install -r requirements.txt

# -----------------------------
# 📄 Copy all source files
# -----------------------------
COPY . .

# -----------------------------
# 🌍 Expose Streamlit port
# -----------------------------
EXPOSE 8501

# -----------------------------
# 🚀 Run Streamlit app
# Use `python -m streamlit` to avoid PATH issues
# -----------------------------
CMD ["python", "-m", "streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
