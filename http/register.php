<?php
if (empty($_POST['username']) || empty($_POST['password'])) {
    die('Username or password not provided.');
} else {
    require_once 'db.php';
    $username = $_POST['username'];
    $hashed = hash('sha256', $_POST['password']);
    $query = "INSERT INTO `users` (`username`, `password`) VALUES(\"$username\", \"$hashed\")";
    if ($db->query($query)) {
        header('Location: index.php');
        die();
    } else {
        echo "Database error: {$db->error}";
    }
}
