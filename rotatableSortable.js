/**
 * Created by Patrick on 12.02.2015.
 */
(function ($) {
    var lastMove = null,
        $closestItem = null,
        $drag = null,
        horizontalSpace = null,
        verticalSpace = null,
        $list = null,
        $content = null,
        $children = null;


    $.fn.rotatableSortable = function (options) {
        console.log(options)

        var listId = options.listId,
            delegates = options.delegates,
            rotation = options.rotation,
            contentId = options.contentId,
            $list = $(listId),
            $children = $list.find(delegates),
            $content = $(contentId);


        setRotationSpaces(rotation);
        addSortable();


        function addSortable() {

            $children.on("touchstart", function (e) {
                $list.css("overflow-y", "hidden");
                $(document).css("user-select", "none").attr('unselectable', 'on').on('selectstart', false);

                $drag = $(this);
                $drag.addClass("drag");

                onTouchMove();

                onTouchEnd();
            });
        }


        function onTouchMove() {
            $(document).on("touchmove", function (e) {

                $drag.css("position", "absolute").css(horizontalSpace, e.originalEvent.targetTouches[0].pageX - ($(document).width() - $content.width())).css(verticalSpace, e.originalEvent.targetTouches[0].pageY);
                lastMove = e;

            });
        }

        function onTouchEnd() {
            $(document).on("touchend", function (e) {
                console.log(e)
                var min = Number.POSITIVE_INFINITY,
                    notDraggingItems = $children.not(".drag");

                for (var i = 0; i < notDraggingItems.length; i++) {
                    var notDragginItemOffset = $(notDraggingItems[i]).position().top,
                        top = lastMove.originalEvent.targetTouches[0].pageY,
                        dist = top - notDragginItemOffset;

                    if (dist < 0) {
                        dist *= -1;
                    }
                    if (dist < min) {
                        $closestItem = $(notDraggingItems[i]);
                        min = dist;
                    }
                }
                $closestItem.switchClass("drag", "insert");

                handleInsertByRotation();


                $drag.css("position", "relative").css(horizontalSpace, "auto").css(verticalSpace, "auto");


                $drag.removeClass("drag");
                $(".insert").removeClass("insert");
                $list.css("overflow-y", "scroll")
            });
        }

        function removeEvents() {
            $(document).off("touchstart").off("touchmove").off("touchend").off("touchstart");
            $(document).css("user-select", "auto").attr('unselectable', 'off').on('selectstart', true);
        }

        function handleInsertByRotation() {
            if (rotation == 180)
                if (lastMove.originalEvent.targetTouches[0].pageY >= $closestItem.position().top)
                    $drag.insertBefore($(".insert"));
                else
                    $drag.insertAfter($(".insert"));
            else if (rotation == 0)
                if (lastMove.originalEvent.targetTouches[0].pageY <= $closestItem.position().top)
                    $drag.insertBefore($(".insert"));
                else
                    $drag.insertAfter($(".insert"));
        }

        console.log(getRotation())
        function setRotationSpaces(rotation) {
            rotation = getRotation();
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

        return this;

    };

    $.fn.destroy = function () {
        $children.off("touchstart");
    };

}(jQuery));