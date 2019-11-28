<?php
require_once('../connect.php');

$data = [
    'success' => true,
    'errors' => []
];

if ($conn -> connect_errno) {
    $data['errors'][] = "Failed to connect to MySQL: " . $conn -> connect_error;
    echo json_encode($data);
    exit();
}

$name =  isset($_POST['name']) ? $_POST['name'] : false;
$date =  isset($_POST['date']) ? $_POST['date'] : false;

if ($name && $date) {
    $query = "SELECT * FROM availability WHERE name = '$name' AND date = '$date'";
    $result = mysqli_query($conn, $query);
    $numRows = mysqli_affected_rows($conn);

    if ($numRows == 0) {
        $query = "INSERT INTO availability (name, date, creation_date)
              VALUES('$name', '$date', CURRENT_TIMESTAMP)";

        $result = mysqli_query($conn,$query);

        $data['updated'] = $result;
        $data['date'] = $date;
    } else {
        $data['errors'][] = 'You have already selected this date';
    }


} else {
    $data['errors'][] = "Missing name or date";
}

echo json_encode($data);
exit;
