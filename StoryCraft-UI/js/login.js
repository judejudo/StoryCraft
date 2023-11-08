Date.prototype.addHours = function (h) {
    return new Date(this.getTime() + (h * 60 * 60 * 1000));
};


function gotoLoginPage() {
    var loginPage = document.getElementById("login-container");
    var registerPage = document.getElementById("register-container");
    registerPage.classList.add("fadeOff");
    registerPage.classList.add("hidden");
    setTimeout(function () {
        loginPage.classList.add("fadeIn");
        loginPage.classList.remove("hidden");
    }, 700);
}

function gotoRegisterPage() {
    var loginPage = document.getElementById("login-container");
    var registerPage = document.getElementById("register-container");
    loginPage.classList.add("fadeOff");
    loginPage.classList.add("hidden");
    setTimeout(function () {
        registerPage.classList.add("fadeIn");
        registerPage.classList.remove("hidden");
    }, 700);
}

$(window, document, undefined).ready(function () {
    $('input').blur(function () {
        var $this = $(this);
        if ($this.val())
            $this.addClass('done');
        else
            $this.removeClass('done');
    });
});

//Firebase setup
var config = {
    apiKey: "AIzaSyDiPkM01PcS84zFdsbCrXkMbPWDbX8bHqM",
    authDomain: "a2sv-hackathon.firebaseapp.com",
    projectId: "a2sv-hackathon",
    storageBucket: "a2sv-hackathon.appspot.com",
    messagingSenderId: "335557285236",
    appId: "1:335557285236:web:95de9a7b59613041ef8821",
    measurementId: "G-TJ192BJEB9"
};
firebase.initializeApp(config);

// Initialize Firebase Authentication
var auth = firebase.auth();

// Sign-Up Form Logic
document.getElementById("signUpForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("regEmail").value;
    var password = document.getElementById("regPassword").value;
    var confirmPassword = document.getElementById("cfmpwd").value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Create a new user with email and password
    auth.createUserWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            localStorage.setItem("uid", userCredential.uid);
            sessionStorage.setItem("AuthenticationState", "Authenticated");
            sessionStorage.setItem("AuthenticationExpires", new Date().addHours(2));
            window.open("landing.html", "_self");
        })
        .catch(function (error) {
            window.open('erropage.html', "_self")
        });
});


// Logic for login
// Email and Password Sign-In
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var loginEmail = document.getElementById("loginEmail").value;
    var loginPassword = document.getElementById("loginPassword").value;
    auth.signInWithEmailAndPassword(loginEmail, loginPassword)
        .then(function (user) {
            localStorage.setItem("uid", user.user.uid);
            sessionStorage.setItem("AuthenticationState", "Authenticated");
            sessionStorage.setItem("AuthenticationExpires", new Date().addHours(2));
            window.open("landing.html", "_self");
        })
        .catch(function (error) {
            alert("Invalid Credentials");
        });
});

// Google Sign-In
document.getElementById("googleSignIn").addEventListener("click", function () {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(function (user) {
            localStorage.setItem("uid", user.uid);
            sessionStorage.setItem("AuthenticationState", "Authenticated");
            sessionStorage.setItem("AuthenticationExpires", new Date().addHours(2));
            window.open("landing.html", "_self");
        })
        .catch(function (error) {
            window.open("errorpage.html", "_self")
        });
});