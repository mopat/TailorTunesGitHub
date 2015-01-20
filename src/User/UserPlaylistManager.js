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

                        playlistTitles.push(userPost._serverData.title);

                        $(that).trigger("userPlaylistTitlesLoaded", [usersPosts[i]._serverData.title, usersPosts[i]._serverData.lastUpdate, usersPosts[i]._serverData.length, usersPosts[i].id, JSONPlaylist]);
                    }
                }
            });
        },

        _startPlaylistPost = function (JSONPlaylist, playlistName) {
            if (JSONPlaylist != null) {
                if (getCurrentUser() != null) {
                    $(that).trigger("emptyOldUserPlaylistView");
                    if ($.inArray(playlistName, playlistTitles) == -1) {
                        postPlaylist(JSONPlaylist, playlistName);
                    }
                    else {
                        swal({
                            title: "Are you sure?",
                            text: "You will not be able to recover this imaginary file!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, delete it!",
                            closeOnConfirm: false
                        }, function () {
                            swal("Deleted!", "Your imaginary file has been deleted.", "success");
                            var Playlists = Parse.Object.extend("Playlists"),
                                query = new Parse.Query(Playlists);
                            query.equalTo("title", playlistName);
                            query.find({
                                success: function (playlist) {
                                    var playlistId = playlist[0].id;
                                    _deleteUserPlaylist(playlistId);
                                    postPlaylist(JSONPlaylist, playlistName);
                                }
                            });
                        });
                    }
                }
                else swal("Saving failed!", "You need to login to save playlists.", "error");
            }
            else {
                swal("Saving failed!", "Your Playlist is empty!", "error");

            }
        },

        postPlaylist = function (JSONPlaylist, playlistName) {
            var Playlists = Parse.Object.extend("Playlists");
            var query = new Parse.Query(Playlists);
            var post = new Playlists();
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
                    swal({
                        title: "Playlist deleted",
                        type: "success",
                        timer: 500
                    });
                    $(that).trigger("userPlaylistDeleteSuccess");
                },
                error: function (myObject, error) {
                    swal({
                        title: "Could not delete Playlist.",
                        type: "error",
                        timer: 500
                    });
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
