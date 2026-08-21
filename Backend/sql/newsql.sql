SET FOREIGN_KEY_CHECKS = 0;
CREATE DATABASE IF NOT EXISTS moderntech;
USE moderntech;

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late') NOT NULL,
    check_in TIME,
    check_out TIME
);

INSERT INTO attendance
(employee_id, employee_name, date, status, check_in, check_out)
VALUES
(1, 'John Smith', '2026-08-01', 'Present', '08:00:00', '17:00:00'),
(2, 'Sarah Williams', '2026-08-01', 'Late', '08:35:00', '17:00:00'),
(3, 'Michael Brown', '2026-08-01', 'Absent', NULL, NULL),
(4, 'Emily Jones', '2026-08-01', 'Present', '07:55:00', '17:05:00'),
(5, 'David Wilson', '2026-08-01', 'Present', '08:10:00', '17:00:00'),
(1, 'John Smith', '2026-08-02', 'Present', '08:05:00', '17:00:00'),
(2, 'Sarah Williams', '2026-08-02', 'Present', '08:00:00', '17:00:00'),
(3, 'Michael Brown', '2026-08-02', 'Present', '07:50:00', '17:00:00'),
(4, 'Emily Jones', '2026-08-02', 'Absent', NULL, NULL),
(5, 'David Wilson', '2026-08-02', 'Late', '08:45:00', '17:00:00');





DROP TABLE IF EXISTS leave_requests;

CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL
);

INSERT INTO leave_requests
(employee_id, date, reason, status)
VALUES
(1, '2025-07-22', 'Sick Leave', 'Approved'),
(1, '2024-12-01', 'Personal', 'Pending'),

(2, '2025-07-15', 'Family Responsibility', 'Denied'),
(2, '2024-12-02', 'Vacation', 'Approved'),

(3, '2025-07-10', 'Medical Appointment', 'Approved'),
(3, '2024-12-05', 'Personal', 'Pending'),

(4, '2025-07-20', 'Bereavement', 'Approved'),

(5, '2024-12-01', 'Childcare', 'Pending'),

(6, '2025-07-18', 'Sick Leave', 'Approved'),

(7, '2025-07-22', 'Vacation', 'Pending'),

(8, '2024-12-02', 'Medical Appointment', 'Approved'),

(9, '2025-07-19', 'Childcare', 'Denied'),

(10, '2024-12-03', 'Vacation', 'Pending');






INSERT INTO attendance
(employee_id, employee_name, date, status, check_in, check_out)
VALUES

-- 2026-08-03
(1, 'John Smith', '2026-08-03', 'Present', '08:00:00', '17:00:00'),
(2, 'Sarah Williams', '2026-08-03', 'Present', '08:10:00', '17:00:00'),
(3, 'Michael Brown', '2026-08-03', 'Late', '08:40:00', '17:00:00'),
(4, 'Emily Jones', '2026-08-03', 'Present', '07:55:00', '17:05:00'),
(5, 'David Wilson', '2026-08-03', 'Absent', NULL, NULL),

-- 2026-08-04
(1, 'John Smith', '2026-08-04', 'Late', '08:30:00', '17:00:00'),
(2, 'Sarah Williams', '2026-08-04', 'Present', '08:00:00', '17:00:00'),
(3, 'Michael Brown', '2026-08-04', 'Present', '08:05:00', '17:00:00'),
(4, 'Emily Jones', '2026-08-04', 'Absent', NULL, NULL),
(5, 'David Wilson', '2026-08-04', 'Present', '08:15:00', '17:00:00'),

-- 2026-08-05
(1, 'John Smith', '2026-08-05', 'Present', '07:55:00', '17:00:00'),
(2, 'Sarah Williams', '2026-08-05', 'Late', '08:50:00', '17:00:00'),
(3, 'Michael Brown', '2026-08-05', 'Present', '08:00:00', '17:00:00'),
(4, 'Emily Jones', '2026-08-05', 'Present', '08:05:00', '17:00:00'),
(5, 'David Wilson', '2026-08-05', 'Absent', NULL, NULL),

