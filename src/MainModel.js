/*** Created by Patrick on 19.11.2014.*/
App.MainModel = (function () {
    var that = {},
        sc_client_id = '23a3031c7cd251c7c217ca127777e48b',
        echoNestAPIKey = "N2U2OZ8ZDCXNV9DBG",
        scLimit = 200,
        echoNestLimit = 10,
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
            var artist = searchVal;
            $.ajax({
                type: "GET",
                url: "https://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&format=json&artist=" + artist + "&artist_start_year_after=" + lowerVal + "&artist_start_year_before=" + upperVal + "&sort=song_hotttnesss-desc&results=" + echoNestLimit,
                cache: false,
                success: function (jsonObject) {
                    var tracks = jsonObject.response.songs;
                    playlist = [];
                    $("#playlist-box").css("background-color", "red");
                    searchSoundCloudTracks(tracks);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
                }
            });
        },

        searchSoundCloudTracks = function (echoNestData) {
            var ajaxCalls = [];
            for (var i in echoNestData) {
                var artist = normalize(echoNestData[i].artist_name);
                var title = normalize(echoNestData[i].title);
                var queryOne = artist + " " + title;
                var queryTwo = title + " " + artist;
                var queryThree = title;
                console.log("query ", queryOne);
                var ajaxCaller = function ajaxQuery(query) {
                    return $.ajax({
                        url: getScUrl(query),
                        data: {
                            format: 'json'
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.length != 0) {
                                var matchingTracks = getMatchingResults(data, query);
                                console.log("QUERY ", query);
                                // iterateArray(data);
                                addToPlayList(matchingTracks);

                            }
                        },
                        type: 'GET'
                    });
                }
                ajaxCalls.push(ajaxCaller(queryOne));
            }
            $.when.apply($, ajaxCalls).done(function () {
                $("#playlist-box").css("background-color", "green");
                playPlaylist();
                setPlaylistView();

            })
            /***
             $.ajax({
                url: getScUrl(queryTwo),
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
                url: getScUrl(queryThree),
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

        addToPlayList = function (matchingTracks) {
            var tracks = [];

            //sort tracks by score
            matchingTracks.sort(sortByFavoritingsCount);
            //take tracks with best match
            for (var i = 0; i < 20; i++) {
                tracks[i] = matchingTracks[i];
            }
            //sort tracks by playback_count
            tracks.sort(sortByFavoritingsCount);
            // console.log(tracks[0].title);
            //take the first element
            if (tracks[0] != undefined)
                playlist.push(tracks[0]);
        },

        getMatchingResults = function (tracks, query) {
            var count = 0;
            var matchingTracks = [];

            for (var i in tracks) {
                var currentTitle = tracks[i].title;
                currentTitle = normalize(currentTitle);
                // console.log(currentTitle);

                var score = currentTitle.score(query);
                var streamable = tracks[i].streamable;
                var sharing = tracks[i].sharing;
                var duration = tracks[i].duration;

                if (score > stringScoreTolerance && streamable == true && sharing == "public" && duration > 90000) {
                    count++;
                    tracks[i].score = score;
                    matchingTracks.push(tracks[i]);
                }
            }
            return matchingTracks;
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


        playPlaylist = function () {
            $(that).trigger("trackPicked", [getSrcUrl()]);
            console.log("playlist ", playlist);
            for (var i = 0; i < playlist.length; i++) {
                console.log("title ", playlist[i].title, " ", playlist[i].favoritings_count)
            }
        },

        setPlaylistView = function () {
            $(that).trigger("playlistCreated", [playlist]);
        },

        playNextTrack = function () {
            if (currentPlaylistItem < playlist.length - 1) {
                currentPlaylistItem++;
                $(that).trigger("trackPicked", [getSrcUrl()]);
            }
        },

        playPreviousTrack = function () {
            if (currentPlaylistItem > 0) {
                currentPlaylistItem--;
                $(that).trigger("trackPicked", [getSrcUrl()]);
            }
        },

        iterateArray = function (array) {
            for (var i = 0; i < array.length; i++) {
                //console.log(array[i]);
                console.log(array[i].score);
                console.log(array[i].favoritings_count);
                console.log(array[i].permalink_url);
            }
            console.log(array.length);
        },

        getScUrl = function (query) {
            return "https://api.soundcloud.com/tracks?&q=" + query + "&client_id=" + sc_client_id + "&limit=" + scLimit;
        },

        getSrcUrl = function () {
            var src = playlist[currentPlaylistItem].stream_url + '?client_id=' + sc_client_id;
            return src;
        };

    that.searchEchoNestTracks = searchEchoNestTracks;
    that.playNextTrack = playNextTrack;
    that.playPreviousTrack = playPreviousTrack;
    that.init = init;

    return that;
}());