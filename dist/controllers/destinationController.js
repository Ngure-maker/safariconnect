"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDestination = exports.updateDestination = exports.createDestination = exports.getDestinationById = exports.getAllDestinations = void 0;
const database_1 = require("../config/database");
const getAllDestinations = async (req, res) => {
    try {
        const destinations = await (0, database_1.query)('SELECT * FROM destinations ORDER BY name ASC');
        res.json(destinations);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch destinations.' });
    }
};
exports.getAllDestinations = getAllDestinations;
const getDestinationById = async (req, res) => {
    try {
        const destinations = await (0, database_1.query)('SELECT * FROM destinations WHERE id = ?', [req.params.id]);
        if (destinations.length === 0) {
            res.status(404).json({ error: 'Destination not found.' });
            return;
        }
        res.json(destinations[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch destination.' });
    }
};
exports.getDestinationById = getDestinationById;
const createDestination = async (req, res) => {
    try {
        const { name, description } = req.body;
        const result = await (0, database_1.query)('INSERT INTO destinations (name, description) VALUES (?, ?) RETURNING id', [name, description]);
        res.status(201).json({ message: 'Destination added successfully.', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add destination.' });
    }
};
exports.createDestination = createDestination;
const updateDestination = async (req, res) => {
    try {
        const { name, description } = req.body;
        await (0, database_1.query)('UPDATE destinations SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id]);
        res.json({ message: 'Destination updated successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update destination.' });
    }
};
exports.updateDestination = updateDestination;
const deleteDestination = async (req, res) => {
    try {
        await (0, database_1.query)('DELETE FROM destinations WHERE id = ?', [req.params.id]);
        res.json({ message: 'Destination deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete destination.' });
    }
};
exports.deleteDestination = deleteDestination;
//# sourceMappingURL=destinationController.js.map