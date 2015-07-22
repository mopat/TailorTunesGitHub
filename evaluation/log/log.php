<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>

<?php
$file = 'log.csv';

if (file_exists($file)) {
    echo "<html><body><table>\n\n";
    $f = fopen("log.csv", "r");
    while (($line = fgetcsv($f)) !== false) {
        echo "<tr>";
        foreach ($line as $cell) {
            echo "<td>" . htmlspecialchars($cell) . "</td>";
        }
        echo "</tr>\n";
    }
    fclose($f);
    echo "\n</table></body></html>";

    exit;
} else {
    echo "FILE NOT EXISTS";
}
?>

</body>
</html>