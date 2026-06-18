import { Request, Response } from 'express';
import { query } from '../config/database';

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await query(`
      SELECT b.*, t.full_name as tourist_name, t.email as tourist_email, t.phone as tourist_phone,
        p.package_name, p.duration as package_duration,
        d.name as destination_name,
        a.accommodation_name, a.location as accommodation_location,
        v.vehicle_name, v.registration_number as vehicle_reg
      FROM bookings b
      LEFT JOIN tourists t ON b.tourist_id = t.id
      LEFT JOIN packages p ON b.package_id = p.id
      LEFT JOIN destinations d ON b.destination_id = d.id
      LEFT JOIN accommodations a ON b.accommodation_id = a.id
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.created_at DESC
    `);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await query(`
      SELECT b.*, t.full_name as tourist_name, t.email as tourist_email, t.phone as tourist_phone,
        p.package_name, p.duration as package_duration,
        d.name as destination_name,
        a.accommodation_name, a.location as accommodation_location,
        v.vehicle_name, v.registration_number as vehicle_reg
      FROM bookings b
      LEFT JOIN tourists t ON b.tourist_id = t.id
      LEFT JOIN packages p ON b.package_id = p.id
      LEFT JOIN destinations d ON b.destination_id = d.id
      LEFT JOIN accommodations a ON b.accommodation_id = a.id
      LEFT JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.id = ?
    `, [req.params.id]);
    if (bookings.length === 0) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    res.json(bookings[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking.' });
  }
};

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tourist_id, package_id, destination_id, accommodation_id, vehicle_id, status, total_amount, booking_date } = req.body;
    const result = await query(
      'INSERT INTO bookings (tourist_id, package_id, destination_id, accommodation_id, vehicle_id, status, total_amount, booking_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id',
      [tourist_id, package_id, destination_id, accommodation_id, vehicle_id || null, status || 'pending', total_amount, booking_date]
    );
    res.status(201).json({ message: 'Booking created successfully.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking.' });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tourist_id, package_id, destination_id, accommodation_id, vehicle_id, status, total_amount, booking_date } = req.body;
    await query(
      'UPDATE bookings SET tourist_id = ?, package_id = ?, destination_id = ?, accommodation_id = ?, vehicle_id = ?, status = ?, total_amount = ?, booking_date = ? WHERE id = ?',
      [tourist_id, package_id, destination_id, accommodation_id, vehicle_id || null, status, total_amount, booking_date, req.params.id]
    );
    res.json({ message: 'Booking updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking.' });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    await query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking.' });
  }
};

export const getBookingsByStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await query(`
      SELECT b.*, t.full_name as tourist_name, p.package_name
      FROM bookings b
      LEFT JOIN tourists t ON b.tourist_id = t.id
      LEFT JOIN packages p ON b.package_id = p.id
      WHERE b.status = ?
      ORDER BY b.created_at DESC
    `, [req.params.status]);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
};
