export default class Player {

	constructor(loginManager, pollRate = 1) {
		this.loginManager = loginManager;
		this._pollRate = pollRate;
		this._pollIntervalId;

		// list of callbacks when nowPlaying changes
		this.nowPlayingChanged = [];

		// now playing object returned by spotify
		this.nowPlaying = null;
		this._pollNowPlaying(this.pollRate);
	}

	async play() {
		const response = await fetch('https://api.spotify.com/v1/me/player/play', {
			method: "PUT",
			headers: {
				"Authorization": 'Bearer ' + this.loginManager.accessToken
			}
		});
	}

	async pause() {
		const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
			method: "PUT",
			headers: {
				"Authorization": 'Bearer ' + this.loginManager.accessToken
			}
		});
	}

	async isPlaying() {
		const response = await fetch('https://api.spotify.com/v1/me/player', {
			method: "GET",
			headers: {
				"Authorization": 'Bearer ' + loginManager.accessToken
			}
		});
		if (response.status == 204) {
			return false;
		}
		const json = await response.json();
		const playbackState = json.is_playing;
		return playbackState
	}

	async next() {
		const response = await fetch('https://api.spotify.com/v1/me/player/next', {
			method: "POST",
			headers: {
				"Authorization": 'Bearer ' + loginManager.accessToken
			}
		});
	}

	async previous() {
		const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
			method: "POST",
			headers: {
				"Authorization": 'Bearer ' + loginManager.accessToken
			}
		});
	}

	async toggle() {
		const playing = await this.isPlaying();
		if (playing) {
			this.pause();
			return false;
		} else {
			this.play();
			return true;
		}
	}

	async _nowPlaying() {
		const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
			method: "GET",
			headers: {
				"Authorization": 'Bearer ' + loginManager.accessToken
			}
		});
		if (response.status != 200) {
			return null;
		}
		const json = await response.json();
		return json;
	}

	_pollNowPlaying(pollRate) {
		const s2ms = 1000;
		this.pollIntervalId = setInterval(async () => {
			const nowPlaying = await this._nowPlaying();
			this.nowPlaying = nowPlaying;
			this.nowPlayingChanged.forEach(callback => {
				callback();
			});
		}, s2ms * this._pollRate);
	}
}
