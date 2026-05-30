# GapScan

An AI-powered Resume Analysis platform that evaluates resumes against ATS best practices and provides actionable feedback on content quality, structure, skills coverage, and writing style.

GapScan allows candidates to upload resumes, receive AI-generated recommendations, track historical submissions, and improve their chances of passing Applicant Tracking Systems (ATS).

---

# Overview

GapScan consists of two independent applications:

1. **Frontend**
   - React Router 7
   - TypeScript
   - Zustand
   - Puter Authentication
   - PDF Processing
   - Resume Management UI

2. **Backend**
   - Node.js
   - Express
   - AWS S3 Integration
   - File Upload APIs
   - Signed URL Generation
   - S3 Cleanup APIs

---

# Architecture



---

# Tech Stack

## Frontend

### Framework

- React 19
- React Router 7

### State Management
- Zustand

### Authentication
- Puter Auth

### AI Integration with any model
- Puter AI. At this case using the puter default gpt-5-nano

Used to analyze resumes and generate structured feedback.

Analysis includes:

- ATS score
- Content quality
- Resume structure
- Skills assessment
- Tone and style evaluation

### PDF Processing

Libraries:

```text
pdfjs-dist
```

Used for:

- PDF text extraction
- PDF preview generation
- Resume rendering

### Styling

- Tailwind CSS
- Tailwind Merge

Used for:

- Responsive layouts
- Component styling
- Utility-first CSS

### File Upload
- Dropzone



---

## Backend

### Runtime

- Node.js 20

### Framework

- Express 5

Provides:

- REST APIs
- Upload endpoints
- S3 integration endpoints

### Upload Processing

- Multer

Used for:

```text
multipart/form-data
```

processing.

Example:

```typescript
upload.single("file")
```

### AWS SDK

Libraries:

```text
@aws-sdk/client-s3
@aws-sdk/s3-request-presigner
```

Used for:

- Uploading files
- Reading files
- Deleting files
- Listing files
- Signed URL generation

---

## Storage

### Amazon S3

Stores:

- Resume images
- Uploaded documents

Features:

- Private bucket support
- Signed URL access
- Secure file retrieval

---

# AI Resume Analysis Pipeline

## Step 1

User uploads:

```text
PDF
```

---

## Step 2

Resume content is extracted.

```text
PDF → Text
Image → Preview
```

---

## Step 3

Resume content is submitted to Puter AI.

---

## Step 4

AI returns structured feedback.

Example:

```json
{
  "overallScore": 88,
  "ATS": {
    "score": 92
  },
  "toneAndStyle": {
    "score": 85
  },
  "content": {
    "score": 90
  },
  "structure": {
    "score": 87
  },
  "skills": {
    "score": 89
  }
}
```

---

## Step 5

Analysis results are stored locally and displayed on the dashboard.

---

# Features

## Resume Upload

Supports:

- PDF
- PNG
- JPG
- JPEG

---

## Resume Dashboard

Displays:

- Previous uploads
- Resume previews
- Historical scores

---

## ATS Analysis

Evaluates:

- ATS compatibility
- Formatting
- Keyword optimization

---

## Content Analysis

Evaluates:

- Professional summary
- Work experience
- Accomplishments
- Relevance

---

## Structure Analysis

Evaluates:

- Layout consistency
- Section organization
- Readability

---

## Skills Analysis

Evaluates:

- Skill relevance
- Technical coverage
- Missing competencies

---

## Tone & Style Analysis

Evaluates:

- Professional language
- Clarity
- Impact

---

## Resume History

Users can:

- Revisit previous analyses
- Compare scores
- Track improvements

---

## Application Wipe Utility

Developer utility route:

```text
/wipe
```

Performs:

- Resume history cleanup
- Local storage cleanup
- S3 object deletion

Useful during development and testing.

---

# Project Structure

```text
GapScan
│
├── frontend
│   │
│   ├── app
│   │   ├── components
│   │   ├── routes
│   │   ├── lib
│   │   └── root.tsx
│   │
│   ├── public
│   ├── package.json
│   └── Dockerfile
│
├── server
│   │
│   ├── routes
│   │   ├── upload.ts
│   │   └── wipe.ts
│   │
│   ├── server.ts
│   ├── package.json
│   └── Dockerfile
│
└── README.md
```

---

# Environment Variables

## Frontend

File:

```bash
frontend/.env
```

```env
VITE_API_URL=http://localhost:5001
```

---

## Backend

File:

```bash
server/.env
```

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxx
S3_BUCKET_NAME=resume-storage-xxxxxxxx
```

---

# Local Development

## Start Backend

```bash
cd server

npm install

npm run dev
```

API:

```text
http://localhost:5001
```

---

## Start Frontend

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

# Docker Deployment

## Frontend

Build:

```bash
docker build -t gapscan-frontend .
```

Run:

```bash
docker run \
-p 3000:3000 \
--env-file .env \
gapscan-frontend
```

---

## Backend

Build:

```bash
docker build -t gapscan-backend .
```

Run:

```bash
docker run \
-p 5001:5001 \
--env-file .env \
gapscan-backend
```

---

## Next Stage
Deploy LLAma locally and use it to avoid usage limit 