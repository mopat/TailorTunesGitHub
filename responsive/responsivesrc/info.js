/**
 * Created by Patrick on 04.11.2014.
 */
var $infoHeader = $("#info-header");
var $infoContent = $("#info-content");
var $document = $(document);
var $documentWidth = $(document).width();

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
    console.log($document.width());
    if($documentWidth > 1024){
        $infoContent.show();
    }
});