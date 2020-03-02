<?php
class DBController {
	private $conn = "";
	private $host = "localhost";
	private $user = "root";
	private $password = "";
	private $database = "krishna";

	function __construct() {
		$conn = $this->connectDB();
		if(!empty($conn)) {
			$this->conn = $conn;			
		}
	}

	function connectDB() {
		$conn = mysqli_connect($this->host,$this->user,$this->password,$this->database);
		return $conn;
	}

	function executeSelectQuery($query) {
		$result = mysqli_query($this->conn,$query);
		if($result){
			while($row=mysqli_fetch_assoc($result)) {
				$resultset[] = $row;
			}	
			if(!empty($resultset))
				return $resultset;
			else return null;
		}
		else return null;
	}

	function executeInsertQuery($query) {
		if (mysqli_query($this->conn, $query)) {
    		return "sucess";
    	}else{
    		return "failed";
    	}
	}

	function executeUpdateQuery($query){
		if($query && mysqli_query($this->conn, $query)) return true;
		else return false;
	}

	function executeDeleteQuery($query){
		if($query && mysqli_query($this->conn, $query)) return true;
		else return false;
	}
}
?>
