import LoginManager from '../jukify/js/LoginManager.js';

const fixedDate = new Date("December 17, 1995 03:24:00");

test('Tests token is expired', () => {
	const loginManager = new LoginManager();
	loginManager.currentDate = () => fixedDate;

	const expiredDateTime = 0;
	const result = loginManager.isExpired(expiredDateTime);

	expect(result).toBe(true);
});

