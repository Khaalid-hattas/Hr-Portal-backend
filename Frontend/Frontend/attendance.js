/*=====================================
    ATTENDANCE VARIABLES
=====================================*/

let attendanceEmployees = [];

const attendanceTableBody =
    document.getElementById("attendanceTableBody");


/*=====================================
    LOAD ATTENDANCE TABLE
=====================================*/

async function loadAttendanceTable() {

    try {

        const attendanceResponse =
            await fetch("http://localhost:3000/api/attendance");


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


        /*
        Try to load leave data.

        If leave fails, the attendance table
        will still work.
        */

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


        /*
        Combine attendance and leave data
        */

        attendanceEmployees =
            attendanceData.map(attendance => {


                const employeeLeaves =
                    leaveData.filter(leave =>

                        Number(leave.employee_id) ===
                        Number(attendance.employee_id)

                    );


                return {

                    ...attendance,

                    leaveRequests:
                        employeeLeaves

                };

            });


        /*
        Display table
        */

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

function displayAttendanceTable(employeeList) {


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


    employeeList.forEach(employee => {


        /*=====================================
            EMPLOYEE INFORMATION
        =====================================*/

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
                            leave.reason || "-"
                    )
                    .join("<br>");


            leaveStatus =
                leaveRequests
                    .map(
                        leave =>
                            leave.status || "-"
                    )
                    .join("<br>");

        }


        /*=====================================
            EMPLOYEE INITIALS
        =====================================*/

        const initials = employeeName

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


                <!-- Employee -->

                <td>

                    <div
                        class="attendance-employee"
                        onclick="showAttendanceHistory(
                            ${employeeId}
                        )"
                    >

                        <div class="attendance-avatar">

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


                <!-- Employee ID -->

                <td>

                    EMP-${String(
                        employeeId
                    ).padStart(3, "0")}

                </td>


                <!-- Date -->

                <td>

                    ${date}

                </td>


                <!-- Attendance -->

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


                <!-- Leave Reason -->

                <td>

                    ${leaveReason}

                </td>


                <!-- Leave Status -->

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

    });

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

                        ${
                            record.date ||
                            "-"
                        }

                    </td>


                    <td>

                        <span
                            class="
                                attendance-status
                                ${attendanceClass}
                            "
                        >

                            ${
                                record.status ||
                                "-"
                            }

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

    const chart = document.querySelector(
        ".attendance-chart-card .chart"
    );

    // Clear chart immediately
    if (chart) {
        chart.innerHTML = "";
    }

    try {

        const response = await fetch(
            "http://localhost:3000/api/attendance/stats"
        );

        if (!response.ok) {
            throw new Error("Backend unavailable");
        }

        const data = await response.json();

        // Cards stay connected
        displayAttendanceCards(data.cards || {});

        // Chart gets backend data
        displayAttendanceChart(data.daily || []);

    } catch (error) {

        console.error(
            "Attendance backend unavailable:",
            error
        );

        // Backend is OFF → remove everything
        if (chart) {
            chart.innerHTML = "";
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

function displayAttendanceChart(dailyData) {

    const chart = document.querySelector(
        ".attendance-chart-card .chart"
    );

    if (!chart) {
        return;
    }

    // Always clear the chart first
    chart.innerHTML = "";

    // No backend data = no bars
    if (!dailyData || dailyData.length === 0) {
        return;
    }

    dailyData.forEach(day => {

        const present = Number(day.present) || 0;
        const absent = Number(day.absent) || 0;
        const late = Number(day.late) || 0;

        const total = present + absent + late;

        if (total === 0) {
            return;
        }

        const presentHeight =
            (present / total) * 100;

        const absentHeight =
            (absent / total) * 100;

        const lateHeight =
            (late / total) * 100;

        chart.innerHTML += `
            <div class="day">

                <div class="bars">

                    <div
                        class="bar present"
                        style="height:${presentHeight}%"
                    ></div>

                    <div
                        class="bar absent"
                        style="height:${absentHeight}%"
                    ></div>

                    <div
                        class="bar late"
                        style="height:${lateHeight}%"
                    ></div>

                </div>

                <p>${day.date}</p>

            </div>
        `;
    });
}
/*=====================================
    BOTTOM TABLE
=====================================*/

function displayDailyLog(
    dailyData
) {


    /*
    IMPORTANT:

    If your bottom table doesn't have
    id="dailyLogBody", nothing happens.

    Therefore your existing bottom table
    remains untouched.
    */

    const dailyLogBody =
        document.getElementById(
            "dailyLogBody"
        );


    if (!dailyLogBody) {

        return;

    }


    dailyLogBody.innerHTML = "";


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

                    : 0;


            dailyLogBody.innerHTML += `

                <tr
                    class="att-tablerow1"
                >

                    <td>

                        ${day.date}

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
    DARK MODE
=====================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const themeToggle =
            document.getElementById(
                "darkModeToggle"
            );


        const toggleText =
            document.getElementById(
                "toggleText"
            );


        const isDarkMode =
            localStorage.getItem(
                "darkMode"
            ) === "true";


        if (isDarkMode) {

            document.body.classList.add(
                "dark-mode"
            );


            if (themeToggle) {

                themeToggle.classList.add(
                    "dark-mode"
                );

            }


            if (toggleText) {

                toggleText.textContent =
                    "Light Mode";

            }

        }


        if (themeToggle) {


            themeToggle.addEventListener(
                "click",
                function () {


                    document.body.classList.toggle(
                        "dark-mode"
                    );


                    themeToggle.classList.toggle(
                        "dark-mode"
                    );


                    const isDark =
                        document.body.classList.contains(
                            "dark-mode"
                        );


                    localStorage.setItem(
                        "darkMode",
                        isDark
                    );


                    if (toggleText) {

                        toggleText.textContent =
                            isDark
                                ? "Light Mode"
                                : "Dark Mode";

                    }

                }

            );

        }

    }

);


/*=====================================
    START EVERYTHING
=====================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /*
        Load employee attendance table
        */

        loadAttendanceTable();


        /*
        Load cards + chart
        */

        loadAttendanceStats();

    }
);