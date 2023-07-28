/**
 * JS for index page.
 */

import LoginManager from "./SpotifyImplicitGrantLoginManager.js"

window.onload = async () => {
    const loginManager = new LoginManager();
    let result;
    try {
        result = await loginManager.login();
    } catch {
        // do nothing
    }
    
    if (result !== true || !loginManager.user) {
        // redirect to login page
        window.location = `html/login.html`
    }

    const nameNode = document.querySelector("header h4");
    nameNode.innerHTML = loginManager.user.display_name;
}
