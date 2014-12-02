/*** Created by Patrick on 19.11.2014.*/
App.MainModel = (function () {
    var that = {},
        client_id = '23a3031c7cd251c7c217ca127777e48b',
        limit = 200,

        init = function () {
            console.log("MM");
            initSoundCloud();
            getSpotifyTracks();
        },

        initSoundCloud = function () {
// initialize client with app credentials
            SC.initialize({
                client_id: client_id
            });
        },

        getSpotifyTracks = function () {
            var bestSpotifyTrack = null;
            $.ajax({
                type: "GET",
                url: "https://developer.echonest.com/api/v4/playlist/static?api_key=N2U2OZ8ZDCXNV9DBG&format=json&artist=snoop+dogg&artist_start_year_after=1991&artist_start_year_before=2000&sort=song_hotttnesss-desc&results=80",
                cache: false,
                success: function (jsonObject) {
                    bestSpotifyTrack = jsonObject.response.songs[0].artist_name + " " + jsonObject.response.songs[0].title;
                    //console.log(jsonObject.response.songs);
                    searchSoundCloudTracks(bestSpotifyTrack);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
                }
            });
        },

        searchSoundCloudTracks = function (query) {
            console.log(query);
            //Optimierung: der track mit den meisten plays oder favorite counts der am besten gleich query
            var query = "robin schulz sun goes down";
            var searchURL = "https://api.soundcloud.com/tracks?filter=public&streamable=true&q=" + query + "&client_id=" + client_id + "&format=json&limit=" + limit + "&duration[from]=250000&duration[to]=800000";
            var bestResult = null;
            var tracks = [];
            $.ajax({
                url: searchURL,
                data: {
                    format: 'json'
                },
                error: function () {

                },
                dataType: 'json',
                success: function (data) {
                    tracks = data;
                    tracks = deleteNotMatchingResults(tracks, query);
                    tracks.sort(sortByPlaybackCount);
                    //console.log(tracks);
                    //for (var i = 0; i < tracks.length; i++) {
                    // console.log(tracks[i].playback_count);
                    //}
                    for (var i = 0; i < tracks.length; i++) {
                        if (tracks[i].streamable == true) {
                            console.log(i);
                            console.log(tracks[i].stream_url);
                            bestResult = tracks[i];
                            break;
                        }
                    }
                    console.log(bestResult.title);

                    $('#player').attr('src', bestResult.stream_url + '?client_id=' + client_id);
                    var audioPlayer = document.getElementById("player");
                    audioPlayer.addEventListener("ended", function () {
                        searchSoundCloudTracks("Hel");
                    });
                },
                type: 'GET'
            });
        },

        sortByFavoritingsCount = function (a, b) {
            return b.favoritings_count - a.favoritings_count;
        },

        sortByPlaybackCount = function (a, b) {
            return b.playback_count - a.playback_count;

        },

        deleteNotMatchingResults = function (tracks, query) {

            for (var i = 0; i < tracks.length; i++) {
                var currentTitle = tracks[i].title;
                currentTitle = normalize(currentTitle);
                query = normalize(query);
                //console.log(currentTitle);
                // console.log(tracks[i].title);

                var index = indexOfBoyerMoore
                    // the needle
                (query,
                    // the haystack
                    currentTitle
                );
                console.log(index);
                console.log(query + " " + currentTitle);
                if (currentTitle.toLowerCase().indexOf(query) == -1) {
                    console.log("delete");
                    tracks.slice(i, 1);
                }
            }
            console.log(tracks);
            return tracks;
        },

        normalize = function (string) {
            return string.replace("-", " ").replace(/[^\w\s]/gi, ' ').replace(/\s{2,}/g, ' ').toLowerCase().trim();
        }

    playTrack = function () {

        };

    that.init = init;

    return that;
}());