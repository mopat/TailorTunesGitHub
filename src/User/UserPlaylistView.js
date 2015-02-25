/**
 * Created by Patrick on 02.01.2015.
 */
App.UserPlaylistView = (function () {
    var that = {},
        $userPlaylistBox = null,
        userPlaylistTpl = null,
        userPlaylistItemTpl = null,
        $userPlaylistModal = null,
        $userPlaylisBox = null,
        listItemColors = null,
        preview = new Audio(),
        $playlistContainerToDelete = null,
        defaultTextColor = null,


        init = function () {
            listItemColors = ["rgba(0,0,0,0.1)", "rgba(0,0,0,0.2)"];
            defaultTextColor = "#f5f5f5";
            $userPlaylistBox = $("#user-playlist-box");
            userPlaylistTpl = _.template($("#user-playlist-tpl").html());

            userPlaylistItemTpl = _.template($("#user-playlist-item-tpl").html());

            $userPlaylistModal = $("#user-playlist-modal");
            $userPlaylisBox = $("#user-playlist-box");

            initHandler();

            setupSwipe();

            return that;
        },

        initHandler = function () {
            $userPlaylistModal.on("close", handleUserPlaylistModalClosed);

            $userPlaylisBox.on("click", ".load-playlist", handleLoadPlaylist);
            $userPlaylisBox.on("click", ".open-icon", handleOpenPlaylist);
            $userPlaylisBox.on("click", ".trash-icon", handleDeletePlaylistClicked);
            $userPlaylisBox.on("click", ".close-icon", handleClosePlaylist);
            $userPlaylisBox.on("click", ".user-playlist-item-anchor", handleListItemClick);
            $userPlaylisBox.on("click", ".user-playlist-item-delete", removeListItem);
            $userPlaylisBox.on("click", ".stop-icon", handleStopIconClick);
        },

        setupSwipe = function () {
            $userPlaylisBox.swipe({
                swipeLeft: function (event) {
                    if (getUserSide() == "bottom")
                        removeListItem(event);
                },
                swipeUp: function (event) {
                    if (getUserSide() == "left")
                        removeListItem(event);
                },
                swipeRight: function (event) {
                    if (getUserSide() == "top")
                        removeListItem(event);
                },
                swipeDown: function (event) {
                    if (getUserSide() == "right")
                        removeListItem(event);
                },
                allowPageScroll: "vertical",
                threshold: 10,
                excludedElements: "button, input, select, textarea, .noSwipe"
            });
        },

        _setUserPlaylistView = function (userPlaylistObj) {
            //create Header
            var playlistHeaderItem = userPlaylistTpl({
                playlist_id: userPlaylistObj.playlistId,
                title: userPlaylistObj.palylistTitle,
                date: userPlaylistObj.date,
                length: userPlaylistObj.length
            });
            $userPlaylistBox.append(playlistHeaderItem);

            //create list
            var JSONPlaylist = userPlaylistObj.JSONPlaylist;
            for (var j in JSONPlaylist) {
                var JSONItem = JSONPlaylist[j],

                    playlistItem = userPlaylistItemTpl({
                        stream_url: JSONItem.stream_url,
                        artwork_url: JSONItem.image_url,
                        title: JSONItem.title,
                        duration: JSONItem.duration,
                        playlist_number: JSONItem.number
                });
                $("#" + userPlaylistObj.playlistId).append(playlistItem);
            }
            setPlaylistIds();
        },

        setPlaylistIds = function () {
            $(".user-playlist-item").each(function (index) {
                if (index % 2 == 0) {
                    $(this).css("background", listItemColors[0]);
                }
                else {
                    $(this).css("background", listItemColors[1]);
                }
                $(this).attr("id", index);
                $(this).find(".user-playlist-number").html(index + 1 + ".");
            });
        },

        _openUserPlaylistModal = function () {
            $userPlaylistModal.foundation('reveal', 'open');
        },

        _emptyUserPlaylistModal = function () {
            $userPlaylistBox.empty();
        },

        handleUserPlaylistModalClosed = function () {
            if (preview.currentTime != 0 || preview == null) {
                preview.pause();
                preview.currentTime = 0;
                $(that).trigger("previewPlayingStop");
            }
        },

        handleLoadPlaylist = function (e) {
            e.preventDefault();
            //playlist in playlistview laden
            var $userPlaylist = $(this).parents(".user-playlist-container").find(".user-playlist");
            if ($userPlaylist.hasClass("loaded") == false) {
                $userPlaylist.addClass("loading");
                var loadedPlaylist = [];
                $(".loading .user-playlist-item").each(function () {
                    var streamUrl = $(this).attr("data-stream-url"),
                        title = $(this).find(".user-playlist-title").html(),
                        artworkUrl = $(this).find(".user-playlist-item-image").attr("src"),
                        duration = $(this).find(".user-playlist-track-duration").html(),
                        playlistObject = {
                        stream_url: streamUrl,
                        title: title,
                        artwork_url: artworkUrl,
                        durationMinsAndSecs: duration
                    };
                    loadedPlaylist.push(playlistObject);
                });
                $userPlaylist.switchClass("loading", "loaded");
                $(this).html("LOADED");
                $(that).trigger("userPlaylistLoaded", [loadedPlaylist]);
            }
        },

        handleListItemClick = function (e) {
            e.preventDefault();
            var $clickedItem = $(e.target).closest(".user-playlist-item");
            $(".preview-playing").removeClass("preview-playing");
            $clickedItem.addClass("preview-playing");
            var streamUrl = $clickedItem.attr("data-stream-url");

            preview.src = streamUrl + "?client_id=" + SC_CLIENT_ID;
            preview.play();
            $clickedItem.addClass("preview-playing");
            $(that).trigger("previewPlayingStart");
            $(".stop-icon").show();
        },


        removeListItem = function (e) {
            console.log("SWIPE")

            var $itemToRemove = $(e.target).closest(".user-playlist-item");
            $itemToRemove.fadeOut(500, function () {
                $itemToRemove.remove();
                setPlaylistIds();
            });
        },

        handleOpenPlaylist = function (e) {
            e.preventDefault();
            $(that).trigger("resizeUserPlaylistHeight");
            $(".user-playlist-header").hide();
            $(this).parents(".user-playlist-container").find(".user-playlist-header").show();
            $(this).parents(".user-playlist-container").find(".user-playlist").slideDown(300);
            $(".open-icon").hide();
            $(".close-icon").show();
        },

        handleClosePlaylist = function (e) {
            e.preventDefault();
            $(".user-playlist-header").show();
            $(this).parents(".user-playlist-container").find(".user-playlist").slideUp(300);
            $(".close-icon").hide();
            $(".open-icon").show();
        },

        handleStopIconClick = function (e) {
            e.preventDefault();
            preview.pause();
            preview.currentTime = 0;
            $(".stop-icon").hide();
            $(".preview-playing").removeClass("preview-playing");
        },

        handleDeletePlaylistClicked = function (e) {
            e.preventDefault();
            $playlistContainerToDelete = $(this).parents(".user-playlist-container");
            var playlistId = $playlistContainerToDelete.find(".user-playlist").attr("id");
            swal({
                title: "Are you sure you want to delete this playlist?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {
                $(that).trigger("deleteUserPlaylist", [playlistId]);
            });
        },

        _removeUserPlaylist = function (e) {
            e.preventDefault();
            if ($playlistContainerToDelete != null) {
                $playlistContainerToDelete.remove();
                $playlistContainerToDelete = null;
            }
        },

        _removeLoadedStatus = function () {
            $(".loaded").removeClass("loaded");
            $(".load-playlist").html("LOAD");
        };


    that._setUserPlaylistView = _setUserPlaylistView;
    that._openUserPlaylistModal = _openUserPlaylistModal;
    that._emptyUserPlaylistModal = _emptyUserPlaylistModal;
    that._removeUserPlaylist = _removeUserPlaylist;
    that._removeLoadedStatus = _removeLoadedStatus;
    that.init = init;

    return that;

}());
