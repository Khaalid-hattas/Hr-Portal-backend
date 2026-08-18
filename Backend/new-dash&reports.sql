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