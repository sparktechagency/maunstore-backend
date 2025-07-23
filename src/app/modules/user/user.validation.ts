import { string, z } from 'zod';

export const createUserZodSchema = z.object({
     body: z.object({
          name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters long'),
          email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
          password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
          phone: string().default('').optional(),
          countryCode: z.string().optional(),
          profileImage: z.string().optional(),
          address: z.string().optional(),
     }),
});


const updateUserZodSchema = z.object({
     body: z.object({
          name: z.string().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          countryCode: z.string().optional(),
          email: z.string().email('Invalid email address').optional(),
          password: z.string().optional(),
          profileImage: z.string().optional(),
     }),
});

export const UserValidation = {
     createUserZodSchema,
     updateUserZodSchema,
};
