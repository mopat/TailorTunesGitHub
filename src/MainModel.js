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
            var query = "david guetta dangerous";
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
                    tracks = deleteNotMatchingResults(data, query);
                    tracks.sort(sortByFavoritingsCount);

                    bestResult = tracks[0];
                    console.log(bestResult.title);
                    playTrack(bestResult.stream_url);

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

        getBestScoreAndCountTrack = function (tracks) {
            var bestTrack = null;
            for (var i = 0; i < tracks.length - 1; i++) {
                var currentTrack = tracks[i];
                var nextTrack = tracks[i + 1];
                if (currentTrack.favoritings_count > nextTrack.favoritings_count) {
                    bestTrack = currentTrack;
                }
                else {
                    bestTrack = nextTrack;
                }
            }
            console.log(bestTrack.favoritings_count);
            return bestTrack;
        },

        deleteNotMatchingResults = function (tracks, query) {
            var properTracks = [];
            for (var i = 0; i < tracks.length; i++) {

                var currentTitle = tracks[i].title;
                currentTitle = normalize(currentTitle);
                query = normalize(query);
                //console.log(currentTitle);
                // console.log(tracks[i].title);

                var score = currentTitle.score(query);
                var streamable = tracks[i].streamable;
                var sharing = tracks[i].sharing;
                //console.log(score);
                //console.log(query + " " + currentTitle);
                if (score > 0.6 && streamable == true && sharing == "public") {
                    tracks[i].score = score;
                    properTracks.push(tracks[i]);
                }
            }
            properTracks.sort(sortByScore);
            iterateArray(properTracks);
            return properTracks;
        },

        sortByScore = function (a, b) {
            return b.score - a.score;
        },

        normalize = function (string) {
            return string.replace("-", " ").replace(/[^\w\s.]/gi, ' ').replace(/\s{2,}/g, ' ').toLowerCase().trim();
        },

        playTrack = function (streamUrl) {
            $('#player').attr('src', streamUrl + '?client_id=' + client_id);
            var audioPlayer = document.getElementById("player");
            audioPlayer.addEventListener("ended", function () {
                searchSoundCloudTracks("Hel");
            });
        },

        iterateArray = function (array) {
            for (var i = 0; i < array.length; i++) {
                console.log(array[i]);
                console.log(array[i].score);
                console.log(array[i].favoritings_count);
                console.log(array[i].permalink_url);
            }

        }

    that.init = init;

    return that;
}());