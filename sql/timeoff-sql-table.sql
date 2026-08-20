CREATE DATABASE IF NOT EXISTS moderntech_hr;
USE moderntech_hr;

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