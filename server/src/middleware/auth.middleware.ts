import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TokenUser extends JwtPayload {
  userId: number
 
}

declare global {
    namespace Express {
      interface Request {
        user?: TokenUser;
      }
    }
  }

  export const isAuth = async (req: Request, res: Response, next: NextFunction) :Promise<void>=> {
    try {
      const authHeader = req.get('Authorization') as string;
      if (!authHeader) {
       res.status(401).json({ message: 'Authorization header missing' });
      }
  
      const [authType, authToken] = authHeader.split(' ');
  
      if (authType.toLowerCase() !== 'bearer' || !authToken) {
         res.status(401).json({ message: 'Invalid authentication type or token' });
      }
  
      const user = jwt.verify(authToken, process.env.JWT_SECRET as string);
      if (!user) {
        res.status(401).json({ message: 'Invalid or expired token' });
      }
  
      req.user = user as TokenUser; // `req.user` is now properly typed
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Unauthorized: Please log in', error });
    }
  };