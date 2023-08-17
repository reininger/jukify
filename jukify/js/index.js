/**
 * JS for index page.
 */

import Player from "./Player.js";
import LoginManager from "./SpotifyImplicitGrantLoginManager.js";
import SpotifyClient from "./SpotifyClient.js";

window.onload = async () => {
    window.loginManager = new LoginManager();
		window.spotifyClient = new SpotifyClient((...args) => window.fetch(...args), window.loginManager);
    window.player = new Player(window.spotifyClient);
    
    const pauseButton = document.getElementById("pause");
    const playButton = document.getElementById("play");
    const nameNode = document.querySelector("header h4");
		const skipPreviousButton = document.querySelector("#skip-previous");
		const skipNextButton = document.querySelector("#skip-next");
		const currentlyPlaying = document.querySelector(".currently-playing");

    let result;
    try {
        result = await window.loginManager.login();
    } catch {
        // do nothing
    }

    if (result !== true || !window.loginManager.user) {
        // redirect to login page
        window.location = `html/login.html`
    }
    nameNode.innerHTML = window.loginManager.user.display_name;

    const setPlayPauseButton = async () => {
        const playing = await window.player.isPlaying();
        playButton.style.display = playing ? "none" : "inline";
        pauseButton.style.display = playing ? "inline" : "none";
    }

    pauseButton.onclick = async () => {
        await window.player.pause();
        setPlayPauseButton();
    }

    playButton.onclick = async () => {
        await window.player.play();
        setPlayPauseButton();
    }

		skipNextButton.onclick = async () => {
				await window.player.next();
		}

		skipPreviousButton.onclick = async() => {
			await window.player.previous();
		}

		window.player.nowPlayingChanged.push(() => {		
			let nowPlaying = '-'
			if (window.player.nowPlaying) {
				const { item: { name, artists, duration_ms }, progress_ms } = window.player.nowPlaying;
				nowPlaying = `${name} - ${artists[0]?.name} - ${Math.round(progress_ms / 1000)} / ${Math.round(duration_ms / 1000)}`;
			}
			currentlyPlaying.innerText = nowPlaying;
		});

    setPlayPauseButton();

    //const nextButtons = document.getElementsByClassName("next-btn");
    //nextButtons[0].onclick = () => window.player.next()
};
