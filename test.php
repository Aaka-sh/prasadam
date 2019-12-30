<?php
    function generateAdmin($email = "", $rawPassword = ""){
        $hashedPass = password_hash($rawPassword, PASSWORD_BCRYPT);

        echo "Email : ".$email;
        echo "<br>Password : ".$hashedPass;
    }

    var_dump(json_decode("{\"email\": \"abc\", \"password\": \"abcdefgh\"}"));
?>