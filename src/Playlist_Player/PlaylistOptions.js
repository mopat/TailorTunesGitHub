/**
 * Created by Patrick on 19.01.2015.
 */
App.PlaylistOptions = (function () {
    var that = {},
        $sortModeSwitch = null,
        $sortSwitchBox = null,
        $savePlaylistButton = null,
        $playlistNameInput = null,
        $clearPlaylistButton = null,

        init = function () {
            $sortModeSwitch = $("#sort-mode-switch");
            $sortSwitchBox = $("#sticky-sort-switch-box");
            $savePlaylistButton = $("#save-playlist-button");
            $playlistNameInput = $("#playlist-name-input");
            $clearPlaylistButton = $("#clear-playlist-button");

            initHandler();
            stickyRelocate();
            _checkSortModeSwitch();
            return that;
        },

        initHandler = function () {
            $sortModeSwitch.on("click", handleSortSwitchClick);

            $savePlaylistButton.on("click", savePlaylist);
            $clearPlaylistButton.on("click", clearPlaylist);
        },

        handleSortSwitchClick = function () {
            if ($sortModeSwitch.attr("checked")) {
                $sortModeSwitch.removeAttr("checked");
                $(that).trigger("sortDisabled");
            }
            else {
                $sortModeSwitch.attr("checked", true);
                $(that).trigger("sortEnabled");
            }
        },

        stickyRelocate = function () {
            $(window).on("scroll", function () {
                var windowTop = $(window).scrollTop();
                var divTop = $('#sticky-anchor').offset().top;
                if (windowTop > divTop) {
                    $('#sticky').addClass('stick');
                }
                else {
                }
            });
        },

        savePlaylist = function () {
            var playlistName = $playlistNameInput.val();
            if (!playlistName)
                swal("Oops...", "Your playlist or your playlist name is empty!", "error");
            else
                $(that).trigger("savePlaylistClicked", [playlistName]);
        },

        _checkSortModeSwitch = function () {
            if ($sortModeSwitch.attr("checked"))
                $sortModeSwitch.click();
        },

        clearPlaylist = function () {
            $(that).trigger("playlistCleared");
            // $playlistSpaceFiller.show();
        };

    that._checkSortModeSwitch = _checkSortModeSwitch;
    that.init = init;

    return that;

}());
