import { Router } from 'express';
import {
  getPublicDestinations,
  getPublicDestinationById,
  getPublicPackages,
  getPublicPackageById,
  getPublicAccommodations,
  createPublicBooking
} from '../controllers/publicController';

const router = Router();

router.get('/destinations', getPublicDestinations);
router.get('/destinations/:id', getPublicDestinationById);
router.get('/packages', getPublicPackages);
router.get('/packages/:id', getPublicPackageById);
router.get('/accommodations', getPublicAccommodations);
router.post('/bookings', createPublicBooking);

export default router;
