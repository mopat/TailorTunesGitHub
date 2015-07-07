<?php
/**
 * Created by PhpStorm.
 * User: Patrick
 * Date: 07.07.2015
 * Time: 09:52
 */

$data = $_POST['data'];
$filename = $_POST['filename'] . ".txt";
$directory = $_POST['directory'];
$header = $_POST['header'];


// Wir öffnen $filename im "Anhänge" - Modus.
// Der Dateizeiger befindet sich am Ende der Datei, und
// dort wird $somecontent später mit fwrite() geschrieben.
if (file_exists(dirname(__FILE__) . "/$directory/$filename") == false) {
    $myfile = fopen(dirname(__FILE__) . "/$directory/$filename", "w");
    fwrite($myfile, $header);
}
$myfile = fopen(dirname(__FILE__) . "/$directory/$filename", "a+");
fwrite($myfile, $data);

fclose($myfile);