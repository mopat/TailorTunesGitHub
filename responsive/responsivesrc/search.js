/**
 * Created by Patrick on 16.11.2014.
 */
var $searchIcon = $("#search-icon");
var $searchInputBox = $("#search-input-box");

$searchIcon.on("click", function () {
    if ($searchInputBox.is(":hidden"))
        $searchInputBox.slideDown(300);
    else {
        $searchInputBox.slideUp(300);
    }
});