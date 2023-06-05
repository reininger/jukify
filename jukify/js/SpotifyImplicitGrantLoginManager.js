/**
 * Responsible for handling the logged in user using Spotify's implicit grant
 * flow.
 */

export default class SpotifyImplicitGrantSigninManager {
    #user;
    #accessToken;
    #accessTokenExpirationTime;

    /**
     * Gets or sets the signed in user.
     */
    get user() {

    }

    /**
     * Gets the access token for the signed in user.
     */
    get accessToken() {

    }

    /**
     * Sets the access token for the signed in user.
     */
    set accessToken(accessToken) {

    }

    /**
     * Gets the access token expiration time.
     */
    get accessTokenExpirationTime() {

    }

    /**
     * Sets the access token expiration time.
     */
    set accessTokenExpirationTime(accessToken) {

    }

    /**
     * Begins login flow.
     */
    async login() {
        // get url params
        // get user info with access token
        // 
    }

    /**
     * Begins logout flow.
     */
    async logout() {

    }

    getUrlSearchParams() {
        const urlParams = new URLSearchParams(window.location.hash.substr(1));
        accessToken = urlParams.get("access_token");
        accessTokenExpiration = urlParams.get("expires_in") * 1000 + Date.now();
    }
}