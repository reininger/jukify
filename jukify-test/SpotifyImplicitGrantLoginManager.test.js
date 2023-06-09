import { Response } from "node-fetch";
import SpotifyImplicitGrantSigninManager from "../jukify/js/SpotifyImplicitGrantLoginManager";

test('Returns false on 401 unauthorized', async () => {
	const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.GetSpotifyUserProfile = async () => {
        const unauthorizedResponse = new Response(null, {
            status: 401,
            statusText: 'Unauthorized'
        });

        return unauthorizedResponse;
    };
    signinManager.accessToken = 'someRandomAccessToken1';

    const result = await signinManager.login();
	expect(result).toBe(false);
});

test('Tests throws an exception on non-401 error statuses', async () => {
	const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.GetSpotifyUserProfile = async () => {
        const unauthorizedResponse = new Response(null, options = {
            status: 403,
            statusText: 'Forbidden'
        });

        return unauthorizedResponse;
    };
    signinManager.accessToken = 'someRandomAccessToken1';

    await expect(signinManager.login())
        .rejects
        .toThrow();
});

test('Tests returns true on 200 response', async () => {
    const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.UpdateAuthenticationArguments = () => {
        signinManager.accessToken = 'valid'
        signinManager.accessTokenExpirationTime = '1'
    }

    signinManager.GetSpotifyUserProfile = async () => {
        const authorizedResponse = new Response(null, {
            status: 200,
            statusText: 'Ok'
        });
        
        return authorizedResponse;
    }

    const result = await signinManager.login();
	expect(result).toBe(true);
});

test('Tests returns false when access token is not set', async () => {
    const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.UpdateAuthenticationArguments = () => {
        signinManager.accessToken = null;
    }

    const result = await signinManager.login();
    expect(result).toBe(false);
})
