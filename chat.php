<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // The request is using POST
    echo 'Hello ' . htmlspecialchars($_POST["handle"]) . '!';
}else{
    // The request is using GET
}

?>
