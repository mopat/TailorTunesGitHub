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

        init = function () {
            $loginAnchor = $("#login-anchor");
            $loginUsername = $("#login-username");
            $loginPassword = $("#login-password");
            $loginButton = $("#login-button");
            $loginForm = $("#login-form");

            $loginAnchor.on("click", handleLoginAnchorClick);
            $loginButton.on("click", handleLoginButtonClick)
        },

        handleLoginButtonClick = function () {
            var username = $loginUsername.val();
            var password = $loginPassword.val();

            $(that).trigger("loginButtonClick", [username, password]);
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
        };

    that.init = init;

    return that;

}());
