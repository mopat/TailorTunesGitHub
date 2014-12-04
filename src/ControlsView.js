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
        $elapsedTime = null,


        init = function () {
            console.log("CV");
            $timeSlider = $("#time-slider");
            $player = $('#player');
            player = document.getElementById("player");
            $playButton = $("#play-button");
            $pauseButton = $("#pause-button");
            $nextButton = $("#next-button");
            $previousButton = $("#previous-button");
            $elapsedTime = $("#elapsed-time");

            initSlider();
            initPlayerControls();
            initStickyFooter();
            $("#year-slider").noUiSlider({
                start: [1950, 2015],
                connect: true,
                range: {
                    'min': 1950,
                    'max': 2015
                },
                format: wNumb({
                    decimals: 0
                })
            });
            $("#year-slider").Link('lower').to($('#year-slider-value-lower'));
            $("#year-slider").Link('upper').to($('#year-slider-value-upper'));
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

        initSlider = function () {
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