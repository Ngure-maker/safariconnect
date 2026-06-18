import { Request, Response } from 'express';
import { query } from '../config/database';

export const getAllVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicles = await query('SELECT * FROM vehicles ORDER BY created_at DESC');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles.' });
  }
};

export const getVehicleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const vehicles = await query('SELECT * FROM vehicles WHERE id = ?', [req.params.id]);
    if (vehicles.length === 0) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }
    res.json(vehicles[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle.' });
  }
};

export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicle_name, registration_number, capacity, driver_assigned, availability } = req.body;
    const result = await query(
      'INSERT INTO vehicles (vehicle_name, registration_number, capacity, driver_assigned, availability) VALUES (?, ?, ?, ?, ?) RETURNING id',
      [vehicle_name, registration_number, capacity, driver_assigned, availability ?? true]
    );
    res.status(201).json({ message: 'Vehicle added successfully.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add vehicle.' });
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { vehicle_name, registration_number, capacity, driver_assigned, availability } = req.body;
    await query(
      'UPDATE vehicles SET vehicle_name = ?, registration_number = ?, capacity = ?, driver_assigned = ?, availability = ? WHERE id = ?',
      [vehicle_name, registration_number, capacity, driver_assigned, availability, req.params.id]
    );
    res.json({ message: 'Vehicle updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle.' });
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    await query('DELETE FROM vehicles WHERE id = ?', [req.params.id]);
    res.json({ message: 'Vehicle deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle.' });
  }
};
