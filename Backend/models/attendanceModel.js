import db from '../../config/db.js';


// =====================================
// GET ALL ATTENDANCE RECORDS
// =====================================

const getAttendance = async () => {

    const [rows] = await db.query(
        "SELECT * FROM attendance"
    );

    return rows;
};


// =====================================
// GET ATTENDANCE FOR ONE EMPLOYEE
// =====================================

const getEmployeeAttendance = async (employeeId) => {

    const [rows] = await db.query(
        "SELECT * FROM attendance WHERE employee_id = ?",
        [employeeId]
    );

    return rows;
};


// =====================================
// CREATE ATTENDANCE
// =====================================

const createAttendance = async (attendance) => {

    const {
        employee_id,
        employee_name,
        date,
        status,
        check_in,
        check_out
    } = attendance;

    const [result] = await db.query(
        `
        INSERT INTO attendance
        (
            employee_id,
            employee_name,
            date,
            status,
            check_in,
            check_out
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            employee_id,
            employee_name,
            date,
            status,
            check_in,
            check_out
        ]
    );

    return result;
};


// =====================================
// UPDATE ATTENDANCE
// =====================================

const updateAttendance = async (id, attendance) => {

    const {
        employee_id,
        employee_name,
        date,
        status,
        check_in,
        check_out
    } = attendance;

    const [result] = await db.query(
        `
        UPDATE attendance
        SET
            employee_id = ?,
            employee_name = ?,
            date = ?,
            status = ?,
            check_in = ?,
            check_out = ?
        WHERE id = ?
        `,
        [
            employee_id,
            employee_name,
            date,
            status,
            check_in,
            check_out,
            id
        ]
    );

    return result;
};


// =====================================
// DELETE ATTENDANCE
// =====================================

const deleteAttendance = async (id) => {

    const [result] = await db.query(
        "DELETE FROM attendance WHERE id = ?",
        [id]
    );

    return result;
};


// =====================================
// ATTENDANCE CARD STATISTICS
// =====================================

const getAttendanceStats = async () => {

    const [rows] = await db.query(
        `
        SELECT
            ROUND(AVG(present_count), 1) AS avgPresent,
            ROUND(AVG(absent_count), 1) AS avgAbsent,
            SUM(late_count) AS lateArrivals

        FROM
        (
            SELECT
                DATE(date) AS attendance_date,

                SUM(
                    LOWER(TRIM(status)) = 'present'
                ) AS present_count,

                SUM(
                    LOWER(TRIM(status)) = 'absent'
                ) AS absent_count,

                SUM(
                    LOWER(TRIM(status)) = 'late'
                ) AS late_count

            FROM attendance

            GROUP BY DATE(date)

        ) AS daily_stats
        `
    );

    return rows[0] || {
        avgPresent: 0,
        avgAbsent: 0,
        lateArrivals: 0
    };
};


// =====================================
// DAILY ATTENDANCE STATISTICS
// =====================================

const getDailyAttendanceStats = async () => {

    const [rows] = await db.query(`
        SELECT
            DATE(date) AS raw_date,

            SUM(
                CASE
                    WHEN LOWER(TRIM(status)) = 'present'
                    THEN 1
                    ELSE 0
                END
            ) AS present,

            SUM(
                CASE
                    WHEN LOWER(TRIM(status)) = 'absent'
                    THEN 1
                    ELSE 0
                END
            ) AS absent,

            SUM(
                CASE
                    WHEN LOWER(TRIM(status)) = 'late'
                    THEN 1
                    ELSE 0
                END
            ) AS late

        FROM attendance

        GROUP BY DATE(date)

        ORDER BY DATE(date) DESC

        LIMIT 7
    `);

    return rows.map(row => ({
        raw_date: row.raw_date,

        date: new Date(row.raw_date)
            .toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "2-digit"
            }),

        present: Number(row.present),
        absent: Number(row.absent),
        late: Number(row.late)
    }));
};
// =====================================
// EXPORT
// =====================================

export {
    getDailyAttendanceStats,
    getAttendanceStats,
    getAttendance,
    getEmployeeAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
};
