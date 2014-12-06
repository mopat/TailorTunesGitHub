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
                var title = playlist[i].title;
                var permalinkUrl = playlist[i].permalink_url;
                var itemContainer = $('<div class="playlist-item-container">');
                var anchor = $('<a>');
                //anchor.attr("href", permalinkUrl);
                anchor.attr("href", "#");
                //   anchor.attr("target", "_blank");
                var listItem = $("<li class='playlist-item'>");
                $(listItem).html(title);
                var listImg = $("<img class='playlist-item-image'>");
                listImg.attr("src", artworkUrl);


                anchor.append(listItem);
                listItem.append(listImg);
                itemContainer.append(anchor);

                $playlist.append(itemContainer);
                $playlistBox.append($playlist);
            }

        };

    that.addPlaylistItem = addPlaylistItem;
    that.init = init;

    return that;

}());
