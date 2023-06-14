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
     * 
     * Returns true on successful login. Returns false on failed login due to
     * bad access token. Throws on server errors.
     */
    async login() {
        if (this.user) {
            this.user = null;
            throw new Error('Cannot call login when a user is already logged in');
        }

        this.UpdateAuthenticationArguments();
        if ([
            this.accessToken === null,
            this.accessTokenExpirationTime === null,
            this.IsExpired()
        ].some(x => x)) {
            return false;
        }

        const response = await this.GetSpotifyUserProfile();

        if (response.status === 401) {
            return false;
        } 
        
        if (!response.ok) {
            throw new Error('Fatal error getting Spotify user profile')
        }

        const userProfile = await response.json();
        this.user = userProfile;

        return true;
    }

    /**
     * Begins logout flow.
     */
    async logout() {
        this.user = null;
        this.accessToken = null;
        this.accessTokenExpirationTime = null;
    }

    /**
     * Sets access token and expiration time.
     */
    UpdateAuthenticationArguments() {
        const urlParams = new URLSearchParams(window.location.hash.substr(1));
        this.accessToken = urlParams.get("access_token");
        this.accessTokenExpirationTime = urlParams.get("expires_in") * 1000 + Date.now();
    }

    /**
     * Calls Spotify API to get user profile.
     * 
     * Returns a Response object.
     */
    async GetSpotifyUserProfile() {
		const url = "https://api.spotify.com/v1/me";
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${accessToken}`
			}
		});
    }

    IsExpired() {
        
    }
}