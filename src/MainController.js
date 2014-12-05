/*** Created by Patrick on 19.11.2014.*/
App.MainController = (function () {
    var that = {},
        mainModel = null,
        playlistView = null,
        controlsView = null,
        searchView = null,

        init = function () {
            mainModel = App.MainModel;
            playlistView = App.PlaylistView;
            controlsView = App.ControlsView;
            searchView = App.SearchView;

            mainModel.init();
            playlistView.init();
            controlsView.init();
            searchView.init();

            $(mainModel).on("trackPicked", handleTrackPicked);
            $(controlsView).on("trackEnded", handleTrackEnded);
            $(controlsView).on("nextButtonClick", handleNextButtonClick);
            $(controlsView).on("previousButtonClick", handlePreviousButtonClick);

            $(searchView).on("searchButtonClicked", handleSearchButtonClicked);
        },

        handleTrackPicked = function (event, src) {
            controlsView.handleTrackPicked(src);
        },

        handleTrackEnded = function () {
            mainModel.playNextTrack();
        },

        handleSearchButtonClicked = function (event, searchVal, lowerVal, upperVal) {
            mainModel.searchEchoNestTracks(searchVal, lowerVal, upperVal);
        },

        handleNextButtonClick = function () {
            mainModel.playNextTrack();
        },

        handlePreviousButtonClick = function () {
            mainModel.playPreviousTrack();
        };


    that.init = init;

    return that;

}());
