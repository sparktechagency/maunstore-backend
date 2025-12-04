import jwt, { SignOptions } from 'jsonwebtoken';
export const createToken = (jwtPayload: { id: string; email: string; role: string }, secret: string, expiresIn: string) => {
     if (!expiresIn) expiresIn = '30d'; // default 30 days
     return jwt.sign(jwtPayload, secret, {
          expiresIn,
     } as SignOptions);
};
