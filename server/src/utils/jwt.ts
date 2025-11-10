import jwt from 'jsonwebtoken';
import { IUserDocument } from '../models/User';

export function signToken(user: IUserDocument) {
  const secret = process.env.JWT_SECRET as string;
  const expire = process.env.JWT_EXPIRE || '7d';
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign({ id: user._id }, secret, { expiresIn: expire });
}
