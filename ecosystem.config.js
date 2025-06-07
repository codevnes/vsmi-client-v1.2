module.exports = {
  apps: [
    {
      name: 'vsmi-frontend-v2',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3031
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3031
      }
    }
  ]
}; 