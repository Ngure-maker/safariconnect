import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import touristRoutes from './routes/touristRoutes';
import packageRoutes from './routes/packageRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import accommodationRoutes from './routes/accommodationRoutes';
import bookingRoutes from './routes/bookingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import destinationRoutes from './routes/destinationRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import publicRoutes from './routes/publicRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/tourists', touristRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/public', publicRoutes);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`SafariConnect server running on port ${PORT}`);
});

export default app;
