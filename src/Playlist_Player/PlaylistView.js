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
        playlistSortable = null,

        init = function () {
            $playlistBox = $("#playlist-box");
            $playlist = $("#playlist");
            isPlaylistExisting = false;

            $blendUp = $("#blend-up");
            $blendDown = $("#blend-down");

            $playlistSpaceFiller = $("#playlist-space-filler");
            $loadingAnimation = $("#spinner-loader-box");
            defaultTextColor = "#222222";

            playlistItemTpl = _.template($("#playlist-item-tpl").html());

            listItemColors = ["#F6F6F5", "#FFFFFF"];

            initHandler();

            setPlaylistIds();

            setupSwipe();

            return that;
        },

        initHandler = function () {
            $playlist.on("click", handleListItemClick);
        },

        setupSwipe = function () {
            $playlist.swipe({
                swipeLeft: function (event) {
                    if (getUserSide() == "bottom")
                        swipeHandler(event);
                },
                swipeUp: function (event) {
                    if (getUserSide() == "left")
                        swipeHandler(event);
                },
                swipeRight: function (event) {
                    if (getUserSide() == "top")
                        swipeHandler(event);
                },
                swipeDown: function (event) {
                    if (getUserSide() == "right")
                        swipeHandler(event);
                },
                allowPageScroll: "vertical",
                threshold: 10,
                excludedElements: "button, input, select, textarea, .noSwipe"
            });
        },

        swipeHandler = function (e) {
            console.log("SWIPE")
            var $swipedItem = $(e.target).closest(".playlist-item").remove(),
                $nowPlaying = $("#playlist .now-playing"),
                playlistSize = $("#playlist .playlist-item").size();
            $swipedItem.fadeOut(500, fadeOutComplete);
            function fadeOutComplete() {
                if (playlistSize - 1 == 0)
                    $(that).trigger("resetPlayer");
                else if ($swipedItem.attr("id") == $nowPlaying.attr("id"))
                    handlePrevOrNextClicked("next");

                $swipedItem.remove();
                setPlaylistIds();
            };
        },

        addPlaylist = function (playlist) {
            console.log("playlist", playlist)
            isPlaylistExisting = true;
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
            $(that).trigger("checkSortModeSwitch");
        },

        startPlaylist = function () {
            var firstTrack = $("#playlist .playlist-item").first();
            if (isPlaylistExisting)
                handlePlayTrack(firstTrack);
        },

        handlePrevOrNextClicked = function (indicator) {
            var $nowPlaying = $("#playlist .now-playing");
            $nowPlaying.find(".playlist-title").css("color", defaultTextColor);
            var $nowPlayingId = parseInt($nowPlaying.attr("id")),
                playlistSize = $("#playlist .playlist-item").size();

            if ($nowPlayingId < playlistSize - 1 && indicator == "next") {
                var $nextTrack = $nowPlaying.next();
                $nowPlaying.removeClass("now-playing");
                handlePlayTrack($nextTrack);
            }
            else if ($nowPlayingId > 0 && indicator == "previous") {
                var $previousTrack = $nowPlaying.prev();
                $nowPlaying.removeClass("now-playing");
                handlePlayTrack($previousTrack);
            }
            else if ($nowPlayingId == playlistSize - 1 && indicator == "next") {
                $nowPlaying.removeClass("now-playing");
                startPlaylist();
            }
            else {
                handleResetTrack($nowPlaying);
            }
        },

        handleListItemClick = function (e) {
            e.preventDefault();
            var $nowPlaying = $("#playlist .now-playing");
            $nowPlaying.find(".playlist-title").css("color", defaultTextColor);
            $nowPlaying.removeClass("now-playing");
            var $clickedItem = $(e.target).closest(".playlist-item");
            handlePlayTrack($clickedItem);
        },

        handlePlayTrack = function (current) {
            current.addClass("now-playing");
            var streamUrl = current.attr("data-stream-url"),
                title = current.find(".playlist-title").html();
            $(that).trigger("trackPicked", [streamUrl, title]);
        },

        handleResetTrack = function (nowPlaying) {
            var streamUrl = nowPlaying.attr("data-stream-url"),
                title = nowPlaying.find(".playlist-title").html();
            $(that).trigger("trackPicked", [streamUrl, title]);
        },


        setPlaylistIds = function () {
            $("#playlist .playlist-item").each(function (index) {
                if (index % 2 == 0) {
                    $(this).css("background-color", listItemColors[0]);
                }
                else {
                    $(this).css("background-color", listItemColors[1]);
                }
                $(this).attr("id", index);
                $(this).find(".playlist-number").html(index + 1 + ".");
            });
        },

        _addSortable = function () {
            var playlist = document.getElementById('playlist');
            $blendUp.slideDown(500);
            $blendDown.slideDown(500);
            $blendUp.on("mouseover", function () {
                console.log("HOVER")
                $playlistBox.animate({scrollTop: $playlistBox.scrollTop() + 100}, 300);

            });
            $blendDown.on("hover", function () {
                $playlistBox.animate({scrollTop: -50}, 300);
            });
            playlistSortable = new Sortable(playlist, {
                sort: true,
                ghostClass: "ghost",
                animation: 150,
                onStart: function (e) {
                    $(".playlist-item").each(function (index) {
                        if ($(this).attr("draggable") == "true") {
                            console.log($(this))
                        }
                    });
                },
                onEnd: function (e) {
                    setPlaylistIds();
                    $(that).trigger("fullPlaylistHeight")
                }
            });
            return this;
        },

        _removeSortable = function () {
            $blendUp.slideUp(500);
            $blendDown.slideUp(500);
            playlistSortable.destroy();
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

    that.addPlaylist = addPlaylist;
    that.handlePrevOrNextClicked = handlePrevOrNextClicked;
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
