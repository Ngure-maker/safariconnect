"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existing = await (0, database_1.query)('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            res.status(400).json({ error: 'Username or email already exists.' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        await (0, database_1.query)('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?) RETURNING id', [username, email, hashedPassword, role || 'receptionist']);
        res.status(201).json({ message: 'User registered successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to register user.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await (0, database_1.query)('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            res.status(401).json({ error: 'Invalid username or password.' });
            return;
        }
        const user = users[0];
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid username or password.' });
            return;
        }
        const payload = { id: user.id, username: user.username, role: user.role };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: (process.env.JWT_EXPIRES_IN || '1d')
        });
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed.' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const users = await (0, database_1.query)('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [req.user?.id]);
        if (users.length === 0) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }
        res.json(users[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get profile.' });
    }
};
exports.getProfile = getProfile;
//# sourceMappingURL=authController.js.map