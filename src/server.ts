import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import { seedSuperAdmin } from './DB/seedAdmin';
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';
import config from './config';


// uncaught exception
process.on('uncaughtException', (error) => {
     errorLogger.error('UncaughtException Detected', error);
     process.exit(1);
});

let server: any;

async function main() {
    try {
        await mongoose.connect(config.database_url as string, {
            autoIndex: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        logger.info(colors.green('🚀 Database connected successfully'));

        // ✅ Cluster-safe super admin seeding
        if (!process.env.NODE_APP_INSTANCE || process.env.NODE_APP_INSTANCE === '0') {
            await seedSuperAdmin();
        }

        const port = Number(config.port);

        server = app.listen(port, config.ip_address as string, () => {
            logger.info(colors.yellow(`♻️ Server running at port:${config.port}`));
        });

        // SOCKET.IO SETUP
        const io = new Server(server, {
            pingTimeout: 60000,
            cors: { origin: config.allowed_origins || '*' },
            allowEIO3: false,
            maxHttpBufferSize: 1e6,
            perMessageDeflate: false,
        });

        socketHelper.socket(io);

        // @ts-ignore
        global.io = io;

    } catch (error) {
        errorLogger.error(colors.red('🤢 Database Connection Failed'), error);
    }

    process.on('unhandledRejection', (error) => {
        errorLogger.error('UnhandledRejection Detected', error);
        if (server) {
            server.close(() => process.exit(1));
        } else {
            process.exit(1);
        }
    });

    const gracefulShutdown = () => {
        logger.info('🔻 Graceful shutdown initiated...');
        if (server) server.close();
        mongoose.connection.close();
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
}

main();
