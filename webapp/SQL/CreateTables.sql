SET FOREIGN_KEY_CHECKS = 0;
-- Uncomment this DROP command to make changes
-- DROP SCHEMA UnivEvents;
 DROP TABLE university, user, admin, superadmin, rso, event, comment, joins, goes_to;

-- CREATE SCHEMA `UnivEvents` DEFAULT CHARACTER SET latin1 ;

CREATE TABLE university (
	uni_id			INT(4) NOT NULL AUTO_INCREMENT,
	uni_name		VARCHAR(45),
    description 	VARCHAR(140),
    num_students	INT,
    superadmin_id	INT(4),
	PRIMARY KEY (uni_id),
    FOREIGN KEY (superadmin_id) REFERENCES superadmin(superadmin_id)
		ON DELETE NO ACTION
	);

CREATE TABLE user (
	student_no	INT(4) NOT NULL AUTO_INCREMENT,
	email		VARCHAR(45),
	password 	VARCHAR(45),
	acct_type 	VARCHAR(20),
		CHECK (acct_type IN ('student', 'admin', 'superadmin')),
	uni_id		INT(4) NOT NULL,
	PRIMARY KEY (student_no),
    FOREIGN KEY (uni_id) REFERENCES university(uni_id)
	);
	
CREATE TABLE admin (
	admin_id 	INT(4) NOT NULL REFERENCES user(student_no),
	PRIMARY KEY (admin_id)
	);
	
CREATE TABLE superadmin (
	superadmin_id 	INT(4) NOT NULL REFERENCES user(student_no),
	PRIMARY KEY (superadmin_id)
	);

CREATE TABLE rso (
	rso_id		INT(4) NOT NULL AUTO_INCREMENT,
	rso_name	VARCHAR(45),
    admin_id	INT(4) NOT NULL,
	PRIMARY KEY (rso_id),
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
	);
	
CREATE TABLE event (
	event_id 		INT(4) NOT NULL AUTO_INCREMENT,
	event_name		VARCHAR(45),
	description		VARCHAR(140),
	starttime		VARCHAR(25),
	type			VARCHAR(20),
		CHECK (category IN ('Public', 'Private', 'RSO')),
	category		VARCHAR(15),
	loc_name		VARCHAR(45),
	latitude		VARCHAR(45),
	longitude		VARCHAR(45),
    weekly_event	VARCHAR(3),
		CHECK (weekly_event IN ('Yes', 'No')),
    admin_id		INT(4) NOT NULL,
    rso_id			INT(4),
	PRIMARY KEY (event_id),
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id),
    FOREIGN KEY (rso_id) REFERENCES rso(rso_id)
	);

-- Comments have to have a user and an event to exist
-- comment_id is used to allow one user to make multiple comments on an event
CREATE TABLE comment (
	comment_id	INT(4) NOT NULL AUTO_INCREMENT,
	date		DATETIME NOT NULL,
	comment		VARCHAR(140),
	student_no	INT(4),
	event_id	INT(4),
	PRIMARY KEY (comment_id, student_no, event_id),
    FOREIGN KEY (student_no) REFERENCES user(student_no) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE
	);

-- MANY to MANY: Users join RSOs
CREATE TABLE joins (
	student_no	INT(4),
    rso_id		INT(4),
    PRIMARY KEY (student_no, rso_id),
    FOREIGN KEY (student_no) REFERENCES user(student_no) ON DELETE CASCADE,
    FOREIGN KEY (rso_id) REFERENCES rso(rso_id) ON DELETE CASCADE
    );

-- MANY to MANY: Users goes to Events
CREATE TABLE goes_to (
	student_no	INT(4),
    event_id	INT(4),
    PRIMARY KEY (student_no, event_id),
    FOREIGN KEY (student_no) REFERENCES user(student_no) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE
    );

SET FOREIGN_KEY_CHECKS = 1;
