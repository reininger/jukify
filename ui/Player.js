export default class Player {

	constructor(loginManager) {
		this.loginManager = loginManager
	}

	async play() {

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
	}

}
