<?php
if (empty($_GET['description'])) {
    echo 'Description not set.';
} else {
    require_once 'db.php';
    session_start();
    $description = $db->real_escape_string($_GET['description']);
    $result = $db->query("UPDATE `users` SET `description`=\"$description\" WHERE `id`={$_SESSION['id']}");
    if ($result) {
        $_SESSION['description'] = $description;
        header('Location: index.php');
    } else {
        echo 'Failed to change description.';
    }
}
