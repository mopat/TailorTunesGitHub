App.RotationHandler = (function () {
    var that = {},
        $rotate = null,
        $rotatable = null,
        rotationMode = false,
        oldRotation = 0,
        newRotation = 0,
        ROTATE_DURATION = 1000,

        init = function () {
            $rotate = $(".rotate");
            $rotatable = $("#rotatable");

            $rotate.on("click", handleRotateClick);
            rotationMode = false;
            if (rotationMode)
                showRotateTriggers();
        },

        rotate = function (rotation) {
            newRotation = rotation //parseInt(rotation) - parseInt(oldRotation);
            oldRotation = newRotation;
            console.log(newRotation, oldRotation)
            if (rotationMode) {
                if (rotation == 90) {

                    $rotatable.animateRotate(newRotation, ROTATE_DURATION);

                    $rotatable.width($(window).height());
                    $("#controls-box .row").width($(window).height());
                    $rotatable.css("float", "left");
                }
                else if (rotation == 180) {

                    $rotatable.animateRotate(newRotation, ROTATE_DURATION);

                    $rotatable.width("100%");
                    $rotatable.css("float", "none");
                    $("#controls-box .row").width($(".row").width());

                }
                else if (rotation == -90) {

                    $rotatable.animateRotate(newRotation, ROTATE_DURATION);

                    $rotatable.width($(window).height());
                    $rotatable.css("float", "right");
                    $("#controls-box .row").width($(window).height());
                }
                else if (rotation == 360) {
                    $rotatable.css("transform", "none").width("100%").css("float", "none");
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

