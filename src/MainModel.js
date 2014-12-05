/*** Created by Patrick on 19.11.2014.*/
App.MainModel = (function () {
    var that = {},
        sc_client_id = '23a3031c7cd251c7c217ca127777e48b',
        echoNestAPIKey = "N2U2OZ8ZDCXNV9DBG",
        limit = 200,
        properTracks = [],
        playlist = [],
        stringScoreTolerance = 0.5,
        currentPlaylistItem = 0,

        init = function () {
            initSoundCloud();
        },

        initSoundCloud = function () {
            SC.initialize({
                client_id: sc_client_id
            });
        },

        searchEchoNestTracks = function (searchVal, lowerVal, upperVal) {
            console.log(lowerVal);
            var artist = searchVal;
            $.ajax({
                type: "GET",
                url: "https://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&format=json&artist=" + artist + "&artist_start_year_after=" + lowerVal + "&artist_start_year_before=" + upperVal + "&sort=song_hotttnesss-desc&results=80",
                cache: false,
                success: function (jsonObject) {
                    for (var i = 0; i < jsonObject.response.songs.length; i++) {
                        var artist = normalize(jsonObject.response.songs[i].artist_name);
                        var title = normalize(jsonObject.response.songs[i].title);
                        // console.log(artist + title);
                        searchSoundCloudTracks(artist, title, jsonObject.response.songs.length - 1, i);
                    }
                    playPlaylist();
                    //searchSoundCloudTracks(spotifyArtist, spotifyTitle);
                    // searchSoundCloudTracks("calvin harris", "blame");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
                }
            });
        },

        searchSoundCloudTracks = function (artist, title, index, currentIndex) {
            var queryOne = artist + " " + title;
            var queryTwo = title + " " + artist;
            var queryThree = title;

            $.ajax({
                url: getAjaxUrl(queryOne),
                data: {
                    format: 'json'
                },
                error: function () {
                },
                dataType: 'json',
                success: function (data) {
                    properTracks = [];
                    deleteNotMatchingResults(data, queryOne);
                    addToPlayList();
                    playPlaylist();
                    console.log(currentIndex, index)
                    if (currentIndex == index)playPlaylist();
                },
                type: 'GET'
            });
            /***
             $.ajax({
                url: getAjaxUrl(queryTwo),
                data: {
                    format: 'json'
                },
                error: function () {

                },
                dataType: 'json',
                success: function (data) {
                  //  deleteNotMatchingResults(data, queryTwo);
                },
                type: 'GET'
            });
             $.ajax({
                url: getAjaxUrl(queryThree),
                data: {
                    format: 'json'
                },
                error: function () {

                },
                dataType: 'json',
                success: function (data) {
                    //deleteNotMatchingResults(data, queryOne);
                    //createPlaylist();
                    //playTrack(getBestTrack().stream_url);
                },
                type: 'GET'
            });
             ***/
        },
        addToPlayList = function () {
            var tracks = [];
            //sort tracks by score
            tracks.sort(sortByScore);
            //take tracks with best match
            for (var i = 0; i < 20; i++) {
                tracks[i] = properTracks[i];
                // iterateArray(tracks);
            }

            //sort tracks by playback_count
            tracks.sort(sortByFavoritingsCount);

            // console.log(tracks[0].title);
            console.log("playbackcount " + tracks[0].playback_count);
            console.log(tracks[0].score);
            //take the first element
            playlist.push(tracks[0]);
            console.log(playlist);
        },

        deleteNotMatchingResults = function (tracks, query) {
            var count = 0;
            for (var i = 0; i < tracks.length; i++) {

                var currentTitle = tracks[i].title;
                currentTitle = normalize(currentTitle);
                //console.log(currentTitle);
                // console.log(tracks[i].title);

                var score = currentTitle.score(query);

                var streamable = tracks[i].streamable;
                var sharing = tracks[i].sharing;
                //console.log(score);
                //console.log(query + " " + currentTitle);
                if (score > stringScoreTolerance && streamable == true && sharing == "public") {
                    count++;
                    tracks[i].score = score;
                    //console.log(score);
                    properTracks.push(tracks[i]);
                }
            }
            //  console.log("count");
            //console.log(count);
            //   console.log(properTracks.length);
        },

        sortByScore = function (a, b) {
            return b.score - a.score;
        },

        sortByFavoritingsCount = function (a, b) {
            return b.favoritings_count - a.favoritings_count;
        },

        sortByPlaybackCount = function (a, b) {
            return b.playback_count - a.playback_count;
        },

        normalize = function (string) {
            return string.replace("-", " ").replace(/[^\w\s.]/gi, ' ').replace(/\s{2,}/g, ' ').toLowerCase().trim();
        },

        playTrack = function () {
            var src = streamUrl + '?client_id=' + sc_client_id;
            $(that).trigger("trackPicked", [src]);
        },

        playPlaylist = function () {
            var src = playlist[currentPlaylistItem].stream_url + '?client_id=' + sc_client_id;
            $(that).trigger("trackPicked", [src])
        },

        getNextTrack = function () {
            currentPlaylistItem++;
            var src = playlist[currentPlaylistItem].stream_url + '?client_id=' + sc_client_id;
            $(that).trigger("trackPicked", [src])
        },

        iterateArray = function (array) {
            for (var i = 0; i < array.length; i++) {
                //console.log(array[i]);
                console.log(array[i].score);
                console.log(array[i].playback_count);
                console.log(array[i].permalink_url);

            }
            console.log(array.length);
        },

        getAjaxUrl = function (query) {
            return "https://api.soundcloud.com/tracks?filter=public&streamable=true&q=" + query + "&client_id=" + sc_client_id + "&format=json&limit=" + limit + "&duration[from]=250000&duration[to]=800000";
        };

    that.searchEchoNestTracks = searchEchoNestTracks;
    that.getNextTrack = getNextTrack;
    that.init = init;

    return that;
}());