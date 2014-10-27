/**
 * Created by Patrick on 27.10.2014.
 */
$.ajax({
    type: "GET",
    url: "http://developer.echonest.com/api/v4/song/search?api_key=N2U2OZ8ZDCXNV9DBG&sort=song_hotttnesss-desc&bucket=song_hotttnesss",
    cache: false,
    success: function(datas){
        console.log(datas);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert("Error " + errorThrown + " at" + XMLHttpRequest);
    }
});