-- 2026-08-06
(1, 'John Smith', '2026-08-06', 'Present', '08:00:00', '17:00:00'),
(2, 'Sarah Williams', '2026-08-06', 'Absent', NULL, NULL),
(3, 'Michael Brown', '2026-08-06', 'Present', '08:10:00', '17:00:00'),
(4, 'Emily Jones', '2026-08-06', 'Late', '08:45:00', '17:00:00'),
(5, 'David Wilson', '2026-08-06', 'Present', '08:00:00', '17:00:00'),

-- 2026-08-07
(1, 'John Smith', '2026-08-07', 'Late', '08:35:00', '17:00:00'),
(2, 'Sarah Williams', '2026-08-07', 'Present', '08:00:00', '17:00:00'),
(3, 'Michael Brown', '2026-08-07', 'Absent', NULL, NULL),
(4, 'Emily Jones', '2026-08-07', 'Present', '07:50:00', '17:00:00'),
(5, 'David Wilson', '2026-08-07', 'Present', '08:05:00', '17:00:00');



SELECT employee_id, employee_name
FROM attendance
GROUP BY employee_id, employee_name;



DELETE FROM attendance
WHERE date BETWEEN '2026-08-03' AND '2026-08-07';

INSERT INTO attendance
(employee_id, employee_name, date, status, check_in, check_out)
VALUES

-- 2026-08-03
(1, 'John Smith', '2026-08-03', 'Present', '08:00:00', '17:00:00'),
(2, 'Sarah Williams', '2026-08-03', 'Late', '08:40:00', '17:00:00'),
(3, 'Michael Brown', '2026-08-03', 'Present', '08:05:00', '17:00:00'),
(4, 'Emily Jones', '2026-08-03', 'Present', '07:55:00', '17:00:00'),
(5, 'David Wilson', '2026-08-03', 'Present', '08:10:00', '17:00:00'),

-- 2026-08-04
(1, 'John Smith', '2026-08-04', 'Absent', NULL, NULL),
(2, 'Sarah Williams', '2026-08-04', 'Present', '08:00:00', '17:00:00'),
(3, 'Michael Brown', '2026-08-04', 'Present', '08:10:00', '17:00:00'),
(4, 'Emily Jones', '2026-08-04', 'Late', '08:50:00', '17:00:00'),
(5, 'David Wilson', '2026-08-04', 'Present', '08:05:00', '17:00:00'),

-- 2026-08-05
(1, 'John Smith', '2026-08-05', 'Late', '08:30:00', '17:00:00'),
(2, 'Sarah Williams', '2026-08-05', 'Late', '08:45:00', '17:00:00'),
(3, 'Michael Brown', '2026-08-05', 'Present', '08:00:00', '17:00:00'),
(4, 'Emily Jones', '2026-08-05', 'Present', '07:55:00', '17:00:00'),
(5, 'David Wilson', '2026-08-05', 'Absent', NULL, NULL),

-- 2026-08-06
(1, 'John Smith', '2026-08-06', 'Present', '08:00:00', '17:00:00'),
(2, 'Sarah Williams', '2026-08-06', 'Absent', NULL, NULL),
(3, 'Michael Brown', '2026-08-06', 'Absent', NULL, NULL),
(4, 'Emily Jones', '2026-08-06', 'Present', '08:05:00', '17:00:00'),
(5, 'David Wilson', '2026-08-06', 'Present', '08:10:00', '17:00:00'),

-- 2026-08-07
(1, 'John Smith', '2026-08-07', 'Present', '08:00:00', '17:00:00'),
(2, 'Sarah Williams', '2026-08-07', 'Present', '08:05:00', '17:00:00'),
(3, 'Michael Brown', '2026-08-07', 'Late', '09:00:00', '17:00:00'),
(4, 'Emily Jones', '2026-08-07', 'Absent', NULL, NULL),
(5, 'David Wilson', '2026-08-07', 'Late', '08:35:00', '17:00:00');


