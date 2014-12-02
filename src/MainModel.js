/*** Created by Patrick on 19.11.2014.*/
App.MainModel = (function () {
    var that = {},
        client_id = '23a3031c7cd251c7c217ca127777e48b',
        limit = 200,
        properTracks = [],
        stringScoreTolerance = 0.5,

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
            var spotifyArtist = null;
            var spotifyTitle = null;
            $.ajax({
                type: "GET",
                url: "https://developer.echonest.com/api/v4/playlist/static?api_key=N2U2OZ8ZDCXNV9DBG&format=json&artist=snoop+dogg&artist_start_year_after=1991&artist_start_year_before=2000&sort=song_hotttnesss-desc&results=80",
                cache: false,
                success: function (jsonObject) {
                    spotifyArtist = normalize(jsonObject.response.songs[0].artist_name);
                    spotifyTitle = normalize(jsonObject.response.songs[0].title);
                    //console.log(jsonObject.response.songs);
                    searchSoundCloudTracks("rihanna", "the monster");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
                }
            });
        },

        searchSoundCloudTracks = function (artist, title) {
            var queryOne = artist + " " + title;
            var queryTwo = title + " " + artist;
            var queryThree = title + " official";
            var testString = normalize("Eminem - The Monster Feat. Rihanna (Official Audio)");
            var testScore = testString.score(queryTwo);
            console.log("TESTSCORE " + testScore);

            $.ajax({
                url: getAjaxUrl(queryOne),
                data: {
                    format: 'json'
                },
                error: function () {
                },
                dataType: 'json',
                success: function (data) {
                    deleteNotMatchingResults(data, queryOne);
                },
                type: 'GET'
            });
            $.ajax({
                url: getAjaxUrl(queryTwo),
                data: {
                    format: 'json'
                },
                error: function () {

                },
                dataType: 'json',
                success: function (data) {
                    deleteNotMatchingResults(data, queryTwo);
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
                    deleteNotMatchingResults(data, queryOne);
                    playTrack(getBestTrack().stream_url);
                },
                type: 'GET'
            });
        },

        getBestTrack = function () {
            var tracks = [];
            //sort tracks by score
            tracks.sort(sortByScore);
            //take tracks with best match
            for (var i = 0; i < 20; i++) {
                tracks[i] = properTracks[i];
                iterateArray(tracks);
            }

            //sort tracks by playback_count
            tracks.sort(sortByFavoritingsCount);

            console.log(tracks[0].title);
            console.log("playbackcount " + tracks[0].playback_count);
            console.log(tracks[0].score);
            //take the first element
            return tracks[0];

        },

        sortByFavoritingsCount = function (a, b) {
            return b.favoritings_count - a.favoritings_count;
        },

        sortByPlaybackCount = function (a, b) {
            return b.playback_count - a.playback_count;
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
            console.log("count");
            console.log(count);
            console.log(properTracks.length);


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
                //console.log(array[i]);
                console.log(array[i].score);
                console.log(array[i].playback_count);
                console.log(array[i].permalink_url);

            }
            console.log(array.length);
        },

        getAjaxUrl = function (query) {
            return "https://api.soundcloud.com/tracks?filter=public&streamable=true&q=" + query + "&client_id=" + client_id + "&format=json&limit=" + limit + "&duration[from]=250000&duration[to]=800000";
        };

    that.init = init;

    return that;
}());