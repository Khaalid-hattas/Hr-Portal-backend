/*=====================================
    LOAD ATTENDANCE + LEAVE DATA
=====================================*/

let attendanceEmployees = [];

const attendanceTableBody =
    document.getElementById("attendanceTableBody");


Promise.all([
    fetch("http://localhost:3000/api/attendance"),
    fetch("http://localhost:3000/api/leave")
])

.then(async ([attendanceResponse, leaveResponse]) => {

    if (!attendanceResponse.ok) {
        throw new Error("Could not load attendance data");
    }

    if (!leaveResponse.ok) {
        throw new Error("Could not load leave data");
    }


    const attendanceData =
        await attendanceResponse.json();

    const leaveData =
        await leaveResponse.json();


    console.log("Attendance:", attendanceData);
    console.log("Leave:", leaveData);


    /*
    Combine the attendance records
    with the leave records.
    */

    attendanceEmployees = attendanceData.map(attendance => {

        const employeeLeaves = leaveData.filter(
            leave =>
                Number(leave.employee_id) ===
                Number(attendance.employee_id)
        );


        return {
            ...attendance,
            leaveRequests: employeeLeaves
        };

    });


    displayAttendanceTable(attendanceEmployees);

})


.catch(error => {

    console.error("Error loading data:", error);

    if (attendanceTableBody) {

        attendanceTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    Error loading attendance and leave data.
                </td>
            </tr>
        `;

    }

});


/*=====================================
    DISPLAY ATTENDANCE TABLE
=====================================*/
function displayAttendanceTable(employeeList) {

    if (!attendanceTableBody) {
        console.error("attendanceTableBody not found");
        return;
    }

    attendanceTableBody.innerHTML = "";

    if (!employeeList || employeeList.length === 0) {

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

        const employeeName =
            employee.employee_name || "Unknown";

        const employeeId =
            employee.employee_id || "-";

        const date =
            employee.date
                ? new Date(employee.date).toLocaleDateString()
                : "-";

        const attendanceStatus =
            employee.status || "-";


        /*
        Find ALL leave requests belonging
        to this employee.
        */

        const leaveRequests =
            employee.leaveRequests || [];


        /*
        Display all leave reasons
        belonging to this employee.
        */

        let leaveReason = "-";
        let leaveStatus = "-";


        if (leaveRequests.length > 0) {

            leaveReason = leaveRequests
                .map(leave => leave.reason)
                .join("<br>");


            leaveStatus = leaveRequests
                .map(leave => leave.status)
                .join("<br>");
        }


        /*
        Employee initials
        */

        const initials = employeeName
            .split(" ")
            .map(name => name.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();


        /*
        Attendance status styling
        */

        let attendanceClass = "";

        if (
            attendanceStatus.toLowerCase() === "present"
        ) {

            attendanceClass = "attendance-present";

        } else if (
            attendanceStatus.toLowerCase() === "absent"
        ) {

            attendanceClass = "attendance-absent";

        } else if (
            attendanceStatus.toLowerCase() === "late"
        ) {

            attendanceClass = "attendance-pending";
        }


        /*
        Leave status styling
        */

        let leaveClass = "";

        if (
            leaveStatus.toLowerCase().includes("approved")
        ) {

            leaveClass = "attendance-present";

        } else if (
            leaveStatus.toLowerCase().includes("denied")
        ) {

            leaveClass = "attendance-absent";

        } else if (
            leaveStatus.toLowerCase().includes("pending")
        ) {

            leaveClass = "attendance-pending";
        }


        /*
        Create table row
        */

        attendanceTableBody.innerHTML += `

            <tr>

                <!-- Employee -->

                <td>

                    <div
                        class="attendance-employee"
                        onclick="showAttendanceHistory(${employeeId})"
                    >

                        <div class="attendance-avatar">
                            ${initials}
                        </div>

                        <div>

                            <div class="attendance-name">
                                ${employeeName}
                            </div>

                            <div class="attendance-subtitle">
                                Employee
                            </div>

                        </div>

                    </div>

                </td>


                <!-- Employee ID -->

                <td>
                    EMP-${String(employeeId).padStart(3, "0")}
                </td>


                <!-- Date -->

                <td>
                    ${date}
                </td>


                <!-- Attendance -->

                <td>

                    <span
                        class="attendance-status ${attendanceClass}"
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
                        class="attendance-status ${leaveClass}"
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

function showAttendanceHistory(employeeId) {

    const employeeRecords =
        attendanceEmployees.filter(
            employee =>
                Number(employee.employee_id) === Number(employeeId)
        );


    if (employeeRecords.length === 0) {
        return;
    }


    const employeeName =
        employeeRecords[0].employee_name || "Employee";


    const employeeNameElement =
        document.getElementById("attendanceEmployeeName");


    if (employeeNameElement) {

        employeeNameElement.innerHTML =
            employeeName + " - Recent";

    }


    const body =
        document.getElementById("attendanceHistoryBody");


    if (!body) {
        return;
    }


    body.innerHTML = "";


    employeeRecords.forEach(record => {

        let attendanceClass = "";

        if (record.status === "Present") {
            attendanceClass = "attendance-present";
        }
        else if (record.status === "Absent") {
            attendanceClass = "attendance-absent";
        }
        else if (record.status === "Late") {
            attendanceClass = "attendance-pending";
        }


        body.innerHTML += `

        <tr>

            <td>
                ${record.date || "-"}
            </td>

            <td>

                <span class="attendance-status ${attendanceClass}">
                    ${record.status || "-"}
                </span>

            </td>

        </tr>

        `;

    });


    const modal =
        document.getElementById("attendanceHistoryModal");


    if (modal) {
        modal.style.display = "flex";
    }

}


/*=====================================
    CLOSE ATTENDANCE HISTORY
=====================================*/

function closeAttendanceHistory() {

    const modal =
        document.getElementById("attendanceHistoryModal");


    if (modal) {
        modal.style.display = "none";
    }

}


/*=====================================
    DARK MODE
=====================================*/

document.addEventListener("DOMContentLoaded", function () {

    const themeToggle =
        document.getElementById("darkModeToggle");

    const toggleText =
        document.getElementById("toggleText");


    const isDarkMode =
        localStorage.getItem("darkMode") === "true";


    if (isDarkMode) {

        document.body.classList.add("dark-mode");

        if (themeToggle) {
            themeToggle.classList.add("dark-mode");
        }

        if (toggleText) {
            toggleText.textContent = "Light Mode";
        }

    }


    if (themeToggle) {

        themeToggle.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            themeToggle.classList.toggle("dark-mode");


            const isDark =
                document.body.classList.contains("dark-mode");


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

        });

    }

});


/*=====================================
    UNIFIED DARK MODE TOGGLE
=====================================*/

const darkModeToggle =
    document.getElementById("darkModeToggle");


if (window.HRTheme) {

    window.HRTheme.syncThemeControls(
        window.HRTheme.getSavedTheme()
    );

}


if (darkModeToggle) {

    darkModeToggle.addEventListener("click", () => {

        if (window.HRTheme) {

            window.HRTheme.toggleTheme();

        }

    });

}





/*=====================================
    LOAD ATTENDANCE STATISTICS
=====================================*/

async function loadAttendanceStats() {
    try {
        const response = await fetch(
            "http://localhost:3000/api/attendance/stats"
        );

        if (!response.ok) {
            throw new Error("Could not load attendance statistics");
        }

        const data = await response.json();

        displayAttendanceCards(data.cards);
        displayAttendanceChart(data.daily);
        displayDailyLog(data.daily);

    } catch (error) {
        console.error(
            "Error loading attendance statistics:",
            error
        );
    }
}


/*=====================================
    DISPLAY CARDS
=====================================*/

function displayAttendanceCards(cards) {

    const avgPresent =
        document.getElementById("avgPresent");

    const avgAbsent =
        document.getElementById("avgAbsent");

    const lateArrivals =
        document.getElementById("lateArrivals");


    if (avgPresent) {
        avgPresent.textContent =
            cards.avgPresent || 0;
    }

    if (avgAbsent) {
        avgAbsent.textContent =
            cards.avgAbsent || 0;
    }

    if (lateArrivals) {
        lateArrivals.textContent =
            cards.lateArrivals || 0;
    }
}


/*=====================================
    DISPLAY CHART
=====================================*/

function displayAttendanceChart(dailyData) {

    const chart =
        document.getElementById("attendanceChart");

    if (!chart) {
        return;
    }

    chart.innerHTML = "";


    dailyData.forEach(day => {

        const total =
            Number(day.present) +
            Number(day.absent) +
            Number(day.late);

        if (total === 0) {
            return;
        }


        const presentHeight =
            (Number(day.present) / total) * 100;

        const absentHeight =
            (Number(day.absent) / total) * 100;

        const lateHeight =
            (Number(day.late) / total) * 100;


        chart.innerHTML += `

            <div class="day">

                <div class="bars">

                    <div
                        class="bar present"
                        style="height: ${presentHeight}%"
                    ></div>

                    <div
                        class="bar absent"
                        style="height: ${absentHeight}%"
                    ></div>

                    <div
                        class="bar late"
                        style="height: ${lateHeight}%"
                    ></div>

                </div>

                <p>${day.date}</p>

            </div>

        `;
    });
}


/*=====================================
    DISPLAY DAILY LOG
=====================================*/

function displayDailyLog(dailyData) {

    const dailyLogBody =
        document.getElementById("dailyLogBody");

    if (!dailyLogBody) {
        return;
    }

    dailyLogBody.innerHTML = "";


    dailyData.forEach(day => {

        const present =
            Number(day.present);

        const absent =
            Number(day.absent);

        const late =
            Number(day.late);

        const total =
            present + absent + late;


        const attendanceRate =
            total > 0
                ? (((present + late) / total) * 100)
                    .toFixed(1)
                : 0;


        dailyLogBody.innerHTML += `

            <tr class="att-tablerow1">

                <td>${day.date}</td>

                <td class="att-present">
                    ${present}
                </td>

                <td class="att-absent">
                    ${absent}
                </td>

                <td class="att-late">
                    ${late}
                </td>

                <td>

                    <div class="progress">

                        <div
                            class="fill"
                            style="width: ${attendanceRate}%"
                        ></div>

                    </div>

                    <span>
                        ${attendanceRate}%
                    </span>

                </td>

            </tr>

        `;
    });
}


/*=====================================
    LOAD STATS WHEN PAGE OPENS
=====================================*/

document.addEventListener(
    "DOMContentLoaded",
    loadAttendanceStats
);