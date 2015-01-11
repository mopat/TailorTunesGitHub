/*** Created by Patrick on 19.11.2014.*/
App.PlaylistView = (function () {
    var that = {},
        $playlistBox = null,
        $playlist = null,
        playlistItemTpl = null,
        listItemColors = [],
        $sortModeSwitch = null,
        addedPlaylists = 0,
        $blendUp = null,
        $blendDown = null,

        init = function () {
            $playlistBox = $("#playlist-box");
            $playlist = $("#playlist");
            $("")
            $sortModeSwitch = $("#sort-mode-switch");
            $blendUp = $("#blend-up");
            $blendDown = $("#blend-down");

            playlistItemTpl = _.template($("#playlist-item-tpl").html());

            listItemColors = ["#464646", "#292929"];

            $playlist.on("click", handleListItemClick);
            $playlist.on("swipeleft", swipeleftHandler);
            $sortModeSwitch.on("click", handleSortSwitchClick);

            $(window).on("scroll", function () {
                stickyRelocate();
            });
            setPlaylistIds();
            setPlaylistMarginBottomZero();
            setPlaylistMarginBottomControlsBoxHeight();
        },

        swipeleftHandler = function (event) {
            $.event.special.swipe.horizontalDistanceThreshold = 50;
            var $swipedItem = $(event.target).closest(".playlist-item");
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
            addedPlaylists++;
            for (var i in playlist) {
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
            if (addedPlaylists == 1)
                startPlaylist();

            if ($sortModeSwitch.attr("checked", true)) {
                $sortModeSwitch.click();
            }
        },

        startPlaylist = function () {
            var firstTrack = $("#playlist .playlist-item").first();
            handlePlayTrack(firstTrack);
        },

        handlePrevOrNextClicked = function (indicator) {
            var $nowPlaying = $("#playlist .now-playing");
            $nowPlaying.find(".playlist-title").css("color", "white");
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
            $nowPlaying.find(".playlist-title").css("color", "white");
            $nowPlaying.removeClass("now-playing");
            var $clickedItem = $(event.target).closest(".playlist-item");
            handlePlayTrack($clickedItem);
        },

        handlePlayTrack = function (current) {
            current.addClass("now-playing");
            var streamUrl = current.attr("data-stream-url");
            var title = current.find(".playlist-title").html();
            current.find(".playlist-title").css("color", "lightblue");
            $(that).trigger("trackPicked", [streamUrl, title]);
        },

        handleResetTrack = function (nowPlaying) {
            nowPlaying.find(".playlist-title").css("color", "lightblue");
            var streamUrl = nowPlaying.attr("data-stream-url");
            var title = nowPlaying.find(".playlist-title").html();
            $(that).trigger("trackPicked", [streamUrl, title]);
        },

        handleSortSwitchClick = function () {
            if ($sortModeSwitch.attr("checked")) {
                $sortModeSwitch.removeAttr("checked");
                removeSortable();
                $("#sticky-footer").slideDown(300);
                setPlaylistMarginBottomControlsBoxHeight();
                $blendUp.slideUp(500);
                $blendDown.slideUp(500);
            }
            else {
                $sortModeSwitch.attr("checked", true);
                addSortable();
                $playlist.disableSelection();
                $("#sticky-footer").slideUp(300);
                setPlaylistMarginBottomZero();
                if ($("#sticky").hasClass("stick"))
                    $blendUp.slideDown(500);
                $blendDown.slideDown(500);
            }
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

        addSortable = function () {
            var autoScroll;
            $playlist.sortable({
                scroll: true,
                sort: function (event, ui) {

                    var currentScrollTop = $('html, body').scrollTop(),
                        topHelper = ui.offset.top,
                        delta = topHelper - currentScrollTop;
                    $blendUp.on("hover", function () {
                        console.log("FIRTSTTRUE")

                        console.log("ENTER!!!!")
                        $('html, body').animate({scrollTop: topHelper - 50}, 300);

                    }).on("mouseleave", "div", function () {

                    });
                    $blendUp.on("hover", function () {

                        $('html, body').animate({scrollTop: topHelper + 50}, 300);
                        console.log("FIRTSTTRUE")

                    }).on("mouseleave", "div", function () {
                    });
                },
                stop: function (event, ui) {
                    setPlaylistIds();
                }
            });
        },

        removeSortable = function () {
            $playlist.sortable("destroy");

        },

        getMinutesAndSeconds = function (duration) {
            var minutes = Math.floor((duration / 1000) / 60);
            var seconds = Math.floor(duration % 60);
            if (seconds < 10)
                seconds = "0" + seconds;
            var minutesAndSeconds = minutes + ":" + seconds;
            return minutesAndSeconds;
        },

        stickyRelocate = function () {
            var windowTop = $(window).scrollTop();
            var divTop = $('#sticky-anchor').offset().top;
            if (windowTop > divTop) {
                $('#sticky').addClass('stick');
                if ($sortModeSwitch.attr("checked"))
                    $blendUp.slideDown(500);
            }
            else {
                $('#sticky').removeClass('stick');
                $blendUp.slideUp(500);
            }
        },

        setPlaylistMarginBottomControlsBoxHeight = function () {
            var controlsBoxHeight = $("#controls-box").height();
            $playlistBox.css("margin-bottom", controlsBoxHeight)
        },

        setPlaylistMarginBottomZero = function () {
            $playlistBox.css("margin-bottom", 0)
        },

        getPlaylistAsJSON = function () {
            var playlistAsJSON = [];

            $("#playlist .playlist-item").each(function () {
                var playlistNumber = $(this).attr("id");
                var imageUrl = $(this).find(".playlist-item-image").attr("src");
                var streamURL = $(this).attr("data-stream-url");
                var duration = $(this).find(".playlist-track-duration").html();
                var title = $(this).find(".playlist-title").html();

                var playlistObject = {
                    number: playlistNumber,
                    image_url: imageUrl,
                    stream_url: streamURL,
                    duration: duration,
                    title: title
                };
                playlistAsJSON.push(playlistObject);
            });
            return JSON.parse(JSON.stringify(playlistAsJSON))
        };

    that.addPlaylist = addPlaylist;
    that.handlePrevOrNextClicked = handlePrevOrNextClicked;
    that.getPlaylistAsJSON = getPlaylistAsJSON;
    that.init = init;

    return that;

}());
