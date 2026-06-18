"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const touristController_1 = require("../controllers/touristController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', touristController_1.getAllTourists);
router.get('/:id', touristController_1.getTouristById);
router.post('/', (0, auth_1.authorize)('admin', 'receptionist'), touristController_1.createTourist);
router.put('/:id', (0, auth_1.authorize)('admin', 'receptionist'), touristController_1.updateTourist);
router.delete('/:id', (0, auth_1.authorize)('admin'), touristController_1.deleteTourist);
exports.default = router;
//# sourceMappingURL=touristRoutes.js.map