/**
 * Created by Patrick on 27.12.2014.
 */
App.ModalView = (function () {

    var that = {},
        $chooseModal = null,
        $chooseModalList = null,
        foundTracks = [],

        init = function () {
            $chooseModal = $("#choose-modal");
            $chooseModalList =  $("#choose-modal-ul");

            // bad duplicate
            $chooseModalList.on("click", handleEchoNestListItemClick);
            $chooseModalList.on("click", handleSoundcloudListItemClick);
        },

        setModalEchoNestContent = function(tracks){

            foundTracks = tracks;
            $chooseModalList.empty();
            console.log(tracks)
            for(var i in tracks){
                var currentArtistName = tracks[i].artist_name;
                var currentTitle = tracks[i].title;
                var currentTrackId = tracks[i].id;

                var listItem = $("<li class='modal-echonest-list-item'>");
                listItem.html(currentArtistName + " - " + currentTitle);
                listItem.attr("data-track-id", currentTrackId);

                $chooseModalList.append(listItem);
            }
            $chooseModal.foundation('reveal', 'open');
        },

        setModalSoundcloudContent = function(tracks){
            $chooseModalList.empty();
            $chooseModalList.addClass("echonest-modal");
            foundTracks = tracks;
            for(var i in foundTracks){
                var title = foundTracks[i].title;
                var duration = foundTracks[i].duration;
                //var permalinkUrl = playlist[i].permalink_url;
                var streamUrl = foundTracks[i].stream_url;

                var listItem = $("<li class='modal-soundcloud-list-item'>");
                listItem.html(title);
                listItem.attr("data-stream-url", streamUrl);
                listItem.attr("list-id", i);

                $chooseModalList.append(listItem);
            }
            $chooseModal.foundation('reveal', 'open');
            $chooseModalList.removeClass("echonest-modal");
        },

        handleEchoNestListItemClick = function(event){
            var dataTrackId = $(event.target).closest(".modal-list-item").attr("data-track-id");
            var query = $(event.target).closest(".modal-echonest-list-item").html();
            $(that).trigger("trackIdPicked", [dataTrackId, query]);
            $chooseModal.foundation('reveal', 'close');
        },

        handleSoundcloudListItemClick = function(event){
            var listId = $(event.target).closest(".modal-soundcloud-list-item").attr("list-id");
            var track = foundTracks[listId];
            console.log(track)

            $(that).trigger("soundcloudTrackPicked", [track]);
            $chooseModal.foundation('reveal', 'close');
        };

    that.setModalEchoNestContent = setModalEchoNestContent;
    that.setModalSoundcloudContent = setModalSoundcloudContent;
    that.init = init;

    return that;

}());
