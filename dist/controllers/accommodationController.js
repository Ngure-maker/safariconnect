"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccommodation = exports.updateAccommodation = exports.createAccommodation = exports.getAccommodationById = exports.getAllAccommodations = void 0;
const database_1 = require("../config/database");
const getAllAccommodations = async (req, res) => {
    try {
        const accommodations = await (0, database_1.query)('SELECT * FROM accommodations ORDER BY created_at DESC');
        res.json(accommodations);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch accommodations.' });
    }
};
exports.getAllAccommodations = getAllAccommodations;
const getAccommodationById = async (req, res) => {
    try {
        const accommodations = await (0, database_1.query)('SELECT * FROM accommodations WHERE id = ?', [req.params.id]);
        if (accommodations.length === 0) {
            res.status(404).json({ error: 'Accommodation not found.' });
            return;
        }
        res.json(accommodations[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch accommodation.' });
    }
};
exports.getAccommodationById = getAccommodationById;
const createAccommodation = async (req, res) => {
    try {
        const { accommodation_name, location, price_per_night, available_rooms, rating } = req.body;
        const result = await (0, database_1.query)('INSERT INTO accommodations (accommodation_name, location, price_per_night, available_rooms, rating) VALUES (?, ?, ?, ?, ?) RETURNING id', [accommodation_name, location, price_per_night, available_rooms, rating || 0]);
        res.status(201).json({ message: 'Accommodation added successfully.', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add accommodation.' });
    }
};
exports.createAccommodation = createAccommodation;
const updateAccommodation = async (req, res) => {
    try {
        const { accommodation_name, location, price_per_night, available_rooms, rating } = req.body;
        await (0, database_1.query)('UPDATE accommodations SET accommodation_name = ?, location = ?, price_per_night = ?, available_rooms = ?, rating = ? WHERE id = ?', [accommodation_name, location, price_per_night, available_rooms, rating, req.params.id]);
        res.json({ message: 'Accommodation updated successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update accommodation.' });
    }
};
exports.updateAccommodation = updateAccommodation;
const deleteAccommodation = async (req, res) => {
    try {
        await (0, database_1.query)('DELETE FROM accommodations WHERE id = ?', [req.params.id]);
        res.json({ message: 'Accommodation deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete accommodation.' });
    }
};
exports.deleteAccommodation = deleteAccommodation;
//# sourceMappingURL=accommodationController.js.map