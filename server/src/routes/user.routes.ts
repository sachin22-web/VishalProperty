import { Router } from 'express';
import { Types } from 'mongoose';
import User from '../models/User'; // ← apne path ke hisaab se adjust

// import { requireAdmin } from '../middleware/auth'; // (optional) if you have it
const router = Router();

// Agar auth/role guard hai to enable karo:
// router.use(requireAdmin);

/**
 * GET /api/admin/users
 * Query: ?q=search&status=active|blocked&role=admin|user
 * Returns: plain array of users (no passwordHash)
 */
router.get('/', async (req, res, next) => {
  try {
    const { q, status, role } = req.query as {
      q?: string;
      status?: 'active' | 'blocked';
      role?: 'admin' | 'user';
    };

    const filter: any = {};
    if (status && ['active', 'blocked'].includes(status)) filter.status = status;
    if (role && ['admin', 'user'].includes(role)) filter.role = role;
    if (q && q.trim()) {
      const r = new RegExp(q.trim(), 'i');
      filter.$or = [{ name: r }, { email: r }, { phone: r }];
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .select('-passwordHash -__v')
      .lean();

    res.json(users); // plain array so frontend simple rahe
  } catch (err) {
    next(err);
  }
});

/** GET /api/admin/users/:id */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });

    const user = await User.findById(id).select('-passwordHash -__v').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

/** PATCH /api/admin/users/:id/status  body: { status: "active"|"blocked" } */
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status?: 'active' | 'blocked' };

    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });
    if (!status || !['active', 'blocked'].includes(status)) {
      return res.status(400).json({ message: 'status must be "active" or "blocked"' });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, projection: '-passwordHash -__v' }
    ).lean();

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/admin/users/:id */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });

    const deleted = await User.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
