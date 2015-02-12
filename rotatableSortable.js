/**
 * Created by Patrick on 12.02.2015.
 */
(function ($) {
    var lastMove = null,
        $closestItem = null,
        $drag = null,
        horizontalSpace = null,
        verticalSpace = null;

    $.fn.rotatableSortable = function (options) {

        var listId = options.listId,
            delegates = options.delegates,
            rotation = options.rotation,
            $children = $(listId).find(delegates);

        setRotationSpaces(rotation);
        addSortable();


        function addSortable() {

            $children.on("touchstart", function (e) {
                $(document).css("user-select", "none").attr('unselectable', 'on').on('selectstart', false);

                $drag = $(this);
                $drag.addClass("drag");

                onTouchMove();

                onTouchEnd();
            });
        }


        function onTouchMove() {
            $(document).on("touchmove", function (e) {

                $drag.css("position", "absolute").css(horizontalSpace, e.originalEvent.targetTouches[0].pageX).css(verticalSpace, e.originalEvent.targetTouches[0].pageY);
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

        function setRotationSpaces(rotation) {
            if (rotation == 180) {
                horizontalSpace = "right";
                verticalSpace = "bottom";
            }
            if (rotation == 0) {
                horizontalSpace = "left";
                verticalSpace = "top";
            }
        }

        return this;

    };

}(jQuery));