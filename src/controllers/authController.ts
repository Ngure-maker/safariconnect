import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { User, UserLogin } from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role }: User = req.body;

    const existing = await query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing.length > 0) {
      res.status(400).json({ error: 'Username or email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?) RETURNING id',
      [username, email, hashedPassword, role || 'receptionist']
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: UserLogin = req.body;

    const users = await query('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length === 0) {
      res.status(401).json({ error: 'Invalid username or password.' });
      return;
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ error: 'Invalid username or password.' });
      return;
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any
    });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await query('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [req.user?.id]);
    if (users.length === 0) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile.' });
  }
};
