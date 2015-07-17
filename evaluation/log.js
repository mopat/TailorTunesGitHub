/**
 * Created by Patrick on 06.07.2015.
 */

var device = window.location.hash.substring(1),
    FILENAME = "log.csv";

if (device == "")
    alert("empty anchor device");
else {

}

setEventListener(device);

function setEventListener(device) {
    if (device == "Mobile" || device == "Tabletop") {
        $(window).on("click touchstart touchend keydown scroll", function (e) {
            log(e);
        });
    }
    else if (device == "Desktop") {
        $(window).on("click mousedown mouseup keydown scroll", function (e) {
            log(e);

        });
    }
    $('ul').on("scroll", function (e) {
        log(e);
    });
}

function rotatableLog(e) {
    log(e);
}

function log(e) {
    var datetime = Date.now(),
        eventType = e.type,
        targetTagName = e.target.tagName,
        targetId = $(e.target).attr("id"),
        targetClass = $(e.target).attr("class"),
        groupIndicator = getGroup(device);
    if (device != "") {
        createLog(datetime, groupIndicator, device, eventType, targetId, targetClass, targetTagName);
    }

}


function createLog(datetime, groupIndicator, device, eventType, targetId, targetClass, targetTagName) {
    var data = datetime + ";" + groupIndicator + ";" + device + ";" + eventType + ";" + targetId + ";" + targetClass + ";" + targetTagName;

//http://132.199.139.24/~mop28809/evaluation/receiver.php
    $.ajax({
        type: 'POST',
        url: 'http://localhost:63342/TailorTunesGithub/evaluation/receiver.php',//url of receiver file on server
        data: {data: data, filename: FILENAME, header: null, isRunning: null, userData: null}, //your data
        success: function (datas) {
            console.log(datas)
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