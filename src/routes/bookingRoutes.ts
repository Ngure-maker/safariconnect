import { Router } from 'express';
import { getAllBookings, getBookingById, createBooking, updateBooking, deleteBooking, getBookingsByStatus } from '../controllers/bookingController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getAllBookings);
router.get('/status/:status', getBookingsByStatus);
router.get('/:id', getBookingById);
router.post('/', authorize('admin', 'receptionist'), createBooking);
router.put('/:id', authorize('admin', 'receptionist'), updateBooking);
router.delete('/:id', authorize('admin'), deleteBooking);

export default router;
