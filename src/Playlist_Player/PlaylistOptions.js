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
        isSortEnabled = null,

        init = function () {
            $sortModeSwitch = $("#sort-mode-switch");
            $sortSwitchBox = $("#sticky-sort-switch-box");
            $savePlaylistButton = $("#save-playlist-button");
            $playlistNameInput = $("#playlist-name-input");
            $clearPlaylistButton = $("#clear-playlist-button");

            initHandler();
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
                isSortEnabled = false;
                $(that).trigger("sortDisabled");
            }
            else {
                $sortModeSwitch.attr("checked", true);
                isSortEnabled = true;
                $(that).trigger("sortEnabled");
            }
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
        },

        _isSortEnabled = function () {
            return isSortEnabled;
        };

    that._checkSortModeSwitch = _checkSortModeSwitch;
    that._isSortEnabled = _isSortEnabled;
    that.init = init;

    return that;

}());
