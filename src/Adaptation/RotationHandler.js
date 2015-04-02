App.RotationHandler = (function () {
    var that = {},
        $rotate = null,
        $rotatable = null,
        rotationMode = false,
        $modals = null,
        ROTATE_DURATION = 1000,
        $sortModeSwitch = null,

        init = function () {
            $rotate = $(".rotate");
            $rotatable = $("#rotatable");
            $modals = $(".reveal-modal");
            $sortModeSwitch = $("#sort-mode-switch");

            $rotate.on("click", handleRotateClick);
            rotationMode = false;

            window.addEventListener("resize", function () {
                fitContentSize(getRotation(), getUserSide())
            }, false);
            return that;
        },

        _setTabletopMode = function(isTabletopMode){
            rotationMode = isTabletopMode;
            if (rotationMode){
               // showRotateTriggers();
                handleRotateGesture();
            }
        },

        fitContentSize = function (rotation, side) {
            console.log("rotate")
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
            $modals.css("width",  $("#controls-box .row").width()).css("left", 0).css("right", 0);
        },

        resizeLeftDistanceModal = function () {
            $modals.css("left", 0).css("right", $(document).width());
        },

        resizeRightDistanceModal = function () {
            $modals.css("left", $(document).width()- $rotatable.width());
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

        _rotateAlert = function () {
            if (getUserSide() == "left")
                sweetAlertLeft();
            else if (getUserSide() == "right")
                sweetAlertRight();
            else if (getUserSide() == "top" || getUserSide() == "bottom")
                sweetAlertDefault();
        },

        hideRotateTriggers = function () {
            $rotate.fadeOut(500);
        },

        showRotateTriggers = function () {
            $rotate.fadeIn(500);
        },

        handleRotateGesture = function () {
            var el = document.getElementById("body"),
                hammertime = new Hammer(el);

            hammertime.get('rotate').set({enable: true});
            hammertime.get('pinch').set({enable: true});
            hammertime.on('rotate pinch', function (e) {
                e.preventDefault();
            });
            hammertime.on("rotatestart", function (e) {
                if ($sortModeSwitch.attr("checked") && $('#playlist').has($(e.target)).length)
                    swal("Disable sort mode to rotate or do not touch the playlist!", null, "error");
            });
            hammertime.on("rotateend", function (e) {
                var rotationValue = e.rotation;

                if (rotationValue < 0)
                    rotationValue *= -1;
                if (rotationValue >= 20)
                    rotateGesture(e);
            });

            function rotateGesture(e) {
                console.log(e.rotation)
                var side = null,
                    newRotation = null;
                if (getUserSide() == "bottom")
                    if (e.rotation > 0) {
                        side = "left";
                        newRotation = 90;
                    }

                    else if (e.rotation < 0) {
                        side = "right";
                        newRotation = 270;
                    }

                if (getUserSide() == "left") {
                    if (e.rotation < 0) {
                        side = "bottom";
                        newRotation = 0;
                    }

                    else if (e.rotation > 0) {
                        side = "top";
                        newRotation = 180;
                    }
                }
                if (getUserSide() == "top")
                    if (e.rotation > 0) {
                        side = "right";
                        newRotation = 270;
                    }

                    else if (e.rotation < 0) {
                        side = "left";
                        newRotation = 90;
                    }

                if (getUserSide() == "right")
                    if (e.rotation < 0) {
                        side = "top";
                        newRotation = 180;

                    }

                    else if (e.rotation > 0) {
                        side = "bottom";
                        newRotation = 0;

                    }
                setRotation(newRotation);
                setUserSider(side);
                fitContentSize(newRotation, side)

                /**    $("#playlist").destroy({
                    listId: "#playlist",
                    delegates: ".playlist-item"
                });
                 $("#playlist").rotatableSortable({
                    contentId: "#rotatable",
                    listId: "#playlist",
                    delegates: ".playlist-item",
                    rotation: getRotation()
                });
                 **/

                if ($sortModeSwitch.attr("checked")) {
                    $("#playlist").destroy({
                        delegates: ".playlist-item"
                    });
                    $("#playlist").rotatableSortable({
                        contentId: "#rotatable",
                        listId: "#playlist",
                        delegates: ".playlist-item",
                        rotation: getRotation()
                    });
                }
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

            if ($sortModeSwitch.attr("checked")) {
                $("#playlist").destroy({
                    delegates: ".playlist-item"
                });
                $("#playlist").rotatableSortable({
                    contentId: "#rotatable",
                    listId: "#playlist",
                    delegates: ".playlist-item",
                    rotation: getRotation()
                });
            }
        };

    that._setTabletopMode = _setTabletopMode;
    that._rotateAlert = _rotateAlert;
    that.init = init;

    return that;
}());

