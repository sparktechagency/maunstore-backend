import mongoose from 'mongoose';
import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { logger, errorLogger } from '../shared/logger';
import colors from 'colors';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

// ✅ Correct password hashing
const hashPassword = async (password: string): Promise<string> => {
     return await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
};

// ✅ File-based locking (সবচেয়ে reliable cluster এর জন্য)
const LOCK_FILE = path.join(process.cwd(), '.seed.lock');

const acquireLock = (): boolean => {
     try {
          // Check if lock file exists
          if (fs.existsSync(LOCK_FILE)) {
               const lockTime = fs.statSync(LOCK_FILE).mtimeMs;
               const now = Date.now();

               // If lock is older than 10 seconds, consider it stale
               if (now - lockTime > 10000) {
                    logger.warn(colors.yellow('⚠️  Stale lock detected, removing...'));
                    fs.unlinkSync(LOCK_FILE);
               } else {
                    return false; // Lock is active
               }
          }

          // Create lock file
          fs.writeFileSync(LOCK_FILE, String(process.pid));
          return true;
     } catch (error) {
          return false;
     }
};

const releaseLock = (): void => {
     try {
          if (fs.existsSync(LOCK_FILE)) {
               fs.unlinkSync(LOCK_FILE);
          }
     } catch (error) {
          errorLogger.error('Failed to release lock:', error);
     }
};

// ✅ 100% Working Solution
export const seedSuperAdmin = async () => {
     const pid = process.pid;

     try {
          logger.info(colors.cyan(`🌱 [PID ${pid}] Attempting to seed super admin...`));

          // 1️⃣ Try to acquire file lock
          if (!acquireLock()) {
               logger.info(colors.yellow(`⏭️  [PID ${pid}] Another process is seeding, waiting...`));

               // Wait for lock to be released
               let attempts = 0;
               while (fs.existsSync(LOCK_FILE) && attempts < 15) {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    attempts++;
               }

               // Check if admin was created
               const check = await User.findOne({
                    email: config.super_admin.email,
                    role: USER_ROLES.SUPER_ADMIN,
               }).lean();

               if (check) {
                    logger.info(colors.green(`✅ [PID ${pid}] Super admin created by another process`));
               }
               return;
          }

          logger.info(colors.cyan(`🔒 [PID ${pid}] Lock acquired`));

          // 2️⃣ Check if super admin exists
          const existingAdmin = await User.findOne({
               email: config.super_admin.email,
               role: USER_ROLES.SUPER_ADMIN,
          }).lean();

          if (existingAdmin) {
               logger.info(colors.green(`✅ [PID ${pid}] Super admin already exists`));
               return;
          }

          // 3️⃣ Create super admin
          const hashedPassword = await hashPassword(config.super_admin.password as string);

          const newAdmin = await User.create({
               name: 'Administrator',
               email: config.super_admin.email,
               role: USER_ROLES.SUPER_ADMIN,
               password: hashedPassword,
               profileImage: '',
               status: 'ACTIVE',
               verified: true,
          });

          logger.info(colors.green(`✨ [PID ${pid}] Super admin created successfully`));
          logger.info(colors.blue(`   Email: ${newAdmin.email}`));
          logger.info(colors.blue(`   ID: ${newAdmin._id}`));
     } catch (error: any) {
          // Duplicate key error
          if (error.code === 11000) {
               logger.info(colors.green(`✅ [PID ${pid}] Super admin already exists (duplicate key)`));
               return;
          }
          errorLogger.error(colors.red(`❌ [PID ${pid}] Failed to seed super admin:`), error);
     } finally {
          // 4️⃣ Always release lock
          releaseLock();
          logger.info(colors.cyan(`🔓 [PID ${pid}] Lock released`));
     }
};

// ⚠️ Standalone seeding script
if (require.main === module) {
     const runSeeding = async () => {
          try {
               logger.info(colors.cyan('🎨 Database seeding start (Standalone Mode)'));

               await mongoose.connect(config.database_url as string);
               logger.info(colors.green('🚀 Database connected'));

               if (process.env.FORCE_SEED === 'true') {
                    const result = await User.deleteMany({
                         role: USER_ROLES.SUPER_ADMIN,
                    });
                    logger.info(colors.yellow(`⚠️  Deleted ${result.deletedCount} super admin(s)`));

                    // Remove lock file if forcing seed
                    if (fs.existsSync(LOCK_FILE)) {
                         fs.unlinkSync(LOCK_FILE);
                    }
               }

               await seedSuperAdmin();

               logger.info(colors.green('🎉 Database seeding completed'));
          } catch (error) {
               logger.error(colors.red('🔥 Error in seeding:'), error);
          } finally {
               await mongoose.disconnect();
               process.exit(0);
          }
     };

     runSeeding();
}
