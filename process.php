

<?php
header("Access-Control-Allow-Origin: *");

exit(json_encode([
    "status_code" => 200,
    'status' => true,
    'message' => "data process"
]));

?>
