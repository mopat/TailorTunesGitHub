<?php
/**
 * Created by PhpStorm.
 * User: Patrick
 * Date: 07.07.2015
 * Time: 09:52
 */
$data = $_POST['data'];
$filename = $_POST['filename'];
$header = $_POST['header'];
$isRunning = $_POST['isRunning'];
$userData = $_POST['userData'];

$isRunningFile = dirname(__FILE__) . "/log/isRunning.txt";

$line = fgets(fopen($isRunningFile, 'r'));
$arr = explode(";", $line);
$logEnabled = $arr[0];
$userId = $arr[1];
$taskNumber = $arr[2];

if ($isRunning == null) {
    $dataComplete = $data . ";" . $userId . ";" . $taskNumber . "\n";
} else {
    $dataComplete = $data . "\n";
}

if (($logEnabled == true && $data != "")) {
    // Wir öffnen $filename im "Anhänge" - Modus.
// Der Dateizeiger befindet sich am Ende der Datei, und
// dort wird $somecontent später mit fwrite() geschrieben.
    if (file_exists(dirname(__FILE__) . "/log/$filename")) {
        $myfile = fopen(dirname(__FILE__) . "/log/$filename", "a+");
        fwrite($myfile, $dataComplete);
    } else {
        $myfile = fopen(dirname(__FILE__) . "/log/$filename", "w");
        fwrite($myfile, $header);
        fwrite($myfile, $dataComplete);
    }

    fclose($myfile);
}
if ($isRunning != null && $isRunning != "") {
    $handle = fopen($isRunningFile, "w");
    fwrite($handle, $userData);
}


$line = fgets(fopen($isRunningFile, 'r'));
$arr = explode(";", $line);
$logEnabled = $arr[0];
$userId = $arr[1];
$taskNumber = $arr[2];
echo $logEnabled;
?>