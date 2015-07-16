/**
 * Created by Patrick on 16.07.2015.
 */
var isTaskRunning = false,
    $evButton = $("#ev-button"),
    $taskNumber = $("#task-number"),
    $userNumber = $("#user-number"),
    $taskSuccess = $("#task-success"),
    $taskFail = $("#task-fail"),
    $device = $("#device"),
    FILENAME = "log.csv",
    isLogEnabled = false,
    HEADER = "datetime;group;device;eventtype;target;userid;task;eventind;tdiff;tcomplete\n",
    $startLogging = $("#start-logging"),
    $logEnabled = $("#log-enabled");

setLogEnabledView();

function setLogEnabledView() {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:63342/TailorTunesGithub/evaluation/receiver.php',//url of receiver file on server
        data: {data: null, userId: null, filename: null, header: null, isRunning: null, userData: null}, //your data
        success: function (datas) {
            isLogEnabled = datas.toString();
            $logEnabled.html("Log enabled: " + isLogEnabled);
        }, //callback when ajax request finishes
        dataType: "text" //text/json...
    });
}

$startLogging.on("click", function (e) {
    var datetime = Date.now(),
        uid = $userNumber.val(),
        task = $taskNumber.val(),
        device = $device.val(),
        eventType = e.type,
        groupIndicator = getGroup(device),
        isRunning = true,
        target = e.target.tagName,
        c = "start";
    createLog(datetime, uid, task, groupIndicator, device, eventType, c, isRunning, target);
});

$taskSuccess.on("click", function (e) {
    var datetime = Date.now(),
        uid = $userNumber.val(),
        task = $taskNumber.val(),
        device = $device.val(),
        eventType = e.type,
        target = e.target,
        groupIndicator = getGroup(device),
        isRunning = false,
        c = "success";
    createLog(datetime, uid, task, groupIndicator, device, eventType, c, isRunning, target);
});

$taskFail.on("click", function (e) {
    var datetime = Date.now(),
        uid = $userNumber.val(),
        task = $taskNumber.val(),
        device = $device.val(),
        eventType = e.type,
        target = e.target.tagName,
        groupIndicator = getGroup(device),
        isRunning = false,
        c = "fail";
    createLog(datetime, uid, task, groupIndicator, device, eventType, c, isRunning, target);
});

function createLog(datetime, uid, task, groupIndicator, device, eventType, c, isRunning, target) {
    var userData = isRunning + ";" + uid + ";" + task;
    var data = datetime + ";" + groupIndicator + ";" + device + ";" + eventType + ";" + target + ";" + uid + ";" + task + ";" + c;
//http://132.199.139.24/~mop28809/evaluation/receiver.php
    $.ajax({
        type: 'POST',
        url: 'http://localhost:63342/TailorTunesGithub/evaluation/receiver.php',//url of receiver file on server
        data: {data: data, userId: uid, filename: FILENAME, header: HEADER, isRunning: isRunning, userData: userData}, //your data
        success: function (datas) {

        }, //callback when ajax request finishes
        dataType: "text" //text/json...
    });
}

function getGroup(device) {
    if (device == "Desktop")
        return 1;
    else if (device == "Mobile")
        return 2;
    else if (device == "Tabletop")
        return 3;

}



