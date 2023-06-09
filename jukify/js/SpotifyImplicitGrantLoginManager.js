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
        if ([
            this.accessToken === null,
            this.accessTokenExpirationTime === null,
            this.IsExpired()
        ].some(x => x)) {
            return false;
        }

        const spotifyUserProfileResponse = await this.GetSpotifyUserProfile();

        if (spotifyUserProfileResponse.status === 401) {
            return false;
        } 
        
        if (!spotifyUserProfileResponse.ok) {
            throw new Error('Fatal error getting Spotify user profile')
        }

        const userProfile = await spotifyUserProfileResponse.json();
        this.user = userProfile;

        return true;
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

    /**
     * Calls Spotify API to get user profile.
     * 
     * Returns a Response object.
     */
    async GetSpotifyUserProfile() {

    }

    IsExpired() {
        
    }
}