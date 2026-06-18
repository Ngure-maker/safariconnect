import { Router } from 'express';
import { getAllAccommodations, getAccommodationById, createAccommodation, updateAccommodation, deleteAccommodation } from '../controllers/accommodationController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getAllAccommodations);
router.get('/:id', getAccommodationById);
router.post('/', authorize('admin'), createAccommodation);
router.put('/:id', authorize('admin'), updateAccommodation);
router.delete('/:id', authorize('admin'), deleteAccommodation);

export default router;
