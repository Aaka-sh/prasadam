<?php
require_once("SimpleRest.php");
require_once("Prasadam.php");
require_once("errors.php");
require_once("constants.php");

class PrasadamRestHandler extends SimpleRest {

	function getPrasamCount($data){
		$prasad = new Prasadam();
		$rawData = $prasad->getPrasamCount($data);

		if(empty($rawData)) {
			$statusCode = 404;
			$rawData = array('error' => 'No Data found!');		
		} else {
			$statusCode = 200;
		}

		$requestContentType = 'application/json';//$_POST['HTTP_ACCEPT'];
		$this ->setHttpHeaders($requestContentType, $statusCode);
		
		$result["output"] = $rawData;
				
		if(strpos($requestContentType,'application/json') !== false){
			$response = $this->encodeJson($result);
			echo $response;
		}		
	}

	function getAllPrasadam() {	

		$prasad = new Prasadam();
		$rawData = $prasad->getAllPrasadam();

		if(empty($rawData)) {
			$statusCode = 404;
			$rawData = array('error' => 'No Data found!');		
		} else {
			$statusCode = 200;
		}

		$requestContentType = 'application/json';//$_POST['HTTP_ACCEPT'];
		$this ->setHttpHeaders($requestContentType, $statusCode);
		
		$result["output"] = $rawData;
				
		if(strpos($requestContentType,'application/json') !== false){
			$response = $this->encodeJson($result);
			echo $response;
		}
	}

	function addPrasadam($data){
		$prasad = new Prasadam();
		$sucessValue = $prasad->addPrasadam($data);

		if(empty($sucessValue)) {
			$statusCode = 404;
			$sucessValue = array('error' => 'Data Not Added !');		
		} else {
			$statusCode = 200;
		}

		$requestContentType = 'application/json';//$_POST['HTTP_ACCEPT'];
		$this ->setHttpHeaders($requestContentType, $statusCode);
		
		$result["output"] = $sucessValue;
				
		if(strpos($requestContentType,'application/json') !== false){
			$response = $this->encodeJson($result);
			echo $response;
		}
	}
	
	public function addUser($data){
		$result = new stdClass();

		if(!$data || !$data->userName){
			$statusCode = 400;
			$result->error = INCOMPLETEDATA;
		}
		else{
			$prasad = new Prasadam();
			$responseValue = $prasad->addUser($data);
			
			if($responseValue === -1){
				// User already exists.
				$statusCode = 400;
				$result->error=USER_EXISTS;
			}
			else{
				if(empty($responseValue)) {
					$statusCode = 404;
					$result->error = SOMEERROR;		
				}
				else {
					$statusCode = 200;
					$result->message = ADDEDUSER;
				}
			}
		}

		$requestContentType = 'application/json';//$_POST['HTTP_ACCEPT'];
		$this ->setHttpHeaders($requestContentType, $statusCode);
	
		if(strpos($requestContentType,'application/json') !== false){
			$response = $this->encodeJson($result);
			echo $response;
		}
	}

	public function encodeJson($responseData) {
		$jsonResponse = json_encode($responseData);
		return $jsonResponse;		
	}

	public function verifyAdmin($data){
		$prasad = new Prasadam();
		$isValid = $prasad->verifyAdmin($data);
		$successValue  = ADMINVALID;

		if($isValid){
			$statusCode = 200;

			$_SESSION[ADMINSESSNAME] = true;
		}
		else{
			$successValue  = ADMININVALID;
			$statusCode = 400;

			$_SESSION[ADMINSESSNAME] = false;
		}

		$requestContentType = 'application/json';//$_POST['HTTP_ACCEPT'];
		$this->setHttpHeaders($requestContentType, $statusCode);
		
		$result = new stdClass();
		$result->output = $successValue;

		$response = $this->encodeJson($result);
		echo $response;
	}

	public function verifyUser($data){
		$prasad = new Prasadam();
		$isValid = $prasad->verifyUser($data);
		$successValue  = USERVALID;

		$result = new stdClass();
		if($isValid){
			$statusCode = 200;
			$_SESSION[USERSESSNAME] = true;
			$result->output = $successValue;
		}
		else{
			$statusCode = 400;
			$_SESSION[USERSESSNAME] = false;
			$result->error = USERINVALID;
		}

		$requestContentType = 'application/json';//$_POST['HTTP_ACCEPT'];
		$this->setHttpHeaders($requestContentType, $statusCode);

		$response = $this->encodeJson($result);
		echo $response;
	}

	public function isAdminLoggedIn(){
		$resObject = new stdClass();

		if($_SESSION[ADMINSESSNAME])
			$resObject->isLoggedIn = true;
		else $resObject->isLoggedIn = false;

		$resObject = json_encode($resObject);

		echo $resObject;
	}

	public function isUserLoggedIn(){
		$resObject = new stdClass();

		if($_SESSION[USERSESSNAME])
			$resObject->isLoggedIn = true;
		else $resObject->isLoggedIn = false;

		$resObject = json_encode($resObject);

		echo $resObject;
	}
}
?>