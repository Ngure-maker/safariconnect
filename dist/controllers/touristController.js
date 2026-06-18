"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTourist = exports.updateTourist = exports.createTourist = exports.getTouristById = exports.getAllTourists = void 0;
const database_1 = require("../config/database");
const getAllTourists = async (req, res) => {
    try {
        const tourists = await (0, database_1.query)('SELECT * FROM tourists ORDER BY created_at DESC');
        res.json(tourists);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tourists.' });
    }
};
exports.getAllTourists = getAllTourists;
const getTouristById = async (req, res) => {
    try {
        const tourists = await (0, database_1.query)('SELECT * FROM tourists WHERE id = ?', [req.params.id]);
        if (tourists.length === 0) {
            res.status(404).json({ error: 'Tourist not found.' });
            return;
        }
        res.json(tourists[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch tourist.' });
    }
};
exports.getTouristById = getTouristById;
const createTourist = async (req, res) => {
    try {
        const { full_name, email, phone, nationality, passport_number, arrival_date, departure_date } = req.body;
        const result = await (0, database_1.query)('INSERT INTO tourists (full_name, email, phone, nationality, passport_number, arrival_date, departure_date) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id', [full_name, email, phone, nationality, passport_number, arrival_date, departure_date]);
        res.status(201).json({ message: 'Tourist added successfully.', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add tourist.' });
    }
};
exports.createTourist = createTourist;
const updateTourist = async (req, res) => {
    try {
        const { full_name, email, phone, nationality, passport_number, arrival_date, departure_date } = req.body;
        await (0, database_1.query)('UPDATE tourists SET full_name = ?, email = ?, phone = ?, nationality = ?, passport_number = ?, arrival_date = ?, departure_date = ? WHERE id = ?', [full_name, email, phone, nationality, passport_number, arrival_date, departure_date, req.params.id]);
        res.json({ message: 'Tourist updated successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update tourist.' });
    }
};
exports.updateTourist = updateTourist;
const deleteTourist = async (req, res) => {
    try {
        await (0, database_1.query)('DELETE FROM tourists WHERE id = ?', [req.params.id]);
        res.json({ message: 'Tourist deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete tourist.' });
    }
};
exports.deleteTourist = deleteTourist;
//# sourceMappingURL=touristController.js.map