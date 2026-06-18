"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const destinationController_1 = require("../controllers/destinationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', destinationController_1.getAllDestinations);
router.get('/:id', destinationController_1.getDestinationById);
router.post('/', (0, auth_1.authorize)('admin'), destinationController_1.createDestination);
router.put('/:id', (0, auth_1.authorize)('admin'), destinationController_1.updateDestination);
router.delete('/:id', (0, auth_1.authorize)('admin'), destinationController_1.deleteDestination);
exports.default = router;
//# sourceMappingURL=destinationRoutes.js.map