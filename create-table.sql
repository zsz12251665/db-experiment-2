CREATE TABLE `Administrator` (
	`AID` VARCHAR(10) NOT NULL,
	`Password` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`AID`)
);

CREATE TABLE `Student` (
	`SID` VARCHAR(10) NOT NULL,
	`Name` VARCHAR(255) NOT NULL,
	`Gender` BOOLEAN NOT NULL,
	`EntranceAge` INT NOT NULL,
	`EntranceYear` INT NOT NULL,
	`Class` VARCHAR(255) NOT NULL,
	`Password` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`SID`),
	CONSTRAINT `check_student_entrance_age` CHECK (10 <= `EntranceAge` AND `EntranceAge` <= 50)
);

CREATE TABLE `Teacher` (
	`TID` VARCHAR(5) NOT NULL,
	`Name` VARCHAR(255) NOT NULL,
	`Password` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`TID`)
);

CREATE TABLE `Course` (
	`CID` VARCHAR(7) NOT NULL,
	`Name` VARCHAR(255) NOT NULL,
	`TID` VARCHAR(5) NOT NULL,
	`Credit` DECIMAL(10, 1) NOT NULL,
	`Grade` INT NOT NULL,
	`CancelledYear` INT DEFAULT NULL,
	PRIMARY KEY (`CID`),
	CONSTRAINT `check_course_credit` CHECK (`Credit` > 0),
	FOREIGN KEY (`TID`) REFERENCES `Teacher`(`TID`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

CREATE TABLE `Teach` (
	`TID` VARCHAR(5) NOT NULL,
	`CourseName` VARCHAR(255) NOT NULL,
	FOREIGN KEY (`TID`) REFERENCES `Teacher`(`TID`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

CREATE TABLE `Choose` (
	`SID` VARCHAR(5) NOT NULL,
	`CID` VARCHAR(255) NOT NULL,
	`ChosenYear` INT NOT NULL,
	`Score` DECIMAL(10, 1) DEFAULT NULL,
	CONSTRAINT `check_choose_score` CHECK (0 <= `Score` AND `Score` <= 100),
	FOREIGN KEY (`SID`) REFERENCES `Student`(`SID`)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	FOREIGN KEY (`CID`) REFERENCES `Course`(`CID`)
		ON UPDATE CASCADE
		ON DELETE CASCADE
);
