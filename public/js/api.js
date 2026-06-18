const API = {
  baseUrl: '/api',
  token: null,

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  },

  getToken() {
    return this.token || localStorage.getItem('token');
  },

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  },

  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${this.baseUrl}${path}`, options);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  put(path, body) { return this.request('PUT', path, body); },
  del(path) { return this.request('DELETE', path); },

  // Auth
  login(username, password) { return this.post('/auth/login', { username, password }); },
  getProfile() { return this.get('/auth/profile'); },

  // Dashboard
  getDashboard() { return this.get('/dashboard'); },

  // Tourists
  getTourists() { return this.get('/tourists'); },
  getTourist(id) { return this.get(`/tourists/${id}`); },
  createTourist(data) { return this.post('/tourists', data); },
  updateTourist(id, data) { return this.put(`/tourists/${id}`, data); },
  deleteTourist(id) { return this.del(`/tourists/${id}`); },

  // Packages
  getPackages() { return this.get('/packages'); },
  getPackage(id) { return this.get(`/packages/${id}`); },
  createPackage(data) { return this.post('/packages', data); },
  updatePackage(id, data) { return this.put(`/packages/${id}`, data); },
  deletePackage(id) { return this.del(`/packages/${id}`); },

  // Bookings
  getBookings() { return this.get('/bookings'); },
  getBooking(id) { return this.get(`/bookings/${id}`); },
  createBooking(data) { return this.post('/bookings', data); },
  updateBooking(id, data) { return this.put(`/bookings/${id}`, data); },
  deleteBooking(id) { return this.del(`/bookings/${id}`); },

  // Vehicles
  getVehicles() { return this.get('/vehicles'); },
  getVehicle(id) { return this.get(`/vehicles/${id}`); },
  createVehicle(data) { return this.post('/vehicles', data); },
  updateVehicle(id, data) { return this.put(`/vehicles/${id}`, data); },
  deleteVehicle(id) { return this.del(`/vehicles/${id}`); },

  // Accommodations
  getAccommodations() { return this.get('/accommodations'); },
  getAccommodation(id) { return this.get(`/accommodations/${id}`); },
  createAccommodation(data) { return this.post('/accommodations', data); },
  updateAccommodation(id, data) { return this.put(`/accommodations/${id}`, data); },
  deleteAccommodation(id) { return this.del(`/accommodations/${id}`); },

  // Payments
  getPayments() { return this.get('/payments'); },
  getPayment(id) { return this.get(`/payments/${id}`); },
  createPayment(data) { return this.post('/payments', data); },
  updatePayment(id, data) { return this.put(`/payments/${id}`, data); },
  deletePayment(id) { return this.del(`/payments/${id}`); },

  // Destinations
  getDestinations() { return this.get('/destinations'); },
  getDestination(id) { return this.get(`/destinations/${id}`); },
  createDestination(data) { return this.post('/destinations', data); },
  updateDestination(id, data) { return this.put(`/destinations/${id}`, data); },
  deleteDestination(id) { return this.del(`/destinations/${id}`); }
};
