import bcrypt from 'bcryptjs';
import { query } from './config/database';

async function seed() {
  try {
    console.log('Seeding database...');

    const existing = await query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (existing.length > 0) {
      console.log('Admin user already exists. Skipping user seed.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('admin123', salt);
      await query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?) RETURNING id',
        ['admin', 'admin@safariconnect.com', hash, 'admin']
      );
      console.log('Admin user created: admin / admin123');
    }

    const dests = await query('SELECT COUNT(*) as count FROM destinations');
    if (dests[0].count === '0' || dests[0].count === 0) {
      const destData = [
        ['Maasai Mara', 'World-famous wildlife reserve known for the Great Migration'],
        ['Amboseli', 'Famous for large elephant herds and views of Mount Kilimanjaro'],
        ['Tsavo East', 'One of Kenya\'s largest national parks with diverse wildlife'],
        ['Tsavo West', 'Known for Mzima Springs and volcanic landscapes'],
        ['Lake Nakuru', 'Famous for flamingos and bird watching'],
        ['Samburu', 'Unique wildlife in a semi-arid landscape'],
        ['Diani Beach', 'Beautiful white sand beach on the Indian Ocean coast'],
        ['Hell\'s Gate', 'Dramatic cliffs and geothermal activity'],
      ];
      for (const [name, desc] of destData) {
        await query('INSERT INTO destinations (name, description) VALUES (?, ?)', [name, desc]);
      }
      console.log('Destinations seeded.');
    }

    const pkgs = await query('SELECT COUNT(*) as count FROM packages');
    if (pkgs[0].count === '0' || pkgs[0].count === 0) {
      const pkgData = [
        ['3-Day Maasai Mara Safari', 3, 45000, 'Experience the wonders of Maasai Mara', 'Game drives, Maasai village visit, bush dinner'],
        ['5-Day Amboseli Experience', 5, 65000, 'Explore Amboseli National Park', 'Game drives, photography, nature walks'],
        ['7-Day Coastal Adventure', 7, 85000, 'Relax and explore Kenya\'s coastline', 'Snorkeling, beach activities, boat rides'],
        ['10-Day Kenya Wildlife Expedition', 10, 120000, 'Comprehensive safari covering multiple parks', 'Game drives, guided walks, bird watching'],
      ];
      for (const [name, dur, price, desc, activities] of pkgData) {
        await query('INSERT INTO packages (package_name, duration, price, description, activities_included) VALUES (?, ?, ?, ?, ?)',
          [name, dur, price, desc, activities]);
      }
      console.log('Packages seeded.');
    }

    const vehs = await query('SELECT COUNT(*) as count FROM vehicles');
    if (vehs[0].count === '0' || vehs[0].count === 0) {
      const vehData = [
        ['Toyota Land Cruiser', 'KCB 001A', 7, 'John Kamau', true],
        ['Safari Van', 'KCB 002B', 12, 'Peter Ochieng', true],
        ['Toyota Prado', 'KCB 003C', 6, 'Mary Wanjiku', true],
        ['Land Rover Defender', 'KCB 004D', 5, 'James Mwangi', true],
      ];
      for (const [name, reg, cap, driver, avail] of vehData) {
        await query('INSERT INTO vehicles (vehicle_name, registration_number, capacity, driver_assigned, availability) VALUES (?, ?, ?, ?, ?)',
          [name, reg, cap, driver, avail]);
      }
      console.log('Vehicles seeded.');
    }

    const accs = await query('SELECT COUNT(*) as count FROM accommodations');
    if (accs[0].count === '0' || accs[0].count === 0) {
      const accData = [
        ['Sarova Mara Game Camp', 'Maasai Mara', 15000, 20, 4.5],
        ['Amboseli Serena Lodge', 'Amboseli', 12000, 15, 4.3],
        ['Sweetwaters Camp', 'Nanyuki', 10000, 25, 4.6],
        ['Diani Reef Resort', 'Diani Beach', 18000, 30, 4.4],
      ];
      for (const [name, loc, price, rooms, rating] of accData) {
        await query('INSERT INTO accommodations (accommodation_name, location, price_per_night, available_rooms, rating) VALUES (?, ?, ?, ?, ?)',
          [name, loc, price, rooms, rating]);
      }
      console.log('Accommodations seeded.');
    }

    console.log('Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
