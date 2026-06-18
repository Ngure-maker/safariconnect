import { Request, Response } from 'express';
import { query } from '../config/database';

export const getAllTourists = async (req: Request, res: Response): Promise<void> => {
  try {
    const tourists = await query('SELECT * FROM tourists ORDER BY created_at DESC');
    res.json(tourists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tourists.' });
  }
};

export const getTouristById = async (req: Request, res: Response): Promise<void> => {
  try {
    const tourists = await query('SELECT * FROM tourists WHERE id = ?', [req.params.id]);
    if (tourists.length === 0) {
      res.status(404).json({ error: 'Tourist not found.' });
      return;
    }
    res.json(tourists[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tourist.' });
  }
};

export const createTourist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, email, phone, nationality, passport_number, arrival_date, departure_date } = req.body;
    const result = await query(
      'INSERT INTO tourists (full_name, email, phone, nationality, passport_number, arrival_date, departure_date) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id',
      [full_name, email, phone, nationality, passport_number, arrival_date, departure_date]
    );
    res.status(201).json({ message: 'Tourist added successfully.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add tourist.' });
  }
};

export const updateTourist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, email, phone, nationality, passport_number, arrival_date, departure_date } = req.body;
    await query(
      'UPDATE tourists SET full_name = ?, email = ?, phone = ?, nationality = ?, passport_number = ?, arrival_date = ?, departure_date = ? WHERE id = ?',
      [full_name, email, phone, nationality, passport_number, arrival_date, departure_date, req.params.id]
    );
    res.json({ message: 'Tourist updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tourist.' });
  }
};

export const deleteTourist = async (req: Request, res: Response): Promise<void> => {
  try {
    await query('DELETE FROM tourists WHERE id = ?', [req.params.id]);
    res.json({ message: 'Tourist deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tourist.' });
  }
};
