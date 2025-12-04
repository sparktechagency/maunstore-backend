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
  BCRYPT_SALT_ROUNDS: 12,
  JWT_EXPIRE_IN: '30d',
  SUPER_ADMIN_EMAIL: 'yaz.vega@raconligroup.com',
  SUPER_ADMIN_PASSWORD: 'admin@123',
  EMAIL_FROM: 'moshfiqurrahman37@gmail.com',
  EMAIL_USER: 'moshfiqurrahman37@gmail.com',
  EMAIL_PASS: 'mmys xoef mwuu osxk',
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_PORT: 587,
  STRIPE_SECRET_KEY: 'sk_test_51RSb5cQOpYWE7pDHjGmR1DkxoGaBiMxwkbAwaZpYWJzzRV1REmNwkmqbjS640tBePjeEWviPCEzwMXU5NcsdHG2a00Ay5a0gYc',
  STRIPE_WEBHOOK_SECRET: 'whsec_4337ae3062507ef8a09e4540e37e7a521260b3f89b6e9a94810cfcfa5f890c9e',
  EXPRESS_SESSION_SECRET_KEY: '1b97a62d173c126d6533566caad3aa56c48b445215343da33ac0e0f0d3793060',
  FIREBASE_PROJECT_ID:"raconliapp",
FIREBASE_CLIENT_EMAIL:"firebase-adminsdk-fbsvc@raconliapp.iam.gserviceaccount.com",
FIREBASE_PRIVATE_KEY:"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyxqWki83ooQd9\n7DsDskND3hbWnsxOt3JMEw94yqSltFDrYFG9ypDXQcJn6cWC9TRdRP44zFrGQUAm\nbRHP1lnoTEy8H72LVuKMObqJ0kkjHlk/tGRFgPdbuzrQjj+Jw/xoPtTXY1flhiDT\nVGi8X8MWMwLlJYT6UiLeOZX/gAxrdiDAA77mjyRBipfte/6W7vFDwqphWe8FqcnU\n1M6hsjO7j+crAWaeq20rDOngoR59uTDj0CU7Hj1d62dBLOsdBnoRKGAT2PjxWehp\nfKuHYu47o7SCtoyy7vcL62t7LY/b4NIv4NORN0fRdRgHKvOcCJjgf9xaLLon2giQ\nuDJbHFhZAgMBAAECggEAEqAK+ExfaKXEJcyTbmRnSR4Nc5EqOGY4yG+w7DTyd9gE\nGS2Y/oSo1+BAPHq4qtbYfIIYWTsDFwYLxKUW1rgeeErgsLW+1dI4uoK2Ki8oEvpR\nsocc7jfMLXihXUKAoJ30QTkQjBsLuHwjldjEq6FvbfPlEJH622hsvQmzVKHWyWgh\nqeq4JO3vbds6ejaIGeGwJRYbPRMZchw63u16y0JnkX+Kv04m7ZgjwvCA1OvnX2eW\n61vRgJKMKDA7uYBpQOC3c8W2T2FusWT/yWelmL5zY8eIkSHWPnaHC9SRwfNclU7z\nR8Evq8QXXC7G8yzeMoTZP4E8aFgb7BDjXJwjR0DSAQKBgQDqHzBZQLzeE0qHKffr\nfxxJ8HLFr2S5yOP+whmotiXJgY5OIInFSWJqBSHrJVoMF38/Yn+B6N5/MB9OXCje\n2lBACnWn36gvP7diEWT6YykO19ImNjhnIVndWQO8xYCv65omuXmrW3XMVOpvmVnp\nCkZx1W5uXaERH4572dDPEP51AQKBgQDDe3BwR/Yfrp1WkgrMNFXrVrbxY7RXrVxV\nI5vl3Kfp9ozhBpv0BFxy8WqWJQyDjd5Lt79YKMAmwnvo/LT7bJ82MVw1U9Es30Rt\nOgjAIkPlsvPgx41FV9AKan2Dxzo3eLABiCOO3tgYjrsAZEzGw/+rlLDKwM66Jrgi\nmNVp5H6rWQKBgE71u+GuMsSXLwCNB/9VvF23iY3gjJEYDsUCA5Nh8zaVyj/RO4Xd\nLSLinkDnNQp09kaTWruepUOyICzWajZW3M/sdyfqB5f/3kJl6W+E9/j4kviuOrGV\njvBXMCp/Vdp/FFtRHJbNXtpOHU8MIkW1YHLN79OrIkJbKTveB01+xsMBAoGBAJqy\n3VB+InEAJtOTz6e64yPTBAQT+2xHbYKTI5TNArVMwEB0koaRzPfJxaf8ueKCKyGQ\n0IRb+3SxBI5lLnSqiXTBq08ofakdJ3GpM7OZalIlRIrmYQ43aBRWIe5fg9rST7dm\nnX07LZiBm8u7lGbYRUTr7t0FqJP4gFAg0wNyKCxBAoGAdRtqyNGKY9ZjPHdT/I9w\nYwQoPM7XlYkrVDNQWYjGlfby1TTGFJd2dtLt8YHZaLCUnSvNGZaZEeRp5SWRibm5\n9sdoksQcOoBg9gLj+64wVjG+RdKT2X9LKFRDd8AmEyeEVENs9rsth+CQgRWfl0l+\nCU16imc8P+H4nzO9GtDw4Vw=\n-----END PRIVATE KEY-----\n"
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