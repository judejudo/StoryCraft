if (sessionStorage.getItem('AuthenticationState') === null) {
    window.open("loginpage.html", "_self");
}
else if (Date.now > new Date(sessionStorage.getItem('AuthenticationExpires'))) {
    window.open("AccessDenied.html", "_self");
}