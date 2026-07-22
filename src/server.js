const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: require('../package.json').version
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    app: process.env.APP_NAME || 'AWS CI/CD Demo',
    region: process.env.AWS_REGION || 'us-east-1',
    pipeline: 'AWS CodePipeline',
    build: 'AWS CodeBuild',
    deploy: 'AWS CodeDeploy',
    monitoring: 'Amazon CloudWatch'
  });
});

app.get('/api/metrics', (req, res) => {
  res.json({
    deployments: Math.floor(Math.random() * 100),
    successRate: (95 + Math.random() * 5).toFixed(2),
    avgBuildTime: (Math.random() * 120).toFixed(2) + 's',
    lastDeployment: new Date().toISOString()
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
