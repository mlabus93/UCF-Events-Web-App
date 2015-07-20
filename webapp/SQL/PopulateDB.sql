-- Test Universities
INSERT INTO university(uni_name, description, num_students)
VALUES('UCF', 'University of Central Florida', '59770');

INSERT INTO university(uni_name, description, num_students)
VALUES('FSU', 'Florida State University', '41733');

INSERT INTO university(uni_name, description, num_students)
VALUES('USF', 'University of South Florida', '41888');

INSERT INTO university(uni_name, description, num_students)
VALUES('UF', 'University of Florida', '51725');

INSERT INTO university(uni_name, description, num_students)
VALUES ('UM', 'University of Miami', '16744');

-- Super Admin
INSERT INTO user(email, password, acct_type, uni_id)
VALUES('super@email.com', 'password', 'superadmin', '1');

-- Testing Users
INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user1@knights.ucf.edu', 'password', 'student', '1');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user2@knights.ucf.edu', 'password', 'student', '1');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user3@knights.ucf.edu', 'password', 'student', '1');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user4@knights.ucf.edu', 'password', 'student', '1');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user5@knights.ucf.edu', 'password', 'student', '1');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('admin1@knights.ucf.edu', 'password', 'admin', '1');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('admin1@my.fsu.edu', 'password', 'admin', '2');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user1@my.fsu.edu', 'password', 'user', '2');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user2@my.fsu.edu', 'password', 'user', '2');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user3@my.fsu.edu', 'password', 'user', '2');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('admin1@mail.usf.edu', 'password', 'admin', '3');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('admin2@mail.usf.edu', 'password', 'admin', '3');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user1@mail.usf.edu', 'password', 'user', '3');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user2@mail.usf.edu', 'password', 'user', '3');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('admin1@ufl.edu', 'password', 'admin', '4');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user1@ufl.edu', 'password', 'user', '4');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('admin1@miami.edu', 'password', 'admin', '5');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('admin2@miami.edu', 'password', 'admin', '5');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user1@miami.edu', 'password', 'user', '5');

INSERT INTO user(email, password, acct_type, uni_id)
VALUES('user2@miami.edu', 'password', 'user', '5');


-- Superadmin insert from users
INSERT INTO superadmin(superadmin_id)
	SELECT student_no
    FROM user
    WHERE acct_type = 'superadmin';
    
-- admin insert from users
INSERT INTO admin(admin_id)
	SELECT student_no
    FROM user
    WHERE acct_type = 'admin' OR acct_type = 'superadmin';
    
-- Test RSOs
INSERT INTO rso(rso_name, admin_id)
VALUES('UCF Programming Club', '7');

INSERT INTO rso(rso_name, admin_id)
VALUES('UCF SGA', '7');

INSERT INTO rso(rso_name, admin_id)
VALUES('Triathlon Club', '7');

INSERT INTO rso(rso_name, admin_id)
VALUES('UCF Alumni', '7');

INSERT INTO rso(rso_name, admin_id)
VALUES('Chess Club', '8');

INSERT INTO rso(rso_name, admin_id)
VALUES('Band', '8');

INSERT INTO rso(rso_name, admin_id)
VALUES('Martial Arts', '12');

INSERT INTO rso(rso_name, admin_id)
VALUES('Intramural Sports', '13');

INSERT INTO rso(rso_name, admin_id)
VALUES('Math Club', '16');

INSERT INTO rso(rso_name, admin_id)
VALUES('Engineering Society', '18');

INSERT INTO rso(rso_name, admin_id)
VALUES('Book Club', '19');

-- Test Events
INSERT INTO event(event_name, description, starttime, type, category, loc_name, latitude, longitude, admin_id, weekly_event)
VALUES('UCF Arena Concert', 'Concert with that one band', '7/20/15 1:40 PM', 'Public', 'Music', 'UCF Arena', '28.608597', '-81.197243', '7', 'No'); 

INSERT INTO event(event_name, description, starttime, type, category, loc_name, latitude, longitude, admin_id, weekly_event)
VALUES('Private Event', 'Surprise Birthday Party', ' 8/1/2015 2:30 PM', 'Private', 'Personal', 'Landis Green', '30.442356', '-84.295025', '8', 'No');

INSERT INTO event(event_name, description, starttime, type, category, loc_name, latitude, longitude, admin_id, rso_id, weekly_event)
VALUES('SGA Opening Meeting', 'Meet and greet', '7/26/2015 8:00 PM', 'Public', 'Government', 'UCF Student Union', '28.602195', '-81.200543', '7', '2', 'No');

INSERT INTO event(event_name, description, starttime, type, category, loc_name, latitude, longitude, admin_id, weekly_event)
VALUES('FSU Football Game', 'Tailgating before at noon.', '9/26/2015 7:00 PM', 'Public', 'Sports', 'FSU Stadium', '30.439186', '-84.304583', '8', 'No');

