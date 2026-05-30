# GapScan

AI-powered Resume Analyzer that evaluates resumes, provides ATS scoring, feedback on content, structure, tone, and skills, and stores uploaded resumes in Amazon S3.

## Features

- Resume upload (PDF/Image)
- AI-powered resume analysis
- ATS compatibility scoring
- Content, Structure, Tone & Style, and Skills evaluation
- Resume history dashboard
- Amazon S3 file storage
- Signed URL support for private S3 buckets
- Docker support
- Separate Frontend and Backend services

---

# Project Structure

```text
GapScan/
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
│
├── server/
│   ├── routes/
│   ├── server.ts
│   ├── package.json
│   └── Dockerfile
│
└── README.md
```

---

# Architecture

```text
Browser
   │
   ▼
Frontend (React Router)
   │
   ▼
Backend API (Express)
   │
   ▼
Amazon S3
```

---

# Requirements

- Node.js 20+
- npm
- Docker
- AWS Account
- S3 Bucket

---

# AWS Configuration

Create an S3 bucket:

```text
resume-storage-xxxxxxxx
```

Create an IAM user with permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET",
        "arn:aws:s3:::YOUR_BUCKET/*"
      ]
    }
  ]
}
```

---

# Frontend Configuration

Create:

```bash
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5001
```

---

# Backend Configuration

Create:

```bash
server/.env
```

Example:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxx
S3_BUCKET_NAME=resume-storage-xxxxxxxx
```

---

# Running Locally

## Backend

```bash
cd server

npm install

npm run dev
```

Server:

```text
http://localhost:5001
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Application:

```text
http://localhost:5173
```

---

# Production Build

## Frontend

```bash
cd frontend

npm run build
```

---

# Docker

## Frontend Image

Build:

```bash
cd frontend

docker build -t gapscan-frontend .
```

Run:

```bash
docker run \
  -p 3000:3000 \
  --env-file .env \
  gapscan-frontend
```

Application:

```text
http://localhost:3000
```

---

## Backend Image

Build:

```bash
cd server

docker build -t gapscan-backend .
```

Run:

```bash
docker run \
  -p 5001:5001 \
  --env-file .env \
  gapscan-backend
```

API:

```text
http://localhost:5001
```

---

# Docker Compose

Create:

```yaml
version: '3.9'

services:

  backend:
    build: ./server
    ports:
      - "5001:5001"
    env_file:
      - ./server/.env

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env
    depends_on:
      - backend
```

Run:

```bash
docker compose up --build
```

---

# Wipe Route

The application includes a maintenance route:

```text
/wipe
```

This route:

- Removes resume metadata
- Clears stored application history
- Deletes uploaded files from S3

Useful during development and testing.

---

# Environment Variables

## Frontend

| Variable | Description |
|-----------|-------------|
| VITE_API_URL | Backend API URL |

Example:

```env
VITE_API_URL=http://localhost:5001
```

---

## Backend

| Variable | Description |
|-----------|-------------|
| AWS_REGION | AWS region |
| AWS_ACCESS_KEY_ID | IAM Access Key |
| AWS_SECRET_ACCESS_KEY | IAM Secret |
| S3_BUCKET_NAME | Target S3 bucket |

Example:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
S3_BUCKET_NAME=resume-storage-xxxxx
```

---

# Deployment

The application is designed to be deployed as two independent containers:

1. Frontend (React Router)
2. Backend (Express API)

---
