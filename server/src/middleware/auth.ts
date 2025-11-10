import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { IUserDocument } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUserDocument | null;
}

export const verifyJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.substring(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const secret = process.env.JWT_SECRET as string;
    if (!secret) return res.status(500).json({ message: 'Missing JWT secret' });

    const payload = jwt.verify(token, secret) as { id: string };
    const user = await UserModel.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const requireRole = (role: 'admin' | 'user') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (role === 'admin' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
