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

$query = "SELECT * FROM availability ORDER BY name";
$result = mysqli_query($conn, $query);

$data['result'] = $result -> fetch_all(MYSQLI_NUM);

echo json_encode($data);
exit;