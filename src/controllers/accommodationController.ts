import { Request, Response } from 'express';
import { query } from '../config/database';

export const getAllAccommodations = async (req: Request, res: Response): Promise<void> => {
  try {
    const accommodations = await query('SELECT * FROM accommodations ORDER BY created_at DESC');
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accommodations.' });
  }
};

export const getAccommodationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const accommodations = await query('SELECT * FROM accommodations WHERE id = ?', [req.params.id]);
    if (accommodations.length === 0) {
      res.status(404).json({ error: 'Accommodation not found.' });
      return;
    }
    res.json(accommodations[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accommodation.' });
  }
};

export const createAccommodation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accommodation_name, location, price_per_night, available_rooms, rating } = req.body;
    const result = await query(
      'INSERT INTO accommodations (accommodation_name, location, price_per_night, available_rooms, rating) VALUES (?, ?, ?, ?, ?) RETURNING id',
      [accommodation_name, location, price_per_night, available_rooms, rating || 0]
    );
    res.status(201).json({ message: 'Accommodation added successfully.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add accommodation.' });
  }
};

export const updateAccommodation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accommodation_name, location, price_per_night, available_rooms, rating } = req.body;
    await query(
      'UPDATE accommodations SET accommodation_name = ?, location = ?, price_per_night = ?, available_rooms = ?, rating = ? WHERE id = ?',
      [accommodation_name, location, price_per_night, available_rooms, rating, req.params.id]
    );
    res.json({ message: 'Accommodation updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update accommodation.' });
  }
};

export const deleteAccommodation = async (req: Request, res: Response): Promise<void> => {
  try {
    await query('DELETE FROM accommodations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Accommodation deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete accommodation.' });
  }
};
