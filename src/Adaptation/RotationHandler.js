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
            $.undim();

            $modals.transition({rotate: rotation}, ROTATE_DURATION);
            $(".sweet-alert").transition({rotate: rotation}, ROTATE_DURATION);
            $rotatable.transition({rotate: rotation}, ROTATE_DURATION, function () {
                switch (side) {
                    case "left":
                        $rotatable.css("float", "left");
                        leftOrRightResize();
                        resizeLeftDistanceModal();
                        sweetAlertLeft();
                        break;
                    case "right":
                        $rotatable.css("float", "right");
                        leftOrRightResize();
                        resizeRightDistanceModal();
                        sweetAlertRight();
                        break;
                    case "top":
                        topOrBottomModeResize();
                        sweetAlertDefault();
                        break;
                    case "bottom":
                        topOrBottomModeResize();
                        sweetAlertDefault();
                        break;
                }
                $(that).trigger("rotationChanged");
            });
        },

        leftOrRightResize = function () {
            $rotatable.width($(window).height());
            $("#controls-box .row").width($(window).height());
            $modals.width($rotatable.height());
        },

        topOrBottomModeResize = function () {
            $rotatable.width("100%");
            $("#controls-box .row").width($(".row").width());
            $modals.width($(".row").width()).css("left", 0).css("right", 0);
        },

        resizeLeftDistanceModal = function () {
            $modals.css("left", "0").css("right", $(document).width() - $rotatable.width());
        },

        resizeRightDistanceModal = function () {
            $modals.css("right", "0").css("left", $(document).width() - $rotatable.width());
        },


    //ALERT BOXES
        sweetAlertLeft = function () {
            var left = $rotatable.width() / 2;
            $(".sweet-alert").css("left", left);
        },

        sweetAlertRight = function () {
            var right = $(document).width() - $rotatable.width() / 2;
            $(".sweet-alert").css("left", right);
        },

        sweetAlertDefault = function () {
            $(".sweet-alert").css("left", "50%");
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
            $("#playlist").destroy({
                listId: "#playlist",
                delegates: ".playlist-item"
            });
            $("#playlist").rotatableSortable({
                contentId: "#rotatable",
                listId: "#playlist",
                delegates: ".playlist-item",
                rotation: getRotation()
            });
        };

    that.init = init;

    return that;
}());

