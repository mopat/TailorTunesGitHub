/**
 * Created by Patrick on 31.12.2014.
 */
App.PlaylistManager = (function () {
    var that = {},
        APPLICATION_ID = "yOTWw2niwOWRTql2MtewglSVcXYQa36Bld6ztZX3",
        JAVASCRIPT_KEY = "wyt0MOGfNQxPCEC3fFDkxGmpukQ7ulbOzeMY27Ql",

        init = function(){
            Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);

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

            var TestObject = Parse.Object.extend("TestObject");
            var testObject = new TestObject();
            testObject.save({foo: "bar"}, {
                success: function(object) {

                },
                error: function(model, error) {

                }
            });
        };

    that.init = init;

    return that;

}());
