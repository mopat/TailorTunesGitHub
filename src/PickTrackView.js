/**
 * Created by Patrick on 27.12.2014.
 */
App.ChooseTitleView = (function () {

    var that = {},
        $echoNestTrackPicker = null,
        $echoNestTrackPickerList = null,
        $soundcloudTrackPicker = null,
        $soundcloudTrackPickerList = null,
        foundTracks = [],

        init = function () {
            $echoNestTrackPicker = $("#echonest-trackID-picker");
            $echoNestTrackPickerList = $("#echonest-trackID-picker-ul");

            $soundcloudTrackPicker = $("#soundcloud-track-picker");
            $soundcloudTrackPickerList = $("#soundcloud-track-picker-ul");

            initHandler();

            return that;
        },

        initHandler = function () {
            $echoNestTrackPickerList.on("click", pickEchoNestTrack);
            $soundcloudTrackPickerList.on("click", pickSoundcloudTrack);
        },

        _setEchoNestTrackIdPicker = function (query, tracks) {
            foundTracks = tracks;
            $echoNestTrackPickerList.empty();
            for (var i in tracks) {
                var currentArtistName = tracks[i].artist_name,
                    currentTitle = tracks[i].title,
                    currentTrackId = tracks[i].id,

                    listItem = $("<li class='modal-echonest-list-item'>");

                listItem.html(currentArtistName + " - " + currentTitle);
                listItem.attr("data-track-id", currentTrackId);

                $echoNestTrackPickerList.append(listItem);
            }
            $echoNestTrackPicker.foundation('reveal', 'open');
        },

        _setSoundcloudTrackPicker = function (tracks) {
            $soundcloudTrackPickerList.empty();
            foundTracks = tracks;
            for (var i in foundTracks) {
                var title = foundTracks[i].title,
                    duration = foundTracks[i].duration,
                    streamUrl = foundTracks[i].stream_url,

                    listItem = $("<li class='modal-soundcloud-list-item'>");
                listItem.html(title);
                listItem.attr("data-stream-url", streamUrl);
                listItem.attr("list-id", i);

                $soundcloudTrackPickerList.append(listItem);
            }
            $soundcloudTrackPicker.foundation('reveal', 'open');
        },

        pickEchoNestTrack = function (e) {
            var trackID = $(e.target).closest(".modal-echonest-list-item").attr("data-track-id"),
                query = $(e.target).closest(".modal-echonest-list-item").html();
            $(that).trigger("echonestTrackIDPicked", [query, "track", null, trackID]);
            $echoNestTrackPicker.foundation('reveal', 'close');
        },

        pickSoundcloudTrack = function (e) {
            var listId = $(e.target).closest(".modal-soundcloud-list-item").attr("list-id"),
                track = [foundTracks[listId]];

            $(that).trigger("soundcloudTrackPicked", [track]);
            $soundcloudTrackPicker.foundation('reveal', 'close');
        };

    that._setEchoNestTrackIdPicker = _setEchoNestTrackIdPicker;
    that._setSoundcloudTrackPicker = _setSoundcloudTrackPicker;
    that.init = init;

    return that;
}());
