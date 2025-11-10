import { Router } from 'express';
import { verifyJWT, requireRole } from '../middleware/auth';
import TransactionModel from '../models/Transaction';

const router = Router();

router.get('/', verifyJWT, requireRole('admin'), async (req, res) => {
  const { status } = req.query as { status?: string };
  const filter: any = {};
  if (status) filter.status = status;
  const list = await TransactionModel.find(filter)
    .sort({ createdAt: -1 })
    .populate('userId', 'name email')
    .populate('propertyId', 'title')
    .populate('packageId', 'name');
  res.json(list);
});

router.post('/', verifyJWT, async (req: any, res) => {
  const { amount, currency = 'INR', gateway = 'razorpay', gatewayRef, propertyId, packageId } = req.body || {};
  if (!amount || !gatewayRef) return res.status(400).json({ message: 'amount and gatewayRef required' });
  const txn = await TransactionModel.create({
    userId: req.user._id,
    amount,
    currency,
    gateway,
    gatewayRef,
    propertyId: propertyId || null,
    packageId: packageId || null,
    status: 'pending',
  });
  res.status(201).json(txn);
});

router.get('/admin/stats', verifyJWT, requireRole('admin'), async (_req, res) => {
  const total = await TransactionModel.countDocuments();
  const success = await TransactionModel.countDocuments({ status: 'success' });
  const pending = await TransactionModel.countDocuments({ status: 'pending' });
  const failed = await TransactionModel.countDocuments({ status: 'failed' });
  res.json({ total, success, pending, failed });
});

router.patch('/:id/status', verifyJWT, requireRole('admin'), async (req, res) => {
  const { status } = req.body as { status: 'pending' | 'success' | 'failed' | 'refunded' };
  if (!status) return res.status(400).json({ message: 'status required' });
  const txn = await TransactionModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!txn) return res.status(404).json({ message: 'Transaction not found' });
  res.json(txn);
});

router.patch('/:id/notes', verifyJWT, requireRole('admin'), async (req, res) => {
  const { notes } = req.body as { notes: string };
  const txn = await TransactionModel.findByIdAndUpdate(req.params.id, { notes }, { new: true });
  if (!txn) return res.status(404).json({ message: 'Transaction not found' });
  res.json(txn);
});

export default router;
