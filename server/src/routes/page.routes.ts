import { Router } from 'express';
const router = Router();

router.get('/:slug', (_req, res) => res.json({ slug: _req.params.slug, content: {} }));
router.get('/admin/list', (_req, res) => res.json([]));
router.post('/', (_req, res) => res.status(201).json({ success: true }));
router.put('/:id', (_req, res) => res.json({ success: true }));
router.delete('/:id', (_req, res) => res.json({ success: true }));

export default router;
