/**
 * Created by Patrick on 31.12.2014.
 */
App.PlaylistManager = (function () {
    var that = {},
        APPLICATION_ID = "yOTWw2niwOWRTql2MtewglSVcXYQa36Bld6ztZX3",
        JAVASCRIPT_KEY = "wyt0MOGfNQxPCEC3fFDkxGmpukQ7ulbOzeMY27Ql",
        savePlaylistButton = null,
        currentUser = null,

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
                    // userPosts contains all of the posts by the current user.
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

        savePlaylist = function () {
            $(that).trigger("savePlaylistClicked");
        },

        postPlaylist = function(JSONPlaylist){
            var Post = Parse.Object.extend("Playlists");
            var post = new Post();
            post.set("title", "playlist namesss");
            post.set("JSONPlaylist", JSONPlaylist);
            post.set("user", currentUser);
            post.save(null, {
                success: function (post) {
                    console.log("PLAYLIST SAVED");
                }
            });
        };

    that.postPlaylist = postPlaylist;
    that.init = init;

    return that;

}());
