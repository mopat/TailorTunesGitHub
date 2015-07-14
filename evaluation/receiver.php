<?php
/**
 * Created by PhpStorm.
 * User: Patrick
 * Date: 07.07.2015
 * Time: 09:52
 */
$data = $_POST['data'];
$filename = $_POST['filename'] . ".csv";
$directory = $_POST['directory'];
$header = $_POST['header'];
$isRunning = $_POST['isRunning'];

$isRunningFile = dirname(__FILE__) . "/log/isRunning.txt";


$line = fgets(fopen($isRunningFile, 'r'));

if ($line == "true") {
    // Wir öffnen $filename im "Anhänge" - Modus.
// Der Dateizeiger befindet sich am Ende der Datei, und
// dort wird $somecontent später mit fwrite() geschrieben.
    if (file_exists(dirname(__FILE__) . "/log/$filename")) {
        $myfile = fopen(dirname(__FILE__) . "/log/$filename", "a+");
        fwrite($myfile, $data);
    } else {
        $myfile = fopen(dirname(__FILE__) . "/log/$filename", "w");
        fwrite($myfile, $header);
        fwrite($myfile, $data);
    }

    fclose($myfile);
}
if ($isRunning != "") {
    $handle = fopen($isRunningFile, "w");
    fwrite($handle, $isRunning);
}

?>