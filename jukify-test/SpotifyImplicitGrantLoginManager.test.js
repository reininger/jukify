import SpotifyImplicitGrantSigninManager from "../jukify/js/SpotifyImplicitGrantLoginManager";

test('', () => {
	const signinManager = new SpotifyImplicitGrantSigninManager();

	const expiredDateTime = 0;
	const result = loginManager.isExpired(expiredDateTime);

	expect(result).toBe(true);
});

