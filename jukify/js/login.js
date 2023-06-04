import LoginManager from "./LoginManager.js";
import Player from "./Player.js"

onload = async () => {
	window.loginManager = new LoginManager();
	window.player = new Player(window.loginManager);

	await loginManager.login()

	// display user info
	const loginButtons = document.getElementsByClassName("login-btn");
	loginButtons[0].innerText = `Welcome ${loginManager.user.userName}!`

	const pauseButtons = document.getElementsByClassName("pause-btn");
	pauseButtons[0].onclick = async () => {
		const playing = await window.player.toggle();
		pauseButtons[0].innerText = playing ? 'Pause' : 'Play'
	}

	const nextButtons = document.getElementsByClassName("next-btn");
	nextButtons[0].onclick = () => window.player.next()
}
