/*** Created by Patrick on 19.11.2014.*/
App.MainController = (function () {
    var that = {},
        mainModel = null,
        playlistView = null,
        controlsView = null,
        searchView = null,
        modalView = null,

        init = function () {
            mainModel = App.MainModel;
            playlistView = App.PlaylistView;
            controlsView = App.ControlsView;
            searchView = App.SearchView;
            modalView = App.ModalView;

            mainModel.init();
            playlistView.init();
            controlsView.init();
            searchView.init();
            modalView.init();

            $(playlistView).on("trackPicked", handleTrackPick);
            $(playlistView).on("resetPlayer", handleResetPlayer);
            $(controlsView).on("trackEnded", handleTrackEnd);
            $(controlsView).on("nextButtonClick", handleNextButtonClick);
            $(controlsView).on("previousButtonClick", handlePreviousButtonClick);

            $(mainModel).on("playlistCreated", handlePlaylistCreated);

            $(playlistView).on("playlistItemClicked", handlePlaylistItemClick);

            $(searchView).on("searchButtonClickedSpotify", handleSearchButtonClickedSpotify);

            $(searchView).on("searchButtonClickedEchoNest", handleSearchButtonClickedEchoNest);

            $(searchView).on("searchButtonClickedSoundcloud", handleSearchButtonClickedSoundcloud);

            $(mainModel).on("echoNestTrackSearchResultsComplete", handleEchoNestTrackSearchResultsComplete);

            $(mainModel).on("soundcloudTrackSearchResultsComplete", handleSoundcloudTrackSearchResultsComplete);

            $(modalView).on("trackIdPicked", handleTrackIdPicked);

            $(modalView).on("soundcloudTrackPicked", handleSoundlcoudTrackPicked);
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

        handleSearchButtonClickedSoundcloud = function (event, searchVal) {
            mainModel.searchSoundcloudTracksSimple(searchVal);
        },

        handleNextButtonClick = function () {
            playlistView.handlePrevOrNextClicked("next");
        },

        handlePreviousButtonClick = function () {
            playlistView.handlePrevOrNextClicked("previous");
        },

        handlePlaylistCreated = function (event, playlist) {
            playlistView.addPlaylistItem(playlist);
        },

        handleSoundlcoudTrackPicked = function (event, track) {
            playlistView.addPlaylistItem(track);
        },

        handlePlaylistItemClick = function (event, streamUrl, title) {
            controlsView.handleTrackPicked(streamUrl, title);
        },

        handleEchoNestTrackSearchResultsComplete = function(event, tracks){
            modalView.setModalEchoNestContent(tracks);
        },

        handleSoundcloudTrackSearchResultsComplete = function(event, tracks){
            modalView.setModalSoundcloudContent(tracks);
        },

        handleTrackIdPicked = function(event, trackId, query){
            mainModel.searchSimilarTracksById(trackId, query);
        };


    that.init = init;

    return that;

}());
