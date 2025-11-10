// server/src/routes/payment.routes.ts
import express from 'express';
import { createIntent, verifyClient, webhook, adminMarkSuccess } from '../controllers/payment.controller';
import { verifyJWT, requireRole } from '../middleware/auth';

const router = express.Router();

router.post('/create-intent', verifyJWT, createIntent);
router.post('/verify-client', verifyJWT, verifyClient);

// IMPORTANT: webhook must use raw body parser ONLY for this route
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

router.post('/admin/:id/mark-success', verifyJWT, requireRole('admin'), adminMarkSuccess);

export default router;
