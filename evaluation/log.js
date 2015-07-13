/**
 * Created by Patrick on 06.07.2015.
 */
var $evButton = $("#ev-button"),
    isTaskRunning = false,
    $evHide = $(".ev-hide"),
    $taskNumber = $("#task-number"),
    $userNumber = $("#user-number"),
    $device = $("#device"),
    evCount = 0,
    groupIndicator = null,
    filename = null,
    data = "",
    HEADER = "datetime;userid;task;group;device;eventtype;eventind;tdiff;tcomplete\n",
    lastDatetime = null,
    tStart = null,
    isTaskSucceeded = null;

$evButton.on("click", function (e) {
        isTaskRunning = true;
        lastDatetime = Date.now();
        tStart = Date.now();
        $evHide.hide();
});

$(window).on("keydown", function (e) {
    if (e.keyCode == 222 && isTaskRunning) {
        $evHide.show();
        isTaskRunning = false;
        evCount = 0;
        c = "";
        lastDatetime = null;
        tStart = null;
        isTaskSucceeded = null;
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
        $(window).on("click touchstart touchend keydown", function (e) {
            log(e);
        });
    }
    else if (device == "Desktop") {
        $(window).on("click mousedown mouseup keydown", function (e) {
            log(e);
        });
    }
    if (device == "Mobile") {
        var el = document.getElementById("body"),
            hammertime = new Hammer(el);

        hammertime.get("rotate").set({enable: true});
        hammertime.get("pinch").set({enable: true});
        hammertime.on("rotate pinch", function (e) {
            e.preventDefault();
        });

        hammertime.on("rotateend", function (e) {
            if ($device.val() == "Mobile") {
                var rotationValue = e.rotation;
                if (rotationValue < 0)
                    rotationValue *= -1;
                if (rotationValue >= 80) {
                    $evHide.show();
                    evCount = 0;
                    c = "";
                    lastDatetime = null;
                    tStart = null;
                    isTaskSucceeded = null;
                }
            }
        });
    }
}

function removeEventListener() {
    $(window).on("click touchstart touchend mousedown mouseup keydown", function (e) {
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
        else if (isTaskRunning == false)
            c = "delete"
        else
            c = evCount;
        createLog(datetime, uid, task, groupIndicator, device, eventType, c)
    }
}


function createLog(datetime, uid, task, groupIndicator, device, eventType, c) {
    evCount++;
    var tDiff = datetime - lastDatetime;
    var tComplete = datetime - tStart;
    data = datetime + ";" + uid + ";" + task + ";" + groupIndicator + ";" + device + ";" + eventType + ";" + c + ";" + tDiff + ";" + tComplete + "\n";
    console.log(data);
    lastDatetime = datetime;
//http://132.199.139.24/~mop28809/evaluation/receiver.php
    $.ajax({
        type: 'POST',
        url: 'http://localhost:63342/TailorTunesGithub/evaluation/receiver.php',//url of receiver file on server
        data: {data: data, directory: device, userId: uid, filename: filename, header: HEADER}, //your data
        success: function (datas) {
            data = "";
        }, //callback when ajax request finishes
        dataType: "text" //text/json...
    });
}