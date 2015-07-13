/**
 * Created by Patrick on 06.07.2015.
 */
var isTaskRunning = false,
    $evButton = $("#ev-button"),
    $taskNumber = $("#task-number"),
    $userNumber = $("#user-number"),
    $taskSuccess = $("#task-success"),
    $evHide = $(".ev-hide"),
    $taskFail = $("#task-fail"),
    $device = $("#device"),
    filename = null,
    groupIndicator = null;


$taskSuccess.on("click", function (e) {

    var datetime = Date.now(),
        uid = $userNumber.val(),
        task = $taskNumber.val(),
        device = $device.val(),
        eventType = e.type;
    setGroupIndicator(device);
    c = "success";
    filename = "p" + uid + "_" + device;
    var data = datetime + ";" + uid + ";" + task + ";" + groupIndicator + ";" + device + ";" + eventType + ";" + c + "\n";
    stopLog(data, device, uid);
});

$taskFail.on("click", function (e) {
    var datetime = Date.now(),
        uid = $userNumber.val(),
        task = $taskNumber.val(),
        device = $device.val(),
        eventType = e.type;
    setGroupIndicator(device);
    c = "fail";
    filename = "p" + uid + "_" + device;
    var data = datetime + ";" + uid + ";" + task + ";" + groupIndicator + ";" + device + ";" + eventType + ";" + c + "\n";
    stopLog(data, device, uid);
});

function stopLog(data, device, uid) {
    //http://132.199.139.24/~mop28809/evaluation/receiver.php
    $.ajax({
        type: 'POST',
        url: 'http://localhost:63342/TailorTunesGithub/evaluation/receiver.php',//url of receiver file on server
        data: {data: data, directory: device, userId: uid, filename: filename}, //your data
        success: function (datas) {
            alert("Success")
        }, //callback when ajax request finishes
        dataType: "text" //text/json...
    });
}

function setGroupIndicator(device) {
    if (device == "Desktop")
        groupIndicator = 1;
    else if (device == "Mobile")
        groupIndicator = 2;
    else if (device == "Tabletop")
        groupIndicator = 3;

}