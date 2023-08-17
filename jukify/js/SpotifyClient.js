/**
* Client for interacting with the Spotify http API.
*/

const defaultBaseUrl = 'https://api.spotify.com/v1/'

export default class SpotifyClient {
  constructor (fetch, loginManager, baseUrl = defaultBaseUrl) {
    this._fetch = fetch
    this._loginManager = loginManager
    this._baseUrl = baseUrl
  }

  fetch (path, options) {
    options = options ?? {}
    const url = this._baseUrl + path
    options.headers = {
      ...options.headers,
      Authorization: 'Bearer ' + this._loginManager.accessToken
    }
    return this._fetch(url, options)
  }
}
