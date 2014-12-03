/*** Created by Patrick on 19.11.2014.*/
App.MainController = (function () {
    var that = {},
        mainModel = null,
        playlistView = null,
        controlsView = null,

        init = function () {
            mainModel = App.MainModel;
            playlistView = App.PlaylistView;
            controlsView = App.ControlsView;

            mainModel.init();
            playlistView.init();
            controlsView.init();

            $(mainModel).on("trackPicked", handleTrackPicked);
            console.log("MC");
        },

        handleTrackPicked = function (event, src) {
            controlsView.handleTrackPicked(src);
        };


    that.init = init;

    return that;

}());
