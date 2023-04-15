const isExpired = expiration => {
	return Date.now() >= expiration;
};

onload = async () => {
	// check sessionStorage for valid access token
	let accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
	let accessTokenExpiration = JSON.parse(sessionStorage.getItem("accessTokenExpiration"));

	// check url parameters for valid access token
	if (accessToken === null || isExpired(accessTokenExpiration)) {
		const urlParams = new URLSearchParams(window.location.hash.substr(1));
		accessToken = urlParams.get("access_token");
		accessTokenExpiration = urlParams.get("expires_in") * 1000 + Date.now();
		sessionStorage.setItem("accessToken", JSON.stringify(accessToken));
		sessionStorage.setItem("accessTokenExpiration",
			JSON.stringify(accessTokenExpiration));
	}

	// if no valid access token, return
	if (accessToken === null || isExpired(accessTokenExpiration)) {
		return;
	}

	// retrieve user info
	const url = "https://api.spotify.com/v1/me";
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Authorization": `Bearer ${accessToken}`
		}
	});
	const json = await response.json();
	const { display_name } = json;

	// display user info
	const loginButtons = document.getElementsByClassName("login-btn");
	loginButtons[0].innerText = `Welcome ${display_name}!`
}
