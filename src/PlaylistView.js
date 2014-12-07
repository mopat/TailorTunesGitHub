/*** Created by Patrick on 19.11.2014.*/
App.PlaylistView = (function () {
    var that = {},
        $playlistBox = null,
        $playlist = null,
        listItemColors = [],
        $sortModeSwitch = null,

        init = function () {
            $playlistBox = $("#playlist-box");
            $playlist = $("#playlist");
            $sortModeSwitch = $("#sort-mode-switch");

            listItemColors = ["#006AAA", "#117AB9"];

            $playlist.on("click", handleListItemClick);
            $sortModeSwitch.on("click", handleSortSwitchClick);
            $(window).on("scroll", function () {
                getFirstAppearedElementOnScreen();
            });
            setPlaylistIds();
        },

        addPlaylistItem = function (playlist) {
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
                listItem.append(listImg);
                listItem.append($("<span class='playlist-track-duration'>").html(getMinutesAndSeconds(duration)));
                listItem.append($("<span class='playlist-title'>").html(title));


                if (i % 2 == 0) {
                    listItem.css("background-color", listItemColors[0]);
                }
                else {
                    listItem.css("background-color", listItemColors[1]);
                }

                var centerContainer = $("<div class='center-container'>");

                anchor.append(listItem);
                centerContainer.append(anchor);
                $playlist.append(centerContainer);
                $playlistBox.append($playlist);
            }

            if ($sortModeSwitch.attr("checked", true)) {
                $sortModeSwitch.click();
            }
        },

        handleSortSwitchClick = function(){
            if($sortModeSwitch.attr("checked")){
                $sortModeSwitch.removeAttr("checked");
                removeSortable();
                $("#sticky-footer").fadeIn(500);
            }
            else{
                $sortModeSwitch.attr("checked", true);
                addSortable();
                $playlist.disableSelection();
                $("#sticky-footer").fadeOut(500);
            }
        },

        addSortable = function(){
            var autoScroll;
            $playlist.sortable({
                scroll: true,
                scrollSensitivity: 10,
                scrollSpeed: 10,
                delay: 600,
                tolerance: "pointer",
                revert: true,
                change: function (event, ui) {

                    var currentScrollTop = $('html, body').scrollTop(),
                        topHelper = ui.offset.top,
                        delta = topHelper - currentScrollTop;


                    var firstElementInListOffset = $("#playlist li").first().offset().top;
                    var lastElementInListOffset = $("#playlist li").last().offset().top;

                    if (topHelper >= 300)
                        $('html, body').animate({scrollTop: currentScrollTop + delta}, 500);

                    setPlaylistIds();
                },
                stop: function (event, ui) {
                    $('html, body').stop();
                    $('html, body').clearQueue();
                }
            });
        },

        getFirstAppearedElementOnScreen = function () {
            $("#playlist .playlist-item").each(function (index) {
                if ($("#playlist li").is(":appeared")) {
                    console.log($("#playlist li").offset().top);
                    return $(this);
                }
            });
        },

        setPlaylistIds = function () {
            $("#playlist .playlist-item").each(function (index) {
                $(this).attr("data-id", "list-id-" + index);
            });
        },

        removeSortable = function(){
            $playlist.sortable("destroy");
        };

        handleListItemClick = function (event) {
            event.preventDefault();
            var streamUrl = $(event.target).closest(".playlist-item").attr("data-stream-url");
            var title = $(event.target).closest(".playlist-title").html();
            $(that).trigger("playlistItemClicked", [streamUrl, title]);
        },

        getMinutesAndSeconds = function (duration) {
            var minutes = Math.floor((duration / 1000) / 60);
            var seconds = Math.floor(duration % 60);
            if (seconds < 10)
                seconds = "0" + seconds;
            var minutesAndSeconds = minutes + ":" + seconds;
            return minutesAndSeconds;
        };

    that.addPlaylistItem = addPlaylistItem;
    that.init = init;

    return that;

}());
