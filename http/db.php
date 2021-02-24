<?php
$db = new mysqli('localhost', 'ntp', 'mgPw379Hl2Xnl8ap', 'ntp');
if ($db->connect_errno) {
    die("Database connection failed: {$db->connect_error}.");
}

