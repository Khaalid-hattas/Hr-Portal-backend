/*=====================================
    ATTENDANCE VARIABLES
=====================================*/

let attendanceEmployees = [];

const attendanceTableBody =
    document.getElementById(
        "attendanceTableBody"
    );


/*=====================================
    LOAD ATTENDANCE TABLE
=====================================*/

async function loadAttendanceTable() {

    try {

        const attendanceResponse =
            await fetch(
                "http://localhost:3000/api/attendance"
            );


        if (!attendanceResponse.ok) {

            throw new Error(
                "Could not load attendance data"
            );

        }


        const attendanceData =
            await attendanceResponse.json();


        console.log(
            "Attendance data:",
            attendanceData
        );


        /*=====================================
            LOAD LEAVE DATA
        =====================================*/

        let leaveData = [];


        try {

            const leaveResponse =
                await fetch(
                    "http://localhost:3000/api/leave"
                );


            if (leaveResponse.ok) {

                leaveData =
                    await leaveResponse.json();

            }

        } catch (error) {

            console.warn(
                "Leave data could not be loaded.",
                error
            );

        }


        /*=====================================
            COMBINE ATTENDANCE + LEAVE
        =====================================*/

        attendanceEmployees =
            attendanceData.map(
                attendance => {

                    const employeeLeaves =
                        leaveData.filter(
                            leave =>

                                Number(
                                    leave.employee_id
                                ) ===
                                Number(
                                    attendance.employee_id
                                )
                        );


                    return {

                        ...attendance,

                        leaveRequests:
                            employeeLeaves

                    };

                }
            );


        /*=====================================
            DISPLAY TABLE
        =====================================*/

        displayAttendanceTable(
            attendanceEmployees
        );


    } catch (error) {

        console.error(
            "Error loading attendance:",
            error
        );


        if (attendanceTableBody) {

            attendanceTableBody.innerHTML = `

                <tr>

                    <td colspan="6">

                        Error loading attendance data.

                    </td>

                </tr>

            `;

        }

    }

}


/*=====================================
    DISPLAY ATTENDANCE TABLE
=====================================*/

function displayAttendanceTable(
    employeeList
) {

    if (!attendanceTableBody) {

        console.error(
            "attendanceTableBody not found"
        );

        return;

    }


    attendanceTableBody.innerHTML = "";


    if (
        !employeeList ||
        employeeList.length === 0
    ) {

        attendanceTableBody.innerHTML = `

            <tr>

                <td colspan="6">

                    No attendance records found.

                </td>

            </tr>

        `;

        return;

    }


    employeeList.forEach(
        employee => {

            const employeeName =
                employee.employee_name ||
                "Unknown";


            const employeeId =
                employee.employee_id ||
                "-";


            const date =
                employee.date
                    ? new Date(
                        employee.date
                    ).toLocaleDateString()
                    : "-";


            const attendanceStatus =
                employee.status ||
                "-";


            /*=====================================
                LEAVE INFORMATION
            =====================================*/

            const leaveRequests =
                employee.leaveRequests ||
                [];


            let leaveReason = "-";

            let leaveStatus = "-";


            if (
                leaveRequests.length > 0
            ) {

                leaveReason =
                    leaveRequests
                        .map(
                            leave =>
                                leave.reason ||
                                "-"
                        )
                        .join("<br>");


                leaveStatus =
                    leaveRequests
                        .map(
                            leave =>
                                leave.status ||
                                "-"
                        )
                        .join("<br>");

            }


            /*=====================================
                EMPLOYEE INITIALS
            =====================================*/

            const initials =
                employeeName
                    .split(" ")
                    .filter(Boolean)
                    .map(
                        name =>
                            name.charAt(0)
                    )
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();


            /*=====================================
                ATTENDANCE STATUS CLASS
            =====================================*/

            let attendanceClass = "";


            if (
                attendanceStatus
                    .toLowerCase() ===
                "present"
            ) {

                attendanceClass =
                    "attendance-present";

            }

            else if (
                attendanceStatus
                    .toLowerCase() ===
                "absent"
            ) {

                attendanceClass =
                    "attendance-absent";

            }

            else if (
                attendanceStatus
                    .toLowerCase() ===
                "late"
            ) {

                attendanceClass =
                    "attendance-pending";

            }


            /*=====================================
                LEAVE STATUS CLASS
            =====================================*/

            let leaveClass = "";


            const lowerLeaveStatus =
                leaveStatus.toLowerCase();


            if (
                lowerLeaveStatus.includes(
                    "approved"
                )
            ) {

                leaveClass =
                    "attendance-present";

            }

            else if (
                lowerLeaveStatus.includes(
                    "denied"
                )
            ) {

                leaveClass =
                    "attendance-absent";

            }

            else if (
                lowerLeaveStatus.includes(
                    "pending"
                )
            ) {

                leaveClass =
                    "attendance-pending";

            }


            /*=====================================
                CREATE TABLE ROW
            =====================================*/

            attendanceTableBody.innerHTML += `

                <tr>

                    <td>

                        <div
                            class="attendance-employee"
                            onclick="
                                showAttendanceHistory(
                                    ${employeeId}
                                )
                            "
                        >

                            <div
                                class="attendance-avatar"
                            >

                                ${initials}

                            </div>


                            <div>

                                <div
                                    class="attendance-name"
                                >

                                    ${employeeName}

                                </div>


                                <div
                                    class="attendance-subtitle"
                                >

                                    Employee

                                </div>

                            </div>

                        </div>

                    </td>


                    <td>

                        EMP-${String(
                            employeeId
                        ).padStart(3, "0")}

                    </td>


                    <td>

                        ${date}

                    </td>


                    <td>

                        <span
                            class="
                                attendance-status
                                ${attendanceClass}
                            "
                        >

                            ${attendanceStatus}

                        </span>

                    </td>


                    <td>

                        ${leaveReason}

                    </td>


                    <td>

                        <span
                            class="
                                attendance-status
                                ${leaveClass}
                            "
                        >

                            ${leaveStatus}

                        </span>

                    </td>

                </tr>

            `;

        }
    );

}


