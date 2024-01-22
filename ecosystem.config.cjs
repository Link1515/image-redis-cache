module.exports = {
  apps: [
    {
      name: 'image-redis-cache',
      port: '3035',
      script: './dist/index.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
