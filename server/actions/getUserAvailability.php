<?php

require_once('../connect.php');

$data = [
    'success' => true,
    'errors' => []
];

if ($conn->connect_errno) {
    $data['errors'][] = "Failed to connect to MySQL: " . $conn->connect_error;
    echo json_encode($data);
    exit();
}

$name = isset($_POST['name']) ? $_POST['name'] : false;

if ($name) {
    $query = "SELECT date FROM availability WHERE name = '$name'";
    $result = mysqli_query($conn, $query);

    $data['result'] = $result -> fetch_all(MYSQLI_NUM);
} else {
    $data['errors'][] = "Missing name";
}

echo json_encode($data);
exit;