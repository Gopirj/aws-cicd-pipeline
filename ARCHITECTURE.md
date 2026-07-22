# AWS CI/CD Pipeline - Complete Architecture

## Project Overview

A **CI/CD Pipeline Automation Tool** that automatically builds, tests, and deploys a Node.js web application to AWS infrastructure.

---

## Website Features

### Dashboard (Frontend)

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS CI/CD Pipeline                        │
│              Automated Application Deployment                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Source   │  │  Build   │  │  Deploy  │  │ Monitor  │   │
│  │  GitHub   │  │ CodeBuild│  │CodeDeploy│  │CloudWatch│   │
│  │  [Active] │  │ [Active] │  │ [Active] │  │ [Active] │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  Live Metrics:                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Deploys   │  │Success   │  │Build Time│  │Last      │   │
│  │  156     │  │  98.5%   │  │ 4:32 min │  │  Today   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## API Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `/api/health` | Check if app is running | `{"status": "healthy", "uptime": "...", "version": "1.0.0"}` |
| `/api/info` | Get app details | `{"app": "AWS CI/CD Demo", "pipeline": "AWS CodePipeline"}` |
| `/api/metrics` | Get live statistics | `{"deployments": 156, "successRate": "98.50"}` |

---

## Visual Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              AWS CLOUD ENVIRONMENT                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                           VPC (10.0.0.0/16)                                     │   │
│  │  ┌───────────────────────────────────────────────────────────────────────────┐  │   │
│  │  │                    Public Subnet (10.0.1.0/24)                            │  │   │
│  │  │                                                                           │  │   │
│  │  │   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                │  │   │
│  │  │   │             │     │             │     │             │                │  │   │
│  │  │   │  EC2        │     │  CodeDeploy │     │  App        │                │  │   │
│  │  │   │  Instance   │◀────│  Agent      │◀────│  Code       │                │  │   │
│  │  │   │             │     │             │     │             │                │  │   │
│  │  │   └─────────────┘     └─────────────┘     └─────────────┘                │  │   │
│  │  │                                                                           │  │   │
│  │  └───────────────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                           CI/CD SERVICES                                         │   │
│  │                                                                                   │   │
│  │  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐  │   │
│  │  │             │     │             │     │             │     │             │  │   │
│  │  │  CodePipeline│────▶│  CodeBuild  │────▶│  S3 Bucket  │────▶│  CloudWatch │  │   │
│  │  │             │     │             │     │             │     │             │  │   │
│  │  └──────┬──────┘     └─────────────┘     └─────────────┘     └─────────────┘  │   │
│  │         │                                                                       │   │
│  │         │                                                                       │   │
│  │         ▼                                                                       │   │
│  │  ┌─────────────┐                                                                │   │
│  │  │             │                                                                │   │
│  │  │  GitHub     │                                                                │   │
│  │  │  (Source)   │                                                                │   │
│  │  │             │                                                                │   │
│  │  └─────────────┘                                                                │   │
│  │                                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Pipeline Flow

```
┌──────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
│          │    │            │    │            │    │            │    │            │
│ Developer│───▶│   GitHub   │───▶│   Code     │───▶│   Code     │───▶│   Code     │
│   Push   │    │   Webhook  │    │  Pipeline  │    │   Build    │    │  Deploy    │
│          │    │            │    │            │    │            │    │            │
└──────────┘    └────────────┘    └────────────┘    └────────────┘    └────────────┘
                    │                   │                   │                   │
                    │                   │                   │                   │
                    ▼                   ▼                   ▼                   ▼
               ┌────────┐          ┌────────┐          ┌────────┐          ┌────────┐
               │ Source │          │ Build  │          │Deploy  │          │  App   │
               │ Stage  │          │ Stage  │          │ Stage  │          │Running │
               └────────┘          └────────┘          └────────┘          └────────┘
                    │                   │                   │                   │
                    │                   │                   │                   │
                    ▼                   ▼                   ▼                   ▼
               ┌────────┐          ┌────────┐          ┌────────┐          ┌────────┐
               │   S3   │          │  S3    │          │  EC2   │          │Health  │
               │Artifact│          │Artifact│          │Instance│          │ Check  │
               └────────┘          └────────┘          └────────┘          └────────┘
```

---

## User Flow

