/**
 * Created by Patrick on 04.11.2014.
 */
var $infoHeader = $("#info-header");
var $infoContent = $("#info-content");

$infoHeader.on("click", function(e){
    e.preventDefault();
        if($infoContent.is(":hidden")){
            $infoContent.show(100);
        }
        else{
            $infoContent.hide(100);
        }
});
$(window).resize(function(){
    console.log($(window).width());
    if($(window).width() > 1024){
        $infoContent.show();
    }
    else{
        $infoContent.hide();
    }
});