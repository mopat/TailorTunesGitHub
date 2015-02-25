/**
 * Created by Patrick on 31.12.2014.
 */
App.UserPlaylistManager = (function () {
    var that = {},
        playlistTitles = [],

        init = function () {
            Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY);

            return that;
        },

        _loadPlaylists = function () {
            var query = new Parse.Query("Playlists");
            query.equalTo("user", getCurrentUser());
            query.find({
                success: function (usersPosts) {
                    for (var i in usersPosts) {
                        var userPost = usersPosts[i],
                            JSONPlaylist = userPost._serverData.JSONPlaylist;

                        var playlistObj = {
                            title: userPost._serverData.title,
                            id: usersPosts[i].id
                        };
                        var playlistId = usersPosts[i].id,
                            playlistTitle = userPost._serverData.title;
                        playlistTitle.id = playlistId;
                        console.log(playlistTitle)
                        playlistTitles.push(playlistObj);

                        var userPlaylistObj = createUserPlaylistObj(usersPosts[i]._serverData.title, usersPosts[i]._serverData.lastUpdate, usersPosts[i]._serverData.length, usersPosts[i].id, JSONPlaylist);
                        $(that).trigger("userPlaylistTitlesLoaded", [userPlaylistObj]);
                    }
                }
            });
        },

        _startPlaylistPost = function (JSONPlaylist, playlistName) {
            if (JSONPlaylist != null) {
                if (getCurrentUser() != null) {
                    var isExisitingIndex = isPlaylistNameExisting(playlistName);
                    if (isExisitingIndex != -1) {
                        overwrite = true;
                        swal({
                            title: "Playlist name already exists",
                            text: "Are you sure you want to overwrite?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Overwrite",
                            closeOnConfirm: false
                        }, function () {
                            var playlistId = playlistTitles[isExisitingIndex].id;
                            _deleteUserPlaylist(playlistId);
                            postPlaylist(JSONPlaylist, playlistName);
                            $(that).trigger("emptyOldUserPlaylistView");
                        });
                    }
                    else {
                        $(that).trigger("emptyOldUserPlaylistView");
                        postPlaylist(JSONPlaylist, playlistName);
                    }
                }
                else swal("Saving failed!", "You need to login to save playlists.", "error");
            }
            else {
                swal("Saving failed!", "Your Playlist is empty!", "error");
            }
        },

        isPlaylistNameExisting = function (playlistName) {
            for (var i in playlistTitles) {
                if (playlistTitles[i].title == playlistName) {
                    return i;
                }
            }
            return -1;
        },

        postPlaylist = function (JSONPlaylist, playlistName) {
            var Playlists = Parse.Object.extend("Playlists"),
                query = new Parse.Query(Playlists),
                post = new Playlists();
            post.set("user", getCurrentUser());
            post.set("title", playlistName);
            post.set("lastUpdate", getCurrenTimeAndDate());
            post.set("length", JSONPlaylist.length);
            post.set("JSONPlaylist", JSONPlaylist);
            post.save(null, {
                success: function (post) {
                    swal("Your playlist has been saved! ", null, "success");
                    // Find all posts by the current user

                    query.equalTo("user", getCurrentUser());
                    query.find({
                        success: function (usersPosts) {
                            // userPosts contains all of the posts by the current user.
                            for (var i in usersPosts) {
                                playlistTitles = [];
                                playlistTitles.push(usersPosts[i]._serverData.title)
                            }
                            _loadPlaylists();
                        }
                    });
                }
            });
        },

        _deleteUserPlaylist = function (playlistId) {
            retrieveObject(playlistId, deleteObject);
        },

        retrieveObject = function (playlistId, callback) {
            var Playlists = Parse.Object.extend("Playlists");
            var query = new Parse.Query(Playlists);
            query.get(playlistId, {
                success: function (playlist) {
                    if (callback != null || callback != undefined)
                        callback(playlist);
                },
                error: function (object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                }
            });
        },

        deleteObject = function (playlist) {
            playlist.destroy({
                success: function (playlist) {
                    if (overwrite == false)
                    swal({
                        title: "Playlist deleted",
                        type: "success",
                        timer: 500
                    });
                    overwrite = false;
                    $(that).trigger("userPlaylistDeleteSuccess");
                },
                error: function (myObject, error) {
                    swal({
                        title: "Could not delete Playlist.",
                        type: "error",
                        timer: 500
                    });
                    overwrite = false;
                }
            });
        },

        getCurrenTimeAndDate = function () {
            var now = new Date(),
                year = now.getFullYear(),
                month = now.getMonth() + 1,
                day = now.getDate(),
                hour = now.getHours(),
                minute = now.getMinutes(),
                second = now.getSeconds();
            if (month.toString().length == 1) {
                month = '0' + month;
            }
            if (day.toString().length == 1) {
                day = '0' + day;
            }
            if (hour.toString().length == 1) {
                hour = '0' + hour;
            }
            if (minute.toString().length == 1) {
                minute = '0' + minute;
            }
            if (second.toString().length == 1) {
                second = '0' + second;
            }
            var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
            return dateTime;
        };

    that._loadPlaylists = _loadPlaylists;
    that._startPlaylistPost = _startPlaylistPost;
    that._deleteUserPlaylist = _deleteUserPlaylist;
    that.init = init;

    return that;

}());
