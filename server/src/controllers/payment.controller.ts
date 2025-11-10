import { Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { getRazorpay } from '../services/razorpay';
import TransactionModel from '../models/Transaction';
import PropertyModel from '../models/Property';

const rupeesToPaise = (inr: number) => Math.round(inr * 100);
const isObjectId = (id?: string) => !!id && mongoose.Types.ObjectId.isValid(id);

/**
 * Create Razorpay order + a pending Transaction
 * Body: { amount:number(INR), currency?:'INR', propertyId?:string, packageId?:string, notes?:object }
 */
export const createIntent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const schema = z.object({
      amount: z.number().positive(),
      currency: z.string().default('INR'),
      propertyId: z.string().optional(),
      packageId: z.string().optional(),
      notes: z.record(z.any()).optional(),
    });

    const data = schema.parse(req.body);

    // Optional: basic sanity for propertyId
    if (data.propertyId && !isObjectId(data.propertyId)) {
      return res.status(400).json({ message: 'Invalid propertyId' });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: rupeesToPaise(data.amount),               // paise
      currency: data.currency || 'INR',
      receipt: `user_${req.user._id}_${Date.now()}`,
      notes: {
        ...(data.notes || {}),
        propertyId: data.propertyId || '',
        userId: String(req.user._id),
      },
    });

    const txn = await TransactionModel.create({
      userId: req.user._id,
      propertyId: data.propertyId || null,
      packageId: data.packageId || null,
      amount: data.amount,                 // store rupees for UI
      currency: data.currency || 'INR',
      gateway: 'razorpay',
      gatewayRef: order.id,                // Razorpay order id
      status: 'pending',                   // pending until webhook/verify
      notes: 'order_created',
    });

    return res.status(201).json({
      orderId: order.id,
      amount: order.amount,                // paise
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      transactionId: txn._id,
    });
  } catch (err: any) {
    console.error('createIntent error', err);
    return res.status(500).json({ message: err?.message || 'Failed to create order' });
  }
};

/**
 * Client-side verification (Razorpay Checkout handler se call)
 * Body: { orderId, paymentId, signature, transactionId }
 * Success: marks txn success and moves property -> pending_review
 */
export const verifyClient = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const schema = z.object({
      orderId: z.string(),
      paymentId: z.string(),
      signature: z.string(),
      transactionId: z.string(),
    });

    const { orderId, paymentId, signature, transactionId } = schema.parse(req.body);

    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    if (!secret) return res.status(500).json({ message: 'Missing Razorpay secret' });

    const expected = crypto.createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expected !== signature) {
      return res.status(400).json({ message: 'Signature mismatch' });
    }

    // Mark txn success iff it belongs to the same order
    const txn = await TransactionModel.findOne({
      _id: transactionId,
      gatewayRef: orderId,
      userId: req.user._id,
    });

    if (!txn) return res.status(404).json({ message: 'Transaction not found' });

    // idempotent
    if (txn.status !== 'success') {
      txn.status = 'success';
      txn.notes = `payment:${paymentId}`;
      await txn.save();
    }

    // Move property into pending_review after successful payment
    if (txn.propertyId) {
      await PropertyModel.findByIdAndUpdate(txn.propertyId, {
        $set: { status: 'pending_review' },
      });
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error('verifyClient error', err);
    return res.status(500).json({ message: err?.message || 'Verification failed' });
  }
};

/**
 * Razorpay Webhook (use express.raw for this route!)
 * Verifies webhook and updates Transaction accordingly.
 * Also moves property -> pending_review on success.
 */
export const webhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string | undefined;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET as string | undefined;

    if (!webhookSecret) {
      return res.status(400).json({ message: 'Webhook secret not configured' });
    }

    // IMPORTANT: req.body must be raw buffer (express.raw) for signature to match
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);
    const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    if (!signature || signature !== expected) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    const event = (req.body as any)?.event as string;
    const payment = (req.body as any)?.payload?.payment?.entity;
    const orderId: string | undefined = payment?.order_id;
    const paymentId: string | undefined = payment?.id;
    const status: string | undefined = payment?.status; // 'captured' | 'failed' ...

    if (event && orderId) {
      const txn = await TransactionModel.findOne({ gatewayRef: orderId });

      if (txn) {
        let newStatus: 'success' | 'failed' | undefined;
        if (status === 'captured') newStatus = 'success';
        else if (status === 'failed') newStatus = 'failed';

        if (newStatus) {
          // idempotent update
          if (txn.status !== newStatus) {
            txn.status = newStatus;
            if (paymentId) txn.notes = `payment:${paymentId}`;
            await txn.save();
          }

          if (newStatus === 'success' && txn.propertyId) {
            await PropertyModel.findByIdAndUpdate(txn.propertyId, {
              $set: { status: 'pending_review' },
            });
          }
        }
      }
    }

    return res.json({ received: true });
  } catch (err: any) {
    console.error('webhook error', err);
    return res.status(500).json({ message: err?.message || 'Webhook processing failed' });
  }
};

/**
 * Admin override: mark success (and move property to pending_review)
 */
export const adminMarkSuccess = async (req: AuthRequest, res: Response) => {
  try {
    const txn = await TransactionModel.findById(req.params.id);
    if (!txn) return res.status(404).json({ message: 'Transaction not found' });

    txn.status = 'success';
    await txn.save();

    if (txn.propertyId) {
      await PropertyModel.findByIdAndUpdate(txn.propertyId, {
        $set: { status: 'pending_review' },
      });
    }

    return res.json(txn);
  } catch (err: any) {
    console.error('adminMarkSuccess error', err);
    return res.status(500).json({ message: err?.message || 'Failed to update transaction' });
  }
};
