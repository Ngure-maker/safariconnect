"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePackage = exports.updatePackage = exports.createPackage = exports.getPackageById = exports.getAllPackages = void 0;
const database_1 = require("../config/database");
const getAllPackages = async (req, res) => {
    try {
        const packages = await (0, database_1.query)('SELECT * FROM packages ORDER BY created_at DESC');
        res.json(packages);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch packages.' });
    }
};
exports.getAllPackages = getAllPackages;
const getPackageById = async (req, res) => {
    try {
        const packages = await (0, database_1.query)('SELECT * FROM packages WHERE id = ?', [req.params.id]);
        if (packages.length === 0) {
            res.status(404).json({ error: 'Package not found.' });
            return;
        }
        res.json(packages[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch package.' });
    }
};
exports.getPackageById = getPackageById;
const createPackage = async (req, res) => {
    try {
        const { package_name, duration, price, description, activities_included } = req.body;
        const result = await (0, database_1.query)('INSERT INTO packages (package_name, duration, price, description, activities_included) VALUES (?, ?, ?, ?, ?) RETURNING id', [package_name, duration, price, description, activities_included]);
        res.status(201).json({ message: 'Package created successfully.', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create package.' });
    }
};
exports.createPackage = createPackage;
const updatePackage = async (req, res) => {
    try {
        const { package_name, duration, price, description, activities_included } = req.body;
        await (0, database_1.query)('UPDATE packages SET package_name = ?, duration = ?, price = ?, description = ?, activities_included = ? WHERE id = ?', [package_name, duration, price, description, activities_included, req.params.id]);
        res.json({ message: 'Package updated successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update package.' });
    }
};
exports.updatePackage = updatePackage;
const deletePackage = async (req, res) => {
    try {
        await (0, database_1.query)('DELETE FROM packages WHERE id = ?', [req.params.id]);
        res.json({ message: 'Package deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete package.' });
    }
};
exports.deletePackage = deletePackage;
//# sourceMappingURL=packageController.js.map