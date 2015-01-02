/**
 * Created by Patrick on 02.01.2015.
 */
App.UserPlaylistView = (function () {
    var that = {},
        $userPlaylistBox = null,
        userPlaylistTemplate = null,

        init = function () {
            $userPlaylistBox = $("#user-playlist-box");
            userPlaylistTemplate = _.template($("#user-playlist-item-tpl").html());
        },

        setUserPlaylistView = function(title, date, length){
            var playlistItem = userPlaylistTemplate({
                title: title,
                date: date,
                length: length
            });
            $userPlaylistBox.append(playlistItem);
        };

    that.setUserPlaylistView = setUserPlaylistView;
        that.init = init;

    return that;

}());
