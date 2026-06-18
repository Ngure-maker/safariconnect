import { Router } from 'express';
import { getAllTourists, getTouristById, createTourist, updateTourist, deleteTourist } from '../controllers/touristController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getAllTourists);
router.get('/:id', getTouristById);
router.post('/', authorize('admin', 'receptionist'), createTourist);
router.put('/:id', authorize('admin', 'receptionist'), updateTourist);
router.delete('/:id', authorize('admin'), deleteTourist);

export default router;
