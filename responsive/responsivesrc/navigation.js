/**
 * Created by Patrick on 28.10.2014.
 */
var navList = $("#nav-list");
$("#pull").on("click", function () {
    if (navList.is(":hidden")) {
        navList.slideDown(100);
    }
    else if (navList.is(":visible")) {
        navList.slideUp(100);
    }

});
