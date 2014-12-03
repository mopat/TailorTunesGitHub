/*** Created by Patrick on 19.11.2014.*/
App.ControlsView = (function () {
    var that = {},
        $timeSlider = null,
        $player = null,
        player = null,
        $playButton = null,
        $pauseButton = null,
        $nextButton = null,
        $previousButton = null,


        init = function () {
            console.log("CV");
            $timeSlider = $("#time-slider");
            $player = $('#player');
            player = document.getElementById("player");
            $playButton = $("#play-button");
            $pauseButton = $("#pause-button");
            $nextButton = $("#next-button");
            $previousButton = $("#previous-button");

            initSlider();
            initPlayerControls();
        },

        initSlider = function () {
            $timeSlider.slider();
            $timeSlider.slider("option", "max", 100);
            $timeSlider.slider({step: 0.3});

            $player.on('timeupdate', function () {
                $timeSlider.slider({value: (this.currentTime / this.duration) * 100});
            });

            $timeSlider.on("slide", function (event, ui) {
                $player.off();
                var val = $timeSlider.slider("value");
                player.currentTime = val * player.duration / 100;

            });

            $timeSlider.on("slidestop", function (event, ui) {
                $player.on('timeupdate', function () {
                    $timeSlider.slider({value: (this.currentTime / this.duration) * 100});
                });
                var val = $timeSlider.slider("value");
                player.currentTime = val * player.duration / 100;
            });
        },

        initPlayerControls = function () {
            $playButton.on('click', function () {
                player.play();
            });

            $pauseButton.on('click', function () {
                player.pause();
            });
        },

        handleTrackPicked = function (src) {
            $player.attr('src', src);
            var audioPlayer = document.getElementById("player");
            audioPlayer.addEventListener("ended", function () {

            });
        };

    that.handleTrackPicked = handleTrackPicked;
    that.init = init;

    return that;

}());