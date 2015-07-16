/**
 * Created by Patrick on 06.07.2015.
 */
var isTaskRunning = false,
    $evButton = $("#ev-button"),
    $taskNumber = $("#task-number"),
    $userNumber = $("#user-number"),
    $taskSuccess = $("#task-success"),
    $taskFail = $("#task-fail"),
    $device = $("#device"),
    filename = null,
    groupIndicator = null,
    HEADER = "datetime;userid;task;group;device;eventtype;eventind;tdiff;tcomplete\n",

    $reset = $("#reset"),
    isLogEnabled = false,
    $logEnabled = $("#log-enabled");

$.ajax({
    type: 'POST',
    url: 'http://localhost:63342/TailorTunesGithub/evaluation/receiver.php',//url of receiver file on server
    data: "", //your data
    success: function (datas) {
        isLogEnabled = datas.toString();
        $logEnabled.html("Log enabled: " + isLogEnabled);
    }, //callback when ajax request finishes
    dataType: "text" //text/json...
});

$reset.on("click", function (e) {
    var datetime = Date.now(),
        uid = $userNumber.val(),
        task = $taskNumber.val(),
        device = $device.val(),
        eventType = e.type;
    var data = datetime + ";" + uid + ";" + task + ";" + groupIndicator + ";" + device + ";" + eventType + ";" + c + "\n";
    setGroupIndicator(device);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:63342/TailorTunesGithub/evaluation/receiver.php',//url of receiver file on server
        data: {isRunning: true}, //your data
        success: function (datas) {
            isLogEnabled = datas.toString();

            alert("Success");
            $logEnabled.html("Log enabled: " + isLogEnabled);
        }, //callback when ajax request finishes
        dataType: "text" //text/json...
    });
});

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
    isTaskRunning = false;
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
    isTaskRunning = false;
});

function stopLog(data, device, uid) {
    //http://132.199.139.24/~mop28809/evaluation/receiver.php
    $.ajax({
        type: 'POST',
        url: 'http://132.199.139.24/~mop28809/evaluation/receiver.php',//url of receiver file on server
        data: {data: data, directory: device, userId: uid, filename: filename, isRunning: false}, //your data
        success: function (datas) {
            isLogEnabled = datas.toString();
            alert("task-stopped");
            $("#task-number > option:selected")
                .attr("selected", false)
                .next()
                .attr("selected", true);
            $logEnabled.html("Log enabled: " + isLogEnabled);
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