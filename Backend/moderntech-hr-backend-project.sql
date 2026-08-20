CREATE SCHEMA `moderntech-hr-backend-project` ;
USE `moderntech-hr-backend-project` ;

-- the employees_table
CREATE TABLE `moderntech-hr-backend-project`.`employees_table` (
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
    REFERENCES `moderntech-hr-backend-project`.`payroll_table` (`employee_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
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
  `hours_worked` DECIMAL(10) NULL,
  `leave_deductions` DECIMAL(10) NULL,
  `final_salary` DECIMAL(10) NULL,
  PRIMARY KEY (`employee_id`));
  
  INSERT INTO `moderntech-hr-backend-project`.`payroll_table` (`hours_worked`, `leave_deductions`, `final_salary`) 
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
