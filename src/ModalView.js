/**
 * Created by Patrick on 27.12.2014.
 */
App.ModalView = (function () {
    var that = {},
        $chooseModalList = null,

        init = function () {
            $chooseModalList =  $("#choose-modal-ul");
        },

        setModalContent = function(tracks){
            console.log(tracks)
            for(var i in tracks){
                var currentArtistName = tracks[i].artist_name;
                var currentTitle = tracks[i].title;
                var currentTrackId = tracks[i].id;

                var listItem = $("<li class='modalListItem'>");
                listItem.html(currentArtistName + " - " + currentTitle);
                listItem.attr("data-track-id", currentTrackId);

                $chooseModalList.append(listItem);
            }
        };

    that.setModalContent = setModalContent;
    that.init = init;

    return that;

}());
