/**
 * Created by Patrick on 20.01.2015.
 */
/**
 * Created by Patrick on 19.01.2015.
 */
App.Resize = (function () {
    var that = {},
        $sortSwitchBox = null,
        $playlist = null,
        $header = null,
        $controlsBox = null,

        init = function () {
            $sortSwitchBox = $("#sticky-sort-switch-box");
            $playlist = $("#playlist");
            $header = $("#header");
            $controlsBox = $("#controls-box");

            $(document).on("ready", function () {
                _resizePlaylistHeight();
            });
            return that;
        },

        _fullPlaylistHeight = function () {
            var height = $(document).height() - $header.height();
            $playlist.css("height", height);
            return this;
        },

        _resizePlaylistHeight = function () {
            var height = $(document).height() - $header.height() - $controlsBox.height();
            $playlist.css("height", height);
            return this;
        },

        _resizeUserPlaylistHeight = function () {
            $(".user-playlist").height($("#user-playlist-box").innerHeight() - 50);
        };

    that._fullPlaylistHeight = _fullPlaylistHeight;
    that._resizePlaylistHeight = _resizePlaylistHeight;
    that._resizeUserPlaylistHeight = _resizeUserPlaylistHeight;
    that.init = init;

    return that;
}());
