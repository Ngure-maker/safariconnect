const App = {
  currentPage: 'dashboard',
  user: null,

  init() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('appPage').style.display = 'none';
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('destPage').style.display = 'none';
    document.getElementById('bookingPage').style.display = 'none';
    document.getElementById('bookingConfirmModal').style.display = 'none';

    const token = API.getToken();
    if (token) {
      this.showApp();
    }

    this.bindEvents();
    this.initScrollEffects();
  },

  initScrollEffects() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    });

    const sections = document.querySelectorAll('.section, .hero-section, #accommodationsSection, #destPage');
    const navLinks = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const id = entry.target.id || entry.target.querySelector('[id]')?.id;
          if (id) {
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) link.classList.add('active');
          }
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(s => observer.observe(s));

    const accSection = document.getElementById('accommodationsSection');
    if (accSection) {
      const accObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.showAccommodationsSection();
            accObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      accObserver.observe(accSection);
    }
  },

  bindEvents() {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });

    document.getElementById('openLoginBtn').addEventListener('click', () => {
      this.openLoginModal();
    });

    document.getElementById('closeLoginBtn').addEventListener('click', () => {
      this.closeLoginModal();
    });

    document.getElementById('loginModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeLoginModal();
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
      this.handleLogout();
    });

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        this.navigate(page);
      });
    });

    document.getElementById('sidebarToggle').addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('open');
    });

    document.getElementById('pageActionBtn').addEventListener('click', () => {
      this.showAddModal(this.currentPage);
    });

    document.getElementById('modalClose').addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        this.closeLoginModal();
      }
    });

    document.getElementById('navToggle').addEventListener('click', () => {
      document.getElementById('navLinks').classList.toggle('open');
    });

    document.getElementById('navHomeLink').addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        if (target && target.startsWith('#')) {
          if (target === '#accommodations') {
            this.showAccommodationsSection();
            return;
          }
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        document.getElementById('navLinks').classList.remove('open');
      });
    });

    document.getElementById('destPageBack').addEventListener('click', () => {
      this.closeDestinationPage();
    });

    document.getElementById('showSignupLink').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginFormContainer').style.display = 'none';
      document.getElementById('signupFormContainer').style.display = 'block';
    });

    document.getElementById('showLoginLink').addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('signupFormContainer').style.display = 'none';
      document.getElementById('loginFormContainer').style.display = 'block';
    });

    document.getElementById('signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSignup();
    });

    document.getElementById('bookingClose').addEventListener('click', () => {
      this.closeBooking();
    });
    document.getElementById('bookingPage').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeBooking();
    });

    document.getElementById('bookingConfirmOk').addEventListener('click', () => {
      document.getElementById('bookingConfirmModal').style.display = 'none';
    });
  },

  openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').textContent = '';
    setTimeout(() => document.getElementById('username').focus(), 100);
  },

  closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
  },

  async handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('loginError');

    if (!username || !password) {
      errorEl.textContent = 'Please enter username and password.';
      return;
    }

    try {
      const result = await API.login(username, password);
      API.setToken(result.token);
      this.user = result.user;
      errorEl.textContent = '';
      this.closeLoginModal();
      this.showApp();
    } catch (err) {
      errorEl.textContent = err.message || 'Login failed. Please check credentials.';
    }
  },

  handleLogout() {
    API.clearToken();
    this.user = null;
    document.getElementById('appPage').style.display = 'none';
    document.getElementById('homePage').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  async showApp() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('appPage').style.display = 'flex';

    if (!this.user) {
      try {
        const profile = await API.getProfile();
        this.user = profile;
      } catch {
        this.handleLogout();
        return;
      }
    }

    document.getElementById('userDisplay').textContent = this.user.username;
    document.getElementById('userRole').textContent = this.user.role;
    this.navigate('dashboard');
  },

  navigate(page) {
    this.currentPage = page;
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });

    const titles = {
      dashboard: 'Dashboard',
      tourists: 'Tourist Management',
      packages: 'Tour Packages',
      bookings: 'Booking Management',
      vehicles: 'Vehicle Management',
      accommodations: 'Accommodation Management',
      payments: 'Payment Management',
      destinations: 'Destinations'
    };

    document.getElementById('pageTitle').textContent = titles[page] || page;
    const actionBtn = document.getElementById('pageActionBtn');
    actionBtn.style.display = page !== 'dashboard' ? 'flex' : 'none';
    actionBtn.innerHTML = `<i class="fas fa-plus"></i> Add ${titles[page]?.replace(' Management', '').replace(' Management', '') || 'New'}`;

    const renderers = {
      dashboard: this.renderDashboard,
      tourists: this.renderTourists,
      packages: this.renderPackages,
      bookings: this.renderBookings,
      vehicles: this.renderVehicles,
      accommodations: this.renderAccommodations,
      payments: this.renderPayments,
      destinations: this.renderDestinations
    };

    const renderer = renderers[page];
    if (renderer) renderer.call(this);
  },

  showModal(title, bodyHTML) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHTML;
    document.getElementById('modalOverlay').style.display = 'flex';
  },

  closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
  },

  // ===== DASHBOARD =====
  async renderDashboard() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<p>Loading dashboard...</p>';

    try {
      const data = await API.getDashboard();
      const stats = data.stats;
      const bookings = data.recentBookings;

      area.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon green"><i class="fas fa-users"></i></div>
            <div class="stat-info"><h3>${stats.totalTourists}</h3><p>Total Tourists</p></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue"><i class="fas fa-calendar-check"></i></div>
            <div class="stat-info"><h3>${stats.activeBookings}</h3><p>Active Bookings</p></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange"><i class="fas fa-truck"></i></div>
            <div class="stat-info"><h3>${stats.availableVehicles}</h3><p>Available Vehicles</p></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple"><i class="fas fa-bed"></i></div>
            <div class="stat-info"><h3>${stats.availableRooms}</h3><p>Available Rooms</p></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon teal"><i class="fas fa-route"></i></div>
            <div class="stat-info"><h3>${stats.upcomingTours}</h3><p>Upcoming Tours</p></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon gold"><i class="fas fa-coins"></i></div>
            <div class="stat-info"><h3>KSh ${Number(stats.totalRevenue).toLocaleString()}</h3><p>Total Revenue</p></div>
          </div>
        </div>
        <div class="table-container">
          <h3>Recent Bookings</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tourist</th>
                <th>Package</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.length === 0 ? '<tr><td colspan="6" style="text-align:center;padding:20px;">No bookings yet.</td></tr>' :
                bookings.map(b => `
                  <tr>
                    <td>#${b.id}</td>
                    <td>${b.tourist_name || 'N/A'}</td>
                    <td>${b.package_name || 'N/A'}</td>
                    <td><span class="status-badge status-${b.status}">${b.status}</span></td>
                    <td>KSh ${Number(b.total_amount).toLocaleString()}</td>
                    <td>${new Date(b.booking_date).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      area.innerHTML = `<p style="color:var(--danger)">Failed to load dashboard: ${err.message}</p>`;
    }
  },

  // ===== TOURISTS =====
  async renderTourists() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<p>Loading tourists...</p>';

    try {
      const tourists = await API.getTourists();
      area.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Nationality</th>
                <th>Passport</th>
                <th>Arrival</th>
                <th>Departure</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${tourists.length === 0 ? '<tr><td colspan="9" style="text-align:center;padding:20px;">No tourists found.</td></tr>' :
                tourists.map(t => `
                  <tr>
                    <td>${t.id}</td>
                    <td>${t.full_name}</td>
                    <td>${t.email}</td>
                    <td>${t.phone}</td>
                    <td>${t.nationality}</td>
                    <td>${t.passport_number}</td>
                    <td>${new Date(t.arrival_date).toLocaleDateString()}</td>
                    <td>${new Date(t.departure_date).toLocaleDateString()}</td>
                    <td>
                      <button class="btn-edit" onclick="App.editTourist(${t.id})"><i class="fas fa-edit"></i></button>
                      <button class="btn-danger" onclick="App.deleteTourist(${t.id})"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      area.innerHTML = `<p style="color:var(--danger)">Failed to load tourists: ${err.message}</p>`;
    }
  },

  showAddTouristModal() {
    this.showModal('Add Tourist', `
      <form id="touristForm">
        <div class="form-row">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" name="full_name" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Phone</label>
            <input type="text" name="phone" required>
          </div>
          <div class="form-group">
            <label>Nationality</label>
            <input type="text" name="nationality" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Passport Number</label>
            <input type="text" name="passport_number" required>
          </div>
          <div class="form-group">
            <label>Arrival Date</label>
            <input type="date" name="arrival_date" required>
          </div>
        </div>
        <div class="form-group">
          <label>Departure Date</label>
          <input type="date" name="departure_date" required>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
          <button type="submit" class="btn-primary">Save Tourist</button>
        </div>
      </form>
    `);

    document.getElementById('touristForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      try {
        await API.createTourist(data);
        this.closeModal();
        this.renderTourists();
      } catch (err) {
        alert(err.message);
      }
    });
  },

  async editTourist(id) {
    try {
      const tourist = await API.getTourist(id);
      this.showModal('Edit Tourist', `
        <form id="touristForm">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" name="full_name" value="${tourist.full_name}" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" name="email" value="${tourist.email}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Phone</label>
              <input type="text" name="phone" value="${tourist.phone}" required>
            </div>
            <div class="form-group">
              <label>Nationality</label>
              <input type="text" name="nationality" value="${tourist.nationality}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Passport Number</label>
              <input type="text" name="passport_number" value="${tourist.passport_number}" required>
            </div>
            <div class="form-group">
              <label>Arrival Date</label>
              <input type="date" name="arrival_date" value="${tourist.arrival_date}" required>
            </div>
          </div>
          <div class="form-group">
            <label>Departure Date</label>
            <input type="date" name="departure_date" value="${tourist.departure_date}" required>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">Update Tourist</button>
          </div>
        </form>
      `);

      document.getElementById('touristForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        try {
          await API.updateTourist(id, data);
          this.closeModal();
          this.renderTourists();
        } catch (err) {
          alert(err.message);
        }
      });
    } catch (err) {
      alert(err.message);
    }
  },

  async deleteTourist(id) {
    if (!confirm('Delete this tourist? This action cannot be undone.')) return;
    try {
      await API.deleteTourist(id);
      this.renderTourists();
    } catch (err) {
      alert(err.message);
    }
  },

  // ===== PACKAGES =====
  async renderPackages() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<p>Loading packages...</p>';
    try {
      const packages = await API.getPackages();
      area.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Package Name</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Description</th>
                <th>Activities</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${packages.length === 0 ? '<tr><td colspan="7" style="text-align:center;padding:20px;">No packages found.</td></tr>' :
                packages.map(p => `
                  <tr>
                    <td>${p.id}</td>
                    <td>${p.package_name}</td>
                    <td>${p.duration} days</td>
                    <td>KSh ${Number(p.price).toLocaleString()}</td>
                    <td>${p.description || '-'}</td>
                    <td>${p.activities_included || '-'}</td>
                    <td>
                      <button class="btn-edit" onclick="App.editPackage(${p.id})"><i class="fas fa-edit"></i></button>
                      <button class="btn-danger" onclick="App.deletePackage(${p.id})"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      area.innerHTML = `<p style="color:var(--danger)">Failed to load packages: ${err.message}</p>`;
    }
  },

  showAddPackageModal() {
    this.showModal('Add Package', `
      <form id="packageForm">
        <div class="form-group">
          <label>Package Name</label>
          <input type="text" name="package_name" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Duration (days)</label>
            <input type="number" name="duration" min="1" required>
          </div>
          <div class="form-group">
            <label>Price (KSh)</label>
            <input type="number" name="price" min="0" step="0.01" required>
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea name="description"></textarea>
        </div>
        <div class="form-group">
          <label>Activities Included</label>
          <textarea name="activities_included" placeholder="Comma-separated activities"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
          <button type="submit" class="btn-primary">Save Package</button>
        </div>
      </form>
    `);

    document.getElementById('packageForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      data.duration = Number(data.duration);
      data.price = Number(data.price);
      try {
        await API.createPackage(data);
        this.closeModal();
        this.renderPackages();
      } catch (err) {
        alert(err.message);
      }
    });
  },

  async editPackage(id) {
    try {
      const pkg = await API.getPackage(id);
      this.showModal('Edit Package', `
        <form id="packageForm">
          <div class="form-group">
            <label>Package Name</label>
            <input type="text" name="package_name" value="${pkg.package_name}" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Duration (days)</label>
              <input type="number" name="duration" value="${pkg.duration}" min="1" required>
            </div>
            <div class="form-group">
              <label>Price (KSh)</label>
              <input type="number" name="price" value="${pkg.price}" min="0" step="0.01" required>
            </div>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description">${pkg.description || ''}</textarea>
          </div>
          <div class="form-group">
            <label>Activities Included</label>
            <textarea name="activities_included">${pkg.activities_included || ''}</textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">Update Package</button>
          </div>
        </form>
      `);

      document.getElementById('packageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        data.duration = Number(data.duration);
        data.price = Number(data.price);
        try {
          await API.updatePackage(id, data);
          this.closeModal();
          this.renderPackages();
        } catch (err) {
          alert(err.message);
        }
      });
    } catch (err) {
      alert(err.message);
    }
  },

  async deletePackage(id) {
    if (!confirm('Delete this package?')) return;
    try {
      await API.deletePackage(id);
      this.renderPackages();
    } catch (err) {
      alert(err.message);
    }
  },

  // ===== BOOKINGS =====
  async renderBookings() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<p>Loading bookings...</p>';
    try {
      const bookings = await API.getBookings();
      area.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tourist</th>
                <th>Package</th>
                <th>Destination</th>
                <th>Accommodation</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.length === 0 ? '<tr><td colspan="10" style="text-align:center;padding:20px;">No bookings found.</td></tr>' :
                bookings.map(b => `
                  <tr>
                    <td>#${b.id}</td>
                    <td>${b.tourist_name || 'N/A'}</td>
                    <td>${b.package_name || 'N/A'}</td>
                    <td>${b.destination_name || 'N/A'}</td>
                    <td>${b.accommodation_name || 'N/A'}</td>
                    <td>${b.vehicle_name || 'N/A'}</td>
                    <td><span class="status-badge status-${b.status}">${b.status}</span></td>
                    <td>KSh ${Number(b.total_amount).toLocaleString()}</td>
                    <td>${new Date(b.booking_date).toLocaleDateString()}</td>
                    <td>
                      <button class="btn-edit" onclick="App.editBooking(${b.id})"><i class="fas fa-edit"></i></button>
                      <button class="btn-danger" onclick="App.deleteBooking(${b.id})"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      area.innerHTML = `<p style="color:var(--danger)">Failed to load bookings: ${err.message}</p>`;
    }
  },

  async showAddBookingModal() {
    try {
      const [tourists, packages, destinations, accommodations, vehicles] = await Promise.all([
        API.getTourists(), API.getPackages(), API.getDestinations(), API.getAccommodations(), API.getVehicles()
      ]);

      this.showModal('Create Booking', `
        <form id="bookingForm">
          <div class="form-group">
            <label>Tourist</label>
            <select name="tourist_id" required>
              <option value="">Select tourist...</option>
              ${tourists.map(t => `<option value="${t.id}">${t.full_name} (${t.passport_number})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Package</label>
            <select name="package_id" id="bookingPackage" required>
              <option value="">Select package...</option>
              ${packages.map(p => `<option value="${p.id}" data-price="${p.price}">${p.package_name} - KSh ${Number(p.price).toLocaleString()}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Destination</label>
            <select name="destination_id" required>
              <option value="">Select destination...</option>
              ${destinations.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Accommodation</label>
            <select name="accommodation_id" required>
              <option value="">Select accommodation...</option>
              ${accommodations.map(a => `<option value="${a.id}">${a.accommodation_name} - KSh ${Number(a.price_per_night).toLocaleString()}/night</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Vehicle</label>
            <select name="vehicle_id">
              <option value="">No vehicle assigned</option>
              ${vehicles.filter(v => v.availability).map(v => `<option value="${v.id}">${v.vehicle_name} - ${v.registration_number}</option>`).join('')}
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Total Amount (KSh)</label>
              <input type="number" name="total_amount" id="bookingAmount" min="0" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Booking Date</label>
              <input type="date" name="booking_date" required>
            </div>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select name="status">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">Create Booking</button>
          </div>
        </form>
      `);

      document.getElementById('bookingPackage').addEventListener('change', function() {
        const selected = this.options[this.selectedIndex];
        if (selected.dataset.price) {
          document.getElementById('bookingAmount').value = selected.dataset.price;
        }
      });

      document.getElementById('bookingForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        data.total_amount = Number(data.total_amount);
        if (!data.vehicle_id) data.vehicle_id = null;
        try {
          await API.createBooking(data);
          this.closeModal();
          this.renderBookings();
        } catch (err) {
          alert(err.message);
        }
      });
    } catch (err) {
      alert(err.message);
    }
  },

  async editBooking(id) {
    try {
      const [booking, tourists, packages, destinations, accommodations, vehicles] = await Promise.all([
        API.getBooking(id), API.getTourists(), API.getPackages(), API.getDestinations(), API.getAccommodations(), API.getVehicles()
      ]);

      this.showModal('Edit Booking', `
        <form id="bookingForm">
          <div class="form-group">
            <label>Tourist</label>
            <select name="tourist_id" required>
              ${tourists.map(t => `<option value="${t.id}" ${t.id === booking.tourist_id ? 'selected' : ''}>${t.full_name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Package</label>
            <select name="package_id" required>
              ${packages.map(p => `<option value="${p.id}" ${p.id === booking.package_id ? 'selected' : ''}>${p.package_name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Destination</label>
            <select name="destination_id" required>
              ${destinations.map(d => `<option value="${d.id}" ${d.id === booking.destination_id ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Accommodation</label>
            <select name="accommodation_id" required>
              ${accommodations.map(a => `<option value="${a.id}" ${a.id === booking.accommodation_id ? 'selected' : ''}>${a.accommodation_name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Vehicle</label>
            <select name="vehicle_id">
              <option value="">No vehicle</option>
              ${vehicles.map(v => `<option value="${v.id}" ${v.id === booking.vehicle_id ? 'selected' : ''}>${v.vehicle_name}</option>`).join('')}
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Total Amount (KSh)</label>
              <input type="number" name="total_amount" value="${booking.total_amount}" min="0" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Booking Date</label>
              <input type="date" name="booking_date" value="${booking.booking_date}" required>
            </div>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select name="status">
              <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="completed" ${booking.status === 'completed' ? 'selected' : ''}>Completed</option>
              <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">Update Booking</button>
          </div>
        </form>
      `);

      document.getElementById('bookingForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        data.total_amount = Number(data.total_amount);
        if (!data.vehicle_id) data.vehicle_id = null;
        try {
          await API.updateBooking(id, data);
          this.closeModal();
          this.renderBookings();
        } catch (err) {
          alert(err.message);
        }
      });
    } catch (err) {
      alert(err.message);
    }
  },

  async deleteBooking(id) {
    if (!confirm('Delete this booking?')) return;
    try {
      await API.deleteBooking(id);
      this.renderBookings();
    } catch (err) {
      alert(err.message);
    }
  },

  // ===== VEHICLES =====
  async renderVehicles() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<p>Loading vehicles...</p>';
    try {
      const vehicles = await API.getVehicles();
      area.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle Name</th>
                <th>Registration</th>
                <th>Capacity</th>
                <th>Driver</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${vehicles.length === 0 ? '<tr><td colspan="7" style="text-align:center;padding:20px;">No vehicles found.</td></tr>' :
                vehicles.map(v => `
                  <tr>
                    <td>${v.id}</td>
                    <td>${v.vehicle_name}</td>
                    <td>${v.registration_number}</td>
                    <td>${v.capacity} seats</td>
                    <td>${v.driver_assigned || 'Not assigned'}</td>
                    <td><span class="status-badge ${v.availability ? 'status-completed' : 'status-cancelled'}">${v.availability ? 'Available' : 'Unavailable'}</span></td>
                    <td>
                      <button class="btn-edit" onclick="App.editVehicle(${v.id})"><i class="fas fa-edit"></i></button>
                      <button class="btn-danger" onclick="App.deleteVehicle(${v.id})"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      area.innerHTML = `<p style="color:var(--danger)">Failed to load vehicles: ${err.message}</p>`;
    }
  },

  showAddVehicleModal() {
    this.showModal('Add Vehicle', `
      <form id="vehicleForm">
        <div class="form-row">
          <div class="form-group">
            <label>Vehicle Name</label>
            <input type="text" name="vehicle_name" required>
          </div>
          <div class="form-group">
            <label>Registration Number</label>
            <input type="text" name="registration_number" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Capacity</label>
            <input type="number" name="capacity" min="1" required>
          </div>
          <div class="form-group">
            <label>Driver Assigned</label>
            <input type="text" name="driver_assigned">
          </div>
        </div>
        <div class="form-group">
          <label><input type="checkbox" name="availability" value="1" checked> Available</label>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
          <button type="submit" class="btn-primary">Save Vehicle</button>
        </div>
      </form>
    `);

    document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      data.capacity = Number(data.capacity);
      data.availability = !!data.availability;
      try {
        await API.createVehicle(data);
        this.closeModal();
        this.renderVehicles();
      } catch (err) {
        alert(err.message);
      }
    });
  },

  async editVehicle(id) {
    try {
      const vehicle = await API.getVehicle(id);
      this.showModal('Edit Vehicle', `
        <form id="vehicleForm">
          <div class="form-row">
            <div class="form-group">
              <label>Vehicle Name</label>
              <input type="text" name="vehicle_name" value="${vehicle.vehicle_name}" required>
            </div>
            <div class="form-group">
              <label>Registration Number</label>
              <input type="text" name="registration_number" value="${vehicle.registration_number}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Capacity</label>
              <input type="number" name="capacity" value="${vehicle.capacity}" min="1" required>
            </div>
            <div class="form-group">
              <label>Driver Assigned</label>
              <input type="text" name="driver_assigned" value="${vehicle.driver_assigned || ''}">
            </div>
          </div>
          <div class="form-group">
            <label><input type="checkbox" name="availability" value="1" ${vehicle.availability ? 'checked' : ''}> Available</label>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">Update Vehicle</button>
          </div>
        </form>
      `);

      document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        data.capacity = Number(data.capacity);
        data.availability = !!data.availability;
        try {
          await API.updateVehicle(id, data);
          this.closeModal();
          this.renderVehicles();
        } catch (err) {
          alert(err.message);
        }
      });
    } catch (err) {
      alert(err.message);
    }
  },

  async deleteVehicle(id) {
    if (!confirm('Delete this vehicle?')) return;
    try {
      await API.deleteVehicle(id);
      this.renderVehicles();
    } catch (err) {
      alert(err.message);
    }
  },

  // ===== ACCOMMODATIONS =====
  async renderAccommodations() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<p>Loading accommodations...</p>';
    try {
      const accommodations = await API.getAccommodations();
      area.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Price/Night</th>
                <th>Available Rooms</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${accommodations.length === 0 ? '<tr><td colspan="7" style="text-align:center;padding:20px;">No accommodations found.</td></tr>' :
                accommodations.map(a => `
                  <tr>
                    <td>${a.id}</td>
                    <td>${a.accommodation_name}</td>
                    <td>${a.location}</td>
                    <td>KSh ${Number(a.price_per_night).toLocaleString()}</td>
                    <td>${a.available_rooms}</td>
                    <td>${'★'.repeat(Math.round(a.rating))}${'☆'.repeat(5 - Math.round(a.rating))}</td>
                    <td>
                      <button class="btn-edit" onclick="App.editAccommodation(${a.id})"><i class="fas fa-edit"></i></button>
                      <button class="btn-danger" onclick="App.deleteAccommodation(${a.id})"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      area.innerHTML = `<p style="color:var(--danger)">Failed to load accommodations: ${err.message}</p>`;
    }
  },

  showAddAccommodationModal() {
    this.showModal('Add Accommodation', `
      <form id="accommodationForm">
        <div class="form-row">
          <div class="form-group">
            <label>Accommodation Name</label>
            <input type="text" name="accommodation_name" required>
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" name="location" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Price Per Night (KSh)</label>
            <input type="number" name="price_per_night" min="0" step="0.01" required>
          </div>
          <div class="form-group">
            <label>Available Rooms</label>
            <input type="number" name="available_rooms" min="0" required>
          </div>
        </div>
        <div class="form-group">
          <label>Rating (0-5)</label>
          <input type="number" name="rating" min="0" max="5" step="0.1">
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
          <button type="submit" class="btn-primary">Save Accommodation</button>
        </div>
      </form>
    `);

    document.getElementById('accommodationForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      data.price_per_night = Number(data.price_per_night);
      data.available_rooms = Number(data.available_rooms);
      data.rating = Number(data.rating) || 0;
      try {
        await API.createAccommodation(data);
        this.closeModal();
        this.renderAccommodations();
      } catch (err) {
        alert(err.message);
      }
    });
  },

  async editAccommodation(id) {
    try {
      const acc = await API.getAccommodation(id);
      this.showModal('Edit Accommodation', `
        <form id="accommodationForm">
          <div class="form-row">
            <div class="form-group">
              <label>Accommodation Name</label>
              <input type="text" name="accommodation_name" value="${acc.accommodation_name}" required>
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" name="location" value="${acc.location}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Price Per Night (KSh)</label>
              <input type="number" name="price_per_night" value="${acc.price_per_night}" min="0" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Available Rooms</label>
              <input type="number" name="available_rooms" value="${acc.available_rooms}" min="0" required>
            </div>
          </div>
          <div class="form-group">
            <label>Rating (0-5)</label>
            <input type="number" name="rating" value="${acc.rating}" min="0" max="5" step="0.1">
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">Update Accommodation</button>
          </div>
        </form>
      `);

      document.getElementById('accommodationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        data.price_per_night = Number(data.price_per_night);
        data.available_rooms = Number(data.available_rooms);
        data.rating = Number(data.rating) || 0;
        try {
          await API.updateAccommodation(id, data);
          this.closeModal();
          this.renderAccommodations();
        } catch (err) {
          alert(err.message);
        }
      });
    } catch (err) {
      alert(err.message);
    }
  },

  async deleteAccommodation(id) {
    if (!confirm('Delete this accommodation?')) return;
    try {
      await API.deleteAccommodation(id);
      this.renderAccommodations();
    } catch (err) {
      alert(err.message);
    }
  },

  // ===== PAYMENTS =====
  async renderPayments() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<p>Loading payments...</p>';
    try {
      const payments = await API.getPayments();
      area.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Tourist</th>
                <th>Booking</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${payments.length === 0 ? '<tr><td colspan="8" style="text-align:center;padding:20px;">No payments found.</td></tr>' :
                payments.map(p => `
                  <tr>
                    <td>${p.invoice_number}</td>
                    <td>${p.tourist_name || 'N/A'}</td>
                    <td>#${p.booking_reference || 'N/A'}</td>
                    <td>KSh ${Number(p.amount).toLocaleString()}</td>
                    <td>${p.payment_method}</td>
                    <td><span class="status-badge status-${p.payment_status === 'completed' ? 'completed' : p.payment_status === 'failed' ? 'cancelled' : 'pending'}">${p.payment_status}</span></td>
                    <td>${new Date(p.payment_date).toLocaleDateString()}</td>
                    <td>
                      <button class="btn-edit" onclick="App.editPayment(${p.id})"><i class="fas fa-edit"></i></button>
                      <button class="btn-danger" onclick="App.deletePayment(${p.id})"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      area.innerHTML = `<p style="color:var(--danger)">Failed to load payments: ${err.message}</p>`;
    }
  },

  async showAddPaymentModal() {
    try {
      const [tourists, bookings] = await Promise.all([API.getTourists(), API.getBookings()]);
      const now = new Date().toISOString().split('T')[0];
      const invNum = 'INV-' + Date.now();

      this.showModal('Record Payment', `
        <form id="paymentForm">
          <div class="form-group">
            <label>Invoice Number</label>
            <input type="text" name="invoice_number" value="${invNum}" readonly>
          </div>
          <div class="form-group">
            <label>Booking</label>
            <select name="booking_id" id="paymentBooking" required>
              <option value="">Select booking...</option>
              ${bookings.map(b => `<option value="${b.id}" data-tourist="${b.tourist_id}" data-amount="${b.total_amount}">#${b.id} - ${b.tourist_name || 'N/A'} - ${b.package_name || 'N/A'}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Tourist</label>
            <select name="tourist_id" id="paymentTourist" required>
              <option value="">Select tourist...</option>
              ${tourists.map(t => `<option value="${t.id}">${t.full_name}</option>`).join('')}
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Amount (KSh)</label>
              <input type="number" name="amount" id="paymentAmount" min="0" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Payment Method</label>
              <select name="payment_method" required>
                <option value="Mpesa">Mpesa</option>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Payment Status</label>
              <select name="payment_status">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div class="form-group">
              <label>Payment Date</label>
              <input type="date" name="payment_date" value="${now}" required>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">Record Payment</button>
          </div>
        </form>
      `);

      document.getElementById('paymentBooking').addEventListener('change', function() {
        const selected = this.options[this.selectedIndex];
        if (selected.dataset.tourist) {
          document.getElementById('paymentTourist').value = selected.dataset.tourist;
        }
        if (selected.dataset.amount) {
          document.getElementById('paymentAmount').value = selected.dataset.amount;
        }
      });

      document.getElementById('paymentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        data.amount = Number(data.amount);
        try {
          await API.createPayment(data);
          this.closeModal();
          this.renderPayments();
        } catch (err) {
          alert(err.message);
        }
      });
    } catch (err) {
      alert(err.message);
    }
  },

  async editPayment(id) {
    try {
      const [payment, tourists, bookings] = await Promise.all([API.getPayment(id), API.getTourists(), API.getBookings()]);
      this.showModal('Edit Payment', `
        <form id="paymentForm">
          <div class="form-group">
            <label>Invoice Number</label>
            <input type="text" name="invoice_number" value="${payment.invoice_number}" readonly>
          </div>
          <div class="form-group">
            <label>Booking</label>
            <select name="booking_id" required>
              ${bookings.map(b => `<option value="${b.id}" ${b.id === payment.booking_id ? 'selected' : ''}>#${b.id}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Tourist</label>
            <select name="tourist_id" required>
              ${tourists.map(t => `<option value="${t.id}" ${t.id === payment.tourist_id ? 'selected' : ''}>${t.full_name}</option>`).join('')}
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Amount (KSh)</label>
              <input type="number" name="amount" value="${payment.amount}" min="0" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Payment Method</label>
              <select name="payment_method" required>
                <option value="Mpesa" ${payment.payment_method === 'Mpesa' ? 'selected' : ''}>Mpesa</option>
                <option value="Visa" ${payment.payment_method === 'Visa' ? 'selected' : ''}>Visa</option>
                <option value="Mastercard" ${payment.payment_method === 'Mastercard' ? 'selected' : ''}>Mastercard</option>
                <option value="Cash" ${payment.payment_method === 'Cash' ? 'selected' : ''}>Cash</option>
                <option value="Bank Transfer" ${payment.payment_method === 'Bank Transfer' ? 'selected' : ''}>Bank Transfer</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Payment Status</label>
              <select name="payment_status">
                <option value="pending" ${payment.payment_status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="completed" ${payment.payment_status === 'completed' ? 'selected' : ''}>Completed</option>
                <option value="failed" ${payment.payment_status === 'failed' ? 'selected' : ''}>Failed</option>
                <option value="refunded" ${payment.payment_status === 'refunded' ? 'selected' : ''}>Refunded</option>
              </select>
            </div>
            <div class="form-group">
              <label>Payment Date</label>
              <input type="date" name="payment_date" value="${payment.payment_date}" required>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">Update Payment</button>
          </div>
        </form>
      `);

      document.getElementById('paymentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        data.amount = Number(data.amount);
        try {
          await API.updatePayment(id, data);
          this.closeModal();
          this.renderPayments();
        } catch (err) {
          alert(err.message);
        }
      });
    } catch (err) {
      alert(err.message);
    }
  },

  async deletePayment(id) {
    if (!confirm('Delete this payment record?')) return;
    try {
      await API.deletePayment(id);
      this.renderPayments();
    } catch (err) {
      alert(err.message);
    }
  },

  // ===== DESTINATIONS =====
  async renderDestinations() {
    const area = document.getElementById('contentArea');
    area.innerHTML = '<p>Loading destinations...</p>';
    try {
      const destinations = await API.getDestinations();
      area.innerHTML = `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${destinations.length === 0 ? '<tr><td colspan="4" style="text-align:center;padding:20px;">No destinations found.</td></tr>' :
                destinations.map(d => `
                  <tr>
                    <td>${d.id}</td>
                    <td><strong>${d.name}</strong></td>
                    <td>${d.description || '-'}</td>
                    <td>
                      <button class="btn-edit" onclick="App.editDestination(${d.id})"><i class="fas fa-edit"></i></button>
                      <button class="btn-danger" onclick="App.deleteDestination(${d.id})"><i class="fas fa-trash"></i></button>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      area.innerHTML = `<p style="color:var(--danger)">Failed to load destinations: ${err.message}</p>`;
    }
  },

  showAddDestinationModal() {
    this.showModal('Add Destination', `
      <form id="destinationForm">
        <div class="form-group">
          <label>Destination Name</label>
          <input type="text" name="name" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea name="description"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
          <button type="submit" class="btn-primary">Save Destination</button>
        </div>
      </form>
    `);

    document.getElementById('destinationForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      try {
        await API.createDestination(data);
        this.closeModal();
        this.renderDestinations();
      } catch (err) {
        alert(err.message);
      }
    });
  },

  async editDestination(id) {
    try {
      const dest = await API.getDestination(id);
      this.showModal('Edit Destination', `
        <form id="destinationForm">
          <div class="form-group">
            <label>Destination Name</label>
            <input type="text" name="name" value="${dest.name}" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description">${dest.description || ''}</textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn-primary">Update Destination</button>
          </div>
        </form>
      `);

      document.getElementById('destinationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd);
        try {
          await API.updateDestination(id, data);
          this.closeModal();
          this.renderDestinations();
        } catch (err) {
          alert(err.message);
        }
      });
    } catch (err) {
      alert(err.message);
    }
  },

  async deleteDestination(id) {
    if (!confirm('Delete this destination?')) return;
    try {
      await API.deleteDestination(id);
      this.renderDestinations();
    } catch (err) {
      alert(err.message);
    }
  },

  // ===== Add Modal Router =====
  showAddModal(page) {
    const handlers = {
      tourists: () => this.showAddTouristModal(),
      packages: () => this.showAddPackageModal(),
      bookings: () => this.showAddBookingModal(),
      vehicles: () => this.showAddVehicleModal(),
      accommodations: () => this.showAddAccommodationModal(),
      payments: () => this.showAddPaymentModal(),
      destinations: () => this.showAddDestinationModal()
    };
    const handler = handlers[page];
    if (handler) handler.call(this);
  },

  // ===== PUBLIC PAGES =====

  openDestinationByName(name) {
    this.showDestinationPage(name);
  },

  async showDestinationPage(name) {
    const homePage = document.getElementById('homePage');
    const destPage = document.getElementById('destPage');
    const hero = document.getElementById('destPageHero');
    const title = document.getElementById('destPageTitle');
    const heroInfo = document.getElementById('destPageHeroInfo');
    const body = document.getElementById('destPageBody');

    homePage.style.display = 'none';
    destPage.style.display = 'block';
    window.scrollTo({ top: 0 });

    body.innerHTML = '<p style="text-align:center;padding:40px;color:var(--text-light)">Loading destination details...</p>';

    try {
      const all = await API.request('GET', '/public/destinations');
      const dest = all.find(d => d.name.toLowerCase() === name.toLowerCase());
      if (!dest) {
        body.innerHTML = '<p style="text-align:center;padding:40px;color:var(--danger)">Destination not found.</p>';
        return;
      }
      const detail = await API.request('GET', `/public/destinations/${dest.id}`);

      const heroImgs = {
        'Maasai Mara': 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
        'Amboseli': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
        'Tsavo East': 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80',
        'Tsavo West': 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80',
        'Diani Beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'Lake Nakuru': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
        'Samburu': 'https://images.unsplash.com/photo-1564767655658-6e6a0c24a0ac?auto=format&fit=crop&w=1200&q=80',
        'Hell\'s Gate': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
      };
      const heroUrl = heroImgs[detail.name] || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80';

      hero.style.backgroundImage = `url('${heroUrl}')`;
      title.textContent = detail.name;
      heroInfo.innerHTML = `
        ${detail.area_size ? `<span><i class="fas fa-expand"></i> ${detail.area_size}</span>` : ''}
        ${detail.altitude ? `<span><i class="fas fa-mountain"></i> ${detail.altitude}</span>` : ''}
        ${detail.price_from ? `<span><i class="fas fa-tag"></i> From KSh ${Number(detail.price_from).toLocaleString()}</span>` : ''}
      `;

      const attractions = detail.key_attractions ? detail.key_attractions.split(',').map((s) => s.trim()) : [];
      const activities = detail.activities ? detail.activities.split(',').map((s) => s.trim()) : [];
      const accs = Array.isArray(detail.accommodations) ? detail.accommodations : [];
      const pkgs = Array.isArray(detail.packages) ? detail.packages : [];

      body.innerHTML = `
        <div class="dest-page-section">
          <h2><i class="fas fa-info-circle"></i> Overview</h2>
          <p>${detail.overview || detail.description || 'Explore this incredible destination with SafariConnect.'}</p>
        </div>

        <div class="dest-page-meta-grid">
          ${detail.area_size ? `
            <div class="dest-page-meta-card">
              <i class="fas fa-expand"></i>
              <strong>Area Size</strong>
              <span>${detail.area_size}</span>
            </div>
          ` : ''}
          ${detail.altitude ? `
            <div class="dest-page-meta-card">
              <i class="fas fa-mountain"></i>
              <strong>Altitude</strong>
              <span>${detail.altitude}</span>
            </div>
          ` : ''}
          ${detail.best_time_to_visit ? `
            <div class="dest-page-meta-card">
              <i class="fas fa-calendar-alt"></i>
              <strong>Best Time</strong>
              <span>${detail.best_time_to_visit.split(',').map(s => s.trim()).filter((_,i) => i < 2).join(', ')}</span>
            </div>
          ` : ''}
          ${detail.price_from ? `
            <div class="dest-page-meta-card">
              <i class="fas fa-coins"></i>
              <strong>Starting From</strong>
              <span>KSh ${Number(detail.price_from).toLocaleString()}</span>
            </div>
          ` : ''}
        </div>

        ${detail.best_time_to_visit ? `
          <div class="dest-page-section">
            <h2><i class="fas fa-calendar-check"></i> Best Time to Visit</h2>
            <p>${detail.best_time_to_visit}</p>
          </div>
        ` : ''}

        ${attractions.length > 0 ? `
          <div class="dest-page-section">
            <h2><i class="fas fa-star"></i> Key Attractions</h2>
            <div class="dest-page-tags">
              ${attractions.map(a => `<span>${a}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${activities.length > 0 ? `
          <div class="dest-page-section">
            <h2><i class="fas fa-hiking"></i> Activities</h2>
            <div class="dest-page-tags">
              ${activities.map(a => `<span>${a}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${accs.length > 0 ? `
          <div class="dest-page-section">
            <h2><i class="fas fa-hotel"></i> Places to Stay</h2>
            <div class="dest-sub-grid">
              ${accs.map(a => `
                <div class="dest-sub-card">
                  <h4>${a.accommodation_name}</h4>
                  <p>${a.location}</p>
                  <span class="price-tag">KSh ${Number(a.price_per_night).toLocaleString()}/night</span>
                  <p style="margin-top:8px;font-size:12px">${'★'.repeat(Math.round(a.rating))}${'☆'.repeat(5-Math.round(a.rating))} · ${a.available_rooms} rooms</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${pkgs.length > 0 ? `
          <div class="dest-page-section">
            <h2><i class="fas fa-box"></i> Available Packages</h2>
            <div class="dest-sub-grid">
              ${pkgs.map(p => `
                <div class="dest-sub-card">
                  <h4>${p.package_name}</h4>
                  <p>${p.duration} days</p>
                  <span class="price-tag">KSh ${Number(p.price).toLocaleString()}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="dest-page-cta">
          <h2>Ready to Explore ${detail.name}?</h2>
          <p>Book your safari today and experience the adventure of a lifetime.</p>
          <button class="btn-hero-primary" onclick="App.openBooking()"><i class="fas fa-calendar-check"></i> Book a Tour</button>
        </div>
      `;
    } catch (err) {
      body.innerHTML = `<p style="text-align:center;padding:40px;color:var(--danger)">Failed to load: ${err.message}</p>`;
    }
  },

  closeDestinationPage() {
    document.getElementById('destPage').style.display = 'none';
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('destinations').scrollIntoView({ behavior: 'smooth' });
  },

  async handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const errorEl = document.getElementById('signupError');

    if (!name || !email || !username || !password) {
      errorEl.textContent = 'Please fill in all fields.';
      return;
    }
    if (password.length < 6) {
      errorEl.textContent = 'Password must be at least 6 characters.';
      return;
    }

    try {
      await API.request('POST', '/auth/register', { username, email, password, role: 'receptionist' });
      errorEl.textContent = '';
      document.getElementById('signupFormContainer').style.display = 'none';
      document.getElementById('loginFormContainer').style.display = 'block';
      document.getElementById('username').value = username;
      document.getElementById('loginError').textContent = 'Account created! Sign in below.';
      document.getElementById('loginError').style.color = 'var(--success)';
    } catch (err) {
      errorEl.textContent = err.message || 'Registration failed.';
    }
  },

  async showAccommodationsSection() {
    const section = document.getElementById('accommodationsSection');
    if (!section) return;

    const container = section.querySelector('.accommodations-grid');
    if (!container) return;

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (container.dataset.loaded) return;
    container.dataset.loaded = 'true';

    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-light)">Loading accommodations...</p>';

    try {
      const accs = await API.request('GET', '/public/accommodations');
      const imgs = [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80'
      ];

      container.innerHTML = accs.length === 0
        ? '<p style="grid-column:1/-1;text-align:center;color:var(--text-light)">No accommodations available yet.</p>'
        : accs.map((a, i) => `
          <div class="acc-card">
            <div class="acc-card-img" style="background-image:url('${imgs[i % imgs.length]}')"></div>
            <div class="acc-card-body">
              <h3>${a.accommodation_name}</h3>
              <p class="acc-card-location"><i class="fas fa-map-marker-alt"></i> ${a.location}</p>
              <div class="acc-card-row">
                <div class="acc-card-price">KSh ${Number(a.price_per_night).toLocaleString()} <span>/night</span></div>
                <div class="acc-card-rating">${'★'.repeat(Math.round(a.rating))}${'☆'.repeat(5-Math.round(a.rating))}</div>
              </div>
              <div class="acc-card-rooms"><i class="fas fa-bed"></i> ${a.available_rooms} rooms available</div>
            </div>
          </div>
        `).join('');
    } catch (err) {
      container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--danger)">Failed to load: ${err.message}</p>`;
    }
  },

  openBooking(preselectedPkgId) {
    const overlay = document.getElementById('bookingPage');
    const container = document.getElementById('bookingFormContainer');
    overlay.style.display = 'flex';

    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7*86400000).toISOString().split('T')[0];

    container.innerHTML = '<p style="text-align:center;padding:20px">Loading form...</p>';

    Promise.all([
      API.request('GET', '/public/packages'),
      API.request('GET', '/public/destinations'),
      API.request('GET', '/public/accommodations')
    ]).then(([packages, destinations, accommodations]) => {
      container.innerHTML = `
        <form class="booking-form" id="bookingForm">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" name="full_name" required placeholder="John Doe">
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" name="email" required placeholder="john@example.com">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Phone *</label>
              <input type="tel" name="phone" required placeholder="+254 7XX XXX XXX">
            </div>
            <div class="form-group">
              <label>Nationality</label>
              <input type="text" name="nationality" placeholder="e.g. Kenyan">
            </div>
          </div>
          <div class="form-group">
            <label>Passport/ID Number</label>
            <input type="text" name="passport_number" placeholder="Optional">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Arrival Date *</label>
              <input type="date" name="arrival_date" value="${today}" required>
            </div>
            <div class="form-group">
              <label>Departure Date *</label>
              <input type="date" name="departure_date" value="${nextWeek}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Package *</label>
              <select name="package_id" id="bookingPkgSelect" required>
                <option value="">Select package...</option>
                ${packages.map(p => `
                  <option value="${p.id}" data-price="${p.price}" ${preselectedPkgId && p.id === preselectedPkgId ? 'selected' : ''}>
                    ${p.package_name} - KSh ${Number(p.price).toLocaleString()}
                  </option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Destination *</label>
              <select name="destination_id" required>
                <option value="">Select destination...</option>
                ${destinations.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Accommodation (optional)</label>
            <select name="accommodation_id">
              <option value="">No accommodation needed</option>
              ${accommodations.map(a => `
                <option value="${a.id}">${a.accommodation_name} - KSh ${Number(a.price_per_night).toLocaleString()}/night</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Total Amount (KSh)</label>
            <input type="number" name="total_amount" id="bookingTotalAmount" min="0" step="0.01" readonly>
          </div>
          <button type="submit" class="booking-submit"><i class="fas fa-paper-plane"></i> Confirm Booking</button>
        </form>
      `;

      const pkgSelect = document.getElementById('bookingPkgSelect');
      const totalInput = document.getElementById('bookingTotalAmount');

      const updatePrice = () => {
        const opt = pkgSelect.options[pkgSelect.selectedIndex];
        if (opt && opt.dataset.price) {
          totalInput.value = opt.dataset.price;
        } else {
          totalInput.value = '';
        }
      };
      pkgSelect.addEventListener('change', updatePrice);
      updatePrice();

      document.getElementById('bookingForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.submitBooking(e.target);
      });
    }).catch(err => {
      container.innerHTML = `<p style="text-align:center;color:var(--danger)">Failed to load form: ${err.message}</p>`;
    });
  },

  closeBooking() {
    document.getElementById('bookingPage').style.display = 'none';
  },

  async submitBooking(form) {
    const btn = form.querySelector('.booking-submit');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    const fd = new FormData(form);
    const data = Object.fromEntries(fd);
    data.total_amount = Number(data.total_amount) || 0;
    if (!data.accommodation_id) data.accommodation_id = null;
    if (!data.passport_number) data.passport_number = null;
    if (!data.nationality) data.nationality = null;

    try {
      const result = await API.request('POST', '/public/bookings', data);
      this.closeBooking();
      this.showBookingConfirmation(result.booking);
    } catch (err) {
      alert(err.message || 'Booking failed. Please try again.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Confirm Booking';
    }
  },

  showBookingConfirmation(booking) {
    const overlay = document.getElementById('bookingConfirmModal');
    const content = document.getElementById('bookingConfirmContent');
    overlay.style.display = 'flex';

    content.innerHTML = `
      <div class="booking-confirm-detail">
        <p><strong>Booking #</strong> ${booking.id}</p>
        <p><strong>Tourist</strong> ${booking.tourist_name}</p>
        <p><strong>Package</strong> ${booking.package_name}</p>
        <p><strong>Destination</strong> ${booking.destination_name}</p>
        ${booking.accommodation_name ? `<p><strong>Accommodation</strong> ${booking.accommodation_name}</p>` : ''}
        <p><strong>Amount</strong> KSh ${Number(booking.total_amount).toLocaleString()}</p>
        <p><strong>Status</strong> <span class="status-badge status-pending">Pending</span></p>
        <p><strong>Date</strong> ${new Date(booking.booking_date).toLocaleDateString()}</p>
      </div>
      <p style="font-size:14px;color:var(--text-light)">A confirmation will be sent to ${booking.tourist_email}. Our team will follow up to finalize your safari.</p>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
