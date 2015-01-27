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
        $blendDown = null,

        init = function () {
            $sortSwitchBox = $("#sticky-sort-switch-box");
            $playlist = $("#playlist");
            $header = $("#header");
            $controlsBox = $("#controls-box");
            $blendDown = $("#blend-down");

            $(document).on("ready", function () {
                _resizePlaylistHeight();
            });

            window.addEventListener("resize", function () {
                _resizePlaylistHeight();
            }, false);
            return that;
        },

        _resizePlaylistHeight = function () {
            var height = $(document).height() - $header.height();
            if ($controlsBox.is(":visible"))
                height -= $controlsBox.height();
            if ($blendDown.is(":visible"))
                height -= $blendDown.height();

            $playlist.css("height", height);
            return this;
        },

        _resizeUserPlaylistHeight = function () {
            $(".user-playlist").height($("#user-playlist-box").innerHeight() - 70);
        };

    that._resizePlaylistHeight = _resizePlaylistHeight;
    that._resizeUserPlaylistHeight = _resizeUserPlaylistHeight;
    that.init = init;

    return that;
}());
