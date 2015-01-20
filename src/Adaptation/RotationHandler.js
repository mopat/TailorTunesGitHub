App.RotationHandler = (function () {
    var that = {},
        $rotate = null,
        $rotatable = null,
        rotationMode = false,
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
            $rotatable.transition({rotate: rotation}, ROTATE_DURATION, function () {
                $(that).trigger("setRotation");
            });
            if (rotationMode) {
                switch (side) {
                    case "left":
                        $rotatable.css("float", "left");
                        leftOrRightResize();
                        break;
                    case "right":
                        $rotatable.css("float", "right");
                        leftOrRightResize();
                        break;
                    case "top":
                        topOrBottomModeResize();
                        break;
                    case "bottom":
                        topOrBottomModeResize();
                        break;
                }
            }
        },

        leftOrRightResize = function () {
            $rotatable.width($(window).height());
            $("#controls-box .row").width($(window).height());
        },

        topOrBottomModeResize = function () {
            $rotatable.width("100%");
            $("#controls-box .row").width($(".row").width());
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
            showRotateTriggers();
            $clickedRotation.fadeOut(500);
            setRotation(rotation)
            rotate(rotation, side);
        };

    that.init = init;

    return that;
}());

