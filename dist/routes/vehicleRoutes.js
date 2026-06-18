"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicleController_1 = require("../controllers/vehicleController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', vehicleController_1.getAllVehicles);
router.get('/:id', vehicleController_1.getVehicleById);
router.post('/', (0, auth_1.authorize)('admin'), vehicleController_1.createVehicle);
router.put('/:id', (0, auth_1.authorize)('admin'), vehicleController_1.updateVehicle);
router.delete('/:id', (0, auth_1.authorize)('admin'), vehicleController_1.deleteVehicle);
exports.default = router;
//# sourceMappingURL=vehicleRoutes.js.map