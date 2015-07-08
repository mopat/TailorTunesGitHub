/**
 * Created by Patrick on 06.07.2015.
 */
var $evButton = $("#ev-button"),
    isTaskRunning = false,
    $evHide = $(".ev-hide"),
    $taskNumber = $("#task-number"),
    $userNumber = $("#user-number"),
    $taskSuccess = $("#task-success");
$taskFail = $("#task-fail");
$device = $("#device"),
    evCount = 0,
    groupIndicator = null,
    filename = null,
    data = "",
    HEADER = "datetime;userid;task;group;device;eventtype;eventind;tdiff;tcomplete\n",
    lastDatetime = null,
    tStart = null,
    isTaskSucceeded = null;

$taskSuccess.on("click", function () {
    handleTaskSuccessOrFail(true);
});
$taskFail.on("click", function () {
    handleTaskSuccessOrFail(false);
});

function handleTaskSuccessOrFail(isSucceeded) {
    isTaskSucceeded = false;
    $taskSuccess.hide();
    $taskFail.hide();
    $evButton.show();
};
$evButton.on("click", function (e) {
    if (isTaskRunning) {
        isTaskRunning = false;
    }
    else {
        isTaskRunning = true;
        lastDatetime = Date.now();
        tStart = Date.now();
        $taskSuccess.show();
        $taskFail.show();
        $(this).hide();
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

        createLog(datetime, uid, task, groupIndicator, device, eventType, c);
        $.ajax({
            type: 'POST',
            url: 'http://localhost:63342/TailorTunesGithub/evaluation/receiver.php',//url of receiver file on server
            data: {data: data, directory: device, userId: uid, filename: filename, header: HEADER}, //your data
            success: function (datas) {
                alert("SUCCESS");
                data = "";
                evCount = 0;
                c = "";
                lastDatetime = null;
                tStart = null;
                isTaskSucceeded = null;
                $taskSuccess.hide();
                $taskFail.hide();
            }, //callback when ajax request finishes
            dataType: "text" //text/json...
        });


    }
});


$device.change(function (e) {
    if ($(this).val() != "None") {
        removeEventListener();
        setEventListener($(this).val());
        setGroupIndicator($(this).val());
    }
});

function setGroupIndicator(device) {
    if (device == "Desktop")
        groupIndicator = 1;
    else if (device == "Mobile")
        groupIndicator = 2;
    else if (device == "Tabletop")
        groupIndicator = 3;

}
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
    filename = "p" + uid + "_" + device;
    if (isTaskRunning) {

        if (evCount == 0)
            c = "start";
        else if (isTaskSucceeded)
            c = "success";
        else if (isTaskSucceeded == false)
            c = "fail";
        else
            c = evCount;
        createLog(datetime, uid, task, groupIndicator, device, eventType, c)
    }


}

function createLog(datetime, uid, task, groupIndicator, device, eventType, c) {
    evCount++;
    var tDiff = datetime - lastDatetime;
    var tComplete = datetime - tStart;
    data += datetime + ";" + uid + ";" + task + ";" + groupIndicator + ";" + device + ";" + eventType + ";" + c + ";" + tDiff + ";" + tComplete + "\n";
    console.log(data)
    lastDatetime = datetime;

    //console.log(data);

}