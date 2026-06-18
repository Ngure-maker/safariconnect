"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', paymentController_1.getAllPayments);
router.get('/revenue', paymentController_1.getRevenueSummary);
router.get('/:id', paymentController_1.getPaymentById);
router.post('/', (0, auth_1.authorize)('admin', 'receptionist'), paymentController_1.createPayment);
router.put('/:id', (0, auth_1.authorize)('admin'), paymentController_1.updatePayment);
router.delete('/:id', (0, auth_1.authorize)('admin'), paymentController_1.deletePayment);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map