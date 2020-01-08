<?php
require_once("dbcontroller.php");
require_once("errors.php");
require_once("constants.php");
/* 
A domain Class to demonstrate RESTful web services
*/
Class Prasadam {
	private $prasad = array();
	/*
		you should hookup the DAO here
	*/
	public function getAllPrasadam(){
		$query = "SELECT * FROM tbl_prasadam";
		$dbcontroller = new DBController();
		$this->prasad = $dbcontroller->executeSelectQuery($query);
		return $this->prasad;
	}	

	public function getPrasamCount($data){
		$dateValue = $data->prasaddate;
		$prasadmValue = $data->chooseprasad;
		$query = "SELECT COUNT(*) FROM `tbl_prasadam` WHERE `prasaddate` ='$dateValue' AND (`chooseprasad` LIKE '%$prasadmValue%')";
		$dbcontroller = new DBController();
		$this->prasad = $dbcontroller->executeSelectQuery($query);
		return $this->prasad;
	}

	public function addPrasadam($data){
		$userName = $data->username;
		$chooseprasad = $data->chooseprasad[1] . $data->chooseprasad[0] . $data->chooseprasad[2];			
		$prasaddate = $data->prasaddate;
		$query = "INSERT INTO tbl_prasadam(username,chooseprasad,prasaddate) VALUES ('$userName','$chooseprasad','$prasaddate')";
		$dbcontroller = new DBController();
		$sucessValue = $dbcontroller->executeInsertQuery($query);
		return $sucessValue;
	}

	public function addUser($data){
		$userName = $data->userName;
		$dbcontroller = new DBController();

		// Validation.
		$validationQuery = "SELECT * FROM users WHERE username = '$userName'";
		$validationResults = $dbcontroller->executeSelectQuery($validationQuery);

		if(sizeof($validationResults) > 0){
			// User already exists with the given username.
			return -1;
		}

		$query = "INSERT INTO users(username) VALUES ('$userName')";
		$sucessValue = $dbcontroller->executeInsertQuery($query);
		return $sucessValue;
	}

	public function verifyAdmin($data){
		if(!$data || !$data->email || !$data->password){
			// If the user hasn't sent any valid info.
			return null;
		}

		$email = $data->email;
		$password = $data->password;

		$extractionQuery = "SELECT * FROM admins WHERE email = '".$email."'";
		$dbcontroller = new DBController();
		$admins = $dbcontroller->executeSelectQuery($extractionQuery);

		if(!$admins || sizeof($admins) > 1)
			return null;

		$hashedPassword = $admins[0]["password"];

		if(password_verify($password, $hashedPassword))
			return true;
		else return false;
	}

	public function verifyUser($data){
		if(!$data || !$data->userName){
			// If the user hasn't sent any valid info.
			return null;
		}

		$userName = $data->userName;

		$extractionQuery = "SELECT * FROM users WHERE username = '".$userName."'";
		$dbcontroller = new DBController();
		$users = $dbcontroller->executeSelectQuery($extractionQuery);

		if(!$users || sizeof($users) > 1)
			return null;
		else return true;	// User valid.
	}
}
?>