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

// Lock Model for Distributed Locking
const lockSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: 60 } // 60 seconds TTL
});

const Lock = mongoose.model('Lock', lockSchema);

// ✅ Cluster-safe super admin seeding
export const seedSuperAdmin = async () => {
    const lockKey = 'super_admin_seed_lock';
    let lockAcquired = false;

    try {
        try {
            await Lock.create({ key: lockKey });
            lockAcquired = true;
            logger.info(colors.cyan('🔒 Lock acquired for super admin seeding'));
        } catch (error: any) {
            if (error.code === 11000) {
                logger.info(colors.yellow('⏳ Another instance is seeding, skipping...'));
                return;
            }
            throw error;
        }
        const existingAdmin = await User.findOne({ 
            email: config.super_admin.email,
            role: USER_ROLES.SUPER_ADMIN 
        });

        if (existingAdmin) {
            logger.info(colors.green('✅ Super admin already exists'));
            return;
        }
        const hashedPassword = await hashPassword(config.super_admin.password as string);

        await User.create({
            name: 'Administrator',
            email: config.super_admin.email,
            role: USER_ROLES.SUPER_ADMIN,
            password: hashedPassword,
            verified: true,
        });

        logger.info(colors.green('✨ Super admin created successfully'));

    } catch (error: any) {
        if (error.code === 11000) {
            logger.info(colors.green('✅ Super admin already exists (duplicate key)'));
            return;
        }
        errorLogger.error(colors.red('❌ Failed to seed super admin:'), error);
    } finally {
        if (lockAcquired) {
            try {
                await Lock.deleteOne({ key: lockKey });
                logger.info(colors.cyan('🔓 Lock released'));
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
            if (process.env.FORCE_SEED === 'true') {
                await User.deleteMany({});
                logger.info(colors.yellow('⚠️  All users deleted'));
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