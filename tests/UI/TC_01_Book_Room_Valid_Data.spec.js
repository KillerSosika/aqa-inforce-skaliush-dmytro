const { test, expect } = require('@playwright/test');
const { BookingPage } = require('../../pages/BookingPage');
const { VALID_USER, TEST_ROOM } = require('../../utils/testData');

test.describe('UI Booking Flow', () => {
    test.setTimeout(60000);
    const createdRoomName = `UI_Test_${Date.now()}`;

    test('TC_01: Valid Booking Flow', async ({ page }) => {
        const bookingPage = new BookingPage(page);
        await bookingPage.navigate();
        
        await bookingPage.openBookingFormForRoom(createdRoomName);
        
        await bookingPage.selectDates();
        
        console.log("Test finished interaction with new UI layout");
    });
});