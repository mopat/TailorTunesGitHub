/*** Created by Patrick on 19.11.2014.*/
App.MainController = (function () {
    var that = {},
        mainModel = null,
        playlistView = null,
        controlsView = null,
        searchView = null,
        pickTrackView = null,
        userPlaylistManager = null,
        userManager = null,
        userPlaylistView = null,
        userManagementView = null,
        rotationHandler = null,

        init = function () {
            mainModel = App.MainModel.init();
            playlistView = App.PlaylistView.init();
            controlsView = App.ControlsView.init();
            searchView = App.SearchView.init();
            pickTrackView = App.PickTrackView;
            userPlaylistManager = App.UserPlaylistManager.init();
            userManager = App.UserManager.init();
            userPlaylistView = App.UserPlaylistView.init();
            userManagementView = App.UserManagementView.init();
            rotationHandler = App.RotationHandler.init();


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
            $(pickTrackView).on("echonestTrackIDPicked", handleTrackIdPicked);
            //ZUSAMMEN END
            $(mainModel).on("showLoadingAnimation", handleShowLoadingAnimation);
            $(mainModel).on("hideLoadingAnimation", handleHideLoadingAnimation);
            $(searchView).on("searchButtonClickedSoundcloud", handleSearchButtonClickedSoundcloud);
            $(mainModel).on("echoNestTrackSearchResultsComplete", handleEchoNestTrackSearchResultsComplete);
            $(mainModel).on("soundcloudTrackSearchResultsComplete", handleSoundcloudTrackSearchResultsComplete);
            $(pickTrackView).on("soundcloudTrackPicked", handleSoundlcoudTrackPicked);

            //user playlist management
            $(playlistView).on("savePlaylistClicked", handleSavePlaylistClicked);
            $(userPlaylistManager).on("userPlaylistTitlesLoaded", handleUserPlaylistTitlesLoaded);
            $(userPlaylistView).on("userPlaylistLoaded", handleUserPlaylistLoaded);
            $(userPlaylistManager).on("emptyOldUserPlaylistView", handleEmptyUserPlaylistView);
            //playing user playlist
            $(userPlaylistView).on("previewPlayingStart", handlePreviewPlayingStart);
            $(userPlaylistView).on("previewPlayingStop", handlePreviewPlayingStop);

            initUserAndPlaylistManagementHandler();


            //search icon click
            $(searchView).on("searchIconFocus", handleSearchIconFocus);
            $(searchView).on("searchIconFocusOut", handleSearchIconFocusOut);


            //ROTATION
            $(rotationHandler).on("setRotation", handleRotationChange);


            //sort Click
            $(playlistView).on("sortEnabled", handleSortEnabled);
            $(playlistView).on("sortDisabled", handleSortDisabled);
        },

        initUserAndPlaylistManagementHandler = function () {
            //login, signin, show playlists
            $(userManagementView).on("loginButtonClicked", handleLoginButtonClick);
            $(userManager).on("loginSuccessful", handleLoginSuccessful);
            $(userManager).on("loginFailed", handleLoginFailed);
            //signin
            $(userManagementView).on("signInButtonClick", handleSignInButtonClick);
            $(userManager).on("signInSuccessful", handleSignInSuccessful);
            $(userManager).on("signInFailed", handleSignInFailed);
            //Logout, show playlists
            $(userManagementView).on("handleLogoutClicked", handleLogoutClick);
            $(userManagementView).on("myPlaylistsAnchorClick", handleMyPlaylistsAnchorClick);
            //delete user playlist
            $(userPlaylistView).on("deleteUserPlaylist", handleDeleteUserPlaylist);
            $(userPlaylistManager).on("userPlaylistDeleteSuccess", handleDeleteUserPlaylistSuccess);
            //empty playlist
            $(userManagementView).on("emptyOldUserPlaylistView", handleEmptyUserPlaylistView);
            $(playlistView).on("playlistCleared", handlePlaylistCleared);
            $(playlistView).on("playlistSpaceFillerClicked", handlePlaylistSpaceFillerClick);
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
            pickTrackView._setEchoNestTrackIdPicker(query, tracks);
        },

        handleSoundcloudTrackSearchResultsComplete = function (event, tracks) {
            pickTrackView._setSoundcloudTrackPicker(tracks);
        },

        handleTrackIdPicked = function (event, query, type, visibleDropdownValue, trackID) {
            mainModel.searchEchoNestTracks(query, type, visibleDropdownValue, trackID);
        },

        handleSavePlaylistClicked = function (event, JSONPlaylist, playlistName) {
            userPlaylistManager._startPlaylistPost(JSONPlaylist, playlistName);
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
            userManager._logIn(username, password);
        },

        handleLogoutClick = function () {
            userManager._logOut();
        },

        handleLoginSuccessful = function () {
            userManagementView._loginSuccessful();
            userPlaylistManager._loadPlaylists();
        },

        handleSignInSuccessful = function () {
            userManagementView._loginSuccessful();
        },

        handleLoginFailed = function (event, errorMessage) {
            userManagementView._loginFailed(errorMessage);
        },

        handleMyPlaylistsAnchorClick = function () {
            userPlaylistView.openUserPlaylistModal();
        },

        handleEmptyUserPlaylistView = function () {
            userPlaylistView.emptyUserPlaylistModal();
        },

        handleSignInButtonClick = function (event, username, password, email) {
            userManager._signIn(username, password, email);
        },

        handleSignInFailed = function (event, errorMessage) {
            userManagementView._signInFailed(errorMessage);
        },

        handleDeleteUserPlaylist = function (event, playlistId) {
            userPlaylistManager._deleteUserPlaylist(playlistId);
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
