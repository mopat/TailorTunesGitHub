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
            rotationMode = true;
            if (rotationMode)
                showRotateTriggers();

            return that;
        },

        rotate = function (rotation, side) {
            newRotation = rotation //parseInt(rotation) - parseInt(oldRotation);
            oldRotation = newRotation;
            console.log(newRotation, oldRotation)
            if (rotationMode) {
                switch (side) {
                    case "left":
                        $rotatable.animateRotate(newRotation, ROTATE_DURATION);
                        $rotatable.width($(window).height());
                        $("#controls-box .row").width($(window).height());
                        $rotatable.css("float", "left");
                        break;
                    case "top":
                        $rotatable.animateRotate(newRotation, ROTATE_DURATION);

                        $rotatable.width("100%");
                        $rotatable.css("float", "none");
                        $("#controls-box .row").width($(".row").width());
                        break;
                    case "right":
                        $rotatable.animateRotate(newRotation, ROTATE_DURATION);

                        $rotatable.width($(window).height());
                        $rotatable.css("float", "right");
                        $("#controls-box .row").width($(window).height());
                        break;
                    case "bottom":
                        $rotatable.css("transform", "none").width("100%").css("float", "none");
                        break;
                }
            }
        },

        hideRotateTriggers = function () {
            $rotate.fadeOut(500);
        },

        showRotateTriggers = function () {
            $rotate.fadeIn(500);
        },

        handleRotateClick = function (e) {
            var $clickedRotation = $(e.target),
                rotation = $clickedRotation.attr("data-rotate"),
                side = $clickedRotation.attr("data-side");
            $rotate.fadeIn(500);
            $clickedRotation.fadeOut(500);
            setRotation(rotation)
            $(that).trigger("setRotation");
            rotate(rotation, side);
        };

    that.init = init;

    return that;

}());

