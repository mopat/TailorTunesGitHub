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

            $(playlistView).on("trackPicked", handleTrackPick);
            $(playlistView).on("resetPlayer", handleResetPlayer);
            $(controlsView).on("trackEnded", handleTrackEnd);
            $(controlsView).on("nextButtonClick", handleNextButtonClick);
            $(controlsView).on("previousButtonClick", handlePreviousButtonClick);

            $(mainModel).on("playlistCreated", handlePlaylistCreated);

            $(playlistView).on("playlistItemClicked", handlePlaylistItemClick);

            $(searchView).on("searchButtonClickedSpotify", handleSearchButtonClickedSpotify);

            $(searchView).on("searchButtonClickedEchoNest", handleSearchButtonClickedEchoNest);
        },

        handleTrackPick = function (event, src, title) {
            controlsView.handleTrackPicked(src, title);
        },

        handleResetPlayer = function(){
            controlsView.resetPlayer();
        },

        handleTrackEnd = function () {
            playlistView.handlePrevOrNextClicked("next");
        },

        handleSearchButtonClickedSpotify = function (event, searchVal, pickedTab, lowerVal, upperVal, visibleDropdownValue) {
            mainModel.searchSpotifyTracks(searchVal, pickedTab, lowerVal, upperVal, visibleDropdownValue);
        },

        handleSearchButtonClickedEchoNest = function (event, searchVal, pickedTab, lowerVal, upperVal, visibleDropdownValue) {
            mainModel.searchEchoNestTracks(searchVal, pickedTab, lowerVal, upperVal, visibleDropdownValue);
        },

        handleNextButtonClick = function () {

            playlistView.handlePrevOrNextClicked("next");
        },

        handlePreviousButtonClick = function () {
            playlistView.handlePlayOrNextClicked("previous");
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
