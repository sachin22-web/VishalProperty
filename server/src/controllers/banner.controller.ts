import { Response } from 'express';
import { z } from 'zod';
import BannerModel from '../models/Banner';
import { AuthRequest } from '../middleware/auth';

const createBannerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL'),
  linkUrl: z.string().url('Invalid link URL').optional(),
  isActive: z.boolean().optional().default(true),
  order: z.coerce.number().int().default(0),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const updateBannerSchema = createBannerSchema.partial();

export const getAllBanners = async (_req: AuthRequest, res: Response) => {
  try {
    const banners = await BannerModel.find({})
      .sort({ order: 1 })
      .exec();
    res.json(banners);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch banners' });
  }
};

export const getActiveBanners = async (_req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const banners = await BannerModel.find({
      isActive: true,
      $or: [
        { startDate: { $lte: now } },
        { startDate: { $exists: false } }
      ],
      $or: [
        { endDate: { $gte: now } },
        { endDate: { $exists: false } }
      ]
    }).sort({ order: 1 }).exec();
    
    res.json(banners);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch banners' });
  }
};

export const createBanner = async (req: AuthRequest, res: Response) => {
  try {
    const data = createBannerSchema.parse(req.body);
    
    const banner = new BannerModel(data);
    const saved = await banner.save();
    
    res.status(201).json(saved);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: error.message || 'Failed to create banner' });
  }
};

export const updateBanner = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateBannerSchema.parse(req.body);
    
    const banner = await BannerModel.findByIdAndUpdate(id, data, { new: true });
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    res.json(banner);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: error.message || 'Failed to update banner' });
  }
};

export const deleteBanner = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const banner = await BannerModel.findByIdAndDelete(id);
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    
    res.json({ message: 'Banner deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete banner' });
  }
};
