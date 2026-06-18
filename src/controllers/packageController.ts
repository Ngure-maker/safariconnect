import { Request, Response } from 'express';
import { query } from '../config/database';

export const getAllPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const packages = await query('SELECT * FROM packages ORDER BY created_at DESC');
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages.' });
  }
};

export const getPackageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const packages = await query('SELECT * FROM packages WHERE id = ?', [req.params.id]);
    if (packages.length === 0) {
      res.status(404).json({ error: 'Package not found.' });
      return;
    }
    res.json(packages[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch package.' });
  }
};

export const createPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { package_name, duration, price, description, activities_included } = req.body;
    const result = await query(
      'INSERT INTO packages (package_name, duration, price, description, activities_included) VALUES (?, ?, ?, ?, ?) RETURNING id',
      [package_name, duration, price, description, activities_included]
    );
    res.status(201).json({ message: 'Package created successfully.', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create package.' });
  }
};

export const updatePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { package_name, duration, price, description, activities_included } = req.body;
    await query(
      'UPDATE packages SET package_name = ?, duration = ?, price = ?, description = ?, activities_included = ? WHERE id = ?',
      [package_name, duration, price, description, activities_included, req.params.id]
    );
    res.json({ message: 'Package updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update package.' });
  }
};

export const deletePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    await query('DELETE FROM packages WHERE id = ?', [req.params.id]);
    res.json({ message: 'Package deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete package.' });
  }
};
