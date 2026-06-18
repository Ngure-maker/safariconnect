"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accommodationController_1 = require("../controllers/accommodationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', accommodationController_1.getAllAccommodations);
router.get('/:id', accommodationController_1.getAccommodationById);
router.post('/', (0, auth_1.authorize)('admin'), accommodationController_1.createAccommodation);
router.put('/:id', (0, auth_1.authorize)('admin'), accommodationController_1.updateAccommodation);
router.delete('/:id', (0, auth_1.authorize)('admin'), accommodationController_1.deleteAccommodation);
exports.default = router;
//# sourceMappingURL=accommodationRoutes.js.map