import LoginManager from "./LoginManager.js";
import Player from "./Player.js"

onload = async () => {
	window.loginManager = new LoginManager();
	window.player = new Player(window.loginManager);

	// configure login button link
	const clientId = '71b02df30e1d481c807dcd000c603440';
	const protocol = window.location.protocol;
	const hostname = window.location.hostname;
	const port = window.location.port;
	const redirectUri = `${protocol}//${hostname}:${port}`;

	await loginManager.login()

	// display user info
	const loginButtons = document.getElementsByClassName("login-btn");
	loginButtons[0].innerText = `Welcome ${loginManager.user.userName}!`
	loginButtons.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=user-modify-playback-state%20user-read-private%20user-read-email%20user-read-playback-state`

	const pauseButtons = document.getElementsByClassName("pause-btn");
	pauseButtons[0].onclick = async () => {
		const playing = await window.player.toggle();
		pauseButtons[0].innerText = playing ? 'Pause' : 'Play'
	}

	const nextButtons = document.getElementsByClassName("next-btn");
	nextButtons[0].onclick = () => window.player.next()
}
