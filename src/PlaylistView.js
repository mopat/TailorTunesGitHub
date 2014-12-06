/*** Created by Patrick on 19.11.2014.*/
App.PlaylistView = (function () {
    var that = {},
        $playlistBox = null,
        $playlist = null,
        playlistTemplate = null,
        init = function () {
            $playlistBox = $("#playlist-box");
            $playlist = $("#playlist");
        },

        addPlaylistItem = function (playlist) {

            for (var i = 0; i < playlist.length; i++) {
                var artworkUrl = playlist[i].artwork_url;
                if (artworkUrl == null)
                    artworkUrl = playlist[i].user.avatar_url;
                var title = playlist[i].title;
                var permalinkUrl = playlist[i].permalink_url;
                var anchor = $('<a>');
                //anchor.attr("href", permalinkUrl);
                anchor.attr("href", "#");
                //   anchor.attr("target", "_blank");
                var listItem = $("<li class='playlist-item'>");
                // $(listItem).html("<span class='playlist-title>" + title + "</span>");

                var listImg = $("<img class='playlist-item-image'>");
                listImg.attr("src", artworkUrl);
                listItem.append(listImg);
                listItem.append($("<span class='playlist-title'>").html(title));

                anchor.append(listItem);
                $playlist.append(anchor);
                $playlistBox.append($playlist);
            }

        };

    that.addPlaylistItem = addPlaylistItem;
    that.init = init;

    return that;

}());
