import { Router } from 'express';
import { login, logout, me, signup } from '../controllers/auth.controller';
import { verifyJWT } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', verifyJWT, me);
router.post('/logout', logout);

export default router;
