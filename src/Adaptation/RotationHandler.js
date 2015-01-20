App.RotationHandler = (function () {
    var that = {},
        $rotate = null,
        $rotatable = null,
        rotationMode = false,
        $modals = null,
        ROTATE_DURATION = 1000,

        init = function () {
            $rotate = $(".rotate");
            $rotatable = $("#rotatable");
            $modals = $(".reveal-modal");

            $rotate.on("click", handleRotateClick);
            rotationMode = true;
            if (rotationMode)
                showRotateTriggers();

            return that;
        },

        rotate = function (rotation, side) {
            $modals.transition({rotate: rotation}, ROTATE_DURATION);
            $rotatable.transition({rotate: rotation}, ROTATE_DURATION, function () {
                $(that).trigger("setRotation");
            });
            if (rotationMode) {
                switch (side) {
                    case "left":
                        $rotatable.css("float", "left");
                        leftOrRightResize();
                        resizeLeftDistanceModal();
                        break;
                    case "right":
                        $rotatable.css("float", "right");
                        leftOrRightResize();
                        resizeRightDistanceModal();
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
            $modals.width($(window).height() * 0.8).css("top", "10%").css("bottom", "10%")
        },

        topOrBottomModeResize = function () {
            $rotatable.width("100%");
            $("#controls-box .row").width($(".row").width());
            $modals.css("top", "10%").css("bottom", "10%").width("80%").css("left", "10%").css("right", "10%");
        },

        resizeLeftDistanceModal = function () {
            $modals.css("left", "5%").css("right", $(document).width() - $rotatable.width())
        },

        resizeRightDistanceModal = function () {
            $modals.css("right", "5%").css("left", $(document).width() - $rotatable.width())
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
            setRotation(rotation);
            setUserSider(side);
            rotate(rotation, side);
        };

    that.init = init;

    return that;
}());

