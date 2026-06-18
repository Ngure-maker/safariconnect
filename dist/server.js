"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const touristRoutes_1 = __importDefault(require("./routes/touristRoutes"));
const packageRoutes_1 = __importDefault(require("./routes/packageRoutes"));
const vehicleRoutes_1 = __importDefault(require("./routes/vehicleRoutes"));
const accommodationRoutes_1 = __importDefault(require("./routes/accommodationRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const destinationRoutes_1 = __importDefault(require("./routes/destinationRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/tourists', touristRoutes_1.default);
app.use('/api/packages', packageRoutes_1.default);
app.use('/api/vehicles', vehicleRoutes_1.default);
app.use('/api/accommodations', accommodationRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/destinations', destinationRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/public', publicRoutes_1.default);
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
app.listen(PORT, () => {
    console.log(`SafariConnect server running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map