import { Response } from "node-fetch";
import SpotifyImplicitGrantSigninManager from "../jukify/js/SpotifyImplicitGrantLoginManager";

test('Returns false on 401 unauthorized', async () => {
	const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.updateAuthenticationArguments = () => null;
    signinManager.getSpotifyUserProfile = async () => {
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
    signinManager.updateAuthenticationArguments = () => {
        signinManager.accessToken = 'someRandomAccessToken1';
        signinManager.accessTokenExpirationTime = '1';
    }
    signinManager.getSpotifyUserProfile = async () => {
        const unauthorizedResponse = new Response(null, {
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
    signinManager.updateAuthenticationArguments = () => {
        signinManager.accessToken = 'valid'
        signinManager.accessTokenExpirationTime = '1'
    }

    signinManager.getSpotifyUserProfile = async () => {
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
    signinManager.updateAuthenticationArguments = () => {
        signinManager.accessToken = null;
    }
    signinManager.getSpotifyUserProfile = async () => {
        calledGetSpotifyUserProfile = true;
    }

    await signinManager.login();
    expect(calledGetSpotifyUserProfile).toBe(false);
});

test('Does not call GetSpotifyUserProfile when accessTokenExpirationTime is null', async () => {
    const signinManager = new SpotifyImplicitGrantSigninManager();
    let calledGetSpotifyUserProfile = false;
    signinManager.updateAuthenticationArguments = () => {
        signinManager.accessTokenExpirationTime = null;
        signinManager.accessToken = 'invalid'
    }
    signinManager.getSpotifyUserProfile = async () => {
        calledGetSpotifyUserProfile = true;
    }

    await signinManager.login();
    expect(calledGetSpotifyUserProfile).toBe(false);
});

test('Tests does not call GetSpotifyUserProfile when accessTokenExpirationTime is expired', async () => {
    const signinManager = new SpotifyImplicitGrantSigninManager();
    let calledGetSpotifyUserProfile = false;
    signinManager.updateAuthenticationArguments = () => {
        signinManager.accessTokenExpirationTime = 1;
        signinManager.accessToken = 'invalid'
    }

    signinManager.isInvalidAuthenticationArguments = () => true;

    signinManager.getSpotifyUserProfile = async () => {
        calledGetSpotifyUserProfile = true;
    }

    await signinManager.login();
    expect(calledGetSpotifyUserProfile).toBe(false);
});

test('Tests user is set on successful spotify api call', async () => {
    const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.updateAuthenticationArguments = () => {
        signinManager.accessToken = 'valid'
        signinManager.accessTokenExpirationTime = '1'
    }

    signinManager.getSpotifyUserProfile = async () => {
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

test('Tests user is null after failed login', async () => {
	const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.user = { email: "test@email.com" };
    signinManager.updateAuthenticationArguments = () => {
        signinManager.accessToken = 'someRandomAccessToken1';
        signinManager.accessTokenExpirationTime = '1';
    }
    signinManager.getSpotifyUserProfile = async () => {
        const unauthorizedResponse = new Response(null, {
            status: 401,
            statusText: 'Unauthorized'
        });

        return unauthorizedResponse;
    };

    try {
        await signinManager.login();
    } catch {}
    expect(signinManager.user).toBe(null);
});

test('Tests throws exception on login if a user is already logged in', async () => {
	const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.user = { email: "test@email.com" };
    signinManager.updateAuthenticationArguments = () => {
        signinManager.accessToken = 'someRandomAccessToken1';
        signinManager.accessTokenExpirationTime = '1';
    }
    signinManager.getSpotifyUserProfile = () => {
        const authorizedResponse = new Response(JSON.stringify({}), {
            status: 200,
            statusText: 'Ok'
        });
        
        return authorizedResponse;
    }

    await expect(signinManager.login())
        .rejects
        .toThrow();
})

test('Tests user and authentication args are null after logout', async () => {
	const signinManager = new SpotifyImplicitGrantSigninManager();
    signinManager.user = { email: "test@email.com" };
    signinManager.accessToken = 'someRandomAccessToken1';
    signinManager.accessTokenExpirationTime = '1';

    signinManager.logout();
    expect([
        signinManager.user,
        signinManager.accessToken,
        signinManager.accessTokenExpirationTime
    ].some(x => x !== null)).toBe(false);
}) 