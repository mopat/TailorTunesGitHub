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
        $logoutAnchor = null,
        $loggedInBox = null,

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
            $logoutAnchor = $("#logout-anchor");
            $loggedInBox = $("#loggedin-box");

            $loginAnchor.on("click", handleLoginAnchorClick);
            $loginButton.on("click", handleLoginButtonClick)
            $myPlaylistsAnchor.on("click", hanldeMyPlaylistsAnchorClick);
            $logoutAnchor.on("click", hanldeLogoutAnchorClick);
        },

        handleLoginButtonClick = function () {
            var username = $loginUsername.val();
            var password = $loginPassword.val();

            $(that).trigger("loginButtonClick", [username, password]);
        },

        loginSuccessful = function () {
            $loginAnchor.undim();
            $loginAnchor.hide();
            $loginForm.hide();

            var username = Parse.User.current().attributes.username;
            $loggedInUsername.html(username);
            $loginFailed.html("");
            $loggedInBox.show();
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

        hanldeMyPlaylistsAnchorClick = function () {
            $(that).trigger("myPlaylistsAnchorClick");
        },

        hanldeLogoutAnchorClick = function () {
            Parse.User.logOut();
            $loggedInBox.hide();
            $loginAnchor.show();

            $(that).trigger("logoutClicked");
        };

    that.loginSuccessful = loginSuccessful;
    that.loginFailed = loginFailed;
    that.init = init;

    return that;

}());
