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
    signinManager.UpdateAuthenticationArguments = () => {
        signinManager.accessToken = 'someRandomAccessToken1';
        signinManager.accessTokenExpirationTime = '1';
    }
    signinManager.GetSpotifyUserProfile = async () => {
        const unauthorizedResponse = new Response(null, options = {
            status: 403,
            statusText: 'Forbidden'
        });

        return unauthorizedResponse;
    };

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
        const authorizedResponse = new Response(JSON.stringify({}), {
            status: 200,
            statusText: 'Ok'
        });
        
        return authorizedResponse;
    }

    const result = await signinManager.login();
	expect(result).toBe(true);
});

test('Does not call GetSpotifyUserProfile when accessToken is null', async () => {
    const signinManager = new SpotifyImplicitGrantSigninManager();
    let calledGetSpotifyUserProfile = false;
    signinManager.UpdateAuthenticationArguments = () => {
        signinManager.accessToken = null;
    }
    signinManager.GetSpotifyUserProfile = async () => {
        calledGetSpotifyUserProfile = true;
    }

    await signinManager.login();
    expect(calledGetSpotifyUserProfile).toBe(false);
});

test('Does not call GetSpotifyUserProfile when accessTokenExpirationTime is null', async () => {
    const signinManager = new SpotifyImplicitGrantSigninManager();
    let calledGetSpotifyUserProfile = false;
    signinManager.UpdateAuthenticationArguments = () => {
        signinManager.accessTokenExpirationTime = null;
        signinManager.accessToken = 'invalid'
    }
    signinManager.GetSpotifyUserProfile = async () => {
        calledGetSpotifyUserProfile = true;
    }

    await signinManager.login();
    expect(calledGetSpotifyUserProfile).toBe(false);
});

test('Tests does not call GetSpotifyUserProfile when accessTokenExpirationTime is expired', async () => {
    const signinManager = new SpotifyImplicitGrantSigninManager();
    let calledGetSpotifyUserProfile = false;
    signinManager.UpdateAuthenticationArguments = () => {
        signinManager.accessTokenExpirationTime = 1;
        signinManager.accessToken = 'invalid'
    }

    signinManager.IsExpired = () => true;

    signinManager.GetSpotifyUserProfile = async () => {
        calledGetSpotifyUserProfile = true;
    }

    await signinManager.login();
    expect(calledGetSpotifyUserProfile).toBe(false);
});

test('Tests user is set on successful spotify api call', async () => {
    const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.UpdateAuthenticationArguments = () => {
        signinManager.accessToken = 'valid'
        signinManager.accessTokenExpirationTime = '1'
    }

    signinManager.GetSpotifyUserProfile = async () => {
        const authorizedResponse = new Response(JSON.stringify({
            email: "test@email.com"
        }), {
            status: 200,
            statusText: 'Ok'
        });
        
        return authorizedResponse;
    }

    await signinManager.login();
	expect(signinManager.user).toBeTruthy();
});
