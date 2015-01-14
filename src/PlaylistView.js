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

        init = function () {
            $playlistBox = $("#playlist-box");
            $playlist = $("#playlist");
            isPlaylistExisting = false;
            $stickyFooter = $("#sticky-footer");
            $sortSwitchBox = $("#sticky-sort-switch-box");
            $sortModeSwitch = $("#sort-mode-switch");
            $savePlaylistButton = $("#save-playlist-button");
            $playlistNameInput = $("#playlist-name-input");
            $blendUp = $("#blend-up");
            $blendDown = $("#blend-down");
            $clearPlaylistButton = $("#clear-playlist-button");
            $playlistSpaceFiller = $("#playlist-space-filler");
            $loadingAnimation = $("#spinner-loader-box");
            defaultTextColor = "#222222";

            playlistItemTpl = _.template($("#playlist-item-tpl").html());

            listItemColors = ["#F6F6F5", "#FFFFFF"];

            $playlist.on("click", handleListItemClick);
            $playlist.on("swipeleft", swipeleftHandler);
            $sortModeSwitch.on("click", handleSortSwitchClick);
            $savePlaylistButton.on("click", savePlaylist);
            $clearPlaylistButton.on("click", clearPlaylist);
            $playlistSpaceFiller.on("click", playlistSpaceFillerClick);

            setPlaylistIds();
            setPlaylistMarginBottomZero();
            setPlaylistMarginBottomControlsBoxHeight();
            fillPlaylistHeight();
            stickyRelocate();
        },

        fillPlaylistHeight = function () {
            var distance = $('#controls-box').offset().top - $('#sticky-sort-switch-box').offset().top;
            $playlist.css("min-height", (distance - $sortSwitchBox.height() - 1));
        },

        swipeleftHandler = function (event) {
            $.event.special.swipe.horizontalDistanceThreshold = 50;
            var $swipedItem = $(event.target).closest(".playlist-item");
            console.log($swipedItem)
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
            checkSortModeSwitch();
        },

        startPlaylist = function () {
            var firstTrack = $("#playlist .playlist-item").first();
            if (isPlaylistExisting)
                handlePlayTrack(firstTrack);
        },

        checkSortModeSwitch = function () {
            if ($sortModeSwitch.attr("checked"))
                $sortModeSwitch.click();
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

        handleSortSwitchClick = function () {
            if ($sortModeSwitch.attr("checked")) {
                $sortModeSwitch.removeAttr("checked");
                removeSortable();
                $stickyFooter.slideDown(300);
                setPlaylistMarginBottomControlsBoxHeight();
                $blendUp.slideUp(500);
                $blendDown.slideUp(500);
            }
            else {
                $sortModeSwitch.attr("checked", true);
                addSortable();
                $playlist.disableSelection();
                $stickyFooter.slideUp(300);
                setPlaylistMarginBottomZero();
                if ($stickyFooter.hasClass("stick"))
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
                        $('html, body').animate({scrollTop: topHelper - 50}, 300);
                    });
                    $blendUp.on("hover", function () {
                        $('html, body').animate({scrollTop: topHelper + 50}, 300);
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
            $(window).on("scroll", function () {
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
            });
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
            console.log(JSON.parse(JSON.stringify(playlistAsJSON)))
            return JSON.parse(JSON.stringify(playlistAsJSON))
        },

        savePlaylist = function () {
            var playlistName = $playlistNameInput.val();
            if (!playlistName || getPlaylistAsJSON().length == 0)
                swal("Oops...", "Your playlist or your playlist name is empty!", "error");
            else
                $(that).trigger("savePlaylistClicked", [getPlaylistAsJSON(), $playlistNameInput.val()]);
        },

        clearPlaylist = function () {
            isPlaylistExisting = false;
            $playlist.find("li").remove();
            $(that).trigger("playlistCleared");
            $playlistSpaceFiller.show();
        },

        playlistSpaceFillerClick = function (e) {
            e.preventDefault();
            $(that).trigger("playlistSpaceFillerClicked");
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
    that.getPlaylistAsJSON = getPlaylistAsJSON;
    that.hideLoadingAnimation = hideLoadingAnimation;
    that.showLoadingAnimation = showLoadingAnimation;
    that.init = init;

    return that;

}());
