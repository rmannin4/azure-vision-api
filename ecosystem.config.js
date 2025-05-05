module.exports = {
  apps: [
    {
      name: 'azure-vision-api',
      script: 'index.js',
      env: {
        NODE_ENV: 'production',
        AZURE_VISION_KEY: process.env.AZURE_VISION_KEY,
        AZURE_VISION_ENDPOINT: process.env.AZURE_VISION_ENDPOINT
      }
    }
  ]
};