-- the employees_table
CREATE TABLE `moderntech`.`employees_table` (
  `employees_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(225) NULL,
  `position` VARCHAR(225) NULL,
  `department` VARCHAR(55) NULL,
  `salary` DECIMAL(10) NULL,
  `employmentHistory` VARCHAR(225) NULL,
  `contact` VARCHAR(225) NULL,
  PRIMARY KEY (`employees_id`),
  CONSTRAINT `emp_id`
    FOREIGN KEY (`employees_id`)
    REFERENCES `moderntech`.`payroll_table` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
INSERT INTO `moderntech`.`employees_table` (`name`, `position`, `department`, `salary`, `employmentHistory`, `contact`) 
VALUES 
('Sibongile Nkosi', 'Software Engineer', 'Development', '70000', 'Joined in 2015, promoted to Senior in 2018', 'sibongile.nkosi@moderntech.com'),
('Lungile Moyo', 'HR Manager', 'HR', '80000', 'Joined in 2013, promoted to Manager in 2017', 'lungile.moyo@moderntech.com'),
('Thabo Molefe', 'Quality Analyst', 'QA', '55000', 'Joined in 2018', 'thabo.molefe@moderntech.com'),
('Keshav Naidoo', 'Sales Representative', 'Sales', '60000', 'Joined in 2020', 'keshav.naidoo@moderntech.com'),
('Zanele Khumalo', 'Marketing Specialist', 'Marketing', '58000', 'Joined in 2019', 'zanele.khumalo@moderntech.com'),
('Sipho Zulu', 'UI/UX Designer', 'Design', '65000', 'Joined in 2016', 'sipho.zulu@moderntech.com'),
('Naledi Moeketsi', 'DevOps Engineer', 'IT', '72000', 'Joined in 2017', 'naledi.moeketsi@moderntech.com'),
('Farai Gumbo', 'Content Strategis', 'Marketing', '56000', 'Joined in 2021', 'farai.gumbo@moderntech.com'),
('Karabo Dlamini', 'Accountant', 'Finance', '62000', 'Joined in 2018', 'karabo.dlamini@moderntech.com'),
('Fatima Patel', 'Customer Support Lead', 'Support', '58000', 'Joined in 2016', 'fatima.patel@moderntech.com');



-- the the payroll_table
CREATE TABLE `moderntech`.`payroll_table` (
  `employee_id` INT NOT NULL AUTO_INCREMENT,
  `hours_worked` DECIMAL(10) NULL,
  `leave_deductions` DECIMAL(10) NULL,
  `final_salary` DECIMAL(10) NULL,
  PRIMARY KEY (`employee_id`));
  
  INSERT INTO `moderntech`.`payroll_table` (`hours_worked`, `leave_deductions`, `final_salary`) 
  VALUES 
  ('160', '792', '69500'),
  ('150', '650', '79000'),
  ('170', '600', '54800'),
  ('165', '708', '59700'),
  ('158', '917', '57850'),
  ('168', '917', '64800'),
  ('175', '917', '71800'),
  ('160', '917', '56000'),
  ('155', '917', '61500'),
  ('162', '917', '57750');
  
select * from employees_table;
alter table employees_table add unique(contact);
alter table employees_table add column `status` varchar(20) default 'active';

create table archived_employees like employees_table;
alter table archived_employees add column archived_at timestamp default current_timestamp;


-- the employees_table
CREATE TABLE `moderntech`.`employees_table` (
`employees_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(225) NOT NULL,
  `position` VARCHAR(225) NOT NULL,
  `department` VARCHAR(55) NOT NULL,
  `salary` DECIMAL(10,2) NOT NULL,
  `employmentHistory` VARCHAR(225) NULL,
  `contact` VARCHAR(225) NULL,
  PRIMARY KEY (`employees_id`)
);
    
