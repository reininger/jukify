const isExpired = expiration => {
	return Date.now() < expiration;
};

onload = () => {
	// check sessionStorage for valid access token
	let accessToken = sessionStorage.getItem("accessToken");
	let accessTokenExpiration = sessionStorage.getItem("accessTokenExpiration");

	// check url parameters for valid access token
	if (!accessToken || isExpired(accessTokenExpiration)) {
		const urlParams = new URLSearchParams(window.location.hash.substr(1));
		sessionStorage.setItem("accessToken", urlParams.get("accesstoken"));
		sessionStorage.setItem("accessTokenExpiration", urlParams.get("expiration"));
	}

	// if no valid access token, return
	if (!accessToken || isExpired(accessTokenExpiration)) {
		return;
	}

	const loginButtons = document.getElementsByClassName("login-btn");
	loginButtons[0].innerText = "Welcome!"
}
