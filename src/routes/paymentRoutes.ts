import { Router } from 'express';
import { getAllPayments, getPaymentById, createPayment, updatePayment, deletePayment, getRevenueSummary } from '../controllers/paymentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getAllPayments);
router.get('/revenue', getRevenueSummary);
router.get('/:id', getPaymentById);
router.post('/', authorize('admin', 'receptionist'), createPayment);
router.put('/:id', authorize('admin'), updatePayment);
router.delete('/:id', authorize('admin'), deletePayment);

export default router;
