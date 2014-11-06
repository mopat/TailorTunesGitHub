/**
 * Created by Patrick on 04.11.2014.
 */
var $infoIcon = $("#info-icon");
var $infoContent = $("#info-content");

$infoIcon.on("click", function (e) {
    e.preventDefault();
    if ($infoContent.is(":hidden")) {
        $infoContent.show(100);
    }
    else {
        $infoContent.hide(100);
    }
});
$(window).resize(function () {
    if ($(window).width() > 1024) {
        $infoContent.show();
    }
    else {
        $infoContent.hide();
    }
});