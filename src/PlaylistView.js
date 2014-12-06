/*** Created by Patrick on 19.11.2014.*/
App.PlaylistView = (function () {
    var that = {},
        $playlistBox = null,
        $playlist = null,
        listItemColors = [],

        init = function () {
            $playlistBox = $("#playlist-box");
            $playlist = $("#playlist");

            listItemColors = ["#006AAA", "#117AB9"];
        },

        addPlaylistItem = function (playlist) {

            for (var i = 0; i < playlist.length; i++) {

                var artworkUrl = playlist[i].artwork_url;
                if (artworkUrl == null)
                    artworkUrl = playlist[i].user.avatar_url;
                var title = playlist[i].title;
                var duration = playlist[i].duration;
                //var permalinkUrl = playlist[i].permalink_url;
                var anchor = $('<a>');
                //anchor.attr("href", permalinkUrl);
                anchor.attr("href", "#");
                //   anchor.attr("target", "_blank");

                var listItem = $("<li class='playlist-item'>");

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
