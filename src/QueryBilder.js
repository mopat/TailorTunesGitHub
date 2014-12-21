/**
 * Created by Patrick on 21.12.2014.
 */
    var echoNestAPIKey = "N2U2OZ8ZDCXNV9DBG";
       var searchLimit = 20;
    function searchEchoNestHottestTracks (query) {
        return "https://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&format=json&artist=" + query + "&sort=song_hotttnesss-desc&results=" + searchLimit;
    };

