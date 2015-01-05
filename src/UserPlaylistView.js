/**
 * Created by Patrick on 02.01.2015.
 */
App.UserPlaylistView = (function () {
    var that = {},
        $userPlaylistBox = null,
        userPlaylistTpl = null,
        userPlaylistItemTpl = null,


        init = function () {
            $userPlaylistBox = $("#user-playlist-box");
            userPlaylistTpl = _.template($("#user-playlist-tpl").html());

            userPlaylistItemTpl = _.template($("#user-playlist-item-tpl").html());
        },

        setUserPlaylistView = function (playlistTitle, date, length, playlistId, JSONPlaylist) {
            var playlistHeaderItem = userPlaylistTpl({
                playlist_id: playlistId,
                title: playlistTitle,
                date: date,
                length: length
            });
            $userPlaylistBox.append(playlistHeaderItem);

            for (var j in JSONPlaylist) {
                var itemToJSON = JSONPlaylist[j];
                var number = itemToJSON.number;
                var imageUrl = itemToJSON.image_url;
                var duration = itemToJSON.duration;
                var songTitle = itemToJSON.title;
                var streamUrl = itemToJSON.stream_url;

                var playlistItem = userPlaylistItemTpl({
                    stream_url: streamUrl,
                    artwork_url: imageUrl,
                    title: songTitle,
                    duration: duration,
                    playlist_number: number
                });
                $("#" + playlistId).append(playlistItem);
            }
            setPlaylistIds();
            $("#user-playlist-modal").foundation('reveal', 'open');
        },

        setPlaylistIds = function () {
            listItemColors = ["#464646", "#292929"];
            $(".user-playlist-item").each(function (index) {
                if (index % 2 == 0) {
                    $(this).css("background-color", listItemColors[0]);
                }
                else {
                    $(this).css("background-color", listItemColors[1]);
                }
                $(this).attr("id", index);
                $(this).find(".playlist-number").html(index + 1 + ".");
            });
        };

    that.setUserPlaylistView = setUserPlaylistView;
    that.init = init;

    return that;

}());
