import mongoose from 'mongoose';
import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { logger, errorLogger } from '../shared/logger';
import colors from 'colors';
import bcrypt from 'bcrypt';

// ✅ Correct password hashing
const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
};

// Lock Collection Schema
const lockSchema = new mongoose.Schema({
    key: { type: String, required: true },
    instanceId: { type: String },
    createdAt: { type: Date, default: Date.now, expires: 30 }
});

lockSchema.index({ key: 1 }, { unique: true });

const Lock = mongoose.model('SeedLock', lockSchema);

// ✅ Improved cluster-safe seeding
export const seedSuperAdmin = async () => {
    const lockKey = 'super_admin_seed_lock';
    const instanceId = process.env.NODE_APP_INSTANCE || process.env.pm_id || '0';
    let lockAcquired = false;

    try {
        const existingAdmin = await User.findOne({ 
            email: config.super_admin.email,
            role: USER_ROLES.SUPER_ADMIN 
        }).lean();

        if (existingAdmin) {
            logger.info(colors.green(`✅ [Instance ${instanceId}] Super admin already exists`));
            return;
        }

        try {
            await Lock.create({ 
                key: lockKey, 
                instanceId: instanceId 
            });
            lockAcquired = true;
            logger.info(colors.cyan(`🔒 [Instance ${instanceId}] Lock acquired`));
        } catch (error: any) {
            if (error.code === 11000) {
                logger.info(colors.yellow(`⏳ [Instance ${instanceId}] Another instance is seeding, skipping...`));
                await new Promise(resolve => setTimeout(resolve, 3000));
                const checkAgain = await User.findOne({ 
                    email: config.super_admin.email 
                }).lean();
                
                if (checkAgain) {
                    logger.info(colors.green(`✅ [Instance ${instanceId}] Super admin created by another instance`));
                } else {
                    logger.warn(colors.yellow(`⚠️  [Instance ${instanceId}] Admin not found, might need manual check`));
                }
                return;
            }
            throw error;
        }

        const doubleCheck = await User.findOne({ 
            email: config.super_admin.email,
            role: USER_ROLES.SUPER_ADMIN 
        }).lean();

        if (doubleCheck) {
            logger.info(colors.green(`✅ [Instance ${instanceId}] Super admin already exists (double-check)`));
            return;
        }

        const session = await mongoose.startSession();
        
        try {
            await session.withTransaction(async () => {
                const finalCheck = await User.findOne({ 
                    email: config.super_admin.email 
                }).session(session).lean();

                if (finalCheck) {
                    logger.info(colors.green(`✅ [Instance ${instanceId}] Admin exists (transaction check)`));
                    return;
                }

                const hashedPassword = await hashPassword(config.super_admin.password as string);

                const [newAdmin] = await User.create([{
                    name: 'Administrator',
                    email: config.super_admin.email,
                    role: USER_ROLES.SUPER_ADMIN,
                    password: hashedPassword,
                    profileImage: '',
                    status: 'ACTIVE',
                    verified: true,
                }], { session });

                logger.info(colors.green(`✨ [Instance ${instanceId}] Super admin created successfully`));
                logger.info(colors.blue(`   Email: ${newAdmin.email}`));
            });
        } finally {
            await session.endSession();
        }

    } catch (error: any) {
        errorLogger.error(colors.red(`❌ [Instance ${instanceId}] Failed to seed super admin:`), error);
    } finally {
        if (lockAcquired) {
            try {
                await Lock.deleteOne({ key: lockKey, instanceId: instanceId });
                logger.info(colors.cyan(`🔓 [Instance ${instanceId}] Lock released`));
            } catch (error) {
                errorLogger.error(`[Instance ${instanceId}] Failed to release lock:`, error);
            }
        }
    }
};

if (require.main === module) {
    const runSeeding = async () => {
        try {
            logger.info(colors.cyan('🎨 Database seeding start (Standalone Mode)'));
            
            await mongoose.connect(config.database_url as string);
            logger.info(colors.green('🚀 Database connected'));

            if (process.env.FORCE_SEED === 'true') {
                const deletedCount = await User.deleteMany({ 
                    role: USER_ROLES.SUPER_ADMIN 
                });
                logger.info(colors.yellow(`⚠️  Deleted ${deletedCount.deletedCount} super admin(s)`));
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