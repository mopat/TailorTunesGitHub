(function (a) {
    a.fn.getOffsets = function (b) {
        var c = {directions: ["left", "right", "top", "bottom"], offsetOfParent: false};
        var b = a.extend(c, b);
        var d = [];
        var e = a(this);
        objectOffset = e.offset();
        objectPosition = e.position();
        if (b.offsetOfParent == true) {
            if (a.inArray("left", b.directions) !== -1) {
                leftOffsetInPixels = objectPosition.left;
                d.push(leftOffsetInPixels)
            }
            if (a.inArray("right", b.directions) !== -1) {
                windowWidth = a(window).outerWidth();
                objectWidth = a(e).width();
                objectOffsetLeft = objectPosition.left;
                rightOffsetInPixels = windowWidth - objectWidth - objectOffsetLeft;
                d.push(rightOffsetInPixels)
            }
            if (a.inArray("top", b.directions) !== -1) {
                topOffsetInPixels = objectPosition.top;
                d.push(topOffsetInPixels)
            }
            if (a.inArray("bottom", b.directions) !== -1) {
                windowHeight = a(window).outerHeight();
                objectHeight = a(e).height();
                objectOffsetTop = objectPosition.top;
                bottomOffsetInPixels = windowHeight - objectHeight - objectOffsetTop;
                d.push(bottomOffsetInPixels)
            }
            return d
        } else {
            if (a.inArray("left", b.directions) !== -1) {
                leftOffsetInPixels = objectOffset.left;
                d.push(leftOffsetInPixels)
            }
            if (a.inArray("right", b.directions) !== -1) {
                windowWidth = a(window).outerWidth();
                objectWidth = a(e).width();
                objectOffsetLeft = objectOffset.left;
                rightOffsetInPixels = windowWidth - objectWidth - objectOffsetLeft;
                d.push(rightOffsetInPixels)
            }
            if (a.inArray("top", b.directions) !== -1) {
                topOffsetInPixels = objectOffset.top;
                d.push(topOffsetInPixels)
            }
            if (a.inArray("bottom", b.directions) !== -1) {
                windowHeight = a(window).outerHeight();
                objectHeight = a(e).height();
                objectOffsetTop = objectOffset.top;
                bottomOffsetInPixels = windowHeight - objectHeight - objectOffsetTop;
                d.push(bottomOffsetInPixels)
            }
            return d
        }
    }
})(jQuery)