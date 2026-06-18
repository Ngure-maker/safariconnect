"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', bookingController_1.getAllBookings);
router.get('/status/:status', bookingController_1.getBookingsByStatus);
router.get('/:id', bookingController_1.getBookingById);
router.post('/', (0, auth_1.authorize)('admin', 'receptionist'), bookingController_1.createBooking);
router.put('/:id', (0, auth_1.authorize)('admin', 'receptionist'), bookingController_1.updateBooking);
router.delete('/:id', (0, auth_1.authorize)('admin'), bookingController_1.deleteBooking);
exports.default = router;
//# sourceMappingURL=bookingRoutes.js.map