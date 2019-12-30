<?php
require_once("SimpleRest.php");
require_once("Prasadam.php");
		
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
		$prasad = new Prasadam();
		$sucessValue = $prasad->addUser($data);

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

	public function encodeJson($responseData) {
		$jsonResponse = json_encode($responseData);
		return $jsonResponse;		
	}

	public function verifyAdmin($data){
		$prasad = new Prasadam();
		$isValid = $prasad->verifyAdmin($data);
		$successValue  = "Admin Valid!";

		if($isValid){
			$statusCode = 200;

			$_SESSION['isloggedin'] = true;
		}
		else{
			$successValue  = "Admin invalid!";
			$statusCode = 400;

			$_SESSION['isloggedin'] = false;
		}

		$requestContentType = 'application/json';//$_POST['HTTP_ACCEPT'];
		$this->setHttpHeaders($requestContentType, $statusCode);
		
		$result = new stdClass();
		$result->output = $successValue;

		$response = $this->encodeJson($result);
		echo $response;
	}

	public function isLoggedIn(){
		$resObject = new stdClass();

		if($_SESSION['isloggedin'])
			$resObject->isLoggedIn = true;
		else $resObject->isLoggedIn = false;

		$resObject = json_encode($resObject);

		echo $resObject;
	}
}
?>