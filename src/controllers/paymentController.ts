import { Request, Response } from 'express';
import { query } from '../config/database';

export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const payments = await query(`
      SELECT p.*, t.full_name as tourist_name, t.email as tourist_email, b.id as booking_reference
      FROM payments p
      LEFT JOIN tourists t ON p.tourist_id = t.id
      LEFT JOIN bookings b ON p.booking_id = b.id
      ORDER BY p.created_at DESC
    `);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments.' });
  }
};

export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const payments = await query(`
      SELECT p.*, t.full_name as tourist_name, t.email as tourist_email, b.id as booking_reference
      FROM payments p
      LEFT JOIN tourists t ON p.tourist_id = t.id
      LEFT JOIN bookings b ON p.booking_id = b.id
      WHERE p.id = ?
    `, [req.params.id]);
    if (payments.length === 0) {
      res.status(404).json({ error: 'Payment not found.' });
      return;
    }
    res.json(payments[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment.' });
  }
};

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoice_number, booking_id, tourist_id, amount, payment_method, payment_status, payment_date } = req.body;
    const result = await query(
      'INSERT INTO payments (invoice_number, booking_id, tourist_id, amount, payment_method, payment_status, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id',
      [invoice_number, booking_id, tourist_id, amount, payment_method, payment_status || 'pending', payment_date]
    );
    res.status(201).json({ message: 'Payment recorded successfully.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record payment.' });
  }
};

export const updatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoice_number, booking_id, tourist_id, amount, payment_method, payment_status, payment_date } = req.body;
    await query(
      'UPDATE payments SET invoice_number = ?, booking_id = ?, tourist_id = ?, amount = ?, payment_method = ?, payment_status = ?, payment_date = ? WHERE id = ?',
      [invoice_number, booking_id, tourist_id, amount, payment_method, payment_status, payment_date, req.params.id]
    );
    res.json({ message: 'Payment updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment.' });
  }
};

export const deletePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    await query('DELETE FROM payments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Payment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment.' });
  }
};

export const getRevenueSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const revenue = await query(`
      SELECT 
        COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN amount END), 0) as total_revenue,
        COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as completed_payments,
        COUNT(*) as total_transactions
      FROM payments
    `);
    res.json(revenue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue summary.' });
  }
};
