/*** Created by Patrick on 19.11.2014.*/
App.PlaylistView = (function () {
    var that = {},
        $playlistBox = null,
        $playlist = null,
        playlistItemTpl = null,
        listItemColors = [],
        isPlaylistExisting = null,
        $blendUp = null,
        $blendDown = null,
        $playlistSpaceFiller = null,
        $loadingAnimation = null,
        defaultTextColor = null,
        playlistLength = 0,

        init = function () {
            $playlistBox = $("#playlist-box");
            $playlist = $("#playlist");
            isPlaylistExisting = false;

            $blendUp = $("#blend-up");
            $blendDown = $("#blend-down");

            $playlistSpaceFiller = $("#playlist-space-filler");
            $loadingAnimation = $("#spinner-loader-box");
            defaultTextColor = "#f5f5f5";

            playlistItemTpl = _.template($("#playlist-item-tpl").html());

            listItemColors = ["rgba(0,0,0,0.1)", "rgba(0,0,0,0.2)"];

            initHandler();

            setPlaylistIds();

            setupSwipeControl();

            return that;
        },

        initHandler = function () {
            $playlist.on("click", ".playlist-item-anchor", handleListItemClick);
            $playlist.on("click", ".playlist-item-delete", removeListItem);
        },

        setupSwipeControl = function () {
            $playlist.swipe({
                swipe: function (event, direction, distance, fingerCount, fingerData, duration) {
                    setupSwipeToDelete(event, direction);
                    setupSwipeToScroll(event, direction, distance);

                },
                allowPageScroll: "vertical",
                threshold: 10,
                excludedElements: "button, input, select, textarea, .noSwipe"
            }).on("touchmove", function(e){
                e.preventDefault();
            });
        },

        setupSwipeToDelete = function (event, direction) {
            if (getUserSide() == "bottom" && direction == "left")
                removeListItem(event);
            else if (getUserSide() == "left" && direction == "up")
                removeListItem(event);
            else if (getUserSide() == "top" && direction == "right")
                removeListItem(event);
            else if (getUserSide() == "right" && direction == "down")
                removeListItem(event);
        },

        setupSwipeToScroll = function (event, direction, distance) {
            if (getUserSide() == "left" && direction == "left") {
                scrollMinus(distance);
            }
            else if (getUserSide() == "left" && direction == "right") {
                scrollPlus(distance);
            }
            else if (getUserSide() == "right" && direction == "right") {
                scrollMinus(distance);
            }
            else if (getUserSide() == "right" && direction == "left") {
                scrollPlus(distance);
            }
            else if(getUserSide() == "bottom" && direction == "up"){
                scrollPlus(distance);
            }
            else if(getUserSide() == "bottom" && direction == "down"){
                scrollMinus(distance);
            }
            else if(getUserSide() == "top" && direction == "down"){
                scrollPlus(distance);
            }
            else if(getUserSide() == "top" && direction == "up"){
                scrollMinus(distance);
            }
        },


        scrollMinus = function (distance) {
            var scrollFactor = distance * 4;
            $playlist.animate({scrollTop: "-=" + scrollFactor});
        },

        scrollPlus = function (distance) {
            var scrollFactor = distance * 4;
            $playlist.animate({scrollTop: "+=" + scrollFactor });
        },

        removeListItem = function (e) {
            var $itemToRemove = $(e.target).closest(".playlist-item");

            $itemToRemove.fadeOut(200, function fadeOutComplete() {
                if ($itemToRemove.hasClass("now-playing"))
                    _playNextTrack();

                $itemToRemove.remove();
                setPlaylistIds();
                checkPlaylistLength();
            });
        },

        checkPlaylistLength = function () {
            if (playlistLength == 0) {
                isPlaylistExisting = false;
                $(that).trigger("allPlaylistItemsRemoved");
            }
        },

        _addPlaylist = function (playlist) {
            console.log("playlist", playlist)
            for (var i in playlist) {
                $playlistSpaceFiller.hide();
                var artworkUrl = playlist[i].artwork_url;
                if (artworkUrl == null)
                    artworkUrl = playlist[i].user.avatar_url;

                var duration = playlist[i].durationMinsAndSecs;
                if (duration == null)
                    duration = getMinutesAndSeconds(playlist[i].duration);

                var title = playlist[i].title,

                    streamUrl = playlist[i].stream_url,

                    playlistItem = playlistItemTpl({
                        stream_url: streamUrl,
                        artwork_url: artworkUrl,
                        title: title,
                        duration: duration
                    });
                $playlist.append(playlistItem);
            }
            setPlaylistIds();
            startPlaylist();

            isPlaylistExisting = true;
            $(that).trigger("checkSortModeSwitch");
        },

        startPlaylist = function () {
            var firstTrack = $("#playlist .playlist-item").first();
            if (!isPlaylistExisting)
                playTrack(firstTrack);
        },

        _playNextTrack = function () {
            var $nowPlaying = $("#playlist .now-playing");
            if ($("#playlist .playlist-item:last-child").hasClass("now-playing")) {
                startPlaylist();
            }
            else {
                $nowPlaying.removeClass("now-playing");
                var $nextTrack = $nowPlaying.next();
                playTrack($nextTrack);
            }
        },

        _playPreviousTrack = function () {
            var $nowPlaying = $("#playlist .now-playing");
            if ($("#playlist .playlist-item:first-child").hasClass("now-playing")) {
                handleResetTrack($nowPlaying);
            }
            else {
                var $previousTrack = $nowPlaying.prev();
                $nowPlaying.removeClass("now-playing");
                playTrack($previousTrack);
            }
        },

        playTrack = function ($track) {
            $track.addClass("now-playing");
            var streamUrl = $track.attr("data-stream-url"),
                title = $track.find(".playlist-title").html();
            $(that).trigger("trackPicked", [streamUrl, title]);
        },

        handleListItemClick = function (e) {
            e.preventDefault();
            var $nowPlaying = $("#playlist .now-playing");
            $nowPlaying.removeClass("now-playing");
            var $clickedItem = $(e.target).closest(".playlist-item");
            playTrack($clickedItem);
        },

        handleResetTrack = function (nowPlaying) {
            var streamUrl = nowPlaying.attr("data-stream-url"),
                title = nowPlaying.find(".playlist-title").html();
            $(that).trigger("trackPicked", [streamUrl, title]);
        },


        setPlaylistIds = function () {
            playlistLength = 0;
            $("#playlist .playlist-item").each(function (index) {
                playlistLength++;
                if (index % 2 == 0) {
                    $(this).css("background", listItemColors[0]);
                }
                else {
                    $(this).css("background", listItemColors[1]);
                }
                $(this).attr("id", index);
                $(this).find(".playlist-number").html(index + 1 + ".");
            });
        },

        _addSortable = function () {
            $playlist.rotatableSortable({
                contentId: "#rotatable",
                delegates: ".playlist-item",
                rotation: getRotation(),
                sortEnd: function () {
                    setPlaylistIds();
                }
            });
            return this;
        },

        _removeSortable = function () {
            $("#playlist").destroy({
                listId: "#playlist",
                delegates: ".playlist-item"
            });
            return this;
        },

        getMinutesAndSeconds = function (duration) {
            var minutes = Math.floor((duration / 1000) / 60),
                seconds = Math.floor(duration % 60);
            if (seconds < 10)
                seconds = "0" + seconds;
            var minutesAndSeconds = minutes + ":" + seconds;
            return minutesAndSeconds;
        },

        _enableSwipe = function () {
            $playlist.swipe("enable");
            console.log("ENABLE")
            return this;
        },

        _disableSwipe = function () {
            $playlist.swipe("disable");
            return this;
        },

        _getPlaylistAsJSON = function () {
            var playlistAsJSON = [];

            $("#playlist .playlist-item").each(function () {
                var playlistNumber = $(this).attr("id"),
                    imageUrl = $(this).find(".playlist-item-image").attr("src"),
                    streamURL = $(this).attr("data-stream-url"),
                    duration = $(this).find(".playlist-track-duration").html(),
                    title = $(this).find(".playlist-title").html(),

                    playlistObject = {
                        number: playlistNumber,
                        image_url: imageUrl,
                        stream_url: streamURL,
                        duration: duration,
                        title: title
                    };
                playlistAsJSON.push(playlistObject);
            });
            console.log(JSON.parse(JSON.stringify(playlistAsJSON)))
            if (playlistAsJSON.length == 0)
                return null;
            else
                return JSON.parse(JSON.stringify(playlistAsJSON))
        },


        playlistSpaceFillerClick = function (e) {
            e.preventDefault();
            $(that).trigger("playlistSpaceFillerClicked");
        },

        _clearPlaylist = function () {
            $playlist.find("li").remove();
            isPlaylistExisting = false;
            $playlistSpaceFiller.show();
        },

        hideLoadingAnimation = function () {
            $loadingAnimation.hide();
            $loadingAnimation.undim();
        },

        showLoadingAnimation = function () {
            $loadingAnimation.show();
            $loadingAnimation.dimBackground();
        },
        _isPlaylistExisting = function () {
            return isPlaylistExisting;
        };

    that._addPlaylist = _addPlaylist;
    that._playNextTrack = _playNextTrack;
    that._playPreviousTrack = _playPreviousTrack;
    that._getPlaylistAsJSON = _getPlaylistAsJSON;
    that.hideLoadingAnimation = hideLoadingAnimation;
    that.showLoadingAnimation = showLoadingAnimation;
    that._addSortable = _addSortable;
    that._removeSortable = _removeSortable;
    that._enableSwipe = _enableSwipe;
    that._disableSwipe = _disableSwipe;
    that._clearPlaylist = _clearPlaylist;
    that._isPlaylistExisting = _isPlaylistExisting;
    that.init = init;

    return that;

}());
