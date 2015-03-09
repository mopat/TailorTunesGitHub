/**
 * Created by Patrick on 12.02.2015.
 */
(function ($) {
    var lastMove = null,
        $closestItem = null,
        $drag = null,
        horizontalSpace = null,
        verticalSpace = null,
        rotation = null,
        $list = null,
        $content = null,
        $delegates = null,
        notDraggingItems = [],
        defaultWidth = null,
        delay = null,
        scrollInterval = null,
        scrollIntervalDuration = null,
        scrollTolerance = null,
        scrollPx = null,
        $oldClosestItem = null,
        ghostInterval = null,
        $ghost = null;

    var min = Number.POSITIVE_INFINITY;


    $.fn.rotatableSortable = function (options) {
        var settings = $.extend({}, $.fn.rotatableSortable.defaults, options);
        //global vars
        rotation = settings.rotation;
        delay = settings.delay;
        scrollIntervalDuration = settings.scrollIntervalDuration;
        scrollTolerance = settings.scrollTolerance;
        scrollPx = settings.scrollPx;

        $list = $(this);
        $delegates = $list.find(settings.delegates);
        $content = $(settings.contentId);

        setRotationSpaces();
        addSortable();


        function addSortable() {
            $delegates.on("touchstart", function (e) {
                e.preventDefault();
                $drag = $(this);

                var timeout = window.setTimeout(function () {
                    followCursor(e);
                    onTouchMove();
                    onTouchEnd();

                    $ghost = $drag.clone();
                    $ghost.switchClass("drag", "ghost");
                    ghostInterval = setInterval(function () {
                        cloneDrag();
                    }, 50);

                    $(document).css("user-select", "none").attr('unselectable', 'on').on('selectstart', false);
                    $drag.addClass("drag").off("touchend");
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

            $delegates.on("mousedown", (function (e) {
                e.preventDefault();
                $drag = $(this);

                var timeout = window.setTimeout(function () {
                    followCursor(e);
                    onMouseUp();
                    onMouseMove();

                    $ghost = $drag.clone();
                    $ghost.switchClass("drag", "ghost");
                    ghostInterval = setInterval(function () {
                        cloneDrag();
                    }, 50);

                    $(document).css("user-select", "none").attr('unselectable', 'on').on('selectstart', false);
                    $drag.addClass("drag").off("mouseup");
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

        function getClosestItem() {
            var $closestItem = null;
            for (var i = 0; i < notDraggingItems.length; i++) {
                var notDraggingItemOffset = null,
                    top = null,
                    dist = null;
                if (rotation == 0 || rotation == 180) {
                    notDraggingItemOffset = $(notDraggingItems[i]).offset().top;
                    top = lastMove.pageY;
                }
                else if (rotation == 90 || 270) {
                    notDraggingItemOffset = $(notDraggingItems[i]).offset().left;
                    top = lastMove.pageX;
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
            return $closestItem;
        }

        function cloneDrag() {
            console.log("clone")
            min = Number.POSITIVE_INFINITY;

            if ($oldClosestItem != $closestItem) {
                insertClone();
            }

            $oldClosestItem = $closestItem;
            for (var i = 0; i < notDraggingItems.length; i++) {
                var notDraggingItemOffset = null,
                    top = null,
                    dist = null;
                if (rotation == 0 || rotation == 180) {
                    notDraggingItemOffset = $(notDraggingItems[i]).offset().top;
                    top = lastMove.pageY;
                }
                else if (rotation == 90 || 270) {
                    notDraggingItemOffset = $(notDraggingItems[i]).offset().left;
                    top = lastMove.pageX;
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

            $ghost.css("position", "relative").css(horizontalSpace, "auto").css(verticalSpace, "auto").css("min-width", defaultWidth);
        }

        function insertClone() {
            if (rotation == 180)
                if (lastMove.pageY >= $closestItem.offset().top + $closestItem.height() / 2)
                    $ghost.insertBefore($closestItem);
                else
                    $ghost.insertAfter($closestItem);
            else if (rotation == 0)
                if (lastMove.pageY <= $closestItem.offset().top - $closestItem.height() / 2)
                    $ghost.insertBefore($closestItem);
                else
                    $ghost.insertAfter($closestItem);
            else if (rotation == 90)
                if (lastMove.pageX >= $closestItem.offset().left + $closestItem.height() / 2)
                    $ghost.insertBefore($closestItem);
                else
                    $ghost.insertAfter($closestItem);
            else if (rotation == 270)
                if (lastMove.pageX >= $closestItem.offset().left - $closestItem.height() / 2)
                    $ghost.insertAfter($closestItem);
                else
                    $ghost.insertBefore($closestItem);

        }


        //FOLLOW CURSOR
        function onTouchMove() {
            $(document).on("touchmove", function (e) {
                e = e.originalEvent.targetTouches[0];

                followCursor(e);
            });
        }

        function onMouseMove() {
            $(document).on("mousemove", function (e) {
                followCursor(e);
            });
        }

        function followCursor(e) {
            defaultWidth = $delegates.width();
            notDraggingItems = $delegates.not(".drag");
            $drag.css("position", "absolute").css("min-width", defaultWidth);
            if (rotation == 0)
                $drag.css(horizontalSpace, e.pageX - $list.offset().left - $drag.width() / 2).css(verticalSpace, e.pageY - $list.offset().top);
            else if (rotation == 90)
                $drag.css(horizontalSpace, e.pageX - $list.offset().left - $drag.height()).css(verticalSpace, e.pageY - $list.offset().top - $drag.width() / 2);
            else if (rotation == 180)
                $drag.css(horizontalSpace, e.pageX - $list.offset().left - $drag.width() / 2).css(verticalSpace, e.pageY - $list.offset().top - $drag.height());
            else if (rotation == 270)
                $drag.css(horizontalSpace, e.pageX - $(document).width() + $list.height()).css(verticalSpace, e.pageY - $list.offset().top - $drag.width() / 2);

            lastMove = e;
        }


        //SORT END
        function onMouseUp() {
            $(document).on("mouseup", function (e) {
                sortComplete();
            });
        }

        function onTouchEnd() {
            $(document).on("touchend", function (e) {
                sortComplete();
            });
        }

        function sortComplete() {
            min = Number.POSITIVE_INFINITY;
            $list.stop();
            clearInterval(scrollInterval);

            for (var i = 0; i < notDraggingItems.length; i++) {
                var notDraggingItemOffset = null,
                    top = null,
                    dist = null;
                if (rotation == 0 || rotation == 180) {
                    notDraggingItemOffset = $(notDraggingItems[i]).offset().top;
                    top = lastMove.pageY;
                }
                else if (rotation == 90 || 270) {
                    notDraggingItemOffset = $(notDraggingItems[i]).offset().left;
                    top = lastMove.pageX;
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

            insertDragItem();
            $drag.css("position", "relative").css(horizontalSpace, "auto").css(verticalSpace, "auto").css("min-width", defaultWidth);
            $drag.removeClass("drag");

            $ghost.remove();
            clearInterval(ghostInterval);

            removeEvents();

            settings.sortEnd.call(this);
        }

        function insertDragItem() {
            if (rotation == 180)
                if (lastMove.pageY >= $closestItem.offset().top + $closestItem.height() / 2)
                    $drag.insertBefore($closestItem);
                else
                    $drag.insertAfter($closestItem);
            else if (rotation == 0)
                if (lastMove.pageY <= $closestItem.offset().top - $closestItem.height() / 2)
                    $drag.insertBefore($closestItem);
                else
                    $drag.insertAfter($closestItem);
            else if (rotation == 90)
                if (lastMove.pageX >= $closestItem.offset().left + $closestItem.height() / 2)
                    $drag.insertBefore($closestItem);
                else
                    $drag.insertAfter($closestItem);
            else if (rotation == 270)
                if (lastMove.pageX >= $closestItem.offset().left - $closestItem.height() / 2)
                    $drag.insertAfter($closestItem);
                else
                    $drag.insertBefore($closestItem);
        }

        function setRotationSpaces() {
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
        }

        function removeEvents() {
            $(document).off("touchstart").off("touchmove").off("touchend").off("touchstart").off("mousedown").off("mousemove").off("mouseup");
            $(document).css("user-select", "auto").attr('unselectable', 'off').on('selectstart', true);
        }


        //SCROLL
        function scroll() {
            var bottomBorder = 0,
                topBorder = 0;

            switch (parseInt(rotation)) {
                case  0:
                    bottomBorder = $list.offset().top + $list.height();
                    topBorder = $list.offset().top;
                    scrollZeroRotation(bottomBorder, topBorder);
                    break;
                case 90:
                    bottomBorder = $list.offset().left;
                    topBorder = $list.offset().left + $list.height();
                    scrollNinetyRotation(bottomBorder, topBorder);
                    break;
                case 180:
                    bottomBorder = $list.offset().top;
                    topBorder = $list.offset().top + $list.height();
                    scrollOneEightyRotation(bottomBorder, topBorder);
                    break;
                case 270:
                    bottomBorder = $list.offset().left + $list.height();
                    topBorder = $list.offset().left;
                    scrollTwoSeventyRotation(bottomBorder, topBorder);
                    break;
                default :
                    return;
            }
        }

        function scrollZeroRotation(bottomBorder, topBorder) {
            if ($drag.offset().top <= bottomBorder && $drag.offset().top >= bottomBorder - scrollTolerance) {
                scrollPlus();
            }
            else if ($drag.offset().top >= topBorder && $drag.offset().top <= topBorder + scrollTolerance) {
                scrollMinus();
            }
            else {
                $list.stop();
            }
        }

        function scrollOneEightyRotation(bottomBorder, topBorder) {
            if ($drag.offset().top >= bottomBorder && $drag.offset().top <= bottomBorder + scrollTolerance) {
                scrollPlus();
            }
            else if ($drag.offset().top <= topBorder && $drag.offset().top >= topBorder - scrollTolerance) {
                scrollMinus();
            }
            else {
                $list.stop();
            }
        }

        function scrollNinetyRotation(bottomBorder, topBorder) {
            if ($drag.offset().left >= bottomBorder && $drag.offset().left <= bottomBorder + scrollTolerance) {
                scrollPlus();
            }
            else if ($drag.offset().left <= topBorder && $drag.offset().left >= topBorder - scrollTolerance) {
                scrollMinus();
            }
            else {
                $list.stop();
            }
        }

        function scrollTwoSeventyRotation(bottomBorder, topBorder) {
            if ($drag.offset().left <= bottomBorder && $drag.offset().left >= bottomBorder - scrollTolerance) {
                scrollPlus();
            }
            else if ($drag.offset().left >= topBorder && $drag.offset().left <= topBorder + scrollTolerance) {
                scrollMinus();
            }
            else {
                $list.stop();
            }
        }

        function scrollPlus() {
            $list.animate({scrollTop: '+=' + scrollPx}, function () {
                $list.stop();
            });
        }

        function scrollMinus() {
            $list.animate({scrollTop: '-=' + scrollPx}, function () {
                $list.stop();
            });
        }

        return this;
    };


    $.fn.rotatableSortable.defaults = {
        delegates: "li",
        contentId: "#content",
        rotation: 0,
        delay: 1000,
        scrollIntervalDuration: 200,
        scrollTolerance: 100,
        scrollPx: 100,

        sortEnd: function () {
            //called when mouse or touch is released
        }
    };

    $.fn.destroy = function (options) {
        var $delegates = $(options.delegates);
        if (options.delegates == null || options.delegates == undefined)
            $delegates = $(this).children();

        $(this).stop();
        $delegates.off("touchstart").off("mousedown");
        clearTimeout(scrollInterval);
        return this;
    };

}(jQuery));