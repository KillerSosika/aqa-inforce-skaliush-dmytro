const { test, expect } = require('@playwright/test');
const { BookingPage } = require('../../pages/BookingPage');
const { INVALID_USER } = require('../../utils/testData');

test.describe('UI Booking Flow - Negative', () => {
    test.setTimeout(60000);
    const createdRoomName = `UI_Invalid_${Date.now()}`;

    test('TC_02: Check that the room cannot be booked with invalid data', async ({ page }) => {
        const bookingPage = new BookingPage(page);

        await test.step('Step 1: Open app and wait for room', async () => {
            await bookingPage.navigate();
            await bookingPage.openBookingFormForRoom(createdRoomName);
        });

        await test.step('Step 2: Select dates', async () => {
            await bookingPage.selectDates();
        });

        await test.step('Step 3: Submit empty form', async () => {
            await bookingPage.fillBookingForm(INVALID_USER);
            await bookingPage.submitForm();
        });

        await test.step('Expected Result: Error messages', async () => {
        
            
            const alert = page.locator('.alert-danger, .alert');
            
            if (await alert.isVisible()) {
                await expect(alert).toBeVisible();
            } else {
                await expect(bookingPage.successMessage).not.toBeVisible();
                console.log("Validation blocked submission (Success message not shown)");
            }
        });
    });
});