/*=====================================
    ATTENDANCE HISTORY
=====================================*/

function showAttendanceHistory(
    employeeId
) {

    const employeeRecords =
        attendanceEmployees.filter(
            employee =>

                Number(
                    employee.employee_id
                ) ===
                Number(employeeId)
        );


    if (
        employeeRecords.length === 0
    ) {

        return;

    }


    const employeeNameElement =
        document.getElementById(
            "attendanceEmployeeName"
        );


    if (employeeNameElement) {

        employeeNameElement.innerHTML =

            (
                employeeRecords[0]
                    .employee_name ||
                "Employee"
            ) +

            " - Recent";

    }


    const body =
        document.getElementById(
            "attendanceHistoryBody"
        );


    if (!body) {

        return;

    }


    body.innerHTML = "";


    employeeRecords.forEach(
        record => {

            let attendanceClass = "";


            if (
                String(record.status)
                    .toLowerCase() ===
                "present"
            ) {

                attendanceClass =
                    "attendance-present";

            }

            else if (
                String(record.status)
                    .toLowerCase() ===
                "absent"
            ) {

                attendanceClass =
                    "attendance-absent";

            }

            else if (
                String(record.status)
                    .toLowerCase() ===
                "late"
            ) {

                attendanceClass =
                    "attendance-pending";

            }


            body.innerHTML += `

                <tr>

                    <td>

                        ${record.date || "-"}

                    </td>


                    <td>

                        <span
                            class="
                                attendance-status
                                ${attendanceClass}
                            "
                        >

                            ${record.status || "-"}

                        </span>

                    </td>

                </tr>

            `;

        }
    );


    const modal =
        document.getElementById(
            "attendanceHistoryModal"
        );


    if (modal) {

        modal.style.display =
            "flex";

    }

}


/*=====================================
    CLOSE HISTORY
=====================================*/

