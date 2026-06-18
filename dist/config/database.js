"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.getConnection = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    user: process.env.DB_USER || 'postgres',
    database: process.env.DB_NAME || 'safariconnect',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbPassword = process.env.DB_PASSWORD;
if (dbHost)
    dbConfig.host = dbHost;
if (dbPort)
    dbConfig.port = parseInt(dbPort);
if (dbPassword)
    dbConfig.password = dbPassword;
const pool = new pg_1.Pool(dbConfig);
const getConnection = async () => {
    return pool.connect();
};
exports.getConnection = getConnection;
const query = async (text, params) => {
    if (params && params.length > 0) {
        let idx = 0;
        text = text.replace(/\?/g, () => `$${++idx}`);
    }
    const result = await pool.query(text, params);
    const wrapper = result.rows;
    wrapper.rowCount = result.rowCount;
    if (result.rows.length > 0 && result.rows[0]?.id) {
        wrapper.insertId = result.rows[0].id;
    }
    return wrapper;
};
exports.query = query;
exports.default = pool;
//# sourceMappingURL=database.js.map