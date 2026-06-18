"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
const router = (0, express_1.Router)();
router.get('/destinations', publicController_1.getPublicDestinations);
router.get('/destinations/:id', publicController_1.getPublicDestinationById);
router.get('/packages', publicController_1.getPublicPackages);
router.get('/packages/:id', publicController_1.getPublicPackageById);
router.get('/accommodations', publicController_1.getPublicAccommodations);
router.post('/bookings', publicController_1.createPublicBooking);
exports.default = router;
//# sourceMappingURL=publicRoutes.js.map