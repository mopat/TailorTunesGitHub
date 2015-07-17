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
    HEADER = "datetime;group;device;eventtype;target_id;target_class;target_tag_name;userid;task;eventind;tdiff;tcomplete\n",
    $startLogging = $("#start-logging"),
    $logEnabled = $("#log-enabled"),
    $error = $("#error"),
    $abort = $("#abort");

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
        targetTagName = e.target.tagName,
        targetId = $(e.target).attr("id"),
        targetClass = $(e.target).attr("class"),
        c = "start";
    if (device != "None")
        createLog(datetime, uid, task, groupIndicator, device, eventType, c, isRunning, targetId, targetClass, targetTagName);
    else
        alert("choose device");
});

$taskSuccess.on("click", function (e) {
    var datetime = Date.now(),
        uid = $userNumber.val(),
        task = $taskNumber.val(),
        device = $device.val(),
        eventType = e.type,
        targetTagName = e.target.tagName,
        targetId = $(e.target).attr("id"),
        targetClass = $(e.target).attr("class"),
        groupIndicator = getGroup(device),
        isRunning = false,
        c = "success";
    $('#task-number option:selected').next().attr('selected', 'selected');
    createLog(datetime, uid, task, groupIndicator, device, eventType, c, isRunning, targetId, targetClass, targetTagName);
});

$taskFail.on("click", function (e) {
    var datetime = Date.now(),
        uid = $userNumber.val(),
        task = $taskNumber.val(),
        device = $device.val(),
        eventType = e.type,
        targetTagName = e.target.tagName,
        targetId = $(e.target).attr("id"),
        targetClass = $(e.target).attr("class"),
        groupIndicator = getGroup(device),
        isRunning = false,
        c = "fail";
    $('#task-number option:selected').next().attr('selected', 'selected');
    createLog(datetime, uid, task, groupIndicator, device, eventType, c, isRunning, targetId, targetClass, targetTagName);
});

$error.on("click", function (e) {
    var datetime = Date.now(),
        uid = $userNumber.val(),
        task = $taskNumber.val(),
        device = $device.val(),
        eventType = e.type,
        targetTagName = e.target.tagName,
        targetId = $(e.target).attr("id"),
        targetClass = $(e.target).attr("class"),
        groupIndicator = getGroup(device),
        isRunning = true,
        c = "error";
    createLog(datetime, uid, task, groupIndicator, device, eventType, c, isRunning, targetId, targetClass, targetTagName);
});

$abort.on("click", function (e) {
    var datetime = Date.now(),
        uid = $userNumber.val(),
        task = $taskNumber.val(),
        device = $device.val(),
        eventType = e.type,
        targetTagName = e.target.tagName,
        targetId = $(e.target).attr("id"),
        targetClass = $(e.target).attr("class"),
        groupIndicator = getGroup(device),
        isRunning = false,
        c = "abort";
    createLog(datetime, uid, task, groupIndicator, device, eventType, c, isRunning, targetId, targetClass, targetTagName);
});

function createLog(datetime, uid, task, groupIndicator, device, eventType, c, isRunning, targetId, targetClass, targetTagName) {
    var userData = isRunning + ";" + uid + ";" + task;
    var data = datetime + ";" + groupIndicator + ";" + device + ";" + eventType + ";" + targetId + ";" + targetClass + ";" + targetTagName + ";" + uid + ";" + task + ";" + c;
    if (c == "start")
        data += ";0;0";
//http://132.199.139.24/~mop28809/evaluation/receiver.php
    $.ajax({
        type: 'POST',
        url: 'http://localhost:63342/TailorTunesGithub/evaluation/receiver.php',//url of receiver file on server
        data: {data: data, userId: uid, filename: FILENAME, header: HEADER, isRunning: isRunning, userData: userData}, //your data
        success: function (datas) {
            $logEnabled.html("log enabled: " + datas);

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



