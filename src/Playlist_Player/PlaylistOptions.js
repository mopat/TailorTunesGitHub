/**
 * Created by Patrick on 19.01.2015.
 */
App.PlaylistOptions = (function () {
    var that = {},
        $optionsBox = null,
        $sortModeSwitch = null,
        $sortSwitchBox = null,
        $savePlaylistButton = null,
        $postPlaylistBox = null,
        $postPlaylistButton = null,
        $playlistNameInput = null,
        $clearPlaylistButton = null,
        isSortEnabled = null,
        $cancelPostPlaylistButton = null,
        $postSaveButtonBox = null,
        isPlaylistExisting = false,

        init = function () {
            $optionsBox = $("#options-box");
            $sortModeSwitch = $("#sort-mode-switch");
            $sortSwitchBox = $("#sticky-sort-switch-box");
            $savePlaylistButton = $("#save-playlist-button");
            $playlistNameInput = $("#playlist-name-input");
            $clearPlaylistButton = $("#clear-playlist-button");
            $postPlaylistButton = $("#post-playlist-button");
            $postPlaylistBox = $("#post-playlist-box");
            $cancelPostPlaylistButton = $("#cancel-post-playlist-button");
            $postSaveButtonBox = $("#post-save-button-box");

            initHandler();
            _checkSortModeSwitch();
            return that;
        },

        initHandler = function () {
            $sortModeSwitch.on("click", handleSortSwitchClick);

            $savePlaylistButton.on("click", savePlaylist);
            $clearPlaylistButton.on("click", clearPlaylist);

            $postPlaylistButton.on("click", postPlaylist);
            $cancelPostPlaylistButton.on("click", cancelPostPlaylist);
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
            $postPlaylistBox.fadeIn(300);
            $clearPlaylistButton.hide();
            $savePlaylistButton.hide();
            $(that).trigger("postPlaylistClicked");
        },

        postPlaylist = function () {
            var playlistName = $playlistNameInput.val();
            if (!playlistName || !isPlaylistExisting)
                swal("Oops...", "Your playlist or your playlist name is empty!", "error");
            else {
                $(that).trigger("savePlaylistClicked", [playlistName]);
                $postPlaylistBox.hide();
                $clearPlaylistButton.fadeIn(300);
                $savePlaylistButton.fadeIn(300);
            }
        },

        cancelPostPlaylist = function () {
            $postPlaylistBox.hide();
            $clearPlaylistButton.fadeIn(300);
            $savePlaylistButton.fadeIn(300);
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
        },

        _setIsPlaylistExisting = function (isExisting) {
            isPlaylistExisting = isExisting;
            if (isPlaylistExisting) {
                $clearPlaylistButton.fadeIn(300);
                $savePlaylistButton.fadeIn(300);
            }
            else {
                $clearPlaylistButton.fadeOut(300);
                $savePlaylistButton.fadeOut(300);
            }
        },

        _hideOptionsBox = function () {
            $optionsBox.hide();

            return this;
        },

        _showOptionsBox = function () {
            $optionsBox.show();

            return this;
        };

    that._checkSortModeSwitch = _checkSortModeSwitch;
    that._isSortEnabled = _isSortEnabled;
    that._setIsPlaylistExisting = _setIsPlaylistExisting;
    that._hideOptionsBox = _hideOptionsBox;
    that._showOptionsBox = _showOptionsBox;
    that.init = init;

    return that;

}());
