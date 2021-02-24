<?php
if (empty($_POST['username']) || empty($_POST['password'])) {
    die('Username or password not provided.');
} else {
    require_once 'db.php';
    $username = $db->real_escape_string($_POST['username']);
    $hashed = hash('sha256', $_POST['password']);
    $query = "SELECT * FROM users WHERE `username`=\"$username\" AND `password`=\"$hashed\" LIMIT 1";
    $result = $db->query($query);
    if (session_start() && $result && $row = $result->fetch_assoc()) {
        $_SESSION['username'] = $row['username'];
        $_SESSION['description'] = $row['description'];
        $_SESSION['id'] = $row['id'];
        header('Location: index.php');
        $result->free();
        $db->close();
        die();
    } else {
        $db->close();
        die('Invalid username/password combination.');
    }
}
