const { test, expect } = require('@playwright/test');
const { BookingPage } = require('../../pages/BookingPage');

test.describe('UI Calendar Verification', () => {
    test.setTimeout(60000);
    const createdRoomName = `UI_Dates_${Date.now()}`;

    test('TC_03: Check calendar interaction', async ({ page }) => {
        const bookingPage = new BookingPage(page);

        await test.step('Step 1: Open app', async () => {
            await bookingPage.navigate();
            
            const roomCard = page.locator('.col-md-6').filter({ hasText: createdRoomName });
            
            if (await roomCard.count() === 0) {
                 await bookingPage.forceInjectRoom(createdRoomName);
            }
        });

        await test.step('Step 2: Check date inputs exist', async () => {
            await bookingPage.openBookingFormForRoom(createdRoomName);
            
            await expect(bookingPage.checkInInput).toBeVisible();
            await expect(bookingPage.checkOutInput).toBeVisible();
            
            console.log("Date inputs verified");
        });
    });
});