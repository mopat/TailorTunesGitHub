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
        $children = null,
        notDraggingItems = [],
        defaultWidth = null,
        delay = 0,
        delayTimer = null;

    $.fn.rotatableSortable = function (options) {
        console.log($(this))
        var listId = options.listId,
            delegates = options.delegates,
            contentId = options.contentId,
            $list = $(listId),
            $children = $list.find(delegates),
            $content = $(contentId),
        rotation = options.rotation;

        setRotationSpaces(rotation);
        addSortable();


        function addSortable() {
            $children.on("touchstart", function (e) {
                e.preventDefault();
                $list.css("overflow-y", "hidden");
                $(document).css("user-select", "none").attr('unselectable', 'on').on('selectstart', false);

                $drag = $(this);
                $drag.addClass("drag");

                onTouchMove();

                onTouchEnd();
            });

            $children.on("mousedown", (function (e) {
                e.preventDefault();

                $list.css("overflow-y", "hidden");
                $(document).css("user-select", "none").attr('unselectable', 'on').on('selectstart', false);

                $drag = $(this);
                $drag.addClass("drag");

                onMouseMove();

                onMouseUp();
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
                lastMove = e;
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
                lastMove = e;
                console.log(e.pageX, $drag.css("left"));
            });
        }

        function onMouseUp() {
            $(document).on("mouseup", function (e) {
                console.log(e)
                var min = Number.POSITIVE_INFINITY;


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
                console.log(e)
                var min = Number.POSITIVE_INFINITY;


                for (var i = 0; i < notDraggingItems.length; i++) {
                    var notDraggingItemOffset = null,
                        top = null,
                        dist = null;
                    if (rotation == 0 || rotation == 180) {
                        notDraggingItemOffset = $(notDraggingItems[i]).position().top,
                            top = lastMove.originalEvent.targetTouches[0].pageY;
                    }
                    else if (rotation == 90 || 270) {
                        notDraggingItemOffset = $(notDraggingItems[i]).position().left,
                            top = lastMove.originalEvent.targetTouches[0].pageX;
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

            console.log(lastMove.originalEvent.targetTouches[0].pageX, $closestItem.position().left)
            var $insert = $(".insert");
            if (rotation == 180)
                if (lastMove.originalEvent.targetTouches[0].pageY >= $closestItem.position().top)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 0)
                if (lastMove.originalEvent.targetTouches[0].pageY <= $closestItem.position().top)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 90)
                if (lastMove.originalEvent.targetTouches[0].pageX <= $closestItem.position().left)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
            else if (rotation == 270)
                if (lastMove.originalEvent.targetTouches[0].pageX - ($(document).width() - $content.width()) <= $closestItem.position().left)
                    $drag.insertBefore($insert);
                else
                    $drag.insertAfter($insert);
        }

        function insertByRotationMouse() {

            console.log(lastMove.pageX, $closestItem.position().left)
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
                    horizontalPosition = lastMove.originalEvent.targetTouches[0].pageY;
                    verticalPosition = $closestItem.position().top;
                }
                if (rotation == 180) {
                    horizontalPosition = lastMove.originalEvent.targetTouches[0].pageY;
                    verticalPosition = $closestItem.position().top;
                }
                if (rotation == 90) {
                    horizontalPosition = lastMove.originalEvent.targetTouches[0].pageX;
                    verticalPosition = $closestItem.position().left;
                }
                if (rotation == 270) {
                    horizontalPosition = lastMove.originalEvent.targetTouches[0].pageX - ($(document).width() - $content.width());
                    verticalPosition = $closestItem.position().left;
                }
            }
        }

        return this;

    };

    $.fn.destroy = function (options) {
        var $children = $(options.delegates),
            listId = options.listId;
        $children.off("touchstart");
    };

}(jQuery));