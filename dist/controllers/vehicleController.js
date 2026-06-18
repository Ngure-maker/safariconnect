"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicleById = exports.getAllVehicles = void 0;
const database_1 = require("../config/database");
const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await (0, database_1.query)('SELECT * FROM vehicles ORDER BY created_at DESC');
        res.json(vehicles);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicles.' });
    }
};
exports.getAllVehicles = getAllVehicles;
const getVehicleById = async (req, res) => {
    try {
        const vehicles = await (0, database_1.query)('SELECT * FROM vehicles WHERE id = ?', [req.params.id]);
        if (vehicles.length === 0) {
            res.status(404).json({ error: 'Vehicle not found.' });
            return;
        }
        res.json(vehicles[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicle.' });
    }
};
exports.getVehicleById = getVehicleById;
const createVehicle = async (req, res) => {
    try {
        const { vehicle_name, registration_number, capacity, driver_assigned, availability } = req.body;
        const result = await (0, database_1.query)('INSERT INTO vehicles (vehicle_name, registration_number, capacity, driver_assigned, availability) VALUES (?, ?, ?, ?, ?) RETURNING id', [vehicle_name, registration_number, capacity, driver_assigned, availability ?? true]);
        res.status(201).json({ message: 'Vehicle added successfully.', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add vehicle.' });
    }
};
exports.createVehicle = createVehicle;
const updateVehicle = async (req, res) => {
    try {
        const { vehicle_name, registration_number, capacity, driver_assigned, availability } = req.body;
        await (0, database_1.query)('UPDATE vehicles SET vehicle_name = ?, registration_number = ?, capacity = ?, driver_assigned = ?, availability = ? WHERE id = ?', [vehicle_name, registration_number, capacity, driver_assigned, availability, req.params.id]);
        res.json({ message: 'Vehicle updated successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update vehicle.' });
    }
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (req, res) => {
    try {
        await (0, database_1.query)('DELETE FROM vehicles WHERE id = ?', [req.params.id]);
        res.json({ message: 'Vehicle deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete vehicle.' });
    }
};
exports.deleteVehicle = deleteVehicle;
//# sourceMappingURL=vehicleController.js.map