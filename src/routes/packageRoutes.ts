import { Router } from 'express';
import { getAllPackages, getPackageById, createPackage, updatePackage, deletePackage } from '../controllers/packageController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getAllPackages);
router.get('/:id', getPackageById);
router.post('/', authorize('admin'), createPackage);
router.put('/:id', authorize('admin'), updatePackage);
router.delete('/:id', authorize('admin'), deletePackage);

export default router;
