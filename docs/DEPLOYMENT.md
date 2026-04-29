# Deployment Guide

## Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

## AWS Reference

Recommended production layout:

- Frontend: AWS Amplify, CloudFront + S3, or ECS service.
- API: ECS Fargate service behind an Application Load Balancer.
- Database: Amazon RDS for MySQL.
- Cache: Amazon ElastiCache Redis.
- Secrets: AWS Secrets Manager.
- Observability: CloudWatch logs, metrics, alarms, and AWS X-Ray.

## Environment Variables

- `DATABASE_URL`: SQLAlchemy MySQL connection string.
- `REDIS_URL`: Redis connection string.
- `JWT_SECRET`: strong random signing secret.
- `OPENAI_API_KEY`: optional for live LLM responses.
- `CORS_ORIGINS`: comma-separated frontend origins.

## CI/CD

GitHub Actions runs frontend lint/build checks and backend import/compile checks. Extend the workflow with image pushes to ECR and ECS deploy steps once AWS account details are available.
