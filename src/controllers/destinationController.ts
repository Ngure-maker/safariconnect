import { Request, Response } from 'express';
import { query } from '../config/database';

export const getAllDestinations = async (req: Request, res: Response): Promise<void> => {
  try {
    const destinations = await query('SELECT * FROM destinations ORDER BY name ASC');
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations.' });
  }
};

export const getDestinationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const destinations = await query('SELECT * FROM destinations WHERE id = ?', [req.params.id]);
    if (destinations.length === 0) {
      res.status(404).json({ error: 'Destination not found.' });
      return;
    }
    res.json(destinations[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destination.' });
  }
};

export const createDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const result = await query(
      'INSERT INTO destinations (name, description) VALUES (?, ?) RETURNING id',
      [name, description]
    );
    res.status(201).json({ message: 'Destination added successfully.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add destination.' });
  }
};

export const updateDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    await query(
      'UPDATE destinations SET name = ?, description = ? WHERE id = ?',
      [name, description, req.params.id]
    );
    res.json({ message: 'Destination updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update destination.' });
  }
};

export const deleteDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    await query('DELETE FROM destinations WHERE id = ?', [req.params.id]);
    res.json({ message: 'Destination deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete destination.' });
  }
};
