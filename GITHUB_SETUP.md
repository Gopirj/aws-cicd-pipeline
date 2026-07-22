# Push to GitHub - Complete Instructions

## Step 1: Initialize Git Repository

```bash
cd /home/gopi/Desktop/aws-cicd-pipeline
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: AWS CI/CD Pipeline with CodePipeline, CodeBuild, CodeDeploy"
```

## Step 4: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `aws-cicd-pipeline`
3. Description: "CI/CD Pipeline for Automated Application Deployment on AWS"
4. Select **Public** or **Private**
5. **DO NOT** initialize with README (we already have one)
6. Click **Create repository**

## Step 5: Connect Local to Remote

```bash
git remote add origin https://github.com/YOUR_USERNAME/aws-cicd-pipeline.git
```

## Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## Step 7: Verify Upload

```bash
git status
git log --oneline
```

## Complete Command Sequence

```bash
# Navigate to project
cd /home/gopi/Desktop/aws-cicd-pipeline

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: AWS CI/CD Pipeline with CodePipeline, CodeBuild, CodeDeploy"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/aws-cicd-pipeline.git

# Push
git branch -M main
git push -u origin main
```

## Authentication Options

### Option 1: HTTPS with Token (Recommended)
```bash
git remote add origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/aws-cicd-pipeline.git
```

### Option 2: SSH
```bash
git remote add origin git@github.com:YOUR_USERNAME/aws-cicd-pipeline.git
```

## After Push - Setup GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Click **I understand my workflows, go ahead and enable them**
4. The CI workflow will run automatically on next push

## Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **Generate new token**
3. Name: `aws-cicd-pipeline`
4. Select scopes:
   - `repo` (Full control)
   - `admin:repo_webhook` (Webhooks)
5. Click **Generate token**
6. Copy the token (you'll need it for AWS CodePipeline)

## Verify GitHub Actions

```bash
# Check workflow status
gh run list

# Watch current run
gh run watch
```

## Troubleshooting

### Issue: Permission denied
```bash
# Fix: Use personal access token
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/aws-cicd-pipeline.git
```

### Issue: Remote already exists
```bash
# Fix: Remove and re-add
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/aws-cicd-pipeline.git
```

### Issue: Branch doesn't match
```bash
# Fix: Rename branch
git branch -M main
git push -u origin main
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `git init` | Initialize git repository |
| `git add .` | Stage all changes |
| `git commit -m "msg"` | Commit changes |
| `git remote add origin URL` | Add remote repository |
| `git push -u origin main` | Push to GitHub |
| `git status` | Check status |
| `git log --oneline` | View commit history |
