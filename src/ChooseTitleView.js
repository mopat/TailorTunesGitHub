/**
 * Created by Patrick on 27.12.2014.
 */
App.ModalView = (function () {

    var that = {},
        $chooseModalEchoNest = null,
        $chooseModalListEchoNest = null,
        $chooseModalSoundcloud = null,
        $chooseModalListSoundcloud = null,
        foundTracks = [],
        echoNestQuery = null,

        init = function () {
            $chooseModalEchoNest = $("#choose-modal-echonest");
            $chooseModalListEchoNest = $("#choose-modal-echonest-ul");

            $chooseModalSoundcloud = $("#choose-modal-soundcloud");
            $chooseModalListSoundcloud = $("#choose-modal-soundcloud-ul");

            $chooseModalListEchoNest.on("click", handleEchoNestListItemClick);
            $chooseModalListSoundcloud.on("click", handleSoundcloudListItemClick);
        },

        setModalEchoNestContent = function (query, tracks) {
            echoNestQuery = query;
            foundTracks = tracks;
            $chooseModalListEchoNest.empty();
            for (var i in tracks) {
                var currentArtistName = tracks[i].artist_name;
                var currentTitle = tracks[i].title;
                var currentTrackId = tracks[i].id;

                var listItem = $("<li class='modal-echonest-list-item'>");
                listItem.html(currentArtistName + " - " + currentTitle);
                listItem.attr("data-track-id", currentTrackId);

                $chooseModalListEchoNest.append(listItem);
            }
            $chooseModalEchoNest.foundation('reveal', 'open');
        },

        setModalSoundcloudContent = function (tracks) {
            $chooseModalListSoundcloud.empty();
            foundTracks = tracks;
            for (var i in foundTracks) {
                var title = foundTracks[i].title;
                var duration = foundTracks[i].duration;
                //var permalinkUrl = playlist[i].permalink_url;
                var streamUrl = foundTracks[i].stream_url;

                var listItem = $("<li class='modal-soundcloud-list-item'>");
                listItem.html(title);
                listItem.attr("data-stream-url", streamUrl);
                listItem.attr("list-id", i);

                $chooseModalListSoundcloud.append(listItem);
            }
            $chooseModalSoundcloud.foundation('reveal', 'open');
        },

        handleEchoNestListItemClick = function (event) {
            var trackID = $(event.target).closest(".modal-echonest-list-item").attr("data-track-id");
            var query = $(event.target).closest(".modal-echonest-list-item").html();
            $(that).trigger("trackIdPicked", [query, "track", null, trackID]);
            $chooseModalEchoNest.foundation('reveal', 'close');
        },

        handleSoundcloudListItemClick = function (event) {
            var listId = $(event.target).closest(".modal-soundcloud-list-item").attr("list-id");
            var track = [foundTracks[listId]];

            $(that).trigger("soundcloudTrackPicked", [track]);
            $chooseModalSoundcloud.foundation('reveal', 'close');
        };

    that.setModalEchoNestContent = setModalEchoNestContent;
    that.setModalSoundcloudContent = setModalSoundcloudContent;
    that.init = init;

    return that;

}());
