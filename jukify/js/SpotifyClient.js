/**
* Client for interacting with the Spotify http API.
*/

const defaultBaseUrl = "https://api.spotify.com/v1";

class SpotifyHttpClient {

	constructor(fetch, loginManager, baseUrl = defaultBaseUrl) {
		this._fetch = fetch;
		this._loginManager = loginManager;

		this._defaultHeaders = {};
	}
	
}
