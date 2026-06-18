"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const packageController_1 = require("../controllers/packageController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', packageController_1.getAllPackages);
router.get('/:id', packageController_1.getPackageById);
router.post('/', (0, auth_1.authorize)('admin'), packageController_1.createPackage);
router.put('/:id', (0, auth_1.authorize)('admin'), packageController_1.updatePackage);
router.delete('/:id', (0, auth_1.authorize)('admin'), packageController_1.deletePackage);
exports.default = router;
//# sourceMappingURL=packageRoutes.js.map