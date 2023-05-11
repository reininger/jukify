import LoginManager from "./LoginManager.js";

const pause = async () => {
	let accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
  const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
		method: "PUT",
		headers: {
			"Authorization": `Bearer ${window.loginManager.user.accessToken}`
		}
	});
}

onload = async () => {
	const loginManager = new LoginManager();
	await loginManager.login()
	window.loginManager = loginManager

	// display user info
	const loginButtons = document.getElementsByClassName("login-btn");
	loginButtons[0].innerText = `Welcome ${loginManager.user.userName}!`

	const pauseButtons = document.getElementsByClassName("pause-btn");
	pauseButtons[0].onclick = () => pause();
}
