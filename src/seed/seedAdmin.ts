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

// ✅ SIMPLE & RELIABLE - শুধু instance 0 তে run হবে
export const seedSuperAdmin = async () => {
    try {
        // 🔥 CRITICAL: শুধু instance 0 তে run করুন
        const instanceId = process.env.NODE_APP_INSTANCE || process.env.pm_id || '0';
        
        if (instanceId !== '0') {
            logger.info(colors.yellow(`⏭️  [Instance ${instanceId}] Skipping seed (not instance 0)`));
            return;
        }

        logger.info(colors.cyan(`🌱 [Instance ${instanceId}] Starting super admin seed...`));

        // Check if super admin exists
        const existingAdmin = await User.findOne({ 
            email: config.super_admin.email,
            role: USER_ROLES.SUPER_ADMIN 
        }).lean();

        if (existingAdmin) {
            logger.info(colors.green('✅ Super admin already exists'));
            return;
        }

        // Create super admin
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

        logger.info(colors.green('✨ Super admin created successfully'));
        logger.info(colors.blue(`   Email: ${newAdmin.email}`));
        logger.info(colors.blue(`   ID: ${newAdmin._id}`));

    } catch (error: any) {
        // Duplicate key error হলে ignore করুন
        if (error.code === 11000) {
            logger.info(colors.green('✅ Super admin already exists (duplicate key)'));
            return;
        }
        errorLogger.error(colors.red('❌ Failed to seed super admin:'), error);
    }
};

// ⚠️ Standalone seeding script (শুধু development এর জন্য)
if (require.main === module) {
    const runSeeding = async () => {
        try {
            logger.info(colors.cyan('🎨 Database seeding start (Standalone Mode)'));
            
            await mongoose.connect(config.database_url as string);
            logger.info(colors.green('🚀 Database connected'));

            // Development এ force re-seed
            if (process.env.FORCE_SEED === 'true') {
                const result = await User.deleteMany({ 
                    role: USER_ROLES.SUPER_ADMIN 
                });
                logger.info(colors.yellow(`⚠️  Deleted ${result.deletedCount} super admin(s)`));
            }

            // Standalone mode এ NODE_APP_INSTANCE set করুন
            process.env.NODE_APP_INSTANCE = '0';
            
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