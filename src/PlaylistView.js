/*** Created by Patrick on 19.11.2014.*/
App.PlaylistView = (function () {
    var that = {},
        $playlistBox = null,
        $playlist = null,
        listItemColors = [],
        $sortModeSwitch = null,
        firstAppearedElementOnScreen = null,
        lastAppearedElementOnScreen = null,
        beforeLastAppearedOnscreen = null,
        completePlaylist = [],
        addedPlaylists = 0,

        init = function () {
            $playlistBox = $("#playlist-box");
            $playlist = $("#playlist");
            $sortModeSwitch = $("#sort-mode-switch");

            listItemColors = ["#464646", "#292929"];

            $playlist.on("click", handleListItemClick);
            $playlist.on("swipeleft", swipeleftHandler);
            $sortModeSwitch.on("click", handleSortSwitchClick);

            $(window).on("scroll", function () {
                setFirstAppearedElementOnScreen();
                setLastAppearedElementOnScreen();
                setBeforeLastAppearedElementOnScreen();
                stickyRelocate();

            });
            setPlaylistIds();
            setPlaylistMarginBottomZero();
            setPlaylistMarginBottomControlsBoxHeight();
        },

        swipeleftHandler = function (event) {
            var $swipedItem = $(event.target).closest(".playlist-item");
            var $nowPlaying = $("#playlist .now-playing");

            if($swipedItem.attr("id") == $nowPlaying.attr("id"))
                handlePrevOrNextClicked("next");

            $swipedItem.fadeOut(500, fadeOutComplete);
            function fadeOutComplete(){
                $swipedItem.remove();
                setPlaylistIds();
            };
        },


        addPlaylistItem = function (playlist) {
            addedPlaylists++;
            completePlaylist.push.apply(completePlaylist, playlist);
            for (var i = 0; i < playlist.length; i++) {

                var artworkUrl = playlist[i].artwork_url;
                if (artworkUrl == null)
                    artworkUrl = playlist[i].user.avatar_url;
                var title = playlist[i].title;
                var duration = playlist[i].duration;
                //var permalinkUrl = playlist[i].permalink_url;
                var streamUrl = playlist[i].stream_url;

                var anchor = $('<a>');

                //anchor.attr("href", permalinkUrl);
                anchor.attr("href", "#");
                //   anchor.attr("target", "_blank");

                var listItem = $("<li class='playlist-item'>");
                listItem.attr("data-stream-url", streamUrl);
                // $(listItem).html("<span class='playlist-title>" + title + "</span>");

                var listImg = $("<img class='playlist-item-image'>");
                listImg.attr("src", artworkUrl);

                anchor.append($("<span class='playlist-number'>").html(i + 1 + "."));
                anchor.append(listImg);
                anchor.append($("<span class='playlist-track-duration'>").html(getMinutesAndSeconds(duration)));
                anchor.append($("<span class='playlist-title'>").html(title));
                listItem.append(anchor);
                var centerContainer = $("<div class='center-container'>");

                $playlist.append(listItem);
                $playlistBox.append($playlist);
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
            current.find(".playlist-title").css("color", "lightblue")
            $(that).trigger("trackPicked", [streamUrl, title]);
        },

        handleResetTrack = function (nowPlaying) {
            nowPlaying.find(".playlist-title").css("color", "lightblue")
            var streamUrl = nowPlaying.attr("data-stream-url");
            var title = nowPlaying.find(".playlist-title").html();
            $(that).trigger("trackPicked", [streamUrl, title]);
        },

        handleSortSwitchClick = function () {
            if ($sortModeSwitch.attr("checked")) {
                $sortModeSwitch.removeAttr("checked");
                removeSortable();
                $("#sticky-footer").fadeIn(0);
                setPlaylistMarginBottomControlsBoxHeight();
            }
            else {
                $sortModeSwitch.attr("checked", true);
                addSortable();
                $playlist.disableSelection();
                $("#sticky-footer").fadeOut(500);
                setPlaylistMarginBottomZero();
            }
        },

        setFirstAppearedElementOnScreen = function () {
            jQuery.fn.reverse = [].reverse;
            $("#playlist .playlist-item").reverse().each(function () {
                if ($(this).visible()) {
                    //  console.log("first", $(this).offset().top);
                    firstAppearedElementOnScreen = $(this).offset().top + $(this).height();
                }
            });
        },

        setLastAppearedElementOnScreen = function () {
            $("#playlist .playlist-item").each(function () {
                if ($(this).visible()) {
                    // console.log("last" , $(this).offset().top);
                    lastAppearedElementOnScreen = $(this).offset().top;
                }
            });
        },
        setBeforeLastAppearedElementOnScreen = function () {
            $("#playlist .playlist-item").each(function (index) {
                if ($(this).visible() && index == 1) {
                    // console.log("last" , $(this).offset().top);
                    beforeLastAppearedOnscreen = $(this).offset().top;
                }
            });
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
                    //console.log("first", firstAppearedElementOnScreen)
                    // console.log("last", lastAppearedElementOnScreen)
                    console.log("topHelper", topHelper)
                    setFirstAppearedElementOnScreen();
                    setLastAppearedElementOnScreen();
                    setBeforeLastAppearedElementOnScreen();
                    if ((topHelper > lastAppearedElementOnScreen - 20)) {
                        $('html, body').animate({scrollTop: lastAppearedElementOnScreen + 10}, 100);
                        console.log("LASTTRUE")
                    }

                    if (topHelper < firstAppearedElementOnScreen) {
                        $('html, body').animate({scrollTop: beforeLastAppearedOnscreen - 100}, 300);
                        console.log("FIRTSTTRUE")
                    }
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
            } else {
                $('#sticky').removeClass('stick');
            }
        },

        setPlaylistMarginBottomControlsBoxHeight = function () {
            var controlsBoxHeight = $("#controls-box").height();
            $playlistBox.css("margin-bottom", controlsBoxHeight)
        },

        setPlaylistMarginBottomZero = function () {
            $playlistBox.css("margin-bottom", 0)
        };


    that.addPlaylistItem = addPlaylistItem;
    that.handlePrevOrNextClicked = handlePrevOrNextClicked;
    that.init = init;

    return that;

}());
