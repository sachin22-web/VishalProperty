import { Router } from 'express';
import { verifyJWT, requireRole } from '../middleware/auth';
import {
  getAllBanners,
  getActiveBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/banner.controller';

const router = Router();

router.get('/', getActiveBanners);

router.post('/', verifyJWT, requireRole('admin'), createBanner);

router.get('/admin/all', verifyJWT, requireRole('admin'), getAllBanners);

router.put('/:id', verifyJWT, requireRole('admin'), updateBanner);

router.delete('/:id', verifyJWT, requireRole('admin'), deleteBanner);

export default router;
