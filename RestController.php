<?php
session_start();
error_reporting(0);
require_once("constants.php");
require_once("errors.php");
require_once("PrasadamRestHandler.php");	
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
		$name = $_POST['name'];

		$data = new stdClass();
		$data->userName = $userName;
		$data->name = $name;
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
	case "loginuser":
		$userName = $_POST['userName'];
		$data = new stdClass();
		$data->userName = $userName;

		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->verifyUser($data);
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
		$_SESSION[ADMINSESSNAME] = false;
		$resOb = new stdClass();
		if(session_destroy()){
			$resOb->message = LOGOUTMESSAGE;
		}
		else $resOb->message = SOMEERROR;
		echo json_encode($resOb);
		break;
	case "logoutuser":
		$_SESSION[USERSESSNAME] = false;
		$_SESSION[NAMESESSION] = null;
		$_SESSION[USERIDSESSNAME] = null;
		
		$resOb = new stdClass();
		if(session_destroy()){
			$resOb->message = LOGOUTMESSAGE;
		}
		else $resOb->message = SOMEERROR;
		echo json_encode($resOb);
		break;
	case "cancelprasadam":
		if(!$_SESSION[USERSESSNAME] || !$_SESSION[USERIDSESSNAME]){
			echo error(USERNOTLOGGEDIN);
			break;
		}
		
		$cancellationDetails = json_decode($_POST[CANCELLATIONDATA]);
		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->cancelPrasadam($cancellationDetails);

		break;
	case "getnprasadam":
		if(!$_SESSION[ADMINSESSNAME]){
			echo error(USERNOTLOGGEDIN);
			break;
		}

		$cancellationTime = null;
		$cancellationDate = null;

		if($_POST['cancellationTime'])
			$cancellationTime = $_POST['cancellationTime'];

		if($_POST['cancellationDate'])
			$cancellationDate = $_POST['cancellationDate'];

		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->getnPrasadam($cancellationTime, $cancellationDate);
		break;
	case "getusercancellations":
		if(!$_SESSION[USERSESSNAME] || !$_SESSION[USERIDSESSNAME]){
			echo error(USERNOTLOGGEDIN);
			break;
		}

		$cancellationTime = $_GET['cancellationTime'];
		$month = $_GET['month'];

		$userid = $_SESSION[USERIDSESSNAME];

		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->getUserCancellations($userid, $cancellationTime, $month);
		
		break;
	case "getdevotees":
		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->getDevotees();
		break;
	case "deleteuser":
		$userid = $_GET['userid'];

		if(!$_SESSION[ADMINSESSNAME]){
			echo error(USERNOTLOGGEDIN);
			header("HTTP/1.1 403");
			break;
		}

		if(!$userid){
			echo error(NOIDSENT);
			header("HTTP/1.1 400");
			break;
		}

		$prasadmRestHandler = new PrasadamRestHandler();
		$prasadmRestHandler->deleteUser($userid);

		break;
	case "" :
		//404 - not found;
		break;
}
?>
