App.RotationHandler = (function () {
    var that = {},
        $rotate = null,
        $rotatable = null,
        rotationMode = false,

        init = function () {
            $rotate = $(".rotate");
            $rotatable = $("#rotatable");

            $rotate.on("click", handleRotateClick);
            rotationMode = true;
            showRotateTriggers();
        },

        rotate = function (rotation) {
            if (rotationMode) {
                if (rotation == 90) {
                    $rotatable.css("transform", "none");
                    $rotatable.animateRotate(rotation);

                    $rotatable.width($(window).height());
                    $("#controls-box .row").width($(window).height());
                    $rotatable.css("float", "left");
                }
                else if (rotation == 180) {
                    $rotatable.css("transform", "none");
                    $rotatable.animateRotate(rotation);

                    $rotatable.width("100%");
                    $rotatable.css("float", "none");
                    $("#controls-box .row").width($(".row").width());

                }
                else if (rotation == -90) {
                    $rotatable.css("transform", "none");
                    $("#rotatable").animateRotate(rotation);

                    $rotatable.width($(window).height());
                    $rotatable.css("float", "right");
                    $("#controls-box .row").width($(window).height());
                }
                else if (rotation == "none") {
                    $("#rotatable").css("transform", "none");

                    $rotatable.width("100%");
                    $rotatable.css("float", "none");
                }
            }
        },

        hideRotateTriggers = function () {
            $rotate.fadeOut(500);
        },

        showRotateTriggers = function () {
            $rotate.fadeIn(500);
        },

        handleRotateClick = function (event) {
            var $clickedRotation = $(event.target),
                rotation = $clickedRotation.attr("data-rotate");
            $rotate.fadeIn(500);
            $clickedRotation.fadeOut(500);
            setRotation(rotation);
            $(that).trigger("setRotation");
            rotate(rotation);
        };

    that.init = init;

    return that;

}());

