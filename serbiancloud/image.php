<?php
/**
 * image.php
 *
 * Wordcloud generating endpoint
 */
function json($json) {
    header("Content-Type: application/json");
    die(json_encode($json));
}
function error($reason) {
    json(["error" => $reason]);
}
function path($name) {
    return "i/$name.png";
}
function display($name) {
    if (isset($_POST["json"])) {
        json(["file" => $name]);
    }
    header("Content-Type: image/png");
    die(file_get_contents(path($name)));
}
if (empty($_POST["text"])) {
    error("notext");
}
$text = trim($_POST["text"]);
$name = md5($text) . strlen($text);
if (file_exists(path($name))) {
    display($name);
}
$textfile = __DIR__ . "/py/text/$name.txt";
$file = @fopen($textfile, "w") or error("file");
@fwrite($file, $text) or error("file");
@fclose($file) or error("file");
$result = shell_exec("python3 py/generate.py $name");
unlink($textfile);
if (trim($result) === "success") {
    display($name);
} else {
    error($result);
}
?>
