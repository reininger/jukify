import SpotifyImplicitGrantSigninManager from "../jukify/js/SpotifyImplicitGrantLoginManager";

test('Returns false on 401 unauthorized', async () => {
	const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.GetSpotifyUserProfile = () => {
        unauthorizedResponse = new Response(options = {
            status: 401,
            statusText: Unauthorized
        });
    };
    signinManager.accessToken = 'someRandomAccessToken1';

    const result = await signinManager.login();
	expect(result).toBe(false);
});

test('Tests throws an exception on non-401 error statuses', async () => {
	const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.GetSpotifyUserProfile = () => {
        unauthorizedResponse = new Response(options = {
            status: 403,
            statusText: 'Forbidden'
        });
    };
    signinManager.accessToken = 'someRandomAccessToken1';

    expect(signinManager.login).toThrow();
});
