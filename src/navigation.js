/**
 * Created by Patrick on 28.10.2014.
 */
var navList = $("#nav-list");
$("#pull").on("click", function(){
    if(navList.is(":hidden")){
        navList.show(500);
    }
    else if(navList.is(":visible")){
        navList.hide(500);
    }

});
