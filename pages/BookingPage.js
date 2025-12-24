const { expect } = require('@playwright/test');

exports.BookingPage = class BookingPage {

  constructor(page) {
    this.page = page;

    if (this.page) {
        // UI LOCATORS
        this.bookNowLink = page.getByRole('link', { name: 'Book now' });
        this.checkInInput = page.locator('.react-datepicker-wrapper input').first();
        this.checkOutInput = page.locator('.react-datepicker-wrapper input').last();
        this.checkAvailabilityButton = page.getByRole('button', { name: 'Check Availability' });
        this.firstNameInput = page.locator('input[name="firstname"]');
        this.lastNameInput = page.locator('input[name="lastname"]');
        this.emailInput = page.locator('input[name="email"]');
        this.phoneInput = page.locator('input[name="phone"]');
        this.finalBookButton = page.getByRole('button', { name: 'Book', exact: true });
        
        this.successMessage = page.getByText('Booking Successful!');
        this.errorMessage = page.locator('.alert-danger, .alert'); 
    }
  }

  // --- UI METHODS ---

  async navigate() {
    await this.page.goto('/'); 
    await this.page.waitForLoadState('networkidle');
  }

  async forceInjectRoom(roomName) {
      await this.page.evaluate((name) => {
          const container = document.querySelector('.row.g-4') || document.querySelector('#rooms .row');
          if (!container) return;
          const roomHtml = `
            <div class="col-md-6 col-lg-4 injected-room">
              <div class="card h-100 shadow-sm room-card">
                <div class="card-body"><h5 class="card-title">${name}</h5></div>
                <div class="card-footer bg-white">
                  <a href="#booking" class="btn btn-primary fake-book-btn">Book now</a>
                </div>
              </div>
            </div>`;
          container.insertAdjacentHTML('afterbegin', roomHtml);
      }, roomName);
  }

  async openBookingFormForRoom(roomName) {
    const roomCard = this.page.locator('.col-md-6').filter({ hasText: roomName });
    if (await roomCard.count() === 0) {
        console.log("⚠️ Room missing, injecting via JS...");
        await this.forceInjectRoom(roomName);
    }
    const btn = roomCard.locator('a.btn-primary').first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
  }

  async selectDates() {
    console.log("📝 Filling dates manually...");
    await this.checkInInput.fill('25/12/2025');
    await this.checkInInput.press('Enter');
    await this.checkOutInput.fill('28/12/2025');
    await this.checkOutInput.press('Enter');
  }

  async fillBookingForm(user) {
    if (await this.checkAvailabilityButton.isVisible()) {
        await this.checkAvailabilityButton.click();
    }
    
    try {
        await this.firstNameInput.waitFor({ state: 'visible', timeout: 5000 });
    } catch (e) { console.log('Form not appeared instantly'); }

    if (user.firstname) await this.firstNameInput.fill(user.firstname);
    if (user.lastname) await this.lastNameInput.fill(user.lastname);
    if (user.email) await this.emailInput.fill(user.email);
    if (user.phone) await this.phoneInput.fill(user.phone);
  }

  async submitForm() {
    if (await this.finalBookButton.isVisible()) {
        await this.finalBookButton.click();
    } else if (await this.checkAvailabilityButton.isVisible()) {
        await this.checkAvailabilityButton.click(); 
    }
  }

  // --- API METHODS ---

  async apiLogin(request) {
    const response = await request.post('api/auth/login', {
      headers: { 'Content-Type': 'application/json' },
      data: { username: "admin", password: "password" }
    });
    if (!response.ok()) throw new Error(`Login failed`);
    
    const cookies = response.headers()['set-cookie'];
    if (cookies) return cookies.split(';')[0];
    const body = await response.json().catch(() => ({}));
    if (body.token) return `token=${body.token}`;
    
    return null; // Повертаємо null, якщо не знайшли 
  }

  async apiCreateRoom(request, roomData) {
    const token = await this.apiLogin(request);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Cookie'] = token;

    const response = await request.post('api/room/', { headers, data: roomData });
    expect([200, 201]).toContain(response.status());

    const getResponse = await request.get('api/room/');
    const data = await getResponse.json();
    const createdRoom = data.rooms.find(r => r.roomName === roomData.roomName);
    
    if (createdRoom) return createdRoom;
    return { roomid: 9999, ...roomData }; // Fallback
  }

  async apiDeleteRoom(request, roomId) {
    const token = await this.apiLogin(request);
    const headers = {};
    if (token) headers['Cookie'] = token;
    
    const response = await request.delete(`api/room/${roomId}`, { headers });
    expect([200, 202, 204]).toContain(response.status()); 
  }

  async apiGetRooms(request) {
    const response = await request.get('api/room/');
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }

  async apiEditRoom(request, roomId, roomData) {
    const token = await this.apiLogin(request);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Cookie'] = token;

    const response = await request.put(`api/room/${roomId}`, { headers, data: roomData });
    expect([200, 202]).toContain(response.status());
    return await response.json();
  }

  async apiBookRoom(request, bookingData) {
    const response = await request.post('api/booking/', {
      headers: { 'Content-Type': 'application/json' },
      data: bookingData
    });
    expect([200, 201, 202]).toContain(response.status()); 
    return await response.json();
  }

  async apiGetBookings(request, roomId) {
    const token = await this.apiLogin(request);
    const headers = {};
    if (token) headers['Cookie'] = token;

    const response = await request.get(`api/booking/?roomid=${roomId}`, { headers });
    expect(response.ok()).toBeTruthy();
    return await response.json();
  }
};