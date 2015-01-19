/*** Created by Patrick on 19.11.2014.*/
App.MainController = (function () {
    var that = {},
        mainModel = null,
        playlistView = null,
        controlsView = null,
        searchView = null,
        chooseTitleView = null,
        playlistManager = null,
        userPlaylistView = null,
        loginRegisterView = null,
        rotationHandler = null,

        init = function () {
            mainModel = App.MainModel;
            playlistView = App.PlaylistView;
            controlsView = App.ControlsView;
            searchView = App.SearchView;
            chooseTitleView = App.ChooseTitleView;
            playlistManager = App.PlaylistManager;
            userPlaylistView = App.UserPlaylistView;
            loginRegisterView = App.LoginRegisterView;
            rotationHandler = App.RotationHandler;

            mainModel.init();
            playlistView.init();
            controlsView.init();
            searchView.init();
            chooseTitleView.init();
            playlistManager.init();
            userPlaylistView.init();
            loginRegisterView.init();
            rotationHandler.init();

            //playlist and player
            $(playlistView).on("trackPicked", handleTrackPick);
            $(playlistView).on("resetPlayer", handleResetPlayer);
            $(controlsView).on("trackEnded", handleTrackEnd);
            $(controlsView).on("nextButtonClick", handleNextButtonClick);
            $(controlsView).on("previousButtonClick", handlePreviousButtonClick);
            $(playlistView).on("playlistItemClicked", handlePlaylistItemClick);
            $(mainModel).on("playlistCreated", handlePlaylistCreated);

            //search
            $(searchView).on("searchButtonClickedEchoNest", handleSearchButtonClickedEchoNest);

            //ZUSAMMEN START
            $(searchView).on("searchEchoNestSimilarTracks", handleSearchEchoNestSimilarTracks);
            $(chooseTitleView).on("echonestTrackIDPicked", handleTrackIdPicked);
            //ZUSAMMEN END
            $(mainModel).on("showLoadingAnimation", handleShowLoadingAnimation);
            $(mainModel).on("hideLoadingAnimation", handleHideLoadingAnimation);
            $(searchView).on("searchButtonClickedSoundcloud", handleSearchButtonClickedSoundcloud);
            $(mainModel).on("echoNestTrackSearchResultsComplete", handleEchoNestTrackSearchResultsComplete);
            $(mainModel).on("soundcloudTrackSearchResultsComplete", handleSoundcloudTrackSearchResultsComplete);
            $(chooseTitleView).on("soundcloudTrackPicked", handleSoundlcoudTrackPicked);

            //user playlist management
            $(playlistView).on("savePlaylistClicked", handleSavePlaylistClicked);
            $(playlistManager).on("userPlaylistTitlesLoaded", handleUserPlaylistTitlesLoaded);
            $(userPlaylistView).on("userPlaylistLoaded", handleUserPlaylistLoaded);
            $(playlistManager).on("emptyOldUserPlaylistView", handleEmptyUserPlaylistView);
            //playing user playlist
            $(userPlaylistView).on("previewPlayingStart", handlePreviewPlayingStart);
            $(userPlaylistView).on("previewPlayingStop", handlePreviewPlayingStop);


            //login, signin, show playlists
            $(loginRegisterView).on("loginButtonClicked", handleLoginButtonClick);
            $(playlistManager).on("loginSuccessful", handleLoginSuccessful);
            $(playlistManager).on("loginFailed", handleLoginFailed);
            //signin
            $(loginRegisterView).on("signInButtonClick", handleSignInButtonClick);
            $(playlistManager).on("signInSuccessful", handleLoginSuccessful);
            $(playlistManager).on("signInFailed", handleSignInFailed);
            //Logout, show playlists
            $(loginRegisterView).on("handleLogoutClicked", handleLogoutClick);
            $(loginRegisterView).on("myPlaylistsAnchorClick", handleMyPlaylistsAnchorClick);
            //delete user playlist
            $(userPlaylistView).on("deleteUserPlaylist", handleDeleteUserPlaylist);
            $(playlistManager).on("userPlaylistDeleteSuccess", handleDeleteUserPlaylistSuccess);
            //empty playlist
            $(loginRegisterView).on("emptyOldUserPlaylistView", handleEmptyUserPlaylistView);
            $(playlistView).on("playlistCleared", handlePlaylistCleared);
            $(playlistView).on("playlistSpaceFillerClicked", handlePlaylistSpaceFillerClick);


            //search icon click
            $(searchView).on("searchIconFocus", handleSearchIconFocus);
            $(searchView).on("searchIconFocusOut", handleSearchIconFocusOut);


            //ROTATION
            $(rotationHandler).on("setRotation", handleRotationChange);


            //sort Click
            $(playlistView).on("sortEnabled", handleSortEnabled);
            $(playlistView).on("sortDisabled", handleSortDisabled);
        },

        handleTrackPick = function (event, src, title) {
            controlsView._handleTrackPicked(src, title);
        },

        handleResetPlayer = function () {
            controlsView._resetPlayer();
        },

        handleTrackEnd = function () {
            playlistView.handlePrevOrNextClicked("next");
        },

        handleShowLoadingAnimation = function () {
            playlistView.showLoadingAnimation();
        },

        handleHideLoadingAnimation = function () {
            playlistView.hideLoadingAnimation();
        },

        handleSearchButtonClickedEchoNest = function (event, searchVal, pickedTab, option, trackID) {
            mainModel.searchEchoNestTracks(searchVal, pickedTab, option, trackID);
        },

        handleSearchEchoNestSimilarTracks = function (event, query) {
            mainModel.searchEchoNestSimilarTracks(query);
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
            controlsView._handleTrackPicked(streamUrl, title);
        },

        handleEchoNestTrackSearchResultsComplete = function (event, query, tracks) {
            chooseTitleView._setEchoNestTrackIdPicker(query, tracks);
        },

        handleSoundcloudTrackSearchResultsComplete = function (event, tracks) {
            chooseTitleView._setSoundcloudTrackPicker(tracks);
        },

        handleTrackIdPicked = function (event, query, type, visibleDropdownValue, trackID) {
            mainModel.searchEchoNestTracks(query, type, visibleDropdownValue, trackID);
        },

        handleSavePlaylistClicked = function (event, JSONPlaylist, playlistName) {
            playlistManager.startPlaylistPost(JSONPlaylist, playlistName);
        },

        handleUserPlaylistTitlesLoaded = function (event, title, date, length, playlistId, JSONPlaylist) {
            userPlaylistView.setUserPlaylistView(title, date, length, playlistId, JSONPlaylist);
        },

        handleUserPlaylistLoaded = function (event, playlist) {
            playlistView.addPlaylist(playlist);
        },

        handlePreviewPlayingStart = function () {
            controlsView._pauseTrack();
        },

        handlePreviewPlayingStop = function () {
            controlsView._playTrack();
        },

        handleLoginButtonClick = function (event, username, password) {
            playlistManager.login(username, password);
        },

        handleLogoutClick = function () {
            playlistManager.logOut();
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
        },

        handleDeleteUserPlaylist = function (event, playlistId) {
            playlistManager.deleteUserPlaylist(playlistId);
        },

        handleDeleteUserPlaylistSuccess = function () {
            userPlaylistView.removeUserPlaylist();
        },

        handlePlaylistCleared = function () {
            controlsView._resetPlayer();
            userPlaylistView.removeLoadedStatus();
        },

        handlePlaylistSpaceFillerClick = function () {
            searchView.scrollToSearchField();
        },

        handleRotationChange = function () {
            playlistView._resizePlaylistHeight();
        },

        handleSearchIconFocus = function () {
            controlsView._hideControlsBox();
            playlistView._fullPlaylistHeight();
        },

        handleSearchIconFocusOut = function () {
            controlsView._showControlsBox();
            playlistView._resizePlaylistHeight();
        },

        handleSortEnabled = function () {
            controlsView._showControlsBox();
        },

        handleSortDisabled = function () {
            controlsView._showControlsBox();
        };


    that.init = init;

    return that;

}());
