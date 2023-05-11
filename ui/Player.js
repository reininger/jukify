export default class Player {

	constructor(loginManager) {
		this.loginManager = loginManager
	}

	async play() {
		const response = fetch('https://api.spotify.com/v1/me/player/play', {
			method: "PUT",
			headers: {
				"Authorization": 'Bearer ' + loginManager.user.accessToken
			}
		});
	}

	async pause() {
		const response = fetch('https://api.spotify.com/v1/me/player/pause', {
			method: "PUT",
			headers: {
				"Authorization": 'Bearer ' + loginManager.user.accessToken
			}
		});
	}

	async isPlaying() {
		const response = await fetch('https://api.spotify.com/v1/me/player', {
			method: "GET",
			headers: {
				"Authorization": 'Bearer ' + loginManager.user.accessToken
			}
		});
		const json = await response.json();
		const playbackState = json.is_playing;
		return playbackState
	}

	async next() {
		const response = fetch('https://api.spotify.com/v1/me/player/next', {
			method: "POST",
			headers: {
				"Authorization": 'Bearer ' + loginManager.user.accessToken
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
