/**
 * Created by Patrick on 07.01.2015.
 */
App.LoginRegisterView = (function () {
    var that = {},
        $loginAnchor = null,
        $loginUsername = null,
        $loginPassword = null,
        $loginButton = null,
        $loginForm = null,
        $loginFailed = null,
        $loggedInUsername = null,
        $myPlaylistsAnchor = null,
        $logoutAnchor = null,
        $loggedInBox = null,
        $signInAnchor = null,
        $signInUsername = null,
        $signInPassword = null,
        $signInButton = null,
        $signInEmail = null,
        $signInForm = null,
        $signInFailed = null,

        init = function () {
            $loginAnchor = $("#login-anchor");
            $loginUsername = $("#login-username");
            $loginPassword = $("#login-password");
            $loginButton = $("#login-button");
            $loginForm = $("#login-form-box");
            $loginFailed = $("#login-failed");
            $loggedInUsername = $("#loggedin-username");
            $myPlaylistsAnchor = $("#my-playlists-anchor");
            $logoutAnchor = $("#logout-anchor");
            $loggedInBox = $("#loggedin-box");

            $signInAnchor = $("#sign-in-anchor");
            $signInUsername = $("#sign-in-username");
            $signInPassword = $("#sign-in-password");
            $signInEmail = $("#sign-in-email");
            $signInButton = $("#sign-in-button");
            $signInForm = $("#sign-in-form-box");
            $signInFailed = $("#sign-in-failed");
            $loginAnchor.on("click", handleLoginAnchorClick);
            $loginButton.on("click", handleLoginButtonClick)
            $myPlaylistsAnchor.on("click", hanldeMyPlaylistsAnchorClick);
            $logoutAnchor.on("click", hanldeLogoutAnchorClick);

            $signInAnchor.on("click", handleSignInAnchorClick);
            $signInButton.on("click", handleSignInButtonClick);
        },

        handleLoginButtonClick = function () {
            var username = $loginUsername.val();
            var password = $loginPassword.val();

            $(that).trigger("loginButtonClicked", [username, password]);
        },

        handleSignInButtonClick = function () {
            var username = $signInUsername.val();
            var password = $signInPassword.val();
            var email = $signInEmail.val();

            $(that).trigger("signInButtonClick", [username, password, email]);
        },

        loginSuccessful = function () {
            $.undim();
            $loginAnchor.hide();
            $loginForm.hide();

            $signInForm.hide();
            $signInAnchor.hide();
            $signInFailed.empty();

            var username = Parse.User.current().attributes.username;
            $loggedInUsername.html(username);
            $loginFailed.empty();
            $loggedInBox.show();
        },

        loginFailed = function (errorMessage) {
            $loginFailed.html("Login Failed due to " + errorMessage);
        },

        signInFailed = function (errorMessage) {
            $signInFailed.html("Sign In Failed: " + errorMessage);
        },

        hanldeMyPlaylistsAnchorClick = function () {
            $(that).trigger("myPlaylistsAnchorClick");
        },

        hanldeLogoutAnchorClick = function () {
            $loggedInBox.hide();
            $loginAnchor.show();
            $signInAnchor.show();

            $(that).trigger("emptyOldUserPlaylistView");
            $(that).trigger("handleLogoutClicked");
        },

        handleLoginAnchorClick = function () {
            if ($loginForm.is(":visible")) {
                $(this).undim();
                $loginForm.hide();
            }
            else {
                $loginForm.show();
                $(this).dimBackground();
                addDimBackgroundClickHandler();
            }
        },

        handleSignInAnchorClick = function () {
            if ($signInForm.is(":visible")) {
                $(this).undim();
                $signInForm.hide();
            }
            else {
                $signInForm.show();
                $(this).dimBackground();
                addDimBackgroundClickHandler();
            }
        },

        addDimBackgroundClickHandler = function () {
            $(".dimbackground-curtain").on("click", function () {
                $.undim();
                $(".form-box").hide();
            });
        };

    that.loginSuccessful = loginSuccessful;
    that.loginFailed = loginFailed;
    that.signInFailed = signInFailed;
    that.init = init;

    return that;

}());
