<?php
    function error($errMessage = "Some error occurred!"){
        $error = new stdClass();
        $error->error = $errMessage;

        return json_encode($error);
    }
?>