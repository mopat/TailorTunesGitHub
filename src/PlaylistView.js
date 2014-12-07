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
            }
            else{
                $sortModeSwitch.attr("checked", true);
                addSortable();
            }

        },

        addSortable = function(){
            $playlist.sortable({
                scroll: true, scrollSensitivity: 10, scrollSpeed: 10,
                delay: 600,
                sort: function(event, ui) {
                    var currentScrollTop = $(window).scrollTop(),
                        topHelper = ui.position.top,
                        delta = topHelper - currentScrollTop;
                    setTimeout(function() {
                        $(window).scrollTop(currentScrollTop + delta);
                    }, 50);
                }

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