```
Developer                    AWS Cloud                     Website
    │                             │                           │
    │  1. Git Push                │                           │
    │─────────────────────────────▶                           │
    │                             │                           │
    │                    2. CodePipeline Triggered             │
    │                             │                           │
    │                    3. CodeBuild:                         │
    │                       - npm ci (install)                 │
    │                       - npm test (test)                  │
    │                       - npm run build (build)            │
    │                             │                           │
    │                    4. CodeDeploy:                         │
    │                       - Stop old app                     │
    │                       - Deploy new code                  │
    │                       - Start new app                    │
    │                       - Health check                     │
    │                             │                           │
    │                             │         5. Updated Website│
    │                             │───────────────────────────▶│
```

---

## Deployment Workflow

### 1. Source Stage
- **Trigger**: Git push to main/develop branch
- **Action**: Pull code from GitHub
- **Output**: Source artifact in S3

### 2. Build Stage
- **Trigger**: Source artifact available
- **Action**: 
  - Install dependencies (`npm ci`)
  - Run tests (`npm test`)
  - Build application
- **Output**: Build artifact in S3

### 3. Deploy Stage
- **Trigger**: Build artifact available
- **Action**:
  - Stop existing application
  - Deploy new version
  - Start application
  - Validate service
- **Output**: Running application on EC2

---

## Rollback Strategy

```
Deployment Failure Detected
         │
         ▼
┌─────────────────┐
│   Auto-Rollback │
│   Triggered     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Stop Failed   │
│   Deployment    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Restore      │
│   Previous     │
│   Version      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Validate     │
│   Service      │
└─────────────────┘
```

---

## Real-World Usage

### Scenario 1: E-Commerce Company
```
Usage: Deploy shopping cart application
Flow:  Developer pushes code → Auto-deploy to production
Benefit: Zero downtime, instant updates
```

### Scenario 2: Startup MVP
```
Usage: Rapid prototyping and deployment
Flow:  Push features → Auto-test → Auto-deploy
Benefit: Focus on coding, not infrastructure
```

### Scenario 3: Enterprise Team
```
Usage: Multi-developer collaboration
Flow:  Multiple devs push → Pipeline handles conflicts → Deploy
Benefit: Consistent, reliable deployments
```

---

## Project Components

### 1. Application Layer

| File | Purpose |
|------|---------|
| `src/server.js` | Express.js API server (handles requests) |
| `src/public/index.html` | Dashboard UI (shows metrics) |
| `src/styles/main.css` | Styling (dark theme, responsive) |

### 2. Infrastructure Layer

| File | Purpose |
|------|---------|
| `infrastructure/cloudformation.yml` | AWS setup (VPC, EC2, IAM) |
| `infrastructure/main.tf` | Same as above (Terraform alternative) |

### 3. CI/CD Layer

| File | Purpose |
|------|---------|
| `buildspec.yml` | CodeBuild instructions |
| `appspec.yml` | CodeDeploy instructions |
| `scripts/*.sh` | Deployment automation scripts |

---

## Monitoring Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                    CloudWatch Dashboard                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │  Pipeline       │    │  Build          │    │  Deploy     │ │
│  │  Success Rate   │    │  Duration       │    │  Count      │ │
│  │                 │    │                 │    │             │ │
│  │     98.5%       │    │    4:32 min     │    │    156      │ │
│  │                 │    │                 │    │             │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │  Failure Rate   │    │  Rollback       │    │  Uptime     │ │
│  │                 │    │  Count          │    │             │ │
│  │      1.5%       │    │      3          │    │   99.9%     │ │
│  │                 │    │                 │    │             │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Benefits Summary

| Aspect | Before (Manual) | After (This Project) |
|--------|-----------------|----------------------|
| Deploy Time | 30-60 minutes | 5-10 minutes |
| Error Rate | High (human error) | Low (automated) |
| Rollback | Complex | Automatic on failure |
| Monitoring | Manual checks | CloudWatch alerts |
| Cost | Developer time | ~$10-15/month AWS |

---

## Key Metrics Tracked

```json
{
  "deployments": 156,
  "successRate": "98.50%",
  "avgBuildTime": "4:32 min",
  "lastDeployment": "2026-07-22T10:30:00Z",
  "rollbackCount": 3,
  "uptime": "99.9%"
}
```

---

## Cost Estimate

| Service | Cost |
|---------|------|
| EC2 t2.micro | ~$8/month |
| CodePipeline | $1/month |
| CodeBuild | ~$0.01/build |
| CodeDeploy | Free tier (5 deployments) |
| S3 | ~$0.01/month |
| **Total** | **~$10-15/month** |
