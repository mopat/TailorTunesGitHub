/**
 * Created by Patrick on 31.12.2014.
 */
App.PlaylistManager = (function () {
    var that = {},
        APPLICATION_ID = "yOTWw2niwOWRTql2MtewglSVcXYQa36Bld6ztZX3",
        JAVASCRIPT_KEY = "wyt0MOGfNQxPCEC3fFDkxGmpukQ7ulbOzeMY27Ql",
        savePlaylistButton = null,

        init = function(){
            Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
savePlaylistButton = $("#save-playlist-button");

            savePlaylistButton.on("click", savePlaylist);
            logIn();
        },

        signIn = function(){
            var user = new Parse.User();
            user.set("username", "patrick");
            user.set("password", "killer");
            user.set("email", "email@example.com");

// other fields can be set just like with Parse.Object
            //user.set("phone", "415-392-0202");

            user.signUp(null, {
                success: function(user) {
                    // Hooray! Let them use the app now.
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        },

        logIn = function(){
            Parse.User.logIn("patrick", "killer", {
                success: function(user) {
                    console.log("LOGGEDIN")
                },
                error: function(user, error) {
                    // The login failed. Check error to see why.
                }
            });
        },

        loadPlaylists = function(){

        },

        savePlaylist = function(){
            var user = Parse.User.current();

// Make a new post
            var Post = Parse.Object.extend("Playlists");
            var post = new Post();
            post.set("title", "playlist namesss");
            post.set("JSONObject", "JSSSOOOOssssssssssON");
            post.set("user", user);
            post.save(null, {
                success: function(post) {
                    // Find all posts by the current user
                    var query = new Parse.Query(Post);

                    query.equalTo("user", user);
                    query.find({
                        success: function(usersPosts) {
                            // userPosts contains all of the posts by the current user.
                            console.log(usersPosts)
                        }
                    });
                }
            });

        };

    that.init = init;

    return that;

}());
