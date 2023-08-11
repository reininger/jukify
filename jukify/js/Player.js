export default class Player {

	constructor(loginManager) {
		this.loginManager = loginManager
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
		const response = fetch('https://api.spotify.com/v1/me/player/next', {
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
}