INSERT INTO `moderntech`.`employees_table` (`name`, `position`, `department`, `salary`, `employmentHistory`, `contact`) 
VALUES 
('Sibongile Nkosi', 'Software Engineer', 'Development', '70000', 'Joined in 2015, promoted to Senior in 2018', 'sibongile.nkosi@moderntech.com'),
('Lungile Moyo', 'HR Manager', 'HR', '80000', 'Joined in 2013, promoted to Manager in 2017', 'lungile.moyo@moderntech.com'),
('Thabo Molefe', 'Quality Analyst', 'QA', '55000', 'Joined in 2018', 'thabo.molefe@moderntech.com'),
('Keshav Naidoo', 'Sales Representative', 'Sales', '60000', 'Joined in 2020', 'keshav.naidoo@moderntech.com'),
('Zanele Khumalo', 'Marketing Specialist', 'Marketing', '58000', 'Joined in 2019', 'zanele.khumalo@moderntech.com'),
('Sipho Zulu', 'UI/UX Designer', 'Design', '65000', 'Joined in 2016', 'sipho.zulu@moderntech.com'),
('Naledi Moeketsi', 'DevOps Engineer', 'IT', '72000', 'Joined in 2017', 'naledi.moeketsi@moderntech.com'),
('Farai Gumbo', 'Content Strategis', 'Marketing', '56000', 'Joined in 2021', 'farai.gumbo@moderntech.com'),
('Karabo Dlamini', 'Accountant', 'Finance', '62000', 'Joined in 2018', 'karabo.dlamini@moderntech.com'),
('Fatima Patel', 'Customer Support Lead', 'Support', '58000', 'Joined in 2016', 'fatima.patel@moderntech.com');



