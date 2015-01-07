/**
 * Created by Patrick on 07.01.2015.
 */
App.LoginRegisterView = (function () {
    var that = {},
        $loginBox = null,
        $loginAnchor = null,
        $loginUsername = null,
        $loginPassword = null,
        $loginButton = null,
        $loginForm = null,
        $loginFailed = null,
        $loggedInUsername = null,
        $myPlaylistsAnchor = null,

        init = function () {
            $loginBox = $("#login-box");
            $loginAnchor = $("#login-anchor");
            $loginUsername = $("#login-username");
            $loginPassword = $("#login-password");
            $loginButton = $("#login-button");
            $loginForm = $("#login-form");
            $loginFailed = $("#login-failed");
            $loggedInUsername = $("#loggedin-username");
            $myPlaylistsAnchor = $("#my-playlists-anchor");

            $loginAnchor.on("click", handleLoginAnchorClick);
            $loginButton.on("click", handleLoginButtonClick)
            $myPlaylistsAnchor.on("click", hanldeMyPlaylistsAnchorClicked);
        },

        handleLoginButtonClick = function () {
            var username = $loginUsername.val();
            var password = $loginPassword.val();

            $(that).trigger("loginButtonClick", [username, password]);
        },

        loginSuccessful = function () {
            $loginAnchor.undim();
            $loginBox.hide();
            var username = Parse.User.current().attributes.username;
            $loggedInUsername.html(username);
        },

        loginFailed = function (errorMessage) {
            $loginFailed.html("Login Failed due to " + errorMessage);
        },

        handleLoginAnchorClick = function () {
            if ($loginForm.is(":visible")) {
                $(this).undim();
                $loginForm.hide();
            }
            else {
                $loginForm.show();
                $(this).dimBackground();
            }
        },

        hanldeMyPlaylistsAnchorClicked = function () {
            $(that).trigger("myPlaylistsAnchorClick");
        };

    that.loginSuccessful = loginSuccessful;
    that.loginFailed = loginFailed;
    that.init = init;

    return that;

}());
