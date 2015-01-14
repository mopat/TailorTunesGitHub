/**
 * Created by Patrick on 31.12.2014.
 */
App.PlaylistManager = (function () {
    var that = {},
        APPLICATION_ID = "yOTWw2niwOWRTql2MtewglSVcXYQa36Bld6ztZX3",
        JAVASCRIPT_KEY = "wyt0MOGfNQxPCEC3fFDkxGmpukQ7ulbOzeMY27Ql",
        currentUser = null,
        playlistTitles = [],

        init = function () {
            Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);

            checkCurrentUser();
        },

        checkCurrentUser = function () {
            $(document).ready(function () {
                currentUser = Parse.User.current();
                if (currentUser != null) {
                    $(that).trigger("loginSuccessful");
                    loadPlaylists();
                }
            });
        },

        signIn = function (username, password, email) {
            var user = new Parse.User();
            user.set("username", username);
            user.set("password", password);
            user.set("email", email);

            user.signUp(null, {
                success: function (user) {
                    $(that).trigger("signInSuccessful");
                    console.log("SUCCESSFUL")
                },
                error: function (user, error) {
                    $(that).trigger("signInFailed", [error.message]);
                }
            });
        },

        logIn = function (username, password) {
            Parse.User.logIn(username, password, {
                success: function (user) {
                    currentUser = Parse.User.current();
                    console.log("LOGGEDIN")
                    $(that).trigger("loginSuccessful");
                    loadPlaylists();
                },
                error: function (user, error) {
                    $(that).trigger("loginFailed", [error.message]);
                }
            });
        },

        logOut = function () {
            Parse.User.logOut();
            currentUser = Parse.User.current();
        },

        loadPlaylists = function () {
            var query = new Parse.Query("Playlists");
            query.equalTo("user", currentUser);
            query.find({
                success: function (usersPosts) {
                    for (var i in usersPosts) {
                        var userPost = usersPosts[i];
                        playlistTitles.push(userPost._serverData.title);

                        var JSONPlaylist = userPost._serverData.JSONPlaylist;

                        $(that).trigger("userPlaylistTitlesLoaded", [usersPosts[i]._serverData.title, usersPosts[i]._serverData.lastUpdate, usersPosts[i]._serverData.length, usersPosts[i].id, JSONPlaylist]);
                    }
                }
            });
        },

        startPlaylistPost = function (JSONPlaylist, playlistName) {
            if (currentUser != null) {
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
                        var Playlists = Parse.Object.extend("Playlists");
                        var query = new Parse.Query(Playlists);
                        query.equalTo("title", playlistName);
                        query.find({
                            success: function (playlist) {
                                var playlistId = playlist[0].id;
                                deleteUserPlaylist(playlistId);
                                postPlaylist(JSONPlaylist, playlistName);
                            }
                        });
                    });
                }
            }
            else swal("Saving failed!", "You need to login to save playlists.", "error");
        },

        postPlaylist = function (JSONPlaylist, playlistName) {
            var Playlists = Parse.Object.extend("Playlists");
            var query = new Parse.Query(Playlists);
            var post = new Playlists();
            post.set("user", currentUser);
            post.set("title", playlistName);
            post.set("lastUpdate", getCurrenTimeAndDate());
            post.set("length", JSONPlaylist.length);
            post.set("JSONPlaylist", JSONPlaylist);
            post.save(null, {
                success: function (post) {
                    swal("Your playlist was saved! ", null, "success");
                    // Find all posts by the current user

                    query.equalTo("user", currentUser);
                    query.find({
                        success: function (usersPosts) {
                            // userPosts contains all of the posts by the current user.
                            for (var i in usersPosts) {
                                playlistTitles = [];
                                playlistTitles.push(usersPosts[i]._serverData.title)
                            }
                            loadPlaylists();
                        }
                    });
                }
            });
        },

        deleteUserPlaylist = function (playlistId) {
            retrieveObject(playlistId, deleteObject);
        },

        retrieveObject = function (playlistId, callback) {
            var Playlists = Parse.Object.extend("Playlists");
            var query = new Parse.Query(Playlists);
            query.get(playlistId, {
                success: function (playlist) {
                    if (callback != null || callback != undefined)
                        callback(playlist);
                    alert("DELETE")
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
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            if (month.toString().length == 1) {
                var month = '0' + month;
            }
            if (day.toString().length == 1) {
                var day = '0' + day;
            }
            if (hour.toString().length == 1) {
                var hour = '0' + hour;
            }
            if (minute.toString().length == 1) {
                var minute = '0' + minute;
            }
            if (second.toString().length == 1) {
                var second = '0' + second;
            }
            var dateTime = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
            return dateTime;
        };

    that.login = logIn;
    that.signIn = signIn;
    that.logOut = logOut;
    that.startPlaylistPost = startPlaylistPost;
    that.deleteUserPlaylist = deleteUserPlaylist;
    that.init = init;

    return that;

}());
