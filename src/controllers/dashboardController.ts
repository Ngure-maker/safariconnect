import { Request, Response } from 'express';
import { query } from '../config/database';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const touristCount = await query('SELECT COUNT(*) as total FROM tourists');
    const activeBookings = await query("SELECT COUNT(*) as total FROM bookings WHERE status IN ('pending', 'confirmed')");
    const availableVehicles = await query('SELECT COUNT(*) as total FROM vehicles WHERE availability = TRUE');
    const availableAccommodations = await query('SELECT SUM(available_rooms) as total FROM accommodations');
    const upcomingTours = await query("SELECT COUNT(*) as total FROM bookings WHERE status IN ('confirmed')");
    const revenue = await query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE payment_status = 'completed'");

    const recentBookings = await query(`
      SELECT b.*, t.full_name as tourist_name, p.package_name
      FROM bookings b
      LEFT JOIN tourists t ON b.tourist_id = t.id
      LEFT JOIN packages p ON b.package_id = p.id
      ORDER BY b.created_at DESC LIMIT 5
    `);

    res.json({
      stats: {
        totalTourists: touristCount[0].total,
        activeBookings: activeBookings[0].total,
        availableVehicles: availableVehicles[0].total,
        availableRooms: availableAccommodations[0].total,
        upcomingTours: upcomingTours[0].total,
        totalRevenue: revenue[0].total
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats.' });
  }
};
