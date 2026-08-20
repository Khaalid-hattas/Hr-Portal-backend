CREATE DATABASE IF NOT EXISTS moderntech_hr;
USE moderntech_hr;

CREATE TABLE IF NOT EXISTS employees (
    employee_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50)
);

SET @has_department = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'employees'
      AND COLUMN_NAME = 'department'
);
SET @add_department = IF(@has_department = 0,
    'ALTER TABLE employees ADD COLUMN department VARCHAR(50)',
    'SELECT 1');
PREPARE add_department_statement FROM @add_department;
EXECUTE add_department_statement;
DEALLOCATE PREPARE add_department_statement;

CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS leave_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status ENUM('Approved', 'Pending', 'Denied') NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employee_information (
    employee_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    employment_history TEXT,
    contact VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS payroll (
    payroll_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    hours_worked DECIMAL(5, 2) NOT NULL,
    leave_deductions INT NOT NULL DEFAULT 0,
    final_salary DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

INSERT IGNORE INTO employees (employee_id, name, department) VALUES
(1, 'Sibongile Nkosi', 'Development'), (2, 'Lungile Moyo', 'HR'),
(3, 'Thabo Molefe', 'QA'), (4, 'Keshav Naidoo', 'Sales'),
(5, 'Zanele Khumalo', 'Marketing'), (6, 'Sipho Zulu', 'Design'),
(7, 'Naledi Moeketsi', 'IT'), (8, 'Farai Gumbo', 'Marketing'),
(9, 'Karabo Dlamini', 'Finance'), (10, 'Fatima Patel', 'Support');

INSERT IGNORE INTO employee_information
    (employee_id, name, position, department, salary, employment_history, contact) VALUES
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

UPDATE employees e
INNER JOIN employee_information i ON i.employee_id = e.employee_id
SET e.department = i.department;

INSERT INTO attendance (employee_id, date, status)
SELECT seed.employee_id, seed.date, seed.status
FROM (
    SELECT 1 employee_id, '2025-07-25' date, 'Present' status UNION ALL SELECT 1,'2025-07-26','Absent' UNION ALL SELECT 1,'2025-07-27','Present' UNION ALL SELECT 1,'2025-07-28','Present' UNION ALL SELECT 1,'2025-07-29','Present' UNION ALL
    SELECT 2,'2025-07-25','Present' UNION ALL SELECT 2,'2025-07-26','Present' UNION ALL SELECT 2,'2025-07-27','Absent' UNION ALL SELECT 2,'2025-07-28','Present' UNION ALL SELECT 2,'2025-07-29','Present' UNION ALL
    SELECT 3,'2025-07-25','Present' UNION ALL SELECT 3,'2025-07-26','Present' UNION ALL SELECT 3,'2025-07-27','Present' UNION ALL SELECT 3,'2025-07-28','Absent' UNION ALL SELECT 3,'2025-07-29','Present' UNION ALL
    SELECT 4,'2025-07-25','Absent' UNION ALL SELECT 4,'2025-07-26','Present' UNION ALL SELECT 4,'2025-07-27','Present' UNION ALL SELECT 4,'2025-07-28','Present' UNION ALL SELECT 4,'2025-07-29','Present' UNION ALL
    SELECT 5,'2025-07-25','Present' UNION ALL SELECT 5,'2025-07-26','Present' UNION ALL SELECT 5,'2025-07-27','Absent' UNION ALL SELECT 5,'2025-07-28','Present' UNION ALL SELECT 5,'2025-07-29','Present' UNION ALL
    SELECT 6,'2025-07-25','Present' UNION ALL SELECT 6,'2025-07-26','Present' UNION ALL SELECT 6,'2025-07-27','Absent' UNION ALL SELECT 6,'2025-07-28','Present' UNION ALL SELECT 6,'2025-07-29','Present' UNION ALL
    SELECT 7,'2025-07-25','Present' UNION ALL SELECT 7,'2025-07-26','Present' UNION ALL SELECT 7,'2025-07-27','Present' UNION ALL SELECT 7,'2025-07-28','Absent' UNION ALL SELECT 7,'2025-07-29','Present' UNION ALL
    SELECT 8,'2025-07-25','Present' UNION ALL SELECT 8,'2025-07-26','Absent' UNION ALL SELECT 8,'2025-07-27','Present' UNION ALL SELECT 8,'2025-07-28','Present' UNION ALL SELECT 8,'2025-07-29','Present' UNION ALL
    SELECT 9,'2025-07-25','Present' UNION ALL SELECT 9,'2025-07-26','Present' UNION ALL SELECT 9,'2025-07-27','Present' UNION ALL SELECT 9,'2025-07-28','Absent' UNION ALL SELECT 9,'2025-07-29','Present' UNION ALL
    SELECT 10,'2025-07-25','Present' UNION ALL SELECT 10,'2025-07-26','Present' UNION ALL SELECT 10,'2025-07-27','Absent' UNION ALL SELECT 10,'2025-07-28','Present' UNION ALL SELECT 10,'2025-07-29','Present'
) seed
WHERE NOT EXISTS (SELECT 1 FROM attendance a WHERE a.employee_id = seed.employee_id AND a.date = seed.date);

INSERT INTO leave_requests (employee_id, date, reason, status)
SELECT seed.employee_id, seed.date, seed.reason, seed.status
FROM (
    SELECT 1 employee_id,'2025-07-22' date,'Sick Leave' reason,'Approved' status UNION ALL SELECT 1,'2024-12-01','Personal','Pending' UNION ALL SELECT 2,'2025-07-15','Family Responsibility','Denied' UNION ALL SELECT 2,'2024-12-02','Vacation','Approved' UNION ALL SELECT 3,'2025-07-10','Medical Appointment','Approved' UNION ALL SELECT 3,'2024-12-05','Personal','Pending' UNION ALL SELECT 4,'2025-07-20','Bereavement','Approved' UNION ALL SELECT 5,'2024-12-01','Childcare','Pending' UNION ALL SELECT 6,'2025-07-18','Sick Leave','Approved' UNION ALL SELECT 7,'2025-07-22','Vacation','Pending' UNION ALL SELECT 8,'2024-12-02','Medical Appointment','Approved' UNION ALL SELECT 9,'2025-07-19','Childcare','Denied' UNION ALL SELECT 10,'2024-12-03','Vacation','Pending'
) seed
WHERE NOT EXISTS (SELECT 1 FROM leave_requests l WHERE l.employee_id=seed.employee_id AND l.date=seed.date AND l.reason=seed.reason AND l.status=seed.status);

INSERT INTO payroll (employee_id, hours_worked, leave_deductions, final_salary)
SELECT seed.employee_id, seed.hours_worked, seed.leave_deductions, seed.final_salary
FROM (
    SELECT 1 employee_id,160.00 hours_worked,8 leave_deductions,69500.00 final_salary UNION ALL SELECT 2,150.00,10,79000.00 UNION ALL SELECT 3,170.00,4,54800.00 UNION ALL SELECT 4,165.00,6,59700.00 UNION ALL SELECT 5,158.00,5,57850.00 UNION ALL SELECT 6,168.00,2,64800.00 UNION ALL SELECT 7,175.00,3,71800.00 UNION ALL SELECT 8,160.00,0,56000.00 UNION ALL SELECT 9,155.00,5,61500.00 UNION ALL SELECT 10,162.00,4,57750.00
) seed
WHERE NOT EXISTS (SELECT 1 FROM payroll p WHERE p.employee_id=seed.employee_id AND p.hours_worked=seed.hours_worked AND p.leave_deductions=seed.leave_deductions AND p.final_salary=seed.final_salary);
