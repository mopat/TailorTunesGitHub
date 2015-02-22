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
        scrollPx = null;

    min = Number.POSITIVE_INFINITY;

    var defaultOptions = {
        rotation: 0,
        delay: 1000,
        scrollIntervalDuration: 200,
        scrollTolerance: 100,
        scrollPx: 100
    };

    $.fn.rotatableSortable = function (options, sortEnd) {
        //global vars
        rotation = options.rotation;
        delay = options.delay;
        scrollIntervalDuration = options.scrollIntervalDuration;
        scrollTolerance = options.scrollTolerance;
        scrollPx = options.scrollPx;

        //options for further usage
        $list = $(options.listId),
            $delegates = $list.find(options.delegates),
            $content = $(options.contentId);

        //set default value if necessary
        if (options.delegates == null || options.delegates == undefined)
            $delegates = $list.children();

        if (rotation == null || rotation == undefined)
            rotation = defaultOptions.rotation;

        if (delay == null || delay == undefined)
            delay = defaultOptions.delay;

        if (scrollIntervalDuration == null || scrollIntervalDuration == undefined)
            scrollIntervalDuration = defaultOptions.scrollIntervalDuration;

        if (scrollTolerance == null || scrollTolerance == undefined)
            scrollTolerance = defaultOptions.scrollTolerance;

        if (scrollPx == null || scrollPx == undefined)
            scrollPx = defaultOptions.scrollPx;

        setRotationSpaces();
        addSortable();


        function addSortable() {
            $delegates.on("touchstart", function (e) {
                min = Number.POSITIVE_INFINITY;
                e.preventDefault();
                $drag = $(this);

                var timeout = window.setTimeout(function () {
                    onTouchMove();
                    onTouchEnd();

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

            $delegates.on("mousedown", (function (e) {
                min = Number.POSITIVE_INFINITY;
                e.preventDefault();
                $drag = $(this);

                var timeout = window.setTimeout(function () {
                    scroll();
                    onMouseUp();
                    onMouseMove();

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
                defaultWidth = $delegates.width();
                notDraggingItems = $delegates.not(".drag");
                e = e.originalEvent.targetTouches[0];

                $drag.css("position", "absolute").css("width", defaultWidth);

                if (rotation == 0)
                    $drag.css(horizontalSpace, e.pageX - $list.offset().left - $drag.width() / 2).css(verticalSpace, e.pageY - $list.offset().top);
                else if (rotation == 90)
                    $drag.css(horizontalSpace, e.pageX - $list.offset().left - $drag.height()).css(verticalSpace, e.pageY - $list.offset().top - $drag.width() / 2);
                else if (rotation == 180)
                    $drag.css(horizontalSpace, e.pageX - $list.offset().left - $drag.width() / 2).css(verticalSpace, e.pageY - $list.offset().top - $drag.height());
                else if (rotation == 270)
                    $drag.css(horizontalSpace, e.pageX - ($(document).width() - $content.width()) - $drag.height()).css(verticalSpace, e.pageY - $list.offset().top - $drag.width() / 2);
                lastMove = e;
            });
        }

        function onMouseMove() {
            $(document).on("mousemove", function (e) {
console.log(e.pageX, $drag.css("left"))
                defaultWidth = $delegates.width();
                notDraggingItems = $delegates.not(".drag");

                $drag.css("position", "absolute").css("width", defaultWidth);
                if (rotation == 0)
                    $drag.css(horizontalSpace, e.pageX - $list.offset().left - $drag.width() / 2).css(verticalSpace, e.pageY - $list.offset().top);
                else if (rotation == 90)
                    $drag.css(horizontalSpace, e.pageX - $list.offset().left - $drag.height()).css(verticalSpace, e.pageY - $list.offset().top - $drag.width() / 2);
                else if (rotation == 180)
                    $drag.css(horizontalSpace, e.pageX - $list.offset().left - $drag.width() / 2).css(verticalSpace, e.pageY - $list.offset().top - $drag.height());
                else if (rotation == 270)
                    $drag.css(horizontalSpace, e.pageX - ($(document).width() - $content.width()) - $drag.height()).css(verticalSpace, e.pageY - $list.offset().top - $drag.width() / 2);
                lastMove = e;
            });
        }

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

        function onMouseUp() {
            $(document).on("mouseup", function (e) {
                $list.stop();
                clearInterval(scrollInterval);

                for (var i = 0; i < notDraggingItems.length; i++) {
                    var notDraggingItemOffset = null,
                        top = null,
                        dist = null;
                    if (rotation == 0 || rotation == 180) {
                        notDraggingItemOffset = $(notDraggingItems[i]).position().top,
                            top = lastMove.pageY;
                    }
                    else if (rotation == 90 || 270) {
                        notDraggingItemOffset = $(notDraggingItems[i]).position().left,
                            top = lastMove.pageX;
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

                insertDragItem();
                $drag.css("position", "relative").css(horizontalSpace, "auto").css(verticalSpace, "auto").css("width", defaultWidth);

                $drag.removeClass("drag");
                $(".insert").removeClass("insert");
                removeEvents();
                if (typeof sortEnd == 'function') {
                    sortEnd.call(this);
                }
            });
        }

        function onTouchEnd() {
            $(document).on("touchend", function (e) {
                $list.stop();
                clearInterval(scrollInterval);

                for (var i = 0; i < notDraggingItems.length; i++) {
                    var notDraggingItemOffset = null,
                        top = null,
                        dist = null;
                    if (rotation == 0 || rotation == 180) {
                        notDraggingItemOffset = $(notDraggingItems[i]).position().top,
                            top = lastMove.pageY;
                    }
                    else if (rotation == 90 || 270) {
                        notDraggingItemOffset = $(notDraggingItems[i]).position().left,
                            top = lastMove.pageX;
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

                insertDragItem();
                $drag.css("position", "relative").css(horizontalSpace, "auto").css(verticalSpace, "auto").css("width", defaultWidth);

                $drag.removeClass("drag");
                $(".insert").removeClass("insert");
                removeEvents();
                if (typeof sortEnd == 'function') {
                    sortEnd.call(this);
                }
            });
        }

        function insertDragItem() {
            var $insert = $(".insert");
            if (rotation == 180)
                if (lastMove.pageY >= $closestItem.position().top)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 0)
                if (lastMove.pageY <= $closestItem.position().top)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 90)
                if (lastMove.pageX <= $closestItem.position().left)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 270)
                if (lastMove.pageX - ($(document).width() - $content.width()) <= $closestItem.position().left)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
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

        return this;
    };

    $.fn.destroy = function (options) {
        var $delegates = $(options.delegates);
        if (options.delegates == null || options.delegates == undefined)
            $delegates = $(this).children();

        $(this).stop();
        $delegates.off("touchstart").off("mousedown");

        return this;
    };

}(jQuery));