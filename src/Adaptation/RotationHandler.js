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

            handleRotateGesture();
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

        handleRotateGesture = function () {
            var doc = document.getElementById('body');
            var docHammer = new Hammer(doc);
            docHammer.get('rotate').set({enable: true});
            docHammer.on("rotate", function (e) {
                e.preventDefault()
            });
            var el = document.getElementById("rotatable");
            var hammertime = new Hammer(el);
            var lastE = null;
            hammertime.get('rotate').set({enable: true});
            hammertime.on('rotate', function (e) {
                e.preventDefault();
                var rotation = e.rotation;
                if (rotation < 0)
                    rotation *= -1;
                lastE = e;

            });
            hammertime.on("rotateend", function () {
                console.log("END")
                
                rotateGesture(lastE);
            })
            function rotateGesture(e) {

                console.log(e.rotation)
                var rotation = e.rotation,
                    side = null;

                if (getUserSide() == "bottom")
                    if (e.rotation > 0) {
                        rotate(90, "left")
                        side = "left"
                    }

                    else if (e.rotation < 0) {
                        rotate(270, "right")
                        side = "right"
                    }

                if (getUserSide() == "left") {
                    if (e.rotation < 0) {
                        rotate(0, "bottom")
                        side = "bottom"
                    }

                    else if (e.rotation > 0) {
                        rotate(180, "top")
                        side = "top"
                    }

                }
                if (getUserSide() == "top")
                    if (e.rotation > 0) {
                        rotate(270, "right")
                        side = "right"
                    }

                    else if (e.rotation < 0) {
                        rotate(90, "left")
                        side = "left"
                    }

                if (getUserSide() == "right")
                    if (e.rotation < 0) {
                        rotate(180, "top")
                        side = "top"
                    }

                    else if (e.rotation > 0) {
                        rotate(0, "bottom")
                        side = "bottom"
                    }


                setRotation(rotation);
                setUserSider(side);
            }

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

