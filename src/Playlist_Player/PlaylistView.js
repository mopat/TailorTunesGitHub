/*** Created by Patrick on 19.11.2014.*/
App.PlaylistView = (function () {
    var that = {},
        $playlistBox = null,
        $playlist = null,
        playlistItemTpl = null,
        listItemColors = [],
        $sortSwitchBox = null,
        $sortModeSwitch = null,
        isPlaylistExisting = null,
        $blendUp = null,
        $blendDown = null,
        $stickyFooter = null,
        $savePlaylistButton = null,
        $playlistNameInput = null,
        $clearPlaylistButton = null,
        $playlistSpaceFiller = null,
        $loadingAnimation = null,
        defaultTextColor = null,
        playlistSortable = null,

        init = function () {
            $playlistBox = $("#playlist-box");
            $playlist = $("#playlist");
            isPlaylistExisting = false;
            $stickyFooter = $("#sticky-footer");


            $blendUp = $("#blend-up");
            $blendDown = $("#blend-down");

            $playlistSpaceFiller = $("#playlist-space-filler");
            $loadingAnimation = $("#spinner-loader-box");
            defaultTextColor = "#222222";

            playlistItemTpl = _.template($("#playlist-item-tpl").html());

            listItemColors = ["#F6F6F5", "#FFFFFF"];

            initHandler();

            setPlaylistIds();
            _resizePlaylistHeight();

            setupSwipe();

            return that;
        },

        initHandler = function () {
            $playlist.on("click", handleListItemClick);


        },

        setupSwipe = function () {
            $playlist.swipe({
                swipeUp: function (event, direction, distance, duration, fingerCount, fingerData) {
                    if (getRotation() == 90)
                        swipeHandler(event);
                },
                swipeRight: function (event, direction, distance, duration, fingerCount, fingerData) {
                    if (getRotation() == 180)
                        swipeHandler(event);
                },
                swipeDown: function (event, direction, distance, duration, fingerCount, fingerData) {
                    if (getRotation() == -90)
                        swipeHandler(event);
                },

                swipeLeft: function (event, direction, distance, duration, fingerCount, fingerData) {
                    if (getRotation() == 360)
                        swipeHandler(event);
                },
                allowPageScroll: "vertical",
                threshold: 10,
                excludedElements: "button, input, select, textarea, .noSwipe"
            });
        },

        swipeHandler = function (event) {
            var $swipedItem = $(event.target).closest(".playlist-item").remove();
            var $nowPlaying = $("#playlist .now-playing");
            var playlistSize = $("#playlist .playlist-item").size();
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
                $playlistSpaceFiller.hide(0);
                var artworkUrl = playlist[i].artwork_url;
                if (artworkUrl == null)
                    artworkUrl = playlist[i].user.avatar_url;

                var duration = playlist[i].durationMinsAndSecs;
                if (duration == null)
                    duration = getMinutesAndSeconds(playlist[i].duration);

                var title = playlist[i].title;

                var streamUrl = playlist[i].stream_url;

                var playlistItem = playlistItemTpl({
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
            var $nowPlayingId = parseInt($nowPlaying.attr("id"));
            var playlistSize = $("#playlist .playlist-item").size();

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

        handleListItemClick = function (event) {
            event.preventDefault();
            var $nowPlaying = $("#playlist .now-playing");
            $nowPlaying.find(".playlist-title").css("color", defaultTextColor);
            $nowPlaying.removeClass("now-playing");
            var $clickedItem = $(event.target).closest(".playlist-item");
            handlePlayTrack($clickedItem);
        },

        handlePlayTrack = function (current) {
            current.addClass("now-playing");
            var streamUrl = current.attr("data-stream-url");
            var title = current.find(".playlist-title").html();
            $(that).trigger("trackPicked", [streamUrl, title]);
        },

        handleResetTrack = function (nowPlaying) {
            var streamUrl = nowPlaying.attr("data-stream-url");
            var title = nowPlaying.find(".playlist-title").html();
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
                onStart: function (evt) {
                    $(".playlist-item").each(function (index) {
                        if ($(this).attr("draggable") == "true") {


                            console.log($(this))
                        }

                    });
                },
                onEnd: function (evt) {
                    setPlaylistIds();
                    _fullPlaylistHeight();
                }
            });
        },

        _removeSortable = function () {
            playlistSortable.destroy();
            _resizePlaylistHeight();
        },

        getMinutesAndSeconds = function (duration) {
            var minutes = Math.floor((duration / 1000) / 60);
            var seconds = Math.floor(duration % 60);
            if (seconds < 10)
                seconds = "0" + seconds;
            var minutesAndSeconds = minutes + ":" + seconds;
            return minutesAndSeconds;
        },

        _fullPlaylistHeight = function () {
            var distance = $(document).height() - $("#header").height() - $('#sticky-sort-switch-box').height()
            $playlist.css("height", distance);
        },

        _resizePlaylistHeight = function () {
            var distance = $(document).height() - $("#header").height() - $("#controls-box").height() - $('#sticky-sort-switch-box').height();
            $playlist.css("height", distance);
        },

        _enableSwipe = function () {
            $playlist.swipe("enable");
            $stickyFooter.slideDown(300);
        },

        _disableSwipe = function () {
            $playlist.swipe("disable");
            $stickyFooter.slideUp(300);
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
            return JSON.parse(JSON.stringify(playlistAsJSON))
        },


        playlistSpaceFillerClick = function (e) {
            e.preventDefault();
            $(that).trigger("playlistSpaceFillerClicked");
        },

        _clearPlaylist = function () {
            $playlist.find("li").remove();
        },

        hideLoadingAnimation = function () {
            $loadingAnimation.hide();
            $loadingAnimation.undim();
        },

        showLoadingAnimation = function () {
            $loadingAnimation.show();
            $loadingAnimation.dimBackground();
        };

    that.addPlaylist = addPlaylist;
    that.handlePrevOrNextClicked = handlePrevOrNextClicked;
    that._getPlaylistAsJSON = _getPlaylistAsJSON;
    that.hideLoadingAnimation = hideLoadingAnimation;
    that.showLoadingAnimation = showLoadingAnimation;
    that._resizePlaylistHeight = _resizePlaylistHeight;
    that._fullPlaylistHeight = _fullPlaylistHeight;
    that._addSortable = _addSortable;
    that._removeSortable = _removeSortable;
    that._enableSwipe = _enableSwipe;
    that._disableSwipe = _disableSwipe;
    that._clearPlaylist = _clearPlaylist;
    that.init = init;

    return that;

}());
