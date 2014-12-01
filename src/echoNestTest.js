/**
 * Created by Patrick on 27.10.2014.
 */
var echoNestKey = "N2U2OZ8ZDCXNV9DBG";
console.log("ECHO-Start");
$.ajax({
    type: "GET",
    url: "https://developer.echonest.com/api/v4/playlist/static?api_key=N2U2OZ8ZDCXNV9DBG&format=json&artist=snoop+dogg&artist_start_year_after=1991&artist_start_year_before=2000&sort=song_hotttnesss-desc&results=80",
    cache: false,
    success: function (jsonObject) {
        console.log(jsonObject);
        console.log(jsonObject.response.songs);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
    }
});
console.log("ECHO-End");

//echonest artist + hotttnes
$("#button-start-search").on("click", function () {
    console.log("send");
    var requestText = $("#input-song-search").val();
    console.log(requestText);
    $.ajax({
        type: "GET",
        url: "http://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestKey + "&format=json&artist=" + requestText + "&sort=song_hotttnesss-desc&bucket=song_currency&results=80",
        cache: false,
        success: function (jsonObject) {
            //console.log(jsonObject);
            var songs = jsonObject.response.songs;
            for (var i = 0; i < songs.length; i++) {
                console.log(songs[i].title);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
        }
    });
});

//Spotify Requests artist + year
$.ajax({
    type: "GET",
    url: "https://api.spotify.com/v1/search?q=snoop+dogg+year:2005-2014&type=track",
    cache: false,
    success: function (data) {
        console.log(data);
        var tracks = data.tracks.items;
        console.log("SPOTIFY-Start");
        for (var i = 0; i < tracks.length; i++) {
            console.log(tracks[i].name);
        }
        console.log("SPOTIFY-End");
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert("ERROR " + errorThrown + " at" + XMLHttpRequest);
    }
});