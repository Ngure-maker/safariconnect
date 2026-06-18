"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPublicBooking = exports.getPublicAccommodations = exports.getPublicPackageById = exports.getPublicPackages = exports.getPublicDestinationById = exports.getPublicDestinations = void 0;
const database_1 = require("../config/database");
const getPublicDestinations = async (_req, res) => {
    try {
        const destinations = await (0, database_1.query)('SELECT * FROM destinations ORDER BY name ASC');
        res.json(destinations);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch destinations.' });
    }
};
exports.getPublicDestinations = getPublicDestinations;
const getPublicDestinationById = async (req, res) => {
    try {
        const destinations = await (0, database_1.query)('SELECT * FROM destinations WHERE id = ?', [req.params.id]);
        if (destinations.length === 0) {
            res.status(404).json({ error: 'Destination not found.' });
            return;
        }
        const destination = destinations[0];
        const accommodations = await (0, database_1.query)("SELECT * FROM accommodations WHERE location ILIKE '%' || ? || '%' OR location ILIKE '%' || (SELECT name FROM destinations WHERE id = ?) || '%' ORDER BY rating DESC", [destination.name, destination.id]);
        const packages = await (0, database_1.query)('SELECT * FROM packages WHERE description ILIKE ?', [`%${destination.name}%`]);
        res.json({ ...destination, accommodations, packages });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch destination.' });
    }
};
exports.getPublicDestinationById = getPublicDestinationById;
const getPublicPackages = async (_req, res) => {
    try {
        const packages = await (0, database_1.query)('SELECT * FROM packages ORDER BY price ASC');
        res.json(packages);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch packages.' });
    }
};
exports.getPublicPackages = getPublicPackages;
const getPublicPackageById = async (req, res) => {
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
exports.getPublicPackageById = getPublicPackageById;
const getPublicAccommodations = async (_req, res) => {
    try {
        const accommodations = await (0, database_1.query)('SELECT a.*, d.name as destination_name FROM accommodations a LEFT JOIN destinations d ON a.location ILIKE d.name ORDER BY a.rating DESC');
        res.json(accommodations);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch accommodations.' });
    }
};
exports.getPublicAccommodations = getPublicAccommodations;
const createPublicBooking = async (req, res) => {
    try {
        const { full_name, email, phone, nationality, passport_number, arrival_date, departure_date, package_id, destination_id, accommodation_id, total_amount } = req.body;
        if (!full_name || !email || !phone || !arrival_date || !departure_date || !package_id || !destination_id) {
            res.status(400).json({ error: 'Missing required fields.' });
            return;
        }
        const existing = await (0, database_1.query)('SELECT id FROM tourists WHERE email = ?', [email]);
        let touristId;
        if (existing.length > 0) {
            touristId = existing[0].id;
        }
        else {
            const result = await (0, database_1.query)('INSERT INTO tourists (full_name, email, phone, nationality, passport_number, arrival_date, departure_date) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id', [full_name, email, phone, nationality || 'Not specified', passport_number || 'N/A', arrival_date, departure_date]);
            touristId = result.insertId;
        }
        const today = new Date().toISOString().split('T')[0];
        const bookingResult = await (0, database_1.query)('INSERT INTO bookings (tourist_id, package_id, destination_id, accommodation_id, status, total_amount, booking_date) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id', [touristId, package_id, destination_id, accommodation_id || null, 'pending', total_amount || 0, today]);
        const bookingId = bookingResult.insertId;
        const booking = await (0, database_1.query)(`
      SELECT b.*, t.full_name as tourist_name, t.email as tourist_email, t.phone as tourist_phone,
        p.package_name, d.name as destination_name,
        a.accommodation_name
      FROM bookings b
      LEFT JOIN tourists t ON b.tourist_id = t.id
      LEFT JOIN packages p ON b.package_id = p.id
      LEFT JOIN destinations d ON b.destination_id = d.id
      LEFT JOIN accommodations a ON b.accommodation_id = a.id
      WHERE b.id = ?
    `, [bookingId]);
        res.status(201).json({
            message: 'Booking confirmed!',
            booking: booking[0]
        });
    }
    catch (error) {
        console.error('Booking error:', error?.message || error);
        res.status(500).json({ error: 'Failed to create booking.' });
    }
};
exports.createPublicBooking = createPublicBooking;
//# sourceMappingURL=publicController.js.map