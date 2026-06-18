import { Router } from 'express';
import { getAllDestinations, getDestinationById, createDestination, updateDestination, deleteDestination } from '../controllers/destinationController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);
router.post('/', authorize('admin'), createDestination);
router.put('/:id', authorize('admin'), updateDestination);
router.delete('/:id', authorize('admin'), deleteDestination);

export default router;
