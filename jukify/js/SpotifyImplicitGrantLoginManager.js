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
        this.UpdateAuthenticationArguments();
        if (this.accessToken === null) {
            return false;
        }

        if (this.accessTokenExpirationTime === null) {
            return false;
        }

        const spotifyUserProfileResponse = await this.GetSpotifyUserProfile();
        if (spotifyUserProfileResponse.status === 401) {
            return false;
        } else if (!spotifyUserProfileResponse.ok) {
            throw new Error('Fatal error getting Spotify user profile')
        }

        return true;
        // get user info from spotify
        // handle errors
        // set signedin user
    }

    /**
     * Begins logout flow.
     */
    async logout() {
        
    }

    /**
     * Sets access token and expiration time.
     */
    UpdateAuthenticationArguments() {

    }

    async GetSpotifyUserProfile() {

    }

    IsExpired() {
        
    }
}