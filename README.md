# BucketList – Life Goals Tracker

A hands-on workshop project for learning AWS services. It's a simple web app where you can add and track your life goals. We use it to learn how to run a containerized app on AWS using ECS, ECR, DynamoDB, and a Load Balancer.

---

## Prerequisites

Before you start, make sure you have the following ready:

- An AWS account
- AWS CLI installed and configured (`aws configure`)
- Node.js 18+ installed
- Docker Desktop installed and running
- A DynamoDB table created (see Step 1 below)
- Git installed

---

## What this app does

- Add life goals (travel, skills, career, etc.)
- Track their status (Planned, In Progress, Completed)
- Store everything in DynamoDB
- Run inside a Docker container

---

## Project Structure

```
app/
  page.tsx                  # Landing page
  dashboard/page.tsx        # Goals dashboard
  api/goals/                # API endpoints (GET, POST, PATCH, DELETE)
components/                 # UI components (cards, forms, modals)
lib/
  dynamodb.ts               # DynamoDB connection
  goals.ts                  # Database operations
  types.ts                  # Data types
```

---

## Step 1 — Create the DynamoDB Table

Go to AWS Console → DynamoDB → Create Table

- Table name: `BucketListGoals`
- Partition key: `goalId` (String)
- Leave everything else as default

Or using AWS CLI:

```bash
aws dynamodb create-table \
  --table-name BucketListGoals \
  --attribute-definitions AttributeName=goalId,AttributeType=S \
  --key-schema AttributeName=goalId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

---

## Step 2 — Run Locally

```bash
# Install dependencies
npm install

# Create your env file
cp .env.example .env.local
# Fill in your AWS credentials in .env.local

# Start the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
DYNAMODB_TABLE=BucketListGoals
```

> When running on ECS, you don't need the keys — you use an IAM Role instead.

---

## Step 3 — Build the Docker Image

```bash
docker build -t bucketlist-app .
```

### How the Dockerfile works

The Dockerfile has 3 stages. This is called a **multi-stage build**.

```
Stage 1 (deps)     → installs only production packages
Stage 2 (builder)  → builds the Next.js app
Stage 3 (runner)   → copies only the built output, nothing else
```

Why 3 stages? So the final image is small and clean. It doesn't include source code or dev tools — only what's needed to run the app. This is a best practice for production containers.

### Run locally with Docker

```bash
docker run -p 3000:3000 --env-file .env.local bucketlist-app
```

---

## Step 4 — Push to ECR

ECR is AWS's container registry — like Docker Hub but on AWS.

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Create a repository
aws ecr create-repository --repository-name bucketlist-app --region us-east-1

# Tag and push your image
docker tag bucketlist-app:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/bucketlist-app:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/bucketlist-app:latest
```

---

## Step 5 — Deploy on ECS

### Create an IAM Task Role

This lets the container talk to DynamoDB without needing any keys.

Attach this permission to the role:

```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:PutItem",
    "dynamodb:GetItem",
    "dynamodb:UpdateItem",
    "dynamodb:DeleteItem",
    "dynamodb:Scan"
  ],
  "Resource": "arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/BucketListGoals"
}
```

### ECS Task Definition

- Use the ECR image you pushed
- Set the Task Role to the one you created above
- Add these environment variables (no keys needed):

```
AWS_REGION = us-east-1
DYNAMODB_TABLE = BucketListGoals
```

- Container port: `3000`

### Create ECS Service + Load Balancer

- Create an ECS cluster (Fargate)
- Create a service using your task definition
- Attach an Application Load Balancer on port 80
- Point it to your container on port 3000

### Final architecture

```
Browser → Load Balancer → ECS Container (port 3000) → DynamoDB
```

---

## AWS Services used in this workshop

| Service | What it does here |
|---|---|
| DynamoDB | Stores the goals |
| ECR | Stores the Docker image |
| ECS Fargate | Runs the container |
| ALB | Routes traffic to the container |
| IAM | Gives the container permission to use DynamoDB |
