CREATE TABLE `Administrator` (
	`ID` VARCHAR(255) NOT NULL,
	`Password` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`ID`)
);

CREATE TABLE `Student` (
	`ID` VARCHAR(10) NOT NULL,
	`Name` VARCHAR(255) NOT NULL,
	`Gender` BOOLEAN NOT NULL,
	`EntranceAge` INT NOT NULL,
	`EntranceYear` INT NOT NULL,
	`Class` VARCHAR(255) NOT NULL,
	`Password` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`ID`),
	CONSTRAINT `check_student_entrance_age` CHECK (10 <= `EntranceAge` AND `EntranceAge` <= 50)
);

CREATE TABLE `Teacher` (
	`ID` VARCHAR(5) NOT NULL,
	`Name` VARCHAR(255) NOT NULL,
	`Password` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`ID`)
);

CREATE TABLE `Course` (
	`ID` VARCHAR(7) NOT NULL,
	`Name` VARCHAR(255) NOT NULL,
	`TID` VARCHAR(5) NOT NULL,
	`Credit` DECIMAL(10, 1) NOT NULL,
	`Grade` INT NOT NULL,
	`CancelledYear` INT DEFAULT NULL,
	PRIMARY KEY (`ID`),
	CONSTRAINT `check_course_credit` CHECK (`Credit` > 0),
	FOREIGN KEY (`TID`) REFERENCES `Teacher`(`ID`) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `Choose` (
	`SID` VARCHAR(10) NOT NULL,
	`CID` VARCHAR(7) NOT NULL,
	`ChosenYear` INT NOT NULL,
	`Score` DECIMAL(10, 1) DEFAULT NULL,
	CONSTRAINT `check_choose_score` CHECK (0 <= `Score` AND `Score` <= 100),
	-- CONSTRAINT `check_choose_chosen_year` CHECK (`CID` IN (SELECT `ID` FROM `Course` WHERE `ChosenYear` < `CancelYear`)),
	FOREIGN KEY (`SID`) REFERENCES `Student`(`ID`) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (`CID`) REFERENCES `Course`(`ID`) ON UPDATE CASCADE ON DELETE CASCADE
);
