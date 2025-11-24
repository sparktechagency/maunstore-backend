module.exports = {
  apps: [
    {
      name: 'maunstore-backend',
      script: 'dist/server.js',

      // Cluster Configuration
      instances: 'max',
      exec_mode: 'cluster',

      // Restart Policy
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,

      // Resource Limits
      max_memory_restart: '1G', 

      // Graceful Shutdown
      kill_timeout: 5000,
      wait_ready: false, 
      listen_timeout: 10000,

      // File Watching
      watch: false, // Production এ never true করবে না
      ignore_watch: ['node_modules', 'logs', '.git'],

      // Logging
      error_file: 'logs/pm2-err.log',
      out_file: 'logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true, 
      log_type: 'json', 

      // Environment Variables
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },

      env_development: {
        NODE_ENV: 'development',
        PORT: 5000,
      },

      // Advanced Options
      source_map_support: true, 
      instance_var: 'INSTANCE_ID',

      // Monitoring
      vizion: false,
      post_update: ['npm install'],

      // Graceful reload
      shutdown_with_message: false,

      // Cron restart (optional - রাতে 2am এ restart)
      // cron_restart: '0 2 * * *',

      // Performance
      node_args: '--max-old-space-size=2048', // 2GB heap size
    },
  ]
}