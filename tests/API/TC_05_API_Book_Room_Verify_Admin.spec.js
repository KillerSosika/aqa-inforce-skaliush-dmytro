const { test, expect } = require('@playwright/test');
const { BookingPage } = require('../../pages/BookingPage');
const { TEST_ROOM, VALID_USER } = require('../../utils/testData');

test.describe('API Flow: Booking', () => {
    test('TC_05: Book Room via User API and Verify via Admin API', async ({ request, page }) => {
        const bookingPage = new BookingPage(page);
        let roomId;

        await test.step('Pre-condition: Create Room', async () => {
            const room = await bookingPage.apiCreateRoom(request, { ...TEST_ROOM, roomName: `BookMe ${Date.now()}` });
            roomId = room.roomid;
        });

        await test.step('Step 1: Book the Room (User API)', async () => {
            const bookingData = {
                bookingdates: { checkin: "2025-05-01", checkout: "2025-05-03" },
                roomid: roomId,
                ...VALID_USER 
            };
            await bookingPage.apiBookRoom(request, bookingData);
        });

        await test.step('Step 2: Verify Booking exists (Admin API)', async () => {
            const response = await bookingPage.apiGetBookings(request, roomId);
            const myBooking = response.bookings.find(b => b.roomid === roomId && b.firstname === VALID_USER.firstname);
            expect(myBooking).toBeDefined();
        });
    });
});