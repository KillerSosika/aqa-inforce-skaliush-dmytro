export const URLS = {
    BASE_URL: 'https://automationintesting.online/',
    ADMIN_PANEL: 'https://automationintesting.online/#/admin'
};

export const CREDENTIALS = {
    ADMIN: {
        username: 'admin',
        password: 'password'
    }
};

export const TEST_ROOM = {
    roomName: 'Auto Test Room',
    type: 'Double',
    accessible: true,
    image: 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
    description: 'Created by automated test',
    features: ['WiFi', 'TV', 'Safe'],
    roomPrice: 200
};

export const VALID_BOOKING = {
    firstname: 'Dmytro',
    lastname: 'Skaliush',
    email: 'dmytro@test.com',
    phone: '12345678901'
};

export const VALID_USER = {
    firstname: 'Dmytro',
    lastname: 'Skaliush',
    email: 'dmytro.skaliush@test.com',
    phone: '12345678901'
};

export const INVALID_USER = {
    firstname: '',
    lastname: '',
    email: '',
    phone: ''
};

export const MESSAGES = {
    SUCCESS_TITLE: 'Booking Successful!',
    ERROR_BLANK: 'must not be blank' 
};