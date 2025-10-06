module.exports = {
  apps: [{
    name: 'kamus-kbbi',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    // Advanced PM2 features
    exec_mode: 'fork',
    kill_timeout: 5000,
    listen_timeout: 8000,
    wait_ready: true,
    // Health monitoring
    health_check_grace_period: 3000,
    // Auto restart on file changes (development only)
    watch_options: {
      followSymlinks: false,
      usePolling: true,
      interval: 1000
    }
  }],

  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/kamus-kbbi.git',
      path: '/var/www/kamus-kbbi',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
