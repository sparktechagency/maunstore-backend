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
  DATABASE_URL: 'mongodb://localhost:27017/Muanstore',
  JWT_SECRET: '12c1c1ed10454ca3b64ae21b783cd96418583ffc83b1015199b18986b57a689b',
  SUPER_ADMIN_EMAIL: 'yaz.vega@raconligroup.com',
  SUPER_ADMIN_PASSWORD: 'admin@123',
  EMAIL_FROM: 'moshfiqurrahman37@gmail.com',
  EMAIL_USER: 'moshfiqurrahman37@gmail.com',
  EMAIL_PASS: 'mmys xoef mwuu osxk',
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_PORT: 587,
  STRIPE_SECRET_KEY: 'sk_test_51RSb5cQOpYWE7pDHjGmR1DkxoGaBiMxwkbAwaZpYWJzzRV1REmNwkmqbjS640tBePjeEWviPCEzwMXU5NcsdHG2a00Ay5a0gYc',
  STRIPE_WEBHOOK_SECRET: 'whsec_4337ae3062507ef8a09e4540e37e7a521260b3f89b6e9a94810cfcfa5f890c9e',
  BCRYPT_SALT_ROUNDS: 12,
  EXPRESS_SESSION_SECRET_KEY: '1b97a62d173c126d6533566caad3aa56c48b445215343da33ac0e0f0d3793060',
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