import mongoose from 'mongoose';
import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { logger, errorLogger } from '../shared/logger';
import colors from 'colors';
import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));
};

const lockSchema = new mongoose.Schema({
    key: { type: String, required: true },
    instanceId: { type: String },
    createdAt: { type: Date, default: Date.now, expires: 30 } 
});

// ✅ Compound unique index on key only
lockSchema.index({ key: 1 }, { unique: true });

const Lock = mongoose.model('SeedLock', lockSchema);

export const seedSuperAdmin = async () => {
    const lockKey = 'super_admin_seed_lock';
    const instanceId = process.env.NODE_APP_INSTANCE || process.env.pm_id || '0';
    let lockAcquired = false;

    try {
        let retries = 3;
        while (retries > 0) {
            try {
                await Lock.create({ 
                    key: lockKey, 
                    instanceId: instanceId 
                });
                lockAcquired = true;
                logger.info(colors.cyan(`🔒 Lock acquired by instance ${instanceId}`));
                break;
            } catch (error: any) {
                if (error.code === 11000) {
                    // Another instance has the lock
                    logger.info(colors.yellow(`⏳ Instance ${instanceId} waiting for lock... (${4 - retries}/3)`));
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                    retries--;
                    if (retries === 0) {
                        logger.info(colors.yellow(`⏭️  Instance ${instanceId} skipping seeding`));
                        return;
                    }
                } else {
                    throw error;
                }
            }
        }

        const existingAdmin = await User.findOne({ 
            email: config.super_admin.email,
            role: USER_ROLES.SUPER_ADMIN 
        }).lean();

        if (existingAdmin) {
            logger.info(colors.green('✅ Super admin already exists'));
            return;
        }
        const duplicateEmail = await User.findOne({ 
            email: config.super_admin.email 
        }).lean();

        if (duplicateEmail) {
            logger.warn(colors.yellow('⚠️  Email already exists with different role'));
            return;
        }

        const session = await mongoose.startSession();
        
        try {
            await session.withTransaction(async () => {
                // Final check inside transaction
                const finalCheck = await User.findOne({ 
                    email: config.super_admin.email 
                }).session(session);

                if (finalCheck) {
                    logger.info(colors.green('✅ Super admin created by another instance'));
                    return;
                }

                const hashedPassword = await hashPassword(config.super_admin.password as string);

                await User.create([{
                    name: 'Administrator',
                    email: config.super_admin.email,
                    role: USER_ROLES.SUPER_ADMIN,
                    password: hashedPassword,
                    verified: true,
                }], { session });

                logger.info(colors.green(`✨ Super admin created successfully by instance ${instanceId}`));
            });
        } finally {
            await session.endSession();
        }

    } catch (error: any) {
        errorLogger.error(colors.red('❌ Failed to seed super admin:'), error);
    } finally {
        // 5️⃣ Release lock
        if (lockAcquired) {
            try {
                await Lock.deleteOne({ key: lockKey, instanceId: instanceId });
                logger.info(colors.cyan(`🔓 Lock released by instance ${instanceId}`));
            } catch (error) {
                errorLogger.error('Failed to release lock:', error);
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

            // ⚠️ Development only - force re-seed
            if (process.env.FORCE_SEED === 'true') {
                await User.deleteMany({ role: USER_ROLES.SUPER_ADMIN });
                logger.info(colors.yellow('⚠️  Super admin deleted'));
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