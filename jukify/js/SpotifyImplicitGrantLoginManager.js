/**
 * Responsible for handling the logged in user using Spotify's implicit grant
 * flow.
 */

export default class SpotifyImplicitGrantSigninManager {
    user = null;
    accessToken = null;
    accessTokenExpirationTime = null;

    /**
     * Begins login flow.
     */
    async login() {
        // get user info from spotify
        // handle errors
        // set signedin user
    }

    /**
     * Begins logout flow.
     */
    async logout() {
        
    }

    async GetSpotifyUserProfile() {

    }
}