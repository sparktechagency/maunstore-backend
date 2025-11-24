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
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  EXPRESS_SESSION_SECRET_KEY: process.env.EXPRESS_SESSION_SECRET_KEY
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