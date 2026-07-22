# Complete AWS CI/CD Pipeline Project

## Project Location
```
/home/gopi/Desktop/aws-cicd-pipeline/
```

## Files Created (24 files)

### Core Application
- `src/server.js` - Express.js application server
- `src/public/index.html` - Frontend dashboard
- `src/styles/main.css` - Application styles
- `package.json` - Node.js dependencies

### AWS Configuration
- `appspec.yml` - CodeDeploy specification
- `buildspec.yml` - CodeBuild specification
- `scripts/before_install.sh` - Pre-installation script
- `scripts/after_install.sh` - Post-installation script
- `scripts/start_server.sh` - Application start script
- `scripts/stop_server.sh` - Application stop script
- `scripts/validate_service.sh` - Service validation script

### Infrastructure as Code
- `infrastructure/cloudformation.yml` - CloudFormation template
- `infrastructure/main.tf` - Terraform configuration
- `infrastructure/terraform.tfvars` - Terraform variables

### CI/CD Configuration
- `.github/workflows/ci.yml` - GitHub Actions workflow

### Testing
- `__tests__/api.test.js` - API test suite

### Documentation
- `README.md` - Complete project documentation
- `ARCHITECTURE.md` - Architecture diagrams
- `GITHUB_SETUP.md` - GitHub push instructions
- `LICENSE` - MIT License

### Configuration
- `.gitignore` - Git ignore rules
- `.env` - Environment variables
- `.env.example` - Environment template
- `.babelrc` - Babel configuration

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AWS CI/CD PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐               │
│  │          │     │              │     │              │               │
│  │  GitHub  │────▶│ CodePipeline │────▶│  CodeBuild   │               │
│  │ (Source) │     │              │     │              │               │
│  └──────────┘     └──────────────┘     └──────────────┘               │
│       │                │                     │                          │
│       │                │                     │                          │
│       ▼                ▼                     ▼                          │
│  ┌──────────┐     ┌──────────────┐     ┌──────────────┐               │
│  │          │     │              │     │              │               │
│  │  Push    │     │  CloudWatch  │     │  S3 Bucket   │               │
│  │  Event   │     │  (Monitor)   │     │ (Artifacts)  │               │
│  └──────────┘     └──────────────┘     └──────────────┘               │
│                                                                          │
│                              │                                          │
│                              ▼                                          │
│                     ┌──────────────┐                                    │
│                     │              │                                    │
│                     │  CodeDeploy  │                                    │
│                     │              │                                    │
│                     └──────────────┘                                    │
│                              │                                          │
│                              ▼                                          │
│                     ┌──────────────┐                                    │
│                     │              │                                    │
│                     │  EC2 Server  │                                    │
│                     │              │                                    │
│                     └──────────────┘                                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Quick Start Commands

### 1. Test Locally
```bash
cd /home/gopi/Desktop/aws-cicd-pipeline
npm install
npm test
npm run dev
```

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: AWS CI/CD Pipeline"
git remote add origin https://github.com/YOUR_USERNAME/aws-cicd-pipeline.git
git branch -M main
git push -u origin main
```

### 3. Deploy to AWS (CloudFormation)
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

### 4. Deploy to AWS (Terraform)
```bash
cd infrastructure
terraform init
terraform plan
terraform apply
```

## Key Features

✅ **Automated Builds** - CodeBuild runs tests and builds on every push
✅ **Automated Deployments** - CodeDeploy deploys to EC2 automatically
✅ **Rollback Strategy** - Auto-rollback on deployment failure
✅ **Monitoring** - CloudWatch monitors pipeline and alerts on failures
✅ **Infrastructure as Code** - CloudFormation and Terraform templates
✅ **Testing** - Jest test suite included
✅ **Security** - Helmet.js for security headers
✅ **Documentation** - Comprehensive README and architecture docs

## Services Used

| Service | Purpose | Cost |
|---------|---------|------|
| AWS CodePipeline | Orchestrates CI/CD | $1/pipeline/month |
| AWS CodeBuild | Builds and tests | $0.01/minute |
| AWS CodeDeploy | Deploys to EC2 | $0.02/deployment |
| Amazon S3 | Stores artifacts | $0.023/GB/month |
| Amazon EC2 | Runs application | $0.0116/hour |
| Amazon CloudWatch | Monitoring | $0.30/metric/month |

## Support

- Check `README.md` for detailed documentation
- Review `ARCHITECTURE.md` for visual diagrams
- See `GITHUB_SETUP.md` for GitHub push instructions