-- the the payroll_table
CREATE TABLE `moderntech`.`payroll_table` (
  `employee_id` INT NOT NULL AUTO_INCREMENT,
  `hours_worked` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `leave_deductions` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `final_salary` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`employee_id`),
  CONSTRAINT `fk_employee_id`
    FOREIGN KEY (`employee_id`)
    REFERENCES `employees_table` (`employees_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
 
  
  INSERT INTO `moderntech`.`payroll_table` (`employee_id`, `hours_worked`, `leave_deductions`, `final_salary`) 
VALUES 
(1, 160.00, 792.00, 69500.00),
(2, 150.00, 650.00, 79000.00),
(3, 170.00, 600.00, 54800.00),
(4, 165.00, 708.00, 59700.00),
(5, 158.00, 917.00, 57850.00),
(6, 168.00, 917.00, 64800.00),
(7, 175.00, 917.00, 71800.00),
(8, 160.00, 917.00, 56000.00),
(9, 155.00, 917.00, 61500.00),
(10, 162.00, 917.00, 57750.00);

ALTER TABLE `moderntech`.`payroll_table` 
DROP FOREIGN KEY `fk_employee_id`;
ALTER TABLE `moderntech`.`payroll_table` 
CHANGE COLUMN `employee_id` `employee_id` INT NOT NULL ;
ALTER TABLE `moderntech`.`payroll_table` 
ADD CONSTRAINT `fk_employee_id`
  FOREIGN KEY (`employee_id`)
  REFERENCES `moderntech`.`employees_table` (`employees_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
-- 1. Create Employees table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 2. Create Attendance table
CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- 3. Create Leave Requests table
CREATE TABLE leave_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status ENUM('Approved', 'Pending', 'Denied') NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- Insert Employees
INSERT INTO employees (employee_id, name) VALUES
(1, 'Sibongile Nkosi'),
(2, 'Lungile Moyo'),
(3, 'Thabo Molefe'),
(4, 'Keshav Naidoo'),
(5, 'Zanele Khumalo'),
(6, 'Sipho Zulu'),
(7, 'Naledi Moeketsi'),
(8, 'Farai Gumbo'),
(9, 'Karabo Dlamini'),
(10, 'Fatima Patel');

-- Insert Attendance Records
INSERT INTO attendance (employee_id, date, status) VALUES
(1, '2025-07-25', 'Present'), (1, '2025-07-26', 'Absent'), (1, '2025-07-27', 'Present'), (1, '2025-07-28', 'Present'), (1, '2025-07-29', 'Present'),
(2, '2025-07-25', 'Present'), (2, '2025-07-26', 'Present'), (2, '2025-07-27', 'Absent'), (2, '2025-07-28', 'Present'), (2, '2025-07-29', 'Present'),
(3, '2025-07-25', 'Present'), (3, '2025-07-26', 'Present'), (3, '2025-07-27', 'Present'), (3, '2025-07-28', 'Absent'), (3, '2025-07-29', 'Present'),
(4, '2025-07-25', 'Absent'),  (4, '2025-07-26', 'Present'), (4, '2025-07-27', 'Present'), (4, '2025-07-28', 'Present'), (4, '2025-07-29', 'Present'),
(5, '2025-07-25', 'Present'), (5, '2025-07-26', 'Present'), (5, '2025-07-27', 'Absent'),  (5, '2025-07-28', 'Present'), (5, '2025-07-29', 'Present'),
(6, '2025-07-25', 'Present'), (6, '2025-07-26', 'Present'), (6, '2025-07-27', 'Absent'),  (6, '2025-07-28', 'Present'), (6, '2025-07-29', 'Present'),
(7, '2025-07-25', 'Present'), (7, '2025-07-26', 'Present'), (7, '2025-07-27', 'Present'), (7, '2025-07-28', 'Absent'),  (7, '2025-07-29', 'Present'),
(8, '2025-07-25', 'Present'), (8, '2025-07-26', 'Absent'),  (8, '2025-07-27', 'Present'), (8, '2025-07-28', 'Present'), (8, '2025-07-29', 'Present'),
(9, '2025-07-25', 'Present'), (9, '2025-07-26', 'Present'), (9, '2025-07-27', 'Present'), (9, '2025-07-28', 'Absent'),  (9, '2025-07-29', 'Present'),
(10, '2025-07-25', 'Present'), (10, '2025-07-26', 'Present'), (10, '2025-07-27', 'Absent'), (10, '2025-07-28', 'Present'), (10, '2025-07-29', 'Present');

-- Insert Leave Requests Records
INSERT INTO leave_requests (employee_id, date, reason, status) VALUES
(1, '2025-07-22', 'Sick Leave', 'Approved'),
(1, '2024-12-01', 'Personal', 'Pending'),
(2, '2025-07-15', 'Family Responsibility', 'Denied'),
(2, '2024-12-02', 'Vacation', 'Approved'),
(3, '2025-07-10', 'Medical Appointment', 'Approved'),
(3, '2024-12-05', 'Personal', 'Pending'),
(4, '2025-07-20', 'Bereavement', 'Approved'),
(5, '2024-12-01', 'Childcare', 'Pending'),
(6, '2025-07-18', 'Sick Leave', 'Approved'),
(7, '2025-07-22', 'Vacation', 'Pending'),
(8, '2024-12-02', 'Medical Appointment', 'Approved'),
(9, '2025-07-19', 'Childcare', 'Denied'),
(10, '2024-12-03', 'Vacation', 'Pending');


-- 1. Create Employee Information table
CREATE TABLE employee_information (
    employee_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    employment_history TEXT,
    contact VARCHAR(100) UNIQUE NOT NULL
);

-- 2. Insert Employee Records
INSERT INTO employee_information (employee_id, name, position, department, salary, employment_history, contact) VALUES
(1, 'Sibongile Nkosi', 'Software Engineer', 'Development', 70000.00, 'Joined in 2015, promoted to Senior in 2018', 'sibongile.nkosi@moderntech.com'),
(2, 'Lungile Moyo', 'HR Manager', 'HR', 80000.00, 'Joined in 2013, promoted to Manager in 2017', 'lungile.moyo@moderntech.com'),
(3, 'Thabo Molefe', 'Quality Analyst', 'QA', 55000.00, 'Joined in 2018', 'thabo.molefe@moderntech.com'),
(4, 'Keshav Naidoo', 'Sales Representative', 'Sales', 60000.00, 'Joined in 2020', 'keshav.naidoo@moderntech.com'),
(5, 'Zanele Khumalo', 'Marketing Specialist', 'Marketing', 58000.00, 'Joined in 2019', 'zanele.khumalo@moderntech.com'),
(6, 'Sipho Zulu', 'UI/UX Designer', 'Design', 65000.00, 'Joined in 2016', 'sipho.zulu@moderntech.com'),
(7, 'Naledi Moeketsi', 'DevOps Engineer', 'IT', 72000.00, 'Joined in 2017', 'naledi.moeketsi@moderntech.com'),
(8, 'Farai Gumbo', 'Content Strategist', 'Marketing', 56000.00, 'Joined in 2021', 'farai.gumbo@moderntech.com'),
(9, 'Karabo Dlamini', 'Accountant', 'Finance', 62000.00, 'Joined in 2018', 'karabo.dlamini@moderntech.com'),
(10, 'Fatima Patel', 'Customer Support Lead', 'Support', 58000.00, 'Joined in 2016', 'fatima.patel@moderntech.com');


-- 1. Create Payroll table
CREATE TABLE payroll (
    payroll_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    hours_worked DECIMAL(5, 2) NOT NULL,
    leave_deductions INT NOT NULL DEFAULT 0,
    final_salary DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- 2. Insert Payroll Records
INSERT INTO payroll (employee_id, hours_worked, leave_deductions, final_salary) VALUES
(1, 160.00, 8, 69500.00),
(2, 150.00, 10, 79000.00),
(3, 170.00, 4, 54800.00),
(4, 165.00, 6, 59700.00),
(5, 158.00, 5, 57850.00),
(6, 168.00, 2, 64800.00),
(7, 175.00, 3, 71800.00),
(8, 160.00, 0, 56000.00),
(9, 155.00, 5, 61500.00),
(10, 162.00, 4, 57750.00);
CREATE TABLE IF NOT EXISTS time_off_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(255),
    status VARCHAR(20) DEFAULT 'Pending'
);

TRUNCATE TABLE time_off_requests;

INSERT INTO time_off_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES
(1, 'Annual Leave', '2026-09-01', '2026-09-05', 'Family trip', 'Approved'),
(1, 'Sick Leave', '2026-03-12', '2026-03-14', 'Flu and fever', 'Approved'),
(2, 'Sick Leave', '2026-04-10', '2026-04-11', 'Dental emergency', 'Approved'),
(2, 'Annual Leave', '2026-12-20', '2027-01-05', 'Year-end holiday', 'Pending'),
(3, 'Study Leave', '2026-05-15', '2026-05-20', 'Final exam preparation', 'Approved'),
(4, 'Maternity Leave', '2026-06-01', '2026-08-31', 'Maternity leave', 'Approved'),
(5, 'Casual Leave', '2026-07-04', '2026-07-05', 'Personal business', 'Approved'),
(6, 'Unpaid Leave', '2026-08-10', '2026-08-12', 'Family emergency', 'Rejected'),
(7, 'Annual Leave', '2026-10-01', '2026-10-10', 'Vacation', 'Pending'),
(8, 'Sick Leave', '2026-02-01', '2026-02-02', 'Food poisoning', 'Approved');


-- ============================================================
-- Application seed data
-- Uses the tables consumed by the current backend.
-- Safe to run repeatedly: payroll and time-off rows are upserted.
-- ============================================================


INSERT INTO payroll_table
    (employee_id, hours_worked, leave_deductions, final_salary)
VALUES
    (1, 160.00, 8, 69500.00),
    (2, 150.00, 10, 79000.00),
    (3, 170.00, 4, 54800.00),
    (4, 165.00, 6, 59700.00),
    (5, 158.00, 5, 57850.00),
    (6, 168.00, 2, 64800.00),
    (7, 175.00, 3, 71800.00),
    (8, 160.00, 0, 56000.00),
    (9, 155.00, 5, 61500.00),
    (10, 162.00, 4, 57750.00)
ON DUPLICATE KEY UPDATE
    hours_worked = VALUES(hours_worked),
    leave_deductions = VALUES(leave_deductions),
    final_salary = VALUES(final_salary);

INSERT INTO time_off_requests
    (employee_id, leave_type, start_date, end_date, reason, status)
VALUES
    (1, 'Annual Leave', '2026-09-01', '2026-09-05', 'Family trip', 'Approved'),
    (1, 'Sick Leave', '2026-03-12', '2026-03-14', 'Flu and fever', 'Approved'),
    (2, 'Sick Leave', '2026-04-10', '2026-04-11', 'Dental emergency', 'Approved'),
    (2, 'Annual Leave', '2026-12-20', '2027-01-05', 'Year-end holiday', 'Pending'),
    (3, 'Study Leave', '2026-05-15', '2026-05-20', 'Final exam preparation', 'Approved'),
    (4, 'Maternity Leave', '2026-06-01', '2026-08-31', 'Maternity leave', 'Approved'),
    (5, 'Casual Leave', '2026-07-04', '2026-07-05', 'Personal business', 'Approved'),
    (6, 'Unpaid Leave', '2026-08-10', '2026-08-12', 'Family emergency', 'Rejected'),
    (7, 'Annual Leave', '2026-10-01', '2026-10-10', 'Vacation', 'Pending'),
    (8, 'Sick Leave', '2026-02-01', '2026-02-02', 'Food poisoning', 'Approved');

INSERT INTO leave_requests (employee_id, date, reason, status)
SELECT seed.employee_id, seed.date, seed.reason, seed.status
FROM (
    SELECT 1 AS employee_id, '2025-07-22' AS date, 'Sick Leave' AS reason, 'Approved' AS status
    UNION ALL SELECT 1, '2024-12-01', 'Personal', 'Pending'
    UNION ALL SELECT 2, '2025-07-15', 'Family Responsibility', 'Denied'
    UNION ALL SELECT 2, '2024-12-02', 'Vacation', 'Approved'
    UNION ALL SELECT 3, '2025-07-10', 'Medical Appointment', 'Approved'
    UNION ALL SELECT 3, '2024-12-05', 'Personal', 'Pending'
    UNION ALL SELECT 4, '2025-07-20', 'Bereavement', 'Approved'
    UNION ALL SELECT 5, '2024-12-01', 'Childcare', 'Pending'
    UNION ALL SELECT 6, '2025-07-18', 'Sick Leave', 'Approved'
    UNION ALL SELECT 7, '2025-07-22', 'Vacation', 'Pending'
    UNION ALL SELECT 8, '2024-12-02', 'Medical Appointment', 'Approved'
    UNION ALL SELECT 9, '2025-07-19', 'Childcare', 'Denied'
    UNION ALL SELECT 10, '2024-12-03', 'Vacation', 'Pending'
) AS seed
WHERE NOT EXISTS (
    SELECT 1
    FROM leave_requests lr
    WHERE lr.employee_id = seed.employee_id
      AND lr.date = seed.date
      AND lr.reason = seed.reason
      AND lr.status = seed.status
);



SELECT COUNT(*) FROM payroll_table;
SELECT COUNT(*) FROM time_off_requests;
SELECT COUNT(*) FROM leave_requests;


SELECT employee_id, COUNT(*) AS records
FROM payroll_table
GROUP BY employee_id
ORDER BY employee_id;


CREATE TABLE IF NOT EXISTS archived_employees LIKE employee_information;
DESCRIBE archived_employees;

ALTER TABLE archived_employees
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'archived';


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee'
);

INSERT INTO users (id, username, password, role) 
VALUES (1, 'ELijah_67', '$2b$10$9jDqYiuxV8R4cpNhuOxVreBasDnbjeCFafjNr3lDfxXqlZl23sxWO', 'employee'),
       (2, 'Ty', 'Password123', 'employee');
SET FOREIGN_KEY_CHECKS = 1;

