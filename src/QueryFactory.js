/**
 * Created by Patrick on 14.01.2015.
 */
var echoNestAPIKey = "N2U2OZ8ZDCXNV9DBG";
var searchLimit = 10;

function artistQuery(options) {
    var query = options.query;
    var option = options.option;
    var queryUrl = null;
    switch (options.option) {
        case "similar":
            queryUrl = "https://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&format=json&artist=" + query + "&type=artist-radio&sort=song_hotttnesss-desc&results=" + searchLimit;
            break;
        case "song_hotttnesss-desc":
            queryUrl = "https://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&format=json&artist=" + query + "&sort=song_hotttnesss-desc&results=" + searchLimit;
            break;
        default:
            queryUrl = "https://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&format=json&artist=" + query + "&song_selection=" + option + "&results=" + searchLimit;
            break;
    }
    this.queryUrl = queryUrl;
}

function trackQuery(options) {
    var trackID = options.trackID;
    var queryUrl = null;
    if (trackID == null)
        queryUrl = "http://developer.echonest.com/api/v4/song/search?api_key=" + echoNestAPIKey + "&sort=song_hotttnesss-desc&bucket=song_hotttnesss&results=40";
    else {
        queryUrl = "http://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&song_id=" + trackID + "&format=json&results=20&type=song-radio";
    }
    this.queryUrl = queryUrl;
}

function genreQuery(options) {
    var query = options.query;
    var option = options.option;
    var queryUrl = "https://developer.echonest.com/api/v4/playlist/static?api_key=" + echoNestAPIKey + "&format=json&genre=" + query + "&type=genre-radio&song_selection=" + option + "&results=" + searchLimit;
    this.queryUrl = queryUrl;
}

function QueryFactory() {
}
QueryFactory.prototype.createQuery = function createQuery(options) {
    var parentClass = null;

    if (options.type === "artist-tab") {
        parentClass = artistQuery;
    }
    else if (options.type === "track-tab") {
        parentClass = trackQuery;
    }
    else if (options.type === "genre-tab") {
        parentClass = genreQuery;
    }

    if (parentClass === null) return false;

    return new parentClass(options);
}
