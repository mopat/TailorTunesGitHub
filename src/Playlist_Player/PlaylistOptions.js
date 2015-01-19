/**
 * Created by Patrick on 19.01.2015.
 */
App.PlaylistOptions = (function () {
    var that = {},
        $sortModeSwitch = null,
        init = function () {
            $sortModeSwitch = $("#sort-mode-switch");
            $sortSwitchBox = $("#sticky-sort-switch-box");
            $savePlaylistButton = $("#save-playlist-button");
            $playlistNameInput = $("#playlist-name-input");
            $clearPlaylistButton = $("#clear-playlist-button");
            $sortModeSwitch.on("click", handleSortSwitchClick);


            $savePlaylistButton.on("click", savePlaylist);
            $clearPlaylistButton.on("click", clearPlaylist);
            stickyRelocate();
            _checkSortModeSwitch();
            return that;
        },

        handleSortSwitchClick = function () {
            $(that).trigger("sortSwitchChanged", [$sortModeSwitch.attr("checked")]);
            if ($sortModeSwitch.attr("checked")) {
                $sortModeSwitch.removeAttr("checked");


                //$blendUp.slideUp(500);
                //$blendDown.slideUp(500);

                $(that).trigger("sortEnabled");
            }
            else {
                $sortModeSwitch.attr("checked", true);


                // $blendUp.slideDown(500);
                //$blendDown.slideDown(500);

                $(that).trigger("sortDisabled");
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
            if (!playlistName || getPlaylistAsJSON().length == 0)
                swal("Oops...", "Your playlist or your playlist name is empty!", "error");
            else
                $(that).trigger("savePlaylistClicked", [getPlaylistAsJSON(), $playlistNameInput.val()]);
        },

        _checkSortModeSwitch = function () {
            if ($sortModeSwitch.attr("checked"))
                $sortModeSwitch.click();
        },

        clearPlaylist = function () {
            isPlaylistExisting = false;

            $(that).trigger("playlistCleared");
            // $playlistSpaceFiller.show();
        };

    that._checkSortModeSwitch = _checkSortModeSwitch;
    that.init = init;

    return that;

}());
