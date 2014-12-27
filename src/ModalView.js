/**
 * Created by Patrick on 27.12.2014.
 */
App.ModalView = (function () {
    var that = {},
        $chooseModal = null,
        $chooseModalList = null,

        init = function () {
            $chooseModal = $("#choose-modal");
            $chooseModalList =  $("#choose-modal-ul");
        },

        setModalContent = function(tracks){
            $chooseModalList.empty();
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
            $chooseModal.foundation('reveal', 'open');
        };

    that.setModalContent = setModalContent;
    that.init = init;

    return that;

}());
