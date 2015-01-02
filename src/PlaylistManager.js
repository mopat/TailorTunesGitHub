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
            logIn();
        },

        signIn = function () {
            var user = new Parse.User();
            user.set("username", "patrick");
            user.set("password", "killer");
            user.set("email", "email@example.com");

            // other fields can be set just like with Parse.Object
            //user.set("phone", "415-392-0202");

            user.signUp(null, {
                success: function (user) {
                    // Hooray! Let them use the app now.
                },
                error: function (user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        },

        logIn = function () {
            Parse.User.logIn("patrick", "killer", {
                success: function (user) {
                    currentUser = Parse.User.current();
                    console.log("LOGGEDIN")
                    loadPlaylists();
                },
                error: function (user, error) {
                    // The login failed. Check error to see why.
                }
            });
        },

        loadPlaylists = function () {
            var query = new Parse.Query("Playlists");
            query.equalTo("user", currentUser);
            query.find({
                success: function(usersPosts) {
                    for(var i in usersPosts){
                         playlistTitles.push(usersPosts[i]._serverData.title)
                        console.log(usersPosts[i]._serverData.title)
                        $(that).trigger("userPlaylistTitlesLoaded", [usersPosts[i]._serverData.title, usersPosts[i]._serverData.lastUpdate, usersPosts[i]._serverData.length]);
                    }

                    var userPost = usersPosts[0];
                    var playlist = userPost._serverData.JSONPlaylist;
                    for(var i in playlist){
                        var itemToJSON = JSON.parse((playlist[i]));
                        var number = itemToJSON.number;
                        var imageUrl = itemToJSON.image_url;
                        var duration = itemToJSON.duration;
                        var title = itemToJSON.title;
                        var streamUrl = itemToJSON.stream_url;
                        console.log(number, imageUrl, duration, title, streamUrl);
                    }
                }
            });
        },


        postPlaylist = function(JSONPlaylist){
            var Post = Parse.Object.extend("Playlists");
            var post = new Post();
            post.set("user", currentUser);
            var playlistTitle = "playlist title";
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

    that.postPlaylist = postPlaylist;
    that.init = init;

    return that;

}());
