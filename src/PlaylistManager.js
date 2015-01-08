/**
 * Created by Patrick on 31.12.2014.
 */
App.PlaylistManager = (function () {
    var that = {},
        APPLICATION_ID = "yOTWw2niwOWRTql2MtewglSVcXYQa36Bld6ztZX3",
        JAVASCRIPT_KEY = "wyt0MOGfNQxPCEC3fFDkxGmpukQ7ulbOzeMY27Ql",
        savePlaylistButton = null,
        currentUser = null,
        playlistTitles = [],

        init = function () {
            Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
            savePlaylistButton = $("#save-playlist-button");

            savePlaylistButton.on("click", savePlaylist);
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

        loadPlaylists = function () {
            var query = new Parse.Query("Playlists");
            query.equalTo("user", currentUser);
            query.find({
                success: function(usersPosts) {
                    for (var i in usersPosts) {
                        var userPost = usersPosts[i];
                        playlistTitles.push(userPost._serverData.title);

                        var JSONPlaylist = userPost._serverData.JSONPlaylist;

                        $(that).trigger("userPlaylistTitlesLoaded", [usersPosts[i]._serverData.title, usersPosts[i]._serverData.lastUpdate, usersPosts[i]._serverData.length, usersPosts[i].id, JSONPlaylist]);
                    }
                }
            });
        },


        postPlaylist = function(JSONPlaylist){
            var Post = Parse.Object.extend("Playlists");
            var post = new Post();
            post.set("user", currentUser);
            var playlistTitle = "playlist title 3";
            if($.inArray(playlistTitle, playlistTitles) == -1){
                post.set("title", playlistTitle);
                post.set("lastUpdate", getCurrenTimeAndDate());
                post.set("length", JSONPlaylist.length);
                post.set("JSONPlaylist", JSONPlaylist);
                post.save(null, {
                    success: function (post) {
                        console.log("PLAYLIST SAVED");
                        // Find all posts by the current user
                        var query = new Parse.Query(Post);

                        query.equalTo("user", currentUser);
                        query.find({
                            success: function (usersPosts) {
                                // userPosts contains all of the posts by the current user.
                                for(var i in usersPosts){
                                    playlistTitles = [];
                                    playlistTitles.push(usersPosts[i]._serverData.title)
                                }
                            }
                        });
                    }
                });
            }
            else{
                console.log("playlist name already exists.")
            }
        },

        getCurrenTimeAndDate = function(){
                var now     = new Date();
                var year    = now.getFullYear();
                var month   = now.getMonth()+1;
                var day     = now.getDate();
                var hour    = now.getHours();
                var minute  = now.getMinutes();
                var second  = now.getSeconds();
                if(month.toString().length == 1) {
                    var month = '0'+month;
                }
                if(day.toString().length == 1) {
                    var day = '0'+day;
                }
                if(hour.toString().length == 1) {
                    var hour = '0'+hour;
                }
                if(minute.toString().length == 1) {
                    var minute = '0'+minute;
                }
                if(second.toString().length == 1) {
                    var second = '0'+second;
                }
                var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
            return dateTime;
            },


        savePlaylist = function () {
            $(that).trigger("savePlaylistClicked");
        };

    that.login = logIn;
    that.signIn = signIn;
    that.postPlaylist = postPlaylist;
    that.init = init;

    return that;

}());
