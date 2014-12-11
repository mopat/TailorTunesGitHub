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

            $(mainModel).on("trackPicked", handleTrackPick);
            $(controlsView).on("trackEnded", handleTrackEnd);
            $(controlsView).on("nextButtonClick", handleNextButtonClick);
            $(controlsView).on("previousButtonClick", handlePreviousButtonClick);

            $(mainModel).on("playlistCreated", handlePlaylistCreated);

            $(playlistView).on("playlistItemClicked", handlePlaylistItemClick);

            $(searchView).on("searchButtonClicked", handleSearchButtonClick);
        },

        handleTrackPick = function (event, src, title) {
            controlsView.handleTrackPicked(src, title);
        },

        handleTrackEnd = function () {
            mainModel.playNextTrack();
        },

        handleSearchButtonClick = function (event, searchVal, lowerVal, upperVal) {
            mainModel.searchSpotifyTracksByYear(searchVal, lowerVal, upperVal);
        },

        handleNextButtonClick = function () {
            mainModel.playNextTrack();
        },

        handlePreviousButtonClick = function () {
            mainModel.playPreviousTrack();
        },

        handlePlaylistCreated = function (event, playlist) {
            playlistView.addPlaylistItem(playlist);
        },

        handlePlaylistItemClick = function (event, streamUrl, title) {
            controlsView.handleTrackPicked(streamUrl, title);
        };


    that.init = init;

    return that;

}());
