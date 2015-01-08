/*** Created by Patrick on 19.11.2014.*/
App.MainController = (function () {
    var that = {},
        mainModel = null,
        playlistView = null,
        controlsView = null,
        searchView = null,
        modalView = null,
        playlistManager = null,
        userPlaylistView = null,
        loginRegisterView = null,

        init = function () {
            mainModel = App.MainModel;
            playlistView = App.PlaylistView;
            controlsView = App.ControlsView;
            searchView = App.SearchView;
            modalView = App.ModalView;
            playlistManager = App.PlaylistManager;
            userPlaylistView = App.UserPlaylistView;
            loginRegisterView = App.LoginRegisterView;

            mainModel.init();
            playlistView.init();
            controlsView.init();
            searchView.init();
            modalView.init();
            playlistManager.init();
            userPlaylistView.init();
            loginRegisterView.init();

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

            $(playlistManager).on("savePlaylistClicked", handleSavePlaylistClicked);

            $(playlistManager).on("userPlaylistTitlesLoaded", handleUserPlaylistTitlesLoaded);

            $(userPlaylistView).on("userPlaylistLoaded", handleUserPlaylistLoaded);

            $(playlistManager).on("emptyOldUserPlaylistView", handleEmptyUserPlaylistView);

            $(userPlaylistView).on("previewPlayingStart", handlePreviewPlayingStart);
            $(userPlaylistView).on("previewPlayingStop", handlePreviewPlayingStop);

            $(loginRegisterView).on("loginButtonClick", handleLoginButtonClick);
            $(loginRegisterView).on("emptyOldUserPlaylistView", handleEmptyUserPlaylistView);
            $(loginRegisterView).on("myPlaylistsAnchorClick", handleMyPlaylistsAnchorClick);
            $(playlistManager).on("loginSuccessful", handleLoginSuccessful);
            $(playlistManager).on("loginFailed", handleLoginFailed);

            $(loginRegisterView).on("signInButtonClick", handleSignInButtonClick);
            $(playlistManager).on("signInSuccessful", handleLoginSuccessful);
            $(playlistManager).on("signInFailed", handleSignInFailed);
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
            playlistView.addPlaylist(playlist);
        },

        handleSoundlcoudTrackPicked = function (event, track) {
            playlistView.addPlaylist(track);
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
        },

        handleSavePlaylistClicked = function(){
            var JSONPlaylist = playlistView.getPlaylistAsJSON();
            playlistManager.postPlaylist(JSONPlaylist);
        },

        handleUserPlaylistTitlesLoaded = function (event, title, date, length, playlistId, JSONPlaylist) {
            userPlaylistView.setUserPlaylistView(title, date, length, playlistId, JSONPlaylist);
        },

        handleUserPlaylistLoaded = function (event, playlist) {
            playlistView.addPlaylist(playlist);
        },

        handlePreviewPlayingStart = function () {
            controlsView.pauseTrack();
        },

        handlePreviewPlayingStop = function () {
            controlsView.playTrack();
        },

        handleLoginButtonClick = function (event, username, password) {
            playlistManager.login(username, password);
        },

        handleLoginSuccessful = function () {
            loginRegisterView.loginSuccessful();
        },

        handleLoginFailed = function (event, errorMessage) {
            loginRegisterView.loginFailed(errorMessage);
        },

        handleMyPlaylistsAnchorClick = function () {
            userPlaylistView.openUserPlaylistModal();
        },

        handleEmptyUserPlaylistView = function () {
            userPlaylistView.emptyUserPlaylistModal();
        },

        handleSignInButtonClick = function (event, username, password, email) {
            playlistManager.signIn(username, password, email);
        },

        handleSignInFailed = function (event, errorMessage) {
            loginRegisterView.signInFailed(errorMessage);
        };


    that.init = init;

    return that;

}());
