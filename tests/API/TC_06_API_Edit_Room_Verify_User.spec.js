const { test, expect } = require('@playwright/test');
const { BookingPage } = require('../../pages/BookingPage');
const { TEST_ROOM } = require('../../utils/testData');

test.describe('API Flow: Edit Room', () => {
    test('TC_06: Edit Room via Admin API and Verify via User API', async ({ request, page }) => {
        const bookingPage = new BookingPage(page);
        let roomId;

        await test.step('Pre-condition: Create Room', async () => {
            const room = await bookingPage.apiCreateRoom(request, TEST_ROOM);
            roomId = room.roomid;
        });

        const newPrice = 999;
        await test.step('Step 1: Edit Room Price (Admin API)', async () => {
            const updateData = { 
                ...TEST_ROOM, 
                roomPrice: newPrice, 
                description: 'Updated via API' 
            };
            await bookingPage.apiEditRoom(request, roomId, updateData);
        });

        await test.step('Step 2: Verify Changes (User API)', async () => {
            const response = await bookingPage.apiGetRooms(request);
            const updatedRoom = response.rooms.find(r => r.roomid === roomId);
            
            expect(updatedRoom.roomPrice).toBe(newPrice);
            expect(updatedRoom.description).toBe('Updated via API');
        });
    });
});