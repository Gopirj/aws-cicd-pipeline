# E-Commerce Store - AWS CI/CD Pipeline

[![CI/CD Pipeline](https://img.shields.io/badge/AWS-CodePipeline-blue.svg)](https://aws.amazon.com/codepipeline/)
[![CodeBuild](https://img.shields.io/badge/AWS-CodeBuild-green.svg)](https://aws.amazon.com/codebuild/)
[![CodeDeploy](https://img.shields.io/badge/AWS-CodeDeploy-orange.svg)](https://aws.amazon.com/codedeploy/)
[![CloudWatch](https://img.shields.io/badge/Monitoring-CloudWatch-purple.svg)](https://aws.amazon.com/cloudwatch/)

A simple e-commerce website with automated CI/CD pipeline for deployment on AWS.

## Features

- **Product Catalog**: Browse 8 products across 5 categories
- **Shopping Cart**: Add, update, remove items
- **Checkout**: Simple checkout with customer details
- **Order Management**: View order history
- **Real-time Metrics**: Live dashboard with deployment stats

## Architecture Overview

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│          │     │              │     │              │     │              │
│  GitHub  │────▶│ CodePipeline │────▶│  CodeBuild   │────▶│ CodeDeploy   │
│ (Source) │     │ (Orchestrate)│     │   (Build)    │     │  (Deploy)    │
│          │     │              │     │              │     │              │
└──────────┘     └──────────────┘     └──────────────┘     └──────────────┘
      │                │                     │                     │
      ▼                ▼                     ▼                     ▼
 ┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 │  Push    │     │  CloudWatch  │     │  S3 Bucket   │     │  EC2 / EBS   │
 │  Event   │     │  (Monitor)   │     │ (Artifacts)  │     │  (Runtime)   │
 └──────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

## Project Structure

```
aws-cicd-pipeline/
├── src/
│   ├── server.js              # Express.js API server
│   ├── public/
│   │   ├── index.html         # Home page
│   │   ├── products.html      # Product listing
│   │   ├── cart.html          # Shopping cart
│   │   ├── checkout.html      # Checkout page
│   │   └── orders.html        # Order history
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
│   └── api.test.js            # API test suite (18 tests)
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI workflow
├── appspec.yml                # CodeDeploy specification
├── buildspec.yml              # CodeBuild specification
├── package.json               # Node.js dependencies
└── README.md                  # This file
```

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/aws-cicd-pipeline.git
cd aws-cicd-pipeline
npm install
```

### 2. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

### 3. Run Tests

```bash
npm test
# 18 tests passing
```

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products?category=Electronics` | Filter by category |

### Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart contents |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:productId` | Update quantity |
| DELETE | `/api/cart/:productId` | Remove item |
| DELETE | `/api/cart` | Clear cart |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get single order |
| POST | `/api/orders` | Create order (checkout) |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/info` | Application info |
| GET | `/api/metrics` | Live metrics |

## Frontend Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with featured products |
| Products | `/products` | All products with search & filter |
| Cart | `/cart` | Shopping cart with quantity controls |
| Checkout | `/checkout` | Checkout form |
| Orders | `/orders` | Order history |

## Deployment to AWS

### Option 1: CloudFormation (Recommended)

```bash
# Configure AWS CLI
aws configure

# Deploy stack
aws cloudformation deploy \
  --template-file infrastructure/cloudformation.yml \
  --stack-name cicd-pipeline \
  --parameter-overrides \
    GitHubOwner=YOUR_USERNAME \
    GitHubRepo=aws-cicd-pipeline \
    GitHubToken=YOUR_PAT \
    KeyPairName=YOUR_KEY_PAIR \
  --capabilities CAPABILITY_IAM
```

### Option 2: Terraform

```bash
cd infrastructure
# Edit terraform.tfvars with your values
terraform init
terraform plan
terraform apply
```

## Products Available

| ID | Product | Price | Category |
|----|---------|-------|----------|
| 1 | Wireless Headphones | $79.99 | Electronics |
| 2 | Smart Watch | $199.99 | Electronics |
| 3 | Running Shoes | $89.99 | Sports |
| 4 | Coffee Maker | $49.99 | Home |
| 5 | Backpack | $39.99 | Travel |
| 6 | Sunglasses | $59.99 | Fashion |
| 7 | Bluetooth Speaker | $69.99 | Electronics |
| 8 | Yoga Mat | $29.99 | Sports |

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Test output
Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
```

## Cost Estimate

| Service | Cost |
|---------|------|
| EC2 t2.micro | ~$8/month |
| CodePipeline | $1/month |
| CodeBuild | ~$0.01/build |
| CodeDeploy | Free tier |
| S3 | ~$0.01/month |
| **Total** | **~$10-15/month** |

## License

MIT License - see [LICENSE](LICENSE) file.
