/**
* Client for interacting with the Spotify http API.
*/


class SpotifyHttpClient {

	constructor(fetch, loginManager) {
		this._fetch = fetch;
		this._loginManager = loginManager;

		this._defaultHeaders = {};
	}
	
}
