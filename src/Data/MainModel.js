/*** Created by Patrick on 19.11.2014.*/
App.MainModel = (function () {
    var that = {},
        sc_client_id = '23a3031c7cd251c7c217ca127777e48b',
        echoNestAPIKey = "N2U2OZ8ZDCXNV9DBG",
        scLimit = 50,
        searchLimit = 10,
        playlist = [],
        stringScoreTolerance = 0.5,
        requestInterval = null,

        init = function () {
            initSoundCloud();

            return that;
        },

        initSoundCloud = function () {
            SC.initialize({
                client_id: sc_client_id
            });
        },

        searchEchoNestTracks = function (srchObj) {
            $(that).trigger("showLoadingAnimation");
            var queryFactory = new QueryFactory();
            var queryBuilder = queryFactory.createQuery({
                type: srchObj.type,
                query: srchObj.query,
                option: srchObj.option,
                trackID: srchObj.trackID
            });

            $.ajax({
                type: "GET",
                url: queryBuilder.queryUrl,
                cache: false,
                success: function (jsonObject) {
                    var tracks = removeDuplicates(jsonObject.response.songs, "echoNest");
                    console.log(tracks)
                    searchSoundCloudTracks(tracks);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    swal("No results found for " + '"' + srchObj.query + '"' + " in " + srchObj.type, null, "error");
                    $(that).trigger("hideLoadingAnimation");
                }
            });
        },

        searchEchoNestSimilarTracks = function (srchObj) {
            var getIdQuery = "http://developer.echonest.com/api/v4/song/search?api_key=" + echoNestAPIKey + "&format=json&results=20" + "&title=" + srchObj.query + "&sort=song_hotttnesss-desc";
            $.ajax({
                type: "GET",
                url: getIdQuery,
                cache: false,
                success: function (jsonObject) {
                    var tracks = removeDuplicates(jsonObject.response.songs, "echoNest");
                    console.log(tracks)
                    $(that).trigger("echoNestTrackSearchResultsComplete", [srchObj.query, tracks]);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    swal("No results found for " + '"' + srchObj.query + '"' + " in " + srchObj.type, null, "error");
                }
            });
        },

        searchSoundcloudTracksSimple = function (srchObj) {
            $(that).trigger("showLoadingAnimation");
            playlist = [];
            $.ajax({
                url: getScUrl(srchObj.query),
                data: {
                    format: 'json'
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("ECHONEST ERROR " + errorThrown + " at" + XMLHttpRequest);
                },
                dataType: 'json',
                success: function (data) {
                    if (data.length != 0) {
                        var filteredTracks = filterResults(data, srchObj.query);
                        $(that).trigger("soundcloudTrackSearchResultsComplete", [filteredTracks]);
                    }
                    $(that).trigger("hideLoadingAnimation");
                },
                error: function () {
                    swal("No results found for " + '"' + srchObj.query + '"' + " in " + srchObj.type, null, "error");
                    $(that).trigger("hideLoadingAnimation");
                },
                type: 'GET'
            });
        },

        searchSoundCloudTracks = function (tracks) {
            playlist = [];
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
                            swal("No results found for " + '"' + query + '".', null, "error");
                            count--;
                        },
                        dataType: 'json',
                        success: function (data) {
                            count--;
                            if (data.length != 0) {
                                var filteredTracks = filterResults(data, query);
                                console.log("QUERY ", query);
                                addToPlayList(filteredTracks);
                            }
                            if (count == 0) {
                                playlist = removeDuplicates(playlist, "soundCloud");
                                setPlaylistView();
                                clearInterval(requestInterval);
                                $(that).trigger("hideLoadingAnimation");
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
                                var filteredTracks = filterResults(data, query);
                                console.log("QUERY ", query);
                                addToPlayList(filteredTracks);
                            }
                        },
                        type: 'GET'
                    });
                }
                ajaxCalls.push(ajaxCaller(queryOne));
            }
             $.when.apply($, ajaxCalls).done(function () {
                playlist = removeDuplicates(playlist);
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

        removeDuplicates = function (tracks, sender) {
            var uniqueTracks = [];
            var indentification = [];
            indentification.length = tracks.length;

            var result = [];
            $.each(indentification, function (i, e) {
                if (sender == "echoNest")
                    indentification[i] = tracks[i].artist_name + " - " + tracks[i].title;
                else indentification[i] = tracks[i].id;
                if ($.inArray(indentification[i], result) == -1) {
                    result.push(indentification[i]);
                    uniqueTracks.push(tracks[i])
                }
            });
            return uniqueTracks;
        },


        addToPlayList = function (filteredTracks) {
            var tracks = [];

            //sort tracks by score
            filteredTracks.sort(sortByFavoritingsCount);
            //take tracks with best match
            for (var i = 0; i < 20; i++) {
                tracks[i] = filteredTracks[i];
            }
            //sort tracks by playback_count
            tracks.sort(sortByFavoritingsCount);
            // console.log(tracks[0].title);
            //take the first element
            if (tracks[0] != undefined)
                playlist.push(tracks[0]);

        },

        filterResults = function (tracks, query) {
            var count = 0;
            var filteredTracks = [];

            for (var i in tracks) {
                var currentTitle = tracks[i].title;
                currentTitle = normalize(currentTitle);
                // console.log(currentTitle);

                var score = currentTitle.score(query),
                    streamable = tracks[i].streamable,
                    sharing = tracks[i].sharing,
                    duration = tracks[i].duration;

                if (score > stringScoreTolerance && streamable == true && sharing == "public" && duration > 90000) {
                    count++;
                    tracks[i].score = score;
                    filteredTracks.push(tracks[i]);
                }
            }
            return filteredTracks;
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
    that.init = init;

    return that;
}());