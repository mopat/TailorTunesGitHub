/*** Created by Patrick on 19.11.2014.*/
App.ControlsView = (function () {
    var that = {},
        $timeSlider = null,
        $volumeSlider = null,
        $volumeIcon = null,
        $player = null,
        player = null,
        $playButton = null,
        $pauseButton = null,
        $nextButton = null,
        $previousButton = null,
        $elapsedTime = null,
        $volume = null,


        init = function () {
            console.log("CV");
            $timeSlider = $("#time-slider");
            $volumeSlider = $("#volume-slider");
            $volumeIcon = $("#volume-icon");
            $player = $('#player');
            player = document.getElementById("player");
            $playButton = $("#play-button");
            $pauseButton = $("#pause-button");
            $nextButton = $("#next-button");
            $previousButton = $("#previous-button");
            $elapsedTime = $("#elapsed-time");
            $volume = $("#volume-value");

            initTimeSlider();
            initPlayerControls();
            initStickyFooter();
            initVolumeSlider();
        },

        initStickyFooter = function () {
            $footer = $('#sticky-footer');
            $win = $(window);
            var ipos = $footer.offset().top;
            var wpos, space;

            function h(e) {
                wpos = $win.scrollTop();
                space = $win.height() - $footer.height() * 2;
                if (wpos + space < ipos) {
                    $footer.addClass('fixed-footer');
                } else {
                    $footer.removeClass('fixed-footer');
                }
            }

            $(window).ready(h).resize(h).scroll(h);
        },

        initTimeSlider = function () {
            $timeSlider.slider();
            $timeSlider.slider("option", "max", 100);
            $timeSlider.slider({step: 0.3});

            $player.on('timeupdate', function () {
                handleTimeSliderUpdate();
            });

            $timeSlider.on("slide", function (event, ui) {
                $player.off();
                var val = $timeSlider.slider("value");
                player.currentTime = val * player.duration / 100;
            });

            $timeSlider.on("slidestop", function (event, ui) {
                $player.on('timeupdate', function () {
                    handleTimeSliderUpdate();
                });
                var val = $timeSlider.slider("value");
                player.currentTime = val * player.duration / 100;
            });
        },

        initVolumeSlider = function () {
            $volumeSlider.slider();
            $volumeSlider.slider("option", "max", 100);
            $volumeSlider.slider("value", 100);
            $volumeSlider.slider({step: 1});

            $volumeSlider.on("slide", function (event, ui) {
                setVolumeValue();
            });
            $volumeSlider.on("slidechange", function (event, ui) {
                setVolumeValue();
            });
            $(".ui-slider-handle").width(12);
            function setVolumeValue() {
                var val = $volumeSlider.slider("value");
                player.volume = val / 100;
                $volume.html(val + "%");
                if (val == 0)
                    $volumeIcon.switchClass("fi-volume", "fi-volume-strike");
                else if ($volumeIcon.hasClass("fi-volume-strike"))
                    $volumeIcon.switchClass("fi-volume-strike", "fi-volume");
            }
        },

        handleTimeSliderUpdate = function () {
            $timeSlider.slider({value: (player.currentTime / player.duration) * 100});
            var minutes = Math.floor(player.currentTime / 60);
            var seconds = Math.floor(player.currentTime % 60);
            if (seconds < 10)
                seconds = "0" + seconds;
            var minutesAndSeconds = minutes + ":" + seconds;
            $elapsedTime.html(minutesAndSeconds);
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
            player.addEventListener("ended", function () {

            });
        };

    that.handleTrackPicked = handleTrackPicked;
    that.init = init;

    return that;

}());