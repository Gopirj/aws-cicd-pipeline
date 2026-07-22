# AWS CI/CD Pipeline - Automated Application Deployment

[![CI/CD Pipeline](https://img.shields.io/badge/AWS-CodePipeline-blue.svg)](https://aws.amazon.com/codepipeline/)
[![CodeBuild](https://img.shields.io/badge/AWS-CodeBuild-green.svg)](https://aws.amazon.com/codebuild/)
[![CodeDeploy](https://img.shields.io/badge/AWS-CodeDeploy-orange.svg)](https://aws.amazon.com/codedeploy/)
[![CloudWatch](https://img.shields.io/badge/Monitoring-CloudWatch-purple.svg)](https://aws.amazon.com/cloudwatch/)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          AWS CI/CD Pipeline Architecture                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐  │
│  │          │     │              │     │              │     │              │  │
│  │  GitHub  │────▶│ CodePipeline │────▶│  CodeBuild   │────▶│ CodeDeploy   │  │
│  │ (Source) │     │ (Orchestrate)│     │   (Build)    │     │  (Deploy)    │  │
│  │          │     │              │     │              │     │              │  │
│  └──────────┘     └──────────────┘     └──────────────┘     └──────────────┘  │
│       │                │                     │                     │            │
│       │                │                     │                     │            │
│       ▼                ▼                     ▼                     ▼            │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐  │
│  │          │     │              │     │              │     │              │  │
│  │  Push    │     │  CloudWatch  │     │  S3 Bucket   │     │  EC2 / EBS   │  │
│  │  Event   │     │  (Monitor)   │     │ (Artifacts)  │     │  (Runtime)   │  │
│  │          │     │              │     │              │     │              │  │
│  └──────────┘     └──────────────┘     └──────────────┘     └──────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Pipeline Flow Diagram

```
Developer Push ──▶ GitHub ──▶ Webhook ──▶ CodePipeline ──▶ CodeBuild ──▶ CodeDeploy ──▶ EC2
      │                                        │                │              │
      │                                        │                │              │
      │                                        ▼                ▼              ▼
      │                                   ┌─────────┐    ┌──────────┐   ┌──────────┐
      │                                   │  CloudWatch  │  S3       │   │  Health  │
      │                                   │  Logs &  │    │ Artifacts│   │  Check   │
      │                                   │  Metrics │    │          │   │          │
      │                                   └─────────┘    └──────────┘   └──────────┘
      │
      └──▶ Rollback on Failure
```

## Project Structure

```
aws-cicd-pipeline/
├── src/
│   ├── server.js              # Main application server
│   ├── public/
│   │   └── index.html         # Frontend dashboard
│   └── styles/
│       └── main.css           # Application styles
├── scripts/
│   ├── before_install.sh      # Pre-installation script
│   ├── after_install.sh       # Post-installation script
│   ├── start_server.sh        # Application start script
│   ├── stop_server.sh         # Application stop script
│   └── validate_service.sh    # Service validation script
├── infrastructure/
│   ├── cloudformation.yml     # CloudFormation template
│   ├── main.tf                # Terraform configuration
│   └── terraform.tfvars       # Terraform variables
├── __tests__/
│   └── api.test.js            # API test suite
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI workflow
├── appspec.yml                # CodeDeploy specification
├── buildspec.yml              # CodeBuild specification
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## Prerequisites

Before deploying this CI/CD pipeline, ensure you have:

### AWS Account Setup
- [ ] AWS Account with administrative access
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] IAM user/role with permissions for:
  - CodePipeline
  - CodeBuild
  - CodeDeploy
  - EC2
  - S3
  - IAM
  - CloudWatch

### Local Development Tools
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] AWS CLI v2 installed

### GitHub Setup
- [ ] GitHub account
- [ ] Personal Access Token (PAT) with `repo` scope
- [ ] Repository created

### AWS Key Pair
- [ ] EC2 Key Pair created in your AWS region

## Deployment Instructions

### Method 1: CloudFormation (Recommended)

#### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/aws-cicd-pipeline.git
cd aws-cicd-pipeline
```

#### Step 2: Configure Parameters
Edit `infrastructure/cloudformation.yml` and update:
- `GitHubOwner`: Your GitHub username
- `GitHubRepo`: Your repository name
- `GitHubToken`: Your GitHub Personal Access Token

#### Step 3: Deploy CloudFormation Stack
```bash
aws cloudformation deploy \
  --template-file infrastructure/cloudformation.yml \
  --stack-name cicd-pipeline-stack \
  --parameter-overrides \
    GitHubOwner=YOUR_USERNAME \
    GitHubRepo=YOUR_REPO_NAME \
    GitHubToken=YOUR_GITHUB_TOKEN \
    KeyPairName=YOUR_KEY_PAIR \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

#### Step 4: Get Stack Outputs
```bash
aws cloudformation describe-stacks \
  --stack-name cicd-pipeline-stack \
  --query 'Stacks[0].Outputs' \
  --output table
```

### Method 2: Terraform

#### Step 1: Initialize Terraform
```bash
cd infrastructure
terraform init
```

#### Step 2: Configure Variables
Edit `terraform.tfvars`:
```hcl
aws_region     = "us-east-1"
environment    = "production"
github_owner   = "YOUR_GITHUB_USERNAME"
github_repo    = "YOUR_REPO_NAME"
github_token   = "YOUR_GITHUB_TOKEN"
key_pair_name  = "YOUR_KEY_PAIR_NAME"
```

#### Step 3: Plan and Apply
```bash
terraform plan
terraform apply
```

### Method 3: Manual AWS Console Setup

#### Step 1: Create S3 Bucket
1. Go to S3 Console
2. Create bucket: `cicd-artifacts-YOUR_ACCOUNT_ID`
3. Enable versioning

#### Step 2: Create IAM Roles
Create three IAM roles:
1. **CodePipelineServiceRole** - For CodePipeline
2. **CodeBuildServiceRole** - For CodeBuild
3. **CodeDeployServiceRole** - For CodeDeploy

#### Step 3: Create EC2 Instance
1. Launch EC2 instance with Amazon Linux 2
2. Install CodeDeploy agent
3. Install Node.js and PM2

#### Step 4: Create CodeDeploy Application
1. Go to CodeDeploy Console
2. Create application: `aws-cicd-demo`
3. Create deployment group with EC2 tag filter

#### Step 5: Create CodeBuild Project
1. Go to CodeBuild Console
2. Create project: `aws-cicd-demo-build`
3. Use `buildspec.yml` from repository

#### Step 6: Create CodePipeline
1. Go to CodePipeline Console
2. Create pipeline: `aws-cicd-demo-pipeline`
3. Add stages: Source, Build, Deploy

## Configuration Details

### buildspec.yml (CodeBuild)

```yaml
version: 0.2

phases:
  pre_build:
    commands:
      - npm ci
  build:
    commands:
      - npm test
      - npm run build
  post_build:
    commands:
      - mkdir -p dist
      - cp -r src/ dist/
      - cp package.json dist/

artifacts:
  files:
    - '**/*'
  base-directory: dist
```

### appspec.yml (CodeDeploy)

```yaml
version: 0.0
os: linux
files:
  - source: /
    destination: /var/www/app
hooks:
  BeforeInstall:
    - location: scripts/before_install.sh
  AfterInstall:
    - location: scripts/after_install.sh
  ApplicationStart:
    - location: scripts/start_server.sh
  ValidateService:
    - location: scripts/validate_service.sh
```

### Deployment Scripts

| Script | Purpose | Timeout |
|--------|---------|---------|
| `before_install.sh` | Clean up previous deployment | 300s |
| `after_install.sh` | Install dependencies | 300s |
| `start_server.sh` | Start application | 300s |
| `stop_server.sh` | Stop application | 300s |
| `validate_service.sh` | Health check | 300s |

## Monitoring with CloudWatch

### Pipeline Metrics

The pipeline automatically monitors:
- Pipeline execution success/failure rates
- Build duration
- Deployment frequency
- Rollback events

### CloudWatch Alarms

An alarm is configured to trigger when:
- Pipeline execution fails
- Build fails
- Deployment fails

### Viewing Logs

```bash
# View CodeBuild logs
aws logs describe-log-groups --log-group-name-prefix "/aws/codebuild/aws-cicd-demo-build"

# View CodeDeploy logs
aws logs describe-log-groups --log-group-name-prefix "/aws/codedeploy"
```

## Testing Locally

### Run Tests
```bash
npm test
```

### Run Development Server
```bash
npm run dev
```

### Access Application
- Frontend: http://localhost:3000
- Health API: http://localhost:3000/api/health
- Info API: http://localhost:3000/api/info
- Metrics API: http://localhost:3000/api/metrics

## Rollback Strategy

### Automatic Rollback
- Enabled in CodeDeploy deployment group
- Triggers on deployment failure
- Reverts to previous version

### Manual Rollback
```bash
# Get deployment ID
aws deploy list-deployments --application-name aws-cicd-demo

# Stop deployment
aws deploy stop-deployment --deployment-id DEPLOYMENT_ID
```

## Security Best Practices

1. **Secrets Management**
   - Store GitHub token in AWS Secrets Manager
   - Use IAM roles instead of access keys
   - Enable encryption at rest for S3

2. **Network Security**
   - Use VPC with private subnets
   - Configure security groups properly
   - Enable VPC Flow Logs

3. **Access Control**
   - Apply least privilege principle
   - Enable MFA for AWS accounts
   - Rotate credentials regularly

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check buildspec.yml syntax |
| Deploy fails | Verify EC2 has CodeDeploy agent |
| Permission denied | Check IAM role policies |
| Webhook not triggering | Verify GitHub token permissions |

### Debug Commands
```bash
# Check pipeline status
aws codepipeline get-pipeline-state --name aws-cicd-demo-pipeline

# Check build status
aws codebuild batch-get-builds --ids BUILD_ID

# Check deployment status
aws deploy get-deployment --deployment-id DEPLOYMENT_ID
```

## Cost Estimation

| Service | Free Tier | Cost per Use |
|---------|-----------|--------------|
| CodePipeline | 1 free pipeline | $1.00/pipeline/month |
| CodeBuild | 100 build minutes | $0.01/minute |
| CodeDeploy | 5 deployments | $0.02/deployment |
| S3 | 5GB storage | $0.023/GB/month |
| EC2 | 750 hours t2.micro | $0.0116/hour |
| CloudWatch | 10 metrics free | $0.30/metric/month |

**Estimated Monthly Cost**: $5-20 (depending on usage)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file.

## Support

For issues and questions:
- Create an issue on GitHub
- Check AWS documentation
- Review CloudWatch logs

## Quick Start Commands

```bash
# Clone and deploy
git clone https://github.com/YOUR_USERNAME/aws-cicd-pipeline.git
cd aws-cicd-pipeline

# Deploy with CloudFormation
aws cloudformation deploy \
  --template-file infrastructure/cloudformation.yml \
  --stack-name cicd-pipeline \
  --parameter-overrides \
    GitHubOwner=YOUR_USERNAME \
    GitHubRepo=YOUR_REPO_NAME \
    GitHubToken=YOUR_TOKEN \
    KeyPairName=YOUR_KEY_PAIR \
  --capabilities CAPABILITY_IAM

# Get application URL
aws cloudformation describe-stacks \
  --stack-name cicd-pipeline \
  --query 'Stacks[0].Outputs[?OutputKey==`AppUrl`].OutputValue' \
  --output text
```

---

**Built with ❤️ using AWS CodePipeline, CodeBuild, CodeDeploy & CloudWatch**
