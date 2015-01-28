/**
 * Created by Patrick on 28.01.2015.
 */
createUserPlaylistObj = function (title, date, length, playlistId, JSONPlaylist) {
    return {
        palylistTitle: title,
        date: date,
        length: length,
        playlistId: playlistId,
        JSONPlaylist: JSONPlaylist
    }
};