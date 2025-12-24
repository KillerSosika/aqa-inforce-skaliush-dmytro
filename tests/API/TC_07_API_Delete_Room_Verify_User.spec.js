const { test, expect } = require('@playwright/test');
const { BookingPage } = require('../../pages/BookingPage');
const { TEST_ROOM } = require('../../utils/testData');

test.describe('API Flow: Delete Room', () => {
    test('TC_07: Delete Room via Admin API and Verify via User API', async ({ request, page }) => {
        const bookingPage = new BookingPage(page);
        let roomId;

        await test.step('Pre-condition: Create Room', async () => {
            const room = await bookingPage.apiCreateRoom(request, { ...TEST_ROOM, roomName: `To Delete ${Date.now()}` });
            roomId = room.roomid;
        });

        await test.step('Step 1: Delete Room (Admin API)', async () => {
            await bookingPage.apiDeleteRoom(request, roomId);
        });

        await test.step('Step 2: Verify Room is Gone (User API)', async () => {
            const response = await bookingPage.apiGetRooms(request);
            const deletedRoom = response.rooms.find(r => r.roomid === roomId);
            
            expect(deletedRoom).toBeUndefined(); // Має бути undefined, якщо кімната зникла
        });
    });
});