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

            $chooseModalList.on("click", handleListItemClick);
        },

        setModalContent = function(tracks){
            $chooseModalList.empty();
            console.log(tracks)
            for(var i in tracks){
                var currentArtistName = tracks[i].artist_name;
                var currentTitle = tracks[i].title;
                var currentTrackId = tracks[i].id;

                var listItem = $("<li class='modal-list-item'>");
                listItem.html(currentArtistName + " - " + currentTitle);
                listItem.attr("data-track-id", currentTrackId);

                $chooseModalList.append(listItem);
            }
            $chooseModal.foundation('reveal', 'open');
        },

        handleListItemClick = function(event){
            var dataTrackId = $(event.target).closest(".modal-list-item").attr("data-track-id");
            var query = $(event.target).closest(".modal-list-item").html();
            $(that).trigger("trackIdPicked", [dataTrackId, query]);
            $chooseModal.foundation('reveal', 'close');
        };

    that.setModalContent = setModalContent;
    that.init = init;

    return that;

}());
