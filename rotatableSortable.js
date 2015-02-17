/**
 * Created by Patrick on 12.02.2015.
 */
(function ($) {
    var lastMoveTouch = null,
        lastMoveMouse = null,
        $closestItem = null,
        $drag = null,
        horizontalSpace = null,
        verticalSpace = null,
        rotation = null,
        $list = null,
        $content = null,
        $children = null,
        notDraggingItems = [],
        defaultWidth = null,
        delay = 0,
        delayTimer = null,
        scrollInterval = null,
        scrollIntervalDuration = 200,
        scrollTolerance = 100;

    $.fn.rotatableSortable = function (options) {
        var listId = options.listId,
            delegates = options.delegates,
            contentId = options.contentId,
            $list = $(listId),
            $children = $list.find(delegates),
            $content = $(contentId),
            rotation = options.rotation,
            delay = options.delay;

        if (delay == null || delay == undefined)
            delay = 250;

        setRotationSpaces(rotation);
        addSortable();


        function addSortable() {
            $children.on("touchstart", function (e) {
                e.preventDefault();
                $drag = $(this);

                var timeout = window.setTimeout(function () {
                    onTouchMove();
                    onTouchEnd();
                    //$list.css("overflow-y", "hidden");
                    $(document).css("user-select", "none").attr('unselectable', 'on').on('selectstart', false);
                    $drag.addClass("drag");
                    $drag.off("touchend");
                }, delay);
                $drag.on("touchend", function () {
                    $drag.off("touchend");
                    window.clearTimeout(timeout);
                });
                scrollInterval = setInterval(function () {
                    scroll();
                }, scrollIntervalDuration);
                return false;
            });

            $children.on("mousedown", (function (e) {
                e.preventDefault();
                $drag = $(this);

                var timeout = window.setTimeout(function () {
                    onMouseUp();
                    onMouseMove();
                    //  $list.css("overflow-y", "hidden");
                    $(document).css("user-select", "none").attr('unselectable', 'on').on('selectstart', false);
                    $drag.addClass("drag");
                    $drag.off("mouseup");
                }, delay);
                $drag.on("mouseup", function () {
                    $drag.off("mouseup");
                    window.clearTimeout(timeout);
                });
                scrollInterval = setInterval(function () {
                    scroll();
                }, scrollIntervalDuration);
                return false;
            }));
        }


        function onTouchMove() {
            $(document).on("touchmove", function (e) {
                defaultWidth = $children.width();
                notDraggingItems = $children.not(".drag");

                $drag.css("position", "absolute").css("width", defaultWidth);
                if (rotation == 270)
                    $drag.css(horizontalSpace, e.originalEvent.targetTouches[0].pageX - ($(document).width() - $content.width())).css(verticalSpace, e.originalEvent.targetTouches[0].pageY);
                else
                    $drag.css(horizontalSpace, e.originalEvent.targetTouches[0].pageX).css(verticalSpace, e.originalEvent.targetTouches[0].pageY);
                lastMoveTouch = e;
                console.log(e.originalEvent.targetTouches[0].pageX, $drag.css("left"));
            });
        }

        function onMouseMove() {
            $(document).on("mousemove", function (e) {

                defaultWidth = $children.width();
                notDraggingItems = $children.not(".drag");

                $drag.css("position", "absolute").css("width", defaultWidth);
                if (rotation == 270)
                    $drag.css(horizontalSpace, e.pageX - ($(document).width() - $content.width())).css(verticalSpace, e.pageY);
                else
                    $drag.css(horizontalSpace, e.pageX).css(verticalSpace, e.pageY);
                lastMoveMouse = e;
            });
        }

        function scroll() {
            var bottomBorder = 0,
                topBorder = 0,
                bottomOffset = 0;
            if (rotation == 0) {
                bottomOffset = $(document).height() - ($list.offset().top + $list.height());
                bottomBorder = $(document).height() - bottomOffset;
                topBorder = $list.offset().top;
            }
            else if (rotation == 180) {
                var topOffset = $(document).height() - ($list.offset().top + $list.height());
                bottomBorder = $list.offset().top;
                topBorder = $(document).height() - topOffset;
            }
            else if (rotation == 90) {
                bottomBorder = $list.offset().left;
                topBorder = $list.offset().left + $list.height();
            }
            else if (rotation = 270) {
                bottomBorder = $list.offset().left + $list.height();
                topBorder = $list.offset().left;
            }


            if (rotation == 0) {
                if ($drag.offset().top >= bottomBorder && $drag.offset().top <= bottomBorder + scrollTolerance) {
                    $list.animate({scrollTop: '+=100'}, function () {
                        $list.stop();
                    });
                }
                else if ($drag.offset().top <= topBorder && $drag.offset().top >= topBorder - scrollTolerance) {
                    $list.animate({scrollTop: '-=100'}, function () {
                        $list.stop();
                    });
                }
                else {
                    $list.stop();
                }
            }
            if (rotation == 180) {
                if ($drag.offset().top <= bottomBorder && $drag.offset().top >= bottomBorder - scrollTolerance) {
                    $list.animate({scrollTop: '+=100'}, function () {
                        $list.stop();
                    });
                }
                else if ($drag.offset().top >= topBorder && $drag.offset().top <= topBorder + scrollTolerance) {
                    $list.animate({scrollTop: '-=100'}, function () {
                        $list.stop();
                    });
                }
                else {
                    $list.stop();
                }
            }

            if (rotation == 90) {
                if ($drag.offset().left <= bottomBorder && $drag.offset().left >= bottomBorder - scrollTolerance) {

                    $list.animate({scrollTop: '+=100'}, function () {
                        $list.stop();

                    });
                }
                else if ($drag.offset().left >= topBorder && $drag.offset().left <= topBorder + scrollTolerance) {
                    console.log("scrollleftup")
                    $list.animate({scrollTop: '-=100'}, function () {
                        $list.stop();
                    });
                }
                else {
                    $list.stop();
                }
            }

            if (rotation == 270) {
                if ($drag.offset().left >= bottomBorder && $drag.offset().left <= bottomBorder + scrollTolerance) {

                    $list.animate({scrollTop: '+=100'}, function () {
                        $list.stop();

                    });
                }
                else if ($drag.offset().left <= topBorder && $drag.offset().left >= topBorder - scrollTolerance) {
                    $list.animate({scrollTop: '-=100'}, function () {
                        $list.stop();
                    });
                }
                else {
                    $list.stop();
                }
            }


            console.log(topBorder - scrollTolerance, $drag.offset().left);
        }

        function onMouseUp() {
            $(document).on("mouseup", function (e) {
                $list.stop();
                clearInterval(scrollInterval);
                var min = Number.POSITIVE_INFINITY;

                for (var i = 0; i < notDraggingItems.length; i++) {
                    var notDraggingItemOffset = null,
                        top = null,
                        dist = null;
                    if (rotation == 0 || rotation == 180) {
                        notDraggingItemOffset = $(notDraggingItems[i]).position().top,
                            top = lastMoveMouse.pageY;
                    }
                    else if (rotation == 90 || 270) {
                        notDraggingItemOffset = $(notDraggingItems[i]).position().left,
                            top = lastMoveMouse.pageX;
                    }
                    if (rotation == 270) {
                        top -= ($(document).width() - $content.width());
                    }

                    dist = top - notDraggingItemOffset;
                    if (dist < 0) {
                        dist *= -1;
                    }
                    if (dist < min) {
                        $closestItem = $(notDraggingItems[i]);
                        min = dist;
                    }
                }
                $closestItem.addClass("insert");

                insertByRotationMouse();
                $list.css("overflow-y", "scroll");
                $drag.css("position", "relative").css(horizontalSpace, "auto").css(verticalSpace, "auto").css("width", "auto");

                $drag.removeClass("drag");
                $(".insert").removeClass("insert");
                removeEvents();
            });
        }

        function onTouchEnd() {
            $(document).on("touchend", function (e) {
                $list.stop();
                clearInterval(scrollInterval);
                var min = Number.POSITIVE_INFINITY;

                for (var i = 0; i < notDraggingItems.length; i++) {
                    var notDraggingItemOffset = null,
                        top = null,
                        dist = null;
                    if (rotation == 0 || rotation == 180) {
                        notDraggingItemOffset = $(notDraggingItems[i]).position().top,
                            top = lastMoveTouch.originalEvent.targetTouches[0].pageY;
                    }
                    else if (rotation == 90 || 270) {
                        notDraggingItemOffset = $(notDraggingItems[i]).position().left,
                            top = lastMoveTouch.originalEvent.targetTouches[0].pageX;
                    }
                    if (rotation == 270) {
                        top -= ($(document).width() - $content.width());
                    }

                    dist = top - notDraggingItemOffset;
                    if (dist < 0) {
                        dist *= -1;
                    }
                    if (dist < min) {
                        $closestItem = $(notDraggingItems[i]);
                        min = dist;
                    }
                }
                $closestItem.addClass("insert");

                handleInsertByRotation();
                $list.css("overflow-y", "scroll");
                $drag.css("position", "relative").css(horizontalSpace, "auto").css(verticalSpace, "auto").css("width", "auto");

                $drag.removeClass("drag");
                $(".insert").removeClass("insert");
                removeEvents();

            });
        }

        function removeEvents() {
            $(document).off("touchstart").off("touchmove").off("touchend").off("touchstart").off("mousedown").off("mousemove").off("mouseup");
            $(document).css("user-select", "auto").attr('unselectable', 'off').on('selectstart', true);
        }

        function handleInsertByRotation() {

            console.log(lastMoveTouch.originalEvent.targetTouches[0].pageX, $closestItem.position().left)
            var $insert = $(".insert");
            if (rotation == 180)
                if (lastMoveTouch.originalEvent.targetTouches[0].pageY >= $closestItem.position().top)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 0)
                if (lastMoveTouch.originalEvent.targetTouches[0].pageY <= $closestItem.position().top)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 90)
                if (lastMoveTouch.originalEvent.targetTouches[0].pageX <= $closestItem.position().left)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 270)
                if (lastMoveTouch.originalEvent.targetTouches[0].pageX - ($(document).width() - $content.width()) <= $closestItem.position().left)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
        }

        function insertByRotationMouse() {

            console.log(lastMoveMouse.pageX, $closestItem.position().left)
            var $insert = $(".insert");
            if (rotation == 180)
                if (lastMoveMouse.pageY >= $closestItem.position().top)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 0)
                if (lastMoveMouse.pageY <= $closestItem.position().top)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 90)
                if (lastMoveMouse.pageX <= $closestItem.position().left)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 270)
                if (lastMoveMouse.pageX - ($(document).width() - $content.width()) <= $closestItem.position().left)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
        }

        function setRotationSpaces(rotation) {
            if (rotation == 180) {
                horizontalSpace = "right";
                verticalSpace = "bottom";
            }
            else if (rotation == 0) {
                horizontalSpace = "left";
                verticalSpace = "top";
            }
            else if (rotation == 90) {
                horizontalSpace = "bottom";
                verticalSpace = "left";
            }
            else if (rotation == 270) {
                horizontalSpace = "top";
                verticalSpace = "right";
            }

            function setDragPositions(e) {
                if (rotation == 0) {
                    horizontalPosition = lastMoveTouch.originalEvent.targetTouches[0].pageY;
                    verticalPosition = $closestItem.position().top;
                }
                if (rotation == 180) {
                    horizontalPosition = lastMoveTouch.originalEvent.targetTouches[0].pageY;
                    verticalPosition = $closestItem.position().top;
                }
                if (rotation == 90) {
                    horizontalPosition = lastMoveTouch.originalEvent.targetTouches[0].pageX;
                    verticalPosition = $closestItem.position().left;
                }
                if (rotation == 270) {
                    horizontalPosition = lastMoveTouch.originalEvent.targetTouches[0].pageX - ($(document).width() - $content.width());
                    verticalPosition = $closestItem.position().left;
                }
            }
        }

        return this;

    };

    $.fn.destroy = function (options) {
        var $children = $(options.delegates),
            listId = options.listId;
        $children.off("touchstart").off("mousedown");
        return this;
    };

}(jQuery));