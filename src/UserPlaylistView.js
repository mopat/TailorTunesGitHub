/**
 * Created by Patrick on 02.01.2015.
 */
App.UserPlaylistView = (function () {
    var that = {},
        sc_client_id = "23a3031c7cd251c7c217ca127777e48b",
        $userPlaylistBox = null,
        userPlaylistTpl = null,
        userPlaylistItemTpl = null,
        $userPlaylistModal = null,
        $userPlaylisBox = null,
        listItemColors = null,
        preview = new Audio(),
        $playlistContainerToDelete = null,


        init = function () {
            listItemColors = ["#464646", "#292929"];
            $userPlaylistBox = $("#user-playlist-box");
            userPlaylistTpl = _.template($("#user-playlist-tpl").html());

            userPlaylistItemTpl = _.template($("#user-playlist-item-tpl").html());

            $userPlaylistModal = $("#user-playlist-modal");
            $userPlaylisBox = $("#user-playlist-box");

            $userPlaylistModal.on("close", handleUserPlaylistModalClosed);

            $userPlaylisBox.on("click", ".load-playlist", handleLoadPlaylist);
            $userPlaylisBox.on("swipeleft", ".user-playlist-item", swipeleftHandler);
            $userPlaylisBox.on("click", ".open-icon", handleOpenPlaylist);
            $userPlaylisBox.on("click", ".trash-icon", handleDeletePlaylistClicked);
            $userPlaylisBox.on("click", ".close-icon", handleClosePlaylist);
            $userPlaylisBox.on("click", ".user-playlist-item", handleListItemClick);
            $userPlaylisBox.on("click", ".stop-icon", handleStopIconClick);
        },

        setUserPlaylistView = function (playlistTitle, date, length, playlistId, JSONPlaylist) {
            var playlistHeaderItem = userPlaylistTpl({
                playlist_id: playlistId,
                title: playlistTitle,
                date: date,
                length: length
            });
            $userPlaylistBox.append(playlistHeaderItem);

            for (var j in JSONPlaylist) {
                var JSONItem = JSONPlaylist[j];
                var number = JSONItem.number;
                var imageUrl = JSONItem.image_url;
                var duration = JSONItem.duration;
                var songTitle = JSONItem.title;
                var streamUrl = JSONItem.stream_url;

                var playlistItem = userPlaylistItemTpl({
                    stream_url: streamUrl,
                    artwork_url: imageUrl,
                    title: songTitle,
                    duration: duration,
                    playlist_number: number
                });
                $("#" + playlistId).append(playlistItem);
            }
            setPlaylistIds();
            //openUserPlaylistModal();
        },

        setPlaylistIds = function () {
            $(".user-playlist-item").each(function (index) {
                if (index % 2 == 0) {
                    $(this).css("background-color", listItemColors[0]);
                }
                else {
                    $(this).css("background-color", listItemColors[1]);
                }
                $(this).attr("id", index);
                $(this).find(".user-playlist-number").html(index + 1 + ".");
            });
        },

        openUserPlaylistModal = function () {
            $userPlaylistModal.foundation('reveal', 'open');
        },

        emptyUserPlaylistModal = function () {
            $userPlaylistBox.empty();
        },

        handleUserPlaylistModalClosed = function () {
            preview.pause();
            preview.currentTime = 0;
            $(that).trigger("previewPlayingStop");
        },

        handleLoadPlaylist = function (event) {
            //playlist in playlistview laden
            var $userPlaylist = $(event.target).parent().parent().parent().find(".user-playlist");
            if ($userPlaylist.hasClass("loaded") == false) {
                $userPlaylist.addClass("loading");
                var loadedPlaylist = [];
                $(".loading .user-playlist-item").each(function () {
                    var streamUrl = $(this).attr("data-stream-url");
                    var title = $(this).find(".user-playlist-title").html();
                    var artworkUrl = $(this).find(".user-playlist-item-image").attr("src");
                    var duration = $(this).find(".user-playlist-track-duration").html();
                    var playlistObject = {
                        stream_url: streamUrl,
                        title: title,
                        artwork_url: artworkUrl,
                        durationMinsAndSecs: duration
                    };
                    loadedPlaylist.push(playlistObject);
                });
                $userPlaylist.switchClass("loading", "loaded");
                $(that).trigger("userPlaylistLoaded", [loadedPlaylist]);
            }
        },

        handleListItemClick = function (event) {
            event.preventDefault();
            var $clickedItem = $(event.target).closest(".user-playlist-item");
            $(".preview-playing").removeClass("preview-playing");
            $clickedItem.addClass("preview-playing");
            var streamUrl = $clickedItem.attr("data-stream-url");

            preview.src = streamUrl + "?client_id=" + sc_client_id;
            preview.play();
            $clickedItem.addClass("preview-playing");
            $(that).trigger("previewPlayingStart");
            $(".stop-icon").show(0);
        },


        swipeleftHandler = function (event) {
            $.event.special.swipe.horizontalDistanceThreshold = 50;
            var $swipedItem = $(event.target).closest(".user-playlist-item");
            $swipedItem.fadeOut(500, fadeOutComplete);
            function fadeOutComplete() {
                $swipedItem.remove();
            }
        },

        handleOpenPlaylist = function (event) {
            $(this).parents(".user-playlist-container").find(".user-playlist").slideDown(300);
        },

        handleClosePlaylist = function (event) {
            $(this).parents(".user-playlist-container").find(".user-playlist").slideUp(300);
        },

        handleStopIconClick = function () {
            preview.pause();
            preview.currentTime = 0;
            $(".stop-icon").hide();
            $(".preview-playing").removeClass("preview-playing");
        },

        handleDeletePlaylistClicked = function () {
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

        removeUserPlaylist = function () {
            if ($playlistContainerToDelete != null) {
                $playlistContainerToDelete.remove();
                $playlistContainerToDelete = null;
            }
        };


    that.setUserPlaylistView = setUserPlaylistView;
    that.openUserPlaylistModal = openUserPlaylistModal;
    that.emptyUserPlaylistModal = emptyUserPlaylistModal;
    that.removeUserPlaylist = removeUserPlaylist;
    that.init = init;

    return that;

}());
