export default class Player {

	constructor(client, pollRate = 1) {
		this._client = client;
		this._pollRate = pollRate;
		this._pollIntervalId;

		// list of callbacks when nowPlaying changes
		this.nowPlayingChanged = [];

		// now playing object returned by spotify
		this.nowPlaying = null;
		this._pollNowPlaying(this.pollRate);
	}

	async play() {
		const response = await this._client.fetch('me/player/play', {
			method: "PUT",
		});
	}

	async pause() {
		const response = await this._client.fetch('me/player/pause', {
			method: "PUT",
		});
	}

	async isPlaying() {
		const response = await this._client.fetch('me/player');
		if (response.status == 204) {
			return false;
		}
		const json = await response.json();
		const playbackState = json.is_playing;
		return playbackState
	}

	async next() {
		const response = await this._client.fetch('me/player/next', {
			method: "POST",
		});
	}

	async previous() {
		const response = await this._client.fetch('me/player/previous', {
			method: "POST",
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
		const response = await this._client.fetch('me/player/currently-playing');
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

