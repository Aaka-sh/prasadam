<?php
    function generateAdmin($email = "", $rawPassword = ""){
        $hashedPass = password_hash($rawPassword, PASSWORD_BCRYPT);

        echo "Email : ".$email;
        echo "<br>Password : ".$hashedPass;
    }

    echo generateAdmin("admin@gmail.com", "12345678");
?>