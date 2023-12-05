module.exports = {
  apps: [
    {
      name: 'pgw-frontendTeam',
      port: '3035',
      script: './dist/index.js',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
