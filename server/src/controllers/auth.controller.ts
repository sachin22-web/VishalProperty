import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import UserModel from '../models/User';
import { signToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

const signupSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const signup = async (req: Request, res: Response) => {
  const data = signupSchema.parse(req.body);
  const existing = await UserModel.findOne({ email: data.email.toLowerCase() });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await UserModel.create({
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone,
    passwordHash,
    role: 'user',
  });

  const token = signToken(user);
  return res.json({ token, user });
};

export const login = async (req: Request, res: Response) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6) });
  const { email, password } = schema.parse(req.body);

  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  if (user.status === 'blocked') return res.status(403).json({ message: 'Account blocked' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken(user);
  return res.json({ token, user });
};

export const me = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  return res.json({ user: req.user });
};

export const logout = async (_req: Request, res: Response) => {
  // Client should drop token; nothing server-side for stateless JWT
  return res.json({ success: true });
};
