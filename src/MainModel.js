/*** Created by Patrick on 19.11.2014.*/
App.MainModel = (function () {
    var that = {},
        sc_client_id = '23a3031c7cd251c7c217ca127777e48b',
        echoNestAPIKey = "N2U2OZ8ZDCXNV9DBG",
        scLimit = 100,
        searchLimit = 10,
        playlist = [],
        completePlaylist = [],
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

        searchEchoNestTracks = function (query, type, lowerVal, upperVal, visibleDropdownValue) {
            if (type == "track-tab" && visibleDropdownValue == "similar")
                searchEchoNestSimilarTracks(query);
            else $.ajax({
                type: "GET",
                url: buildEchoNestUrl(query, type, lowerVal, upperVal, visibleDropdownValue),
                cache: false,
                success: function (jsonObject) {
                    var tracks = removeDuplicates(jsonObject.response.songs);
                    console.log(tracks)
                    playlist = [];
                    searchSoundCloudTracks(tracks, "soundcloud", query);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
                }
            });
        },

        buildEchoNestUrl = function (query, type, lowerVal, upperVal, visibleDropdownValue) {
            switch (type) {
                case "artist-tab":
                    return echoNestArtistQueryBuilder(query, visibleDropdownValue);
                    break;
                case "track-tab":
                    return echoNestTrackQueryBuilder();
                    break;
                case "genre-tab":
                    return echoNestGenreQueryBuilder(query, visibleDropdownValue);
                    break;
            }
        },

        echoNestArtistQueryBuilder = function (query, visibleDropdownValue) {
            switch (visibleDropdownValue) {
                case "hottest":
                    return "https://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&format=json&artist=" + query + "&sort=song_hotttnesss-desc&results=" + searchLimit;
                    break;
                case "similar":
                    return "https://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&format=json&artist=" + query + "&type=artist-radio&song_selection=song_hotttnesss-top&results=" + searchLimit;
                    break;
            }
        },

        echoNestTrackQueryBuilder = function () {
            return "http://developer.echonest.com/api/v4/song/search?api_key=" + echoNestAPIKey + "&sort=song_hotttnesss-desc&bucket=song_hotttnesss";
        },

        echoNestGenreQueryBuilder = function (query, visibleDropdownValue) {
            return "https://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&format=json&genre=" + query + "&type=genre-radio&song_selection=" + visibleDropdownValue + "&results=" + searchLimit;
        },

        searchEchoNestSimilarTracks = function (query) {
            var getIdQuery = "http://developer.echonest.com/api/v4/song/search?api_key=" + echoNestAPIKey + "&format=json&results=20" + "&title=" + query + "&sort=song_hotttnesss-desc";

            $.ajax({
                type: "GET",
                url: getIdQuery,
                cache: false,
                success: function (jsonObject) {
                    var tracks = jsonObject.response.songs;
                    $(that).trigger("echoNestTrackSearchResultsComplete", [tracks]);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
                }
            });
        },

        searchSimilarTracksById = function (trackId, query) {
            var searchUrl = "http://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&song_id=" + trackId + "&format=json&results=20&type=song-radio";
            $.ajax({
                type: "GET",
                url: searchUrl,
                cache: false,
                success: function (jsonObject) {
                    var tracks = jsonObject.response.songs;
                    playlist = [];
                    searchSoundCloudTracks(tracks, "soundcloud", query);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
                }
            });
        },

        searchSpotifyTracks = function (query, type, lowerVal, upperVal, visibleDropdownValue) {
            var artist = query;
            $.ajax({
                type: "GET",
                url: buildSpotifyUrl(query, type, lowerVal, upperVal, visibleDropdownValue),
                cache: false,
                success: function (data) {
                    var tracks = data.tracks.items;
                    playlist = [];
                    searchSoundCloudTracks(tracks, "spotify", artist);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
                }
            });
        },

        buildSpotifyUrl = function (query, type, lowerVal, upperVal, visibleDropdownValue) {
            switch (type) {
                case "artist-tab":
                    return spotifyArtistQueryBuilder(query, lowerVal, upperVal, visibleDropdownValue);
                    break;
                case "genre-tab":
                    return spotifyGenreQueryBuilder(query, lowerVal, upperVal, visibleDropdownValue);
                    break;
                case "track-tab":
                    return spotifyTrackQueryBuilder(query, visibleDropdownValue);
            }
        },

        spotifyArtistQueryBuilder = function (query, lowerVal, upperVal, visibleDropdownValue) {
            switch (visibleDropdownValue) {
                case "year":
                    return "https://api.spotify.com/v1/search?q=" + query + "+year:" + lowerVal.toString() + "-" + upperVal.toString() + "&type=track&limit=" + searchLimit;
                    break;
                case "newest":
                    return "https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=" + searchLimit;
                    break;
            }
        },

        spotifyGenreQueryBuilder = function (query, lowerVal, upperVal, visibleDropdownValue) {
            switch (visibleDropdownValue) {
                case "newest":
                    return "https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=" + searchLimit;
                    break;
            }
        },

        searchSoundcloudTracksSimple = function (query) {
            playlist = [];
            ajaxQuery(query);
            function ajaxQuery(query) {
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
                            $(that).trigger("soundcloudTrackSearchResultsComplete", [matchingTracks]);
                            console.log("QUERY ", query);
                        }
                    },
                    type: 'GET'
                });
            }
        },

        searchSoundCloudTracks = function (tracks, usedAPI, artistQuery) {
            var ajaxCalls = [];
            var artist = null;
            var title = null;
            var queryOne = null;
            tracks = removeDuplicates(tracks);
            for (var i in tracks) {
                if (usedAPI == "spotify") {
                    queryOne = artistQuery + " " + normalize(tracks[i].name);
                }
                else {
                    artist = normalize(tracks[i].artist_name);
                    title = normalize(tracks[i].title);
                    queryOne = artist + " " + title;
                }
                var queryTwo = title + " " + artist;
                var queryThree = title;
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
                            console.log(data)
                            if (data.length != 0) {
                                var matchingTracks = getMatchingResults(data, query);
                                console.log("QUERY ", query);
                                addToPlayList(removeDuplicates(matchingTracks));
                            }
                        },
                        type: 'GET'
                    });
                }
                ajaxCalls.push(ajaxCaller(queryOne));
            }
            $.when.apply($, ajaxCalls).done(function () {
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

        removeDuplicates = function (tracks) {
            var uniqueObjects = [];
            $.each(tracks, function (i, el) {
                if ($.inArray(el, uniqueObjects) === -1) uniqueObjects.push(el);
            });
            return uniqueObjects;
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
            matchingTracks = removeDuplicates(matchingTracks);
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

        setPlaylistView = function () {
            $(that).trigger("playlistCreated", [playlist]);
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
        };

    that.searchEchoNestTracks = searchEchoNestTracks;
    that.searchSpotifyTracks = searchSpotifyTracks;
    that.searchSoundcloudTracksSimple = searchSoundcloudTracksSimple;
    that.searchSimilarTracksById = searchSimilarTracksById;
    that.init = init;

    return that;
}());