function closeAttendanceHistory() {

    const modal =
        document.getElementById(
            "attendanceHistoryModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}


/*=====================================
    LOAD ATTENDANCE STATISTICS
=====================================*/

async function loadAttendanceStats() {

    const chart =
        document.querySelector(
            ".attendance-chart-card .chart"
        );


    const dailyLogBody =
        document.getElementById(
            "dailyLogBody"
        );


    /*
        Clear old frontend/hard-coded data.
        If backend is unavailable, nothing
        will be displayed.
    */

    if (chart) {

        chart.innerHTML = "";

    }


    if (dailyLogBody) {

        dailyLogBody.innerHTML = "";

    }


    try {

        const response =
            await fetch(
                "http://localhost:3000/api/attendance/stats"
            );


        if (!response.ok) {

            throw new Error(
                "Backend unavailable"
            );

        }


        const data =
            await response.json();


        console.log(
            "Attendance statistics:",
            data
        );


        /*=====================================
            CARDS
        =====================================*/

        displayAttendanceCards(
            data.cards || {}
        );


        /*=====================================
            DAILY DATA
        =====================================*/

        const dailyData =
            Array.isArray(data.daily)
                ? data.daily
                : [];


        console.log(
            "Daily attendance:",
            dailyData
        );


        /*=====================================
            CHART
        =====================================*/

        displayAttendanceChart(
            dailyData
        );


        /*=====================================
            DAILY LOG
        =====================================*/

        displayDailyLog(
            dailyData
        );


    } catch (error) {

        console.error(
            "Attendance backend unavailable:",
            error
        );


        /*
            Backend OFF:
            keep chart and daily log empty.
        */

        if (chart) {

            chart.innerHTML = "";

        }


        if (dailyLogBody) {

            dailyLogBody.innerHTML = "";

        }

    }

}


/*=====================================
    ATTENDANCE CARDS
=====================================*/

function displayAttendanceCards(
    cards
) {

    const avgPresent =
        document.getElementById(
            "avgPresent"
        );


    const avgAbsent =
        document.getElementById(
            "avgAbsent"
        );


    const lateArrivals =
        document.getElementById(
            "lateArrivals"
        );


    if (avgPresent) {

        avgPresent.textContent =
            cards.avgPresent ?? 0;

    }


    if (avgAbsent) {

        avgAbsent.textContent =
            cards.avgAbsent ?? 0;

    }


    if (lateArrivals) {

        lateArrivals.textContent =
            cards.lateArrivals ?? 0;

    }

}


/*=====================================
    ATTENDANCE CHART
=====================================*/

function displayAttendanceChart(
    dailyData
) {

    const chart =
        document.querySelector(
            ".attendance-chart-card .chart"
        );


    if (!chart) {

        console.error(
            "Chart element not found"
        );

        return;

    }


    chart.innerHTML = "";


    /*
        No backend data =
        no bars.
    */

    if (
        !Array.isArray(dailyData) ||
        dailyData.length === 0
    ) {

        return;

    }


    /*
        Show every day returned by
        the backend.

        Backend currently returns up
        to 7 days.
    */

    dailyData
        .slice()
        .reverse()
        .forEach(
            day => {

                const present =
                    Number(day.present) || 0;


                const absent =
                    Number(day.absent) || 0;


                const late =
                    Number(day.late) || 0;


                /*
                    Use one consistent maximum
                    for all days.

                    This makes the bars comparable.
                */

                const maxValue =
                    Math.max(
                        10,
                        ...dailyData.map(
                            item => Math.max(
                                Number(item.present) || 0,
                                Number(item.absent) || 0,
                                Number(item.late) || 0
                            )
                        )
                    );


                const presentHeight =
                    Math.max(
                        0,
                        (present / maxValue) * 100
                    );


                const absentHeight =
                    Math.max(
                        0,
                        (absent / maxValue) * 100
                    );


                const lateHeight =
                    Math.max(
                        0,
                        (late / maxValue) * 100
                    );


                const dayLabel =
                    day.date ||
                    day.raw_date ||
                    "-";


                chart.innerHTML += `

                    <div class="day">

                        <div class="bars">

                            <div
                                class="bar present"
                                style="
                                    height:
                                    ${presentHeight}%;
                                "
                                title="
                                    Present: ${present}
                                "
                            ></div>


                            <div
                                class="bar absent"
                                style="
                                    height:
                                    ${absentHeight}%;
                                "
                                title="
                                    Absent: ${absent}
                                "
                            ></div>


                            <div
                                class="bar late"
                                style="
                                    height:
                                    ${lateHeight}%;
                                "
                                title="
                                    Late: ${late}
                                "
                            ></div>

                        </div>


                        <p>

                            ${dayLabel}

                        </p>

                    </div>

                `;

            }
        );

}


/*=====================================
    DAILY LOG TABLE
=====================================*/

function displayDailyLog(
    dailyData
) {

    const dailyLogBody =
        document.getElementById(
            "dailyLogBody"
        );


    if (!dailyLogBody) {

        console.error(
            "dailyLogBody not found"
        );

        return;

    }


    dailyLogBody.innerHTML = "";


    /*
        No backend data =
        no rows.
    */

    if (
        !Array.isArray(dailyData) ||
        dailyData.length === 0
    ) {

        return;

    }


    dailyData.forEach(
        day => {

            const present =
                Number(day.present) || 0;


            const absent =
                Number(day.absent) || 0;


            const late =
                Number(day.late) || 0;


            const total =
                present +
                absent +
                late;


            const attendanceRate =
                total > 0

                    ? (
                        (
                            (
                                present +
                                late
                            ) /
                            total
                        ) * 100

                    ).toFixed(1)

                    : "0.0";


            const dayLabel =
                day.date ||
                day.raw_date ||
                "-";


            dailyLogBody.innerHTML += `

                <tr
                    class="att-tablerow1"
                >

                    <td>

                        ${dayLabel}

                    </td>


                    <td
                        class="att-present"
                    >

                        ${present}

                    </td>


                    <td
                        class="att-absent"
                    >

                        ${absent}

                    </td>


                    <td
                        class="att-late"
                    >

                        ${late}

                    </td>


                    <td>

                        <div
                            class="progress"
                        >

                            <div
                                class="fill"
                                style="
                                    width:
                                    ${attendanceRate}%;
                                "
                            >
                            </div>

                        </div>


                        <span>

                            ${attendanceRate}%

                        </span>

                    </td>

                </tr>

            `;

        }
    );

}


/*=====================================
    FILTERS
=====================================*/

function applyAttendanceFilters() {

    const searchInput =
        document.getElementById(
            "attendanceSearchInput"
        );


    const dateFilter =
        document.getElementById(
            "attendanceDateFilter"
        );


    const statusFilter =
        document.getElementById(
            "attendanceStatusFilter"
        );


    const searchValue =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const dateValue =
        dateFilter
            ? dateFilter.value
            : "";


    const statusValue =
        statusFilter
            ? statusFilter.value
            : "All";


    const filteredEmployees =
        attendanceEmployees.filter(
            employee => {

                const name =
                    String(
                        employee.employee_name ||
                        ""
                    ).toLowerCase();


                const employeeId =
                    String(
                        employee.employee_id ||
                        ""
                    );


                const employeeDate =
                    employee.date
                        ? new Date(
                            employee.date
                        )
                            .toISOString()
                            .split("T")[0]

                        : "";


                const employeeStatus =
                    String(
                        employee.status ||
                        ""
                    );


                const matchesSearch =

                    name.includes(
                        searchValue
                    )

                    ||

                    employeeId.includes(
                        searchValue
                    );


                const matchesDate =

                    !dateValue ||

                    employeeDate ===
                    dateValue;


                const matchesStatus =

                    statusValue ===
                    "All"

                    ||

                    employeeStatus.toLowerCase() ===
                    statusValue.toLowerCase();


                return (

                    matchesSearch &&

                    matchesDate &&

                    matchesStatus

                );

            }
        );


    displayAttendanceTable(
        filteredEmployees
    );

}


/*=====================================
    INITIALISE PAGE
=====================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAttendanceTable();

        loadAttendanceStats();


        const searchInput =
            document.getElementById(
                "attendanceSearchInput"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                applyAttendanceFilters
            );

        }


        const dateFilter =
            document.getElementById(
                "attendanceDateFilter"
            );


        if (dateFilter) {

            dateFilter.addEventListener(
                "change",
                applyAttendanceFilters
            );

        }


        const statusFilter =
            document.getElementById(
                "attendanceStatusFilter"
            );


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                applyAttendanceFilters
            );

        }

    }
);