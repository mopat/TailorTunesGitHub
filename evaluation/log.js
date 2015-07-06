/**
 * Created by Patrick on 06.07.2015.
 */
var $evButton = $("#ev-button"),
    isTaskRunning = false,
    $evHide = $(".ev-hide"),
    $taskNumber = $("#task-number"),
    $userNumber = $("#user-number"),
    $device = $("#device");

$evButton.on("click", function (e) {
    if (isTaskRunning) {
        $(this).html("Start");
        isTaskRunning = false;
        $evHide.show();
        removeEventListener();
    }
    else {
        $(this).html("Stop");
        isTaskRunning = true;
        $evHide.hide();
        setEventListener();
    }
});

function setEventListener() {
    var device = $device.val();
    console.log(device)
    if (device == "Mobile" || device == "Tabletop") {
        $(window).on("click touchstart touchend", function (e) {
            log(e);
        });
    }
    else if (device == "Desktop") {
        $(window).on("click mousedown mouseup", function (e) {
            log(e);
        });

    }
}

function removeEventListener() {
    $(window).on("click touchstart touchend mousedown mouseup", function (e) {
        return true;
    });
}

function rotatableLog(e) {
    log(e);
}

function log(e) {

    if (isTaskRunning) {
        var datetime = Date.now(),
            uid = $userNumber.val(),
            task = $taskNumber.val(),
            device = $device.val(),
            eventType = e.type;

        console.log(datetime, uid, task, device, eventType);
    }


}