INSERT INTO event(event_name, description, starttime, type, category, loc_name, latitude, longitude, admin_id, rso_id, weekly_event)
VALUES('Cookout', 'Bring your own drinks.', '8/14/2015 1:00 PM', 'Private', 'Social', 'MLK Plaza', '28.062803', '-82.414701', '13', '8', 'No');

INSERT INTO event (event_name, description, starttime, type, category, loc_name, latitude, longitude, weekly_event, admin_id, rso_id)
VALUES ('Summer Training', 'swimming, biking, running', '8/18/2015 7:00 AM', 'RSO', 'Sports', 'UCF Gym', '28.595849', '-81.199400', 'Yes', '7', '3');

-- Users joining RSOs
INSERT INTO joins(student_no, rso_id)
VALUES('7', '1');

INSERT INTO joins(student_no, rso_id)
VALUES('7', '2');

INSERT INTO joins(student_no, rso_id)
VALUES('7', '3');

INSERT INTO joins(student_no, rso_id)
VALUES('7', '4');

INSERT INTO joins(student_no, rso_id)
VALUES('8', '5');

INSERT INTO joins(student_no, rso_id)
VALUES('8', '6');

INSERT INTO joins(student_no, rso_id)
VALUES('12', '7');

INSERT INTO joins(student_no, rso_id)
VALUES('13', '8');

INSERT INTO joins(student_no, rso_id)
VALUES('16', '9');

INSERT INTO joins(student_no, rso_id)
VALUES('18', '10');

INSERT INTO joins(student_no, rso_id)
VALUES('1', '2');

INSERT INTO joins(student_no, rso_id)
VALUES('2', '3');

INSERT INTO joins(student_no, rso_id)
VALUES('3', '1');

INSERT INTO joins(student_no, rso_id)
VALUES('3', '2');

INSERT INTO joins(student_no, rso_id)
VALUES('4', '1');

INSERT INTO joins(student_no, rso_id)
VALUES('4', '2');

INSERT INTO joins(student_no, rso_id)
VALUES('4', '4');

INSERT INTO joins(student_no, rso_id)
VALUES('9', '5');

INSERT INTO joins(student_no, rso_id)
VALUES('9', '6');

INSERT INTO joins(student_no, rso_id)
VALUES('10', '5');

INSERT INTO joins(student_no, rso_id)
VALUES('11', '6');

INSERT INTO joins(student_no, rso_id)
VALUES('14', '7');

INSERT INTO joins(student_no, rso_id)
VALUES('15', '5');

INSERT INTO joins(student_no, rso_id)
VALUES('17', '9');

INSERT INTO joins(student_no, rso_id)
VALUES('20', '10');


-- Users going to events
INSERT INTO goes_to(student_no, event_id)
VALUES('3', '1');

INSERT INTO goes_to(student_no, event_id)
VALUES('4', '1');

INSERT INTO goes_to(student_no, event_id)
VALUES('7', '1');

INSERT INTO goes_to(student_no, event_id)
VALUES('13', '1');

INSERT INTO goes_to(student_no, event_id)
VALUES('8', '2');

INSERT INTO goes_to(student_no, event_id)
VALUES('9', '2');

INSERT INTO goes_to(student_no, event_id)
VALUES('4', '3');

INSERT INTO goes_to(student_no, event_id)
VALUES('7', '3');

INSERT INTO goes_to(student_no, event_id)
VALUES('7', '2');

INSERT INTO goes_to(student_no, event_id)
VALUES('8', '4');

INSERT INTO goes_to(student_no, event_id)
VALUES('9', '4');

INSERT INTO goes_to(student_no, event_id)
VALUES('10', '4');

INSERT INTO goes_to(student_no, event_id)
VALUES('11', '4');

INSERT INTO goes_to(student_no, event_id)
VALUES('12', '5');

INSERT INTO goes_to(student_no, event_id)
VALUES('13', '5');

INSERT INTO goes_to(student_no, event_id)
VALUES('15', '5');

-- Users posting comments on events
INSERT INTO comment(date, comment, student_no, event_id)
VALUES(NOW(), 'First comment of the event!', '3', '1');

INSERT INTO comment(date, comment, student_no, event_id)
VALUES(NOW(), "Can't wait for this to happen already", '4', '1');

INSERT INTO comment(date, comment, student_no, event_id)
VALUES(NOW(), "I'm the admin!", '7', '1');

INSERT INTO comment(date, comment, student_no, event_id)
VALUES(NOW(), 'Happy Birthday!', '9', '2');

INSERT INTO comment(date, comment, student_no, event_id)
VALUES(NOW(), "Can't wait to meet everyone!", '7', '3');

INSERT INTO comment(date, comment, student_no, event_id)
VALUES(NOW(), "Can't wait to meet everyone!", '15', '5');



