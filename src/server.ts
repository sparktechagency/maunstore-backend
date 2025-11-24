import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import { seedSuperAdmin } from './DB/seedAdmin';
import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/logger';
import config from './config';


// ---------------- SECURITY ADDITIONS ---------------- //

// Validate all required ENV variables
// const requiredEnvs = ['database_url', 'port'];
// requiredEnvs.forEach((env) => {
//      if (!(config as any)[env]) {
//           console.error(`❌ Missing required env: ${env}`);
//           process.exit(1);
//      }
// });

// uncaught exception
process.on('uncaughtException', (error) => {
     errorLogger.error('UncaughtException Detected', error);
     process.exit(1);
});

let server: any;

async function main() {
     try {
          await mongoose.connect(config.database_url as string, {
               autoIndex: false, // Prevent attackers from creating many indexes
               maxPoolSize: 10, // Prevent resource exhaustion
               serverSelectionTimeoutMS: 5000,
               socketTimeoutMS: 45000,
          });

          logger.info(colors.green('🚀 Database connected successfully'));

          await seedSuperAdmin();

          const port = Number(config.port);

          server = app.listen(port, config.ip_address as string, () => {
               logger.info(colors.yellow(`♻️ Server running at port:${config.port}`));
          });

          // SOCKET.IO SECURITY
          const io = new Server(server, {
               pingTimeout: 60000,
               cors: {
                    origin: config.allowed_origins || '*',
               },
               allowEIO3: false, // Prevent downgrade to older, less secure protocol
               maxHttpBufferSize: 1e6, // Limit message size to prevent DOS
               perMessageDeflate: false, // Disable to prevent compression attacks
          });

          socketHelper.socket(io);

          // @ts-ignore
          global.io = io;

     } catch (error) {
          errorLogger.error(colors.red('🤢 Database Connection Failed'), error);
     }

     // unhandledRejection
     process.on('unhandledRejection', (error) => {
          errorLogger.error('UnhandledRejection Detected', error);

          if (server) {
               server.close(() => process.exit(1));
          } else {
               process.exit(1);
          }
     });

     // Unexpected SIGINT/SIGTERM shutdown
     const gracefulShutdown = () => {
          logger.info('🔻 Graceful shutdown initiated...');
          if (server) server.close();
          mongoose.connection.close();
     };

     process.on('SIGINT', gracefulShutdown);
     process.on('SIGTERM', gracefulShutdown);
}

main();
