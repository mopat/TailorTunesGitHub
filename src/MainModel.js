/*** Created by Patrick on 19.11.2014.*/
App.MainModel = (function () {
    var that = {},
        client_id = '23a3031c7cd251c7c217ca127777e48b',

        init = function () {
            console.log("MM");
            initSoundCloud();
            // stream track id 293
            SC.stream("/tracks/293", function (sound) {
                //sound.play();
            });
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
                    bestSpotifyTrack = jsonObject.response.songs[1].artist_name + " " + jsonObject.response.songs[1].title;
                    console.log(jsonObject.response.songs);
                    searchSoundCloudTracks(bestSpotifyTrack);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
                }
            });
        },
        playTracks = function () {

        },
        searchSoundCloudTracks = function (searchedTrack) {
            console.log(searchedTrack);
            var searchedTrack = "SUN GOES DOWN (FEAT. JASMINE THOMPSON)";
            var searchURL = "https://api.soundcloud.com/tracks?filter=public&streamable=true&q=" + searchedTrack + "&client_id=23a3031c7cd251c7c217ca127777e48b&format=json";
            var bestResult = null;
            var tracks = null;
            $.ajax({
                url: searchURL,
                data: {
                    format: 'json'
                },
                error: function () {

                },
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                    tracks = data;
                    tracks.sort(function (a, b) {
                        return b.favoritings_count - a.favoritings_count
                    })

                    for (var i = 0; i < tracks.length; i++) {
                        console.log(tracks[i].favoritings_count);
                    }
                    bestResult = data[0];
                    console.log(bestResult.title);
                    $('#player').attr('src', bestResult.stream_url.replace('http:', 'https:') + '?client_id=' + client_id);

                },
                type: 'GET'
            });
        };

    that.init = init;

    return that;
}());