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

	/* Prasadam Functions */
	private function date_exists($date, $cancellationTime){
		// Function to check if a cancellation with a certain date already exists.
		$query = "SELECT * FROM ".PRASADAMTABLE." WHERE recorddate = '".$date."' AND recordfor = '".$cancellationTime."'";
		$dbcontroller = new DBController();
		$res = $dbcontroller->executeSelectQuery($query);
		if(!$res || sizeof($res) <= 0 || empty($res)){
			return false;
		}
		else{
			return $res[0];
		}
	}

	private function addFreshCancellation($cancellationDate, $cancellationTime, $userid){
		if($cancellationTime && $userid && $cancellationDate){
			$dbcontroller = new DBController();
			$userids = json_encode(array($userid));
			$query = "INSERT INTO ".PRASADAMTABLE."(recorddate, recordfor, userids) VALUES('".$cancellationDate."', '".$cancellationTime."', '".$userids."')";
			if($dbcontroller->executeInsertQuery($query) === 'sucess') return true;
			else return false;
		}
		else return false;
	}

	/* General Functions */

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
		$successValue = $dbcontroller->executeInsertQuery($query);
		return $successValue;
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
		$successValue = $dbcontroller->executeInsertQuery($query);
		return $successValue;
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
		else return $users[0]["id"];	// User valid.
	}

	public function cancelPrasadam($cancellationDetails){
		$cancellationTime = $cancellationDetails->cancellationTime;
		$cancellationDates = $cancellationDetails->cancellationDates;
		$error = false;

		foreach($cancellationDates as $date){
			$existingDateRecord = $this->date_exists($date, $cancellationTime);

			if($existingDateRecord){
				// There is a date in the records for this.
				$userIds = json_decode($existingDateRecord['userids']);

				if(in_array($_SESSION[USERIDSESSNAME], $userIds)){
					// User has already cancelled for this date and is just messing around.
					continue;
				}
				else{
					$userIds[] = $_SESSION[USERIDSESSNAME];	// Add the userid to the list.

					// Now update the record.
					$newUserIds = json_encode($userIds);

					$updateQuery = "UPDATE ".PRASADAMTABLE." SET userids = '".$newUserIds."' WHERE recorddate = '".$date."' AND recordfor = '".$cancellationTime."'";
					$dbcontroller = new DBController();

					if(!$dbcontroller->executeUpdateQuery($updateQuery)){
						$error = true;
						break;
					}
				}
			}
			else{
				// Create a fresh record of the cancellation.

				if(!$this->addFreshCancellation($date, $cancellationTime, $_SESSION[USERIDSESSNAME]))
					$error = true;
			}
		}

		if($error) return false;	// Could not insert all entries.
		else return true;	// Inserted all entries.
	}

	public function get_prasadam_count($cancellationTime, $cancellationDate = null){
		// Function to get the number of cancellations on a single date.
		// For a specific time.

		if(!$cancellationTime)
			return null;

		$date = $cancellationDate;

		if(!$date)
			$date = date("Y-m-d");

		$dbhandler = new DBController();

		$userCounterQuery = "SELECT count(*) AS 'nusers' FROM users;";
		$extractionQuery = "SELECT * FROM ".PRASADAMTABLE." WHERE recordfor='".$cancellationTime."' AND recorddate='".$date."'";

		$nusers = $dbhandler->executeSelectQuery($userCounterQuery);

		if(!$nusers) return 0;	// Error in fetching or no users, no cancellations, no need to calculate further.
		$nusers = $nusers[0]['nusers'];	// Since we fetched the row as 'nusers'.

		$cancellationRecord = $dbhandler->executeSelectQuery($extractionQuery);

		$userids = $cancellationRecord[0] ? json_decode($cancellationRecord[0]['userids']) : null;
		$useridsLength = is_array($userids) ? sizeof($userids) : 0;

		$nprasadam = $nusers - $useridsLength;

		return $nprasadam;
	}

	public function getUserCancellations($userid, $cancellationTime, $month){
		$month_name = date("F", mktime(0, 0, 0, $month, 10)); 

		$firstDate = date("Y-".$month."-01", strtotime($month_name));
		$lastDate = date("Y-".$month."-t", strtotime($month_name));

		$selectionQuery = "SELECT recorddate FROM ".PRASADAMTABLE." 
								WHERE recordfor='".$cancellationTime."' 
								AND userids LIKE '%\"".$userid."\"%' 
								AND (
									recorddate BETWEEN '".$firstDate."' AND '".$lastDate."'
							)";

		$dbhandler = new DBController();
		$cancellationDatesRecord = $dbhandler->executeSelectQuery($selectionQuery);

		$cancellationDates = array();

		if($cancellationDatesRecord)
			foreach($cancellationDatesRecord as $date)
				array_push($cancellationDates, $date['recorddate']);
		
		return $cancellationDates;
	}
}
?>