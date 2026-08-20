CREATE SCHEMA `moderntech-hr-backend-project` ;
USE `moderntech-hr-backend-project` ;

-- the employees_table
CREATE TABLE `moderntech-hr-backend-project`.`employees_table` (
`employees_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(225) NOT NULL,
  `position` VARCHAR(225) NOT NULL,
  `department` VARCHAR(55) NOT NULL,
  `salary` DECIMAL(10,2) NOT NULL,
  `employmentHistory` VARCHAR(225) NULL,
  `contact` VARCHAR(225) NULL,
  PRIMARY KEY (`employees_id`)
);
    
INSERT INTO `moderntech-hr-backend-project`.`employees_table` (`name`, `position`, `department`, `salary`, `employmentHistory`, `contact`) 
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
CREATE TABLE `moderntech-hr-backend-project`.`payroll_table` (
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
 
  
INSERT INTO `moderntech-hr-backend-project`.`payroll_table` (`employee_id`, `hours_worked`, `leave_deductions`, `final_salary`) 
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

ALTER TABLE `moderntech-hr-backend-project`.`payroll_table` 
DROP FOREIGN KEY `fk_employee_id`;
ALTER TABLE `moderntech-hr-backend-project`.`payroll_table` 
CHANGE COLUMN `employee_id` `employee_id` INT NOT NULL ;
ALTER TABLE `moderntech-hr-backend-project`.`payroll_table` 
ADD CONSTRAINT `fk_employee_id`
  FOREIGN KEY (`employee_id`)
  REFERENCES `moderntech-hr-backend-project`.`employees_table` (`employees_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
