/**
 * Created by Patrick on 06.07.2015.
 */
var $evButton = $("#ev-button"),
    isTaskRunning = false,
    $evHide = $(".ev-hide"),
    $taskNumber = $("#task-number"),
    $userNumber = $("#user-number"),
    $device = $("#device"),
    evCount = 0;


$evButton.on("click", function (e) {
    if (isTaskRunning) {
        isTaskRunning = false;

    }
    else {
        isTaskRunning = true;
    }
    if (isTaskRunning) {
        $(this).html("Stop").css({left: 0, position: "absolute"});
        $evHide.hide();
    }
    else {

        $(this).html("Start").css({left: "none", position: "relative"});
        $evHide.show();
        removeEventListener();
        var c = "",
            datetime = Date.now(),
            uid = $userNumber.val(),
            task = $taskNumber.val(),
            device = $device.val(),
            eventType = e.type;
        c = "end";
        createLog(datetime, uid, task, device, eventType, c);
        evCount = 0;

    }
});

$device.change(function (e) {
    if ($(this).val() != "None") {
        removeEventListener();
        setEventListener($(this).val());
    }
});

function setEventListener(device) {
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
    var c = "",
        datetime = Date.now(),
        uid = $userNumber.val(),
        task = $taskNumber.val(),
        device = $device.val(),
        eventType = e.type;
    if (isTaskRunning) {

        if (evCount == 0)
            c = "start";
        else
            c = evCount;
        createLog(datetime, uid, task, device, eventType, c)
    }


}

function createLog(datetime, uid, task, device, eventType, c) {
    evCount++;
    console.log(datetime, uid, task, device, eventType, c);
}