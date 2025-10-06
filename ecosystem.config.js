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
      PORT: 3000,
      HOST: '127.0.0.1'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 7500,
      HOST: '0.0.0.0'  // Penting: bind ke semua interface
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000
  }]
};
