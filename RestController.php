<?php
session_start();
require_once("PrasadamRestHandler.php");
error_reporting(0);		
$view = "";

if(isset($_GET["view"]))
	$view = $_GET["view"];

/*
controls the RESTful services
URL mapping
*/
switch($view){

	case "all":
		// to handle REST Url /prasadam/list/
		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->getAllPrasadam();
		break;

	case "add":
		// to handle REST Url prasadam/add/
		$json = file_get_contents('php://input');

		// Converts it into a PHP object
		$data = json_decode($json);
		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->addPrasadam($data);
		break;

	case "count":
		// to handle REST Url prasadam/count/
		$json = file_get_contents('php://input');

		// Converts it into a PHP object
		$data = json_decode($json);
		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->getPrasamCount($data);
		break;

  	case "adduser":
		// to handle REST Url prasadam/addUser/
		$userName = $_POST['userName'];
		$data = new stdClass();
		$data->userName = $userName;
		// Add any other fields here...

		// Converts it into a PHP object
		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->addUser($data);
		break;

	case "verifyadmin":
		$email = $_POST['email'];
		$password = $_POST['password'];

		$data = new stdClass();
		$data->email = $email;
		$data->password = $password;

		// Converts it into a PHP object
		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->verifyAdmin($data);
		break;
	case "isadminloggedin":
		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->isAdminLoggedIn();
		break;
	case "isuserloggedin":
		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->isUserLoggedIn();
	break;
	case "logoutadmin":
		$_SESSION['isloggedin'] = false;
		$resOb = new stdClass();
		if(session_destroy()){
			$resOb->message = "Successfully logged out!";
		}
		else $resOb->message = "Some problem occurred!";
		echo json_encode($resOb);
		break;
	case "" :
		//404 - not found;
		break;
}
?>
