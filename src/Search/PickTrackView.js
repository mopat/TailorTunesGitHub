App.PickTrackView = (function () {
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

    /*
     view for user to pick a suggested track for echonest
     */
        _setEchoNestTrackIdPicker = function (query, tracks) {
            foundTracks = tracks;
            $echoNestTrackPickerList.empty();
            for (var i in tracks) {
                var currentArtistName = tracks[i].artist_name,
                    currentTitle = tracks[i].title,
                    currentTrackId = tracks[i].id,

                    $listItem = $("<li class='modal-echonest-list-item'>").html(currentArtistName + " - " + currentTitle).attr("data-track-id", currentTrackId);

                if (i % 2 == 0)
                    $listItem.css("background", "rgba(0,0,0,0.1)");
                else $listItem.css("background", "rgba(0,0,0,0.2)");

                var $anchor = $("<a href='#'></a>").append($listItem);

                $echoNestTrackPickerList.append($anchor);
            }
            $echoNestTrackPicker.foundation('reveal', 'open');
        },

    /*
     view for user to pick a suggested track for soundcloud
     */
        _setSoundcloudTrackPicker = function (tracks) {
            $soundcloudTrackPickerList.empty();
            foundTracks = tracks;
            for (var i in foundTracks) {
                var title = foundTracks[i].title,
                    duration = foundTracks[i].duration,
                    streamUrl = foundTracks[i].stream_url,

                    $listItem = $("<li class='modal-soundcloud-list-item'>").html(title).attr("data-stream-url", streamUrl).attr("list-id", i);
                if (i % 2 == 0)
                    $listItem.css("background", "rgba(0,0,0,0.1)");
                else $listItem.css("background", "rgba(0,0,0,0.2)");
                var $anchor = $("<a href='#'></a>").append($listItem);

                $soundcloudTrackPickerList.append($anchor);
            }
            $soundcloudTrackPicker.foundation('reveal', 'open');
        },

        pickEchoNestTrack = function (e) {
            var $closestItem = $(e.target).closest(".modal-echonest-list-item"),
                trackID = $closestItem.attr("data-track-id"),
                query = $closestItem.html();

            var srchObj = createSrchObj(query, "track", "similar", trackID, $("option:selected", this).attr("data-api"));

            $(that).trigger("echonestTrackIDPicked", [srchObj]);
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
