/*** Created by Patrick on 19.11.2014.*/
App.MainModel = (function () {
    var that = {},
        sc_client_id = '23a3031c7cd251c7c217ca127777e48b',
        echoNestAPIKey = "N2U2OZ8ZDCXNV9DBG",
        scLimit = 50,
        searchLimit = 10,
        playlist = [],
        completePlaylist = [],
        stringScoreTolerance = 0.5,
        currentPlaylistItem = 0,
        requestInterval = null,

        init = function () {
            initSoundCloud();
        },

        initSoundCloud = function () {
            SC.initialize({
                client_id: sc_client_id
            });
        },

        searchEchoNestTracks = function (query, type, visibleDropdownValue, trackID) {
                var queryFactory = new QueryFactory();
                var queryBuilder = queryFactory.createQuery({
                    type: type,
                    query: query,
                    option: visibleDropdownValue,
                    trackID: trackID
                });
                $.ajax({
                    type: "GET",
                    url: queryBuilder.queryUrl,
                    cache: false,
                    success: function (jsonObject) {
                        var tracks = removeEchoNestDuplicates(jsonObject.response.songs);
                        console.log(tracks)
                        playlist = [];
                        searchSoundCloudTracks(tracks, "soundcloud", query);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("ECHONEST ERROR " + errorThrown + " at" + XMLHttpRequest);
                    }
                });
        },

        searchEchoNestSimilarTracks = function (query) {
            var getIdQuery = "http://developer.echonest.com/api/v4/song/search?api_key=" + echoNestAPIKey + "&format=json&results=20" + "&title=" + query + "&sort=song_hotttnesss-desc";

            $.ajax({
                type: "GET",
                url: getIdQuery,
                cache: false,
                success: function (jsonObject) {
                    var tracks = removeEchoNestDuplicates(jsonObject.response.songs);
                    $(that).trigger("echoNestTrackSearchResultsComplete", [query, tracks]);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
                }
            });
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
                        alert("ECHONEST ERROR " + errorThrown + " at" + XMLHttpRequest);
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

        searchSoundCloudTracks = function (tracks) {
            var count = tracks.length;

            requestInterval = setInterval(function () {
                if (count > 0 && tracks.length > 0) {
                    var artist = normalize(tracks[0].artist_name);
                    var title = normalize(tracks[0].title);
                    var query = artist + " " + title;
                    ajaxQuery(query)
                }
                tracks.splice(0, 1);

                function ajaxQuery(query) {
                    return $.ajax({
                        url: getScUrl(query),
                        data: {
                            format: 'json'
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("SOUNDCLOUD ERROR " + errorThrown + " at" + XMLHttpRequest);
                            count--;
                        },
                        dataType: 'json',
                        success: function (data) {
                            count--;
                            //console.log(data)
                            if (data.length != 0) {
                                var matchingTracks = getMatchingResults(data, query);
                                console.log("QUERY ", query);
                                addToPlayList(matchingTracks);
                            }
                            if (count == 0) {
                                playlist = removeSoundCloudDuplicates(playlist);
                                setPlaylistView();
                                clearInterval(requestInterval);
                            }
                        },
                        type: 'GET'
                    });
                }
            }, 200);


            /** OLD
             *   var ajaxCalls = [];
             var artist = null;
             var title = null;
             var queryOne = null;
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
                            alert("SOUNDCLOUD ERROR " + errorThrown + " at" + XMLHttpRequest);
                        },
                        dataType: 'json',
                        success: function (data) {
                            console.log(data)
                            if (data.length != 0) {
                                var matchingTracks = getMatchingResults(data, query);
                                console.log("QUERY ", query);
                                addToPlayList(matchingTracks);
                            }
                        },
                        type: 'GET'
                    });
                }
                ajaxCalls.push(ajaxCaller(queryOne));
            }
             $.when.apply($, ajaxCalls).done(function () {
                playlist = removeSoundCloudDuplicates(playlist);
                setPlaylistView();
            })
             */

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

        removeEchoNestDuplicates = function (tracks) {
            var uniqueTracks = [];
            var artistAndTitle = [];
            artistAndTitle.length = tracks.length;

            var result = [];
            $.each(artistAndTitle, function (i, e) {
                artistAndTitle[i] = tracks[i].artist_name + " - " + tracks[i].title;
                if ($.inArray(artistAndTitle[i], result) == -1) {
                    result.push(artistAndTitle[i]);
                    uniqueTracks.push(tracks[i])
                }
            });
            return uniqueTracks;
        },

        removeSoundCloudDuplicates = function (tracks) {
            var uniqueTracks = [];
            var artistAndTitle = [];
            artistAndTitle.length = tracks.length;

            var result = [];
            $.each(artistAndTitle, function (i, e) {
                artistAndTitle[i] = tracks[i].id;
                if ($.inArray(artistAndTitle[i], result) == -1) {
                    result.push(artistAndTitle[i]);
                    uniqueTracks.push(tracks[i]);
                }
            });
            return uniqueTracks;
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

        setPlaylistView = function () {
            console.log("CREATED")
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
    that.searchEchoNestSimilarTracks = searchEchoNestSimilarTracks;
    that.searchSoundcloudTracksSimple = searchSoundcloudTracksSimple;
    that.searchSimilarTracksById = searchSimilarTracksById;
    that.init = init;

    return that;
}());