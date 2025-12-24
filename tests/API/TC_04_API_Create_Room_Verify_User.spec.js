const { test, expect } = require('@playwright/test');
const { BookingPage } = require('../../pages/BookingPage');
const { TEST_ROOM } = require('../../utils/testData');

test.describe('API Flow: Create Room', () => {
    test('TC_04: Create Room via Admin API and Verify via User API', async ({ request, page }) => {
        const bookingPage = new BookingPage(page);
        const uniqueRoom = { ...TEST_ROOM, roomName: `API Create ${Date.now()}` };
        let roomId;

        await test.step('Step 1: Create Room (Admin API)', async () => {
            const response = await bookingPage.apiCreateRoom(request, uniqueRoom);
            roomId = response.roomid;
            expect(roomId).toBeDefined();
        });

        await test.step('Step 2: Verify Room exists (User API)', async () => {
            const response = await bookingPage.apiGetRooms(request);
            const createdRoom = response.rooms.find(r => r.roomid === roomId);
            
            expect(createdRoom).toBeDefined();
            expect(createdRoom.roomName).toBe(uniqueRoom.roomName);
        });
    });
});