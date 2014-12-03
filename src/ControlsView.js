/*** Created by Patrick on 19.11.2014.*/
App.ControlsView = (function () {
    var that = {},
        $timeSlider = null,


        init = function () {
            console.log("CV");

            $timeSlider = $("#time-slider");
            initTimeSlider();
            initPlayer();
        },
        initTimeSlider = function () {
            $timeSlider.slider();
            $timeSlider.slider("option", "max", 100);
            $timeSlider.slider({step: 0.3});

            $('.ui-slider-handle').draggable();

            $timeSlider.on("slide", function (event, ui) {
                $(that).trigger("timesliderslide", [$timeSlider.slider("value")]);
            });

            $timeSlider.on("slidestop", function (event, ui) {

                $('#player').on('timeupdate', function () {
                    $timeSlider.slider({value: (this.currentTime / this.duration) * 100});
                });
                var val = $timeSlider.slider("value");

                var player = document.getElementById('player');
                player.currentTime = val * player.duration / 100;
            });
        },

        initPlayer = function () {
            $('#play-button').on('click', function () {
                document.getElementById('player').play();
            });

            $('#pause-button').on('click', function () {
                document.getElementById('player').pause();
            });


        },

        handleTimeSliderUpdate = function (currentTime, duration) {
            $timeSlider.slider({value: (currentTime / duration) * 100});
        };

    that.handleTimeSliderUpdate = handleTimeSliderUpdate;
    that.init = init;

    return that;

}());
