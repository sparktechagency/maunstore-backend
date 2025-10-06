"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
exports.createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters long'),
        email: zod_1.z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        password: zod_1.z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
        phone: (0, zod_1.string)().default('').optional(),
        countryCode: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }),
});
const updateUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
        countryCode: zod_1.z.string().optional(),
        email: zod_1.z.string().email('Invalid email address').optional(),
        password: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
    }),
});
exports.UserValidation = {
    createUserZodSchema: exports.createUserZodSchema,
    updateUserZodSchema,
};
