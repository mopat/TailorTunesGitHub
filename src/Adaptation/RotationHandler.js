App.RotationHandler = (function () {
    var that = {},
        $rotate = null,
        $rotatable = null,
        $modals = null,
        ROTATE_DURATION = 1000,
        $sortModeSwitch = null,
        $rotateInfoBox = null,
        $rotationTriggerBox = null,
        $tabletopInfoBox = null,

        init = function () {

            return that;
        },


        initRotation = function () {
            $rotate = $(".rotate");
            $rotatable = $("#rotatable");
            $modals = $(".reveal-modal");
            $sortModeSwitch = $("#sort-mode-switch");
            $rotateInfoBox = $("#rotate-info-box");
            $rotationTriggerBox = $("#rotation-trigger-box");
            $tabletopInfoBox = $("#tabletop-info-box");

            $rotate.on("click", handleRotateClick);
            $rotationTriggerBox.on("click", closeTriggerBox);
            $tabletopInfoBox.on("click", handleTabletopInfoBoxClick);

            window.addEventListener("resize", function () {
                fitContentSize(getRotation(), getUserSide())
            }, false);

            handleRotateGesture();
        },

        handleTabletopInfoBoxClick = function (e) {
            e.preventDefault();
            swal({
                title: "Use rotate gesture to change content orientation",
                imageUrl: "ui-images/two_finger_rotate.png",
                showConfirmButton: true
            });
        },

        _setTabletopMode = function () {
            if (isTabletopMode()) {
                initRotation();
                $tabletopInfoBox.show();
            }
        },

        fitContentSize = function (rotation, side) {
            $modals.transition({rotate: rotation}, ROTATE_DURATION);
            $(".sweet-alert").transition({rotate: rotation}, ROTATE_DURATION);
            $rotatable.transition({rotate: rotation}, ROTATE_DURATION, function () {
                switch (side) {
                    case "left":
                        $rotatable.css("float", "left");
                        leftOrRightResize();
                        modalLeft();
                        sweetAlertLeft();
                        break;
                    case "right":
                        $rotatable.css("float", "right");
                        leftOrRightResize();
                        modalRight();
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
            });
            setTimeout(function () {
                $(that).trigger("rotationChanged");
            }, ROTATE_DURATION);
        },

        leftOrRightResize = function () {
            $("#controls-box .row").width($(window).height());
            $rotatable.width($(window).height());
            //setzen der Breite der Fenster auf die Breite des Containers
            $modals.width($rotatable.width());
        },

        topOrBottomModeResize = function () {
            $rotatable.width("100%");
            $("#controls-box .row").width($(".row").width());
            $modals.css("width", $("#controls-box .row").width()).css("left", 0).css("right", 0);
        },

        modalRight = function () {
            /*
             Der Abstand zum linken Bildschirmrand entspricht der Breite des Dokuments
             minus der Breite des Pop-ups
             */
            var left = $(document).width() - $modals.width();
            $modals.css("left", left);
        },

        modalLeft = function () {
            /*
             Der Abstand zum linken Bildschirmrand entspricht der Breite des Dokuments
             minus der Breite des Pop-ups mal -1
             */
            var left = ($(document).width() - $modals.width()) * -1;
            $modals.css("left", left);
        },


    //ALERT BOXES
        sweetAlertLeft = function () {
            setTimeout(function () {
                /* für Rotation von 90 Grad
                 der Abstand zur linken Seite entspricht
                 dem Abstand des rotierbaren Containers zur linken Seite
                 Dazu Verschiebung in die Mitte des Containers und
                 Zentrierung durch Abziehen der halbe Höhe eines SweetAlerts
                 */
                var offsetLeft = $rotatable.offset().left + $rotatable.height() / 2 - $(".sweet-alert").height() / 2;
                $(".sweet-alert").offset({left: offsetLeft})
            }, ROTATE_DURATION)
        },

        sweetAlertRight = function () {
            setTimeout(function () {
                /* für Rotation von 270 Grad
                 der Abstand zur linken Seite entspricht
                 dem Abstand des rotierbaren Containers zur linken Seite
                 Dazu Verschiebung in die Mitte des Containers und
                 Zentrierung durch Abziehen der halbe Höhe eines SweetAlerts
                 */
                var offsetLeft = $rotatable.offset().left + $rotatable.height() / 2 - $(".sweet-alert").height() / 2;
                $(".sweet-alert").offset({left: offsetLeft})
            }, ROTATE_DURATION)
        },

        sweetAlertDefault = function () {
            setTimeout(function () {
                $(".sweet-alert").css("left", "50%");
            }, ROTATE_DURATION)
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
            $rotationTriggerBox.fadeOut(100);
        },

        showRotateTriggers = function () {
            $rotationTriggerBox.show();
            $rotate.show();

            $("#rotate-" + getRotation()).hide();
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
                if (rotationValue >= 20) {
                    showRotateTriggers();
                }
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

            hideRotateTriggers();
            $clickedRotation.fadeOut(500);
            setRotation(rotation);
            setUserSider(side);
            fitContentSize(rotation, side);

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
        },

        closeTriggerBox = function () {
            hideRotateTriggers();
        };

    that._setTabletopMode = _setTabletopMode;
    that._rotateAlert = _rotateAlert;
    that.init = init;

    return that;
}());

