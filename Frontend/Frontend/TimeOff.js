const state = {
    requests: [],
    employees: []
};

// Calendar starts on the first month that contains leave requests
let currentMonth = new Date().getMonth();
let currentYear  = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
    setupSidebarControls();
    setupThemeToggle();
    setupCreateModal();
    loadTimeOffData();
});

function setupSidebarControls() {

    const menuToggle = document.getElementById("timeoffMenuToggle");
    const sidebar    = document.getElementById("timeoffSidebar");
    const overlay    = document.getElementById("timeoffSidebarOverlay");
    const closeBtn   = document.getElementById("timeoffSidebarClose");

    if (!menuToggle || !sidebar || !overlay || !closeBtn) return;

    menuToggle.addEventListener("click", () => {
        sidebar.classList.add("timeoff-sidebar--open");
        overlay.classList.add("timeoff-sidebar-overlay--visible");
        document.body.classList.add("timeoff-no-scroll");
    });

    function closeSidebar() {
        sidebar.classList.remove("timeoff-sidebar--open");
        overlay.classList.remove("timeoff-sidebar-overlay--visible");
        document.body.classList.remove("timeoff-no-scroll");
    }

    closeBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);
}

function setupThemeToggle() {

    const themeToggle = document.getElementById("darkModeToggle");

    if (!themeToggle || !window.HRTheme) return;

    window.HRTheme.syncThemeControls(
        window.HRTheme.getSavedTheme()
    );

    themeToggle.addEventListener("click", () => {
        window.HRTheme.toggleTheme();
    });

}

// ─── Load all Time Off data from MySQL via the API ────────────────────────────

async function loadTimeOffData() {

    try {

        // Load employees (for the create-request dropdown)
        const empRes = await fetch("http://localhost:3000/api/employees");
        if (empRes.ok) {
            state.employees = await empRes.json();
            populateEmployeeDropdown(state.employees);
        }

        const response = await fetch("http://localhost:3000/api/timeoff");

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const rows = await response.json();

        // Map each DB row — employee_name and department now come from the JOIN
        state.requests = rows.map(row => ({

            // request_id is the stable DB primary key; used for PATCH/DELETE calls
            id:            row.request_id,

            // Human-readable reference shown in the table "Ref" column
            ref:           "TOR-" + String(row.request_id).padStart(3, "0"),

            employeeId:    row.employee_id,

            // Real employee name and department from the SQL JOIN with employees table
            employeeName:  row.employee_name,
            department:    row.department,

            // Initials derived from the real name
            initials:      getInitials(row.employee_name),

            type:          row.leave_type,
            reason:        row.reason || "",
            fromDate:      row.start_date,
            toDate:        row.end_date,

            // Days is a derived convenience value (inclusive)
            days: Math.max(1,
                Math.round(
                    (new Date(row.end_date) - new Date(row.start_date)) /
                    (1000 * 60 * 60 * 24)
                ) + 1
            ),

            status: row.status
        }));

        // Automatically open on the month of the most-recent leave request (DESC order)
        if (state.requests.length > 0) {
            const first = new Date(state.requests[0].fromDate);
            if (!isNaN(first)) {
                currentMonth = first.getMonth();
                currentYear  = first.getFullYear();
            }
        }

    } catch (err) {
        console.error("loadTimeOffData:", err);
    }

    render();
    renderCalendar();

}

// ─── Render summary counters + requests table ─────────────────────────────────

function render() {

    const pendingCount = state.requests.filter(
        r => r.status.toLowerCase() === "pending"
    ).length;

    const approvedCount = state.requests.filter(
        r => r.status.toLowerCase() === "approved"
    ).length;

    // DB stores "Rejected" (sent by Deny PATCH), not "denied"
    const deniedCount = state.requests.filter(
        r => r.status.toLowerCase() === "rejected"
    ).length;

    document.getElementById("pendingCount").textContent  = pendingCount;
    document.getElementById("approvedCount").textContent = approvedCount;
    document.getElementById("deniedCount").textContent   = deniedCount;

    document.getElementById("timeoffHeaderSummary").textContent =
        `${pendingCount} pending review • ${state.requests.length} total requests`;

    renderRequests();

}

function renderRequests() {

    const tbody = document.getElementById("timeoffTableBody");

    if (!tbody) return;

    if (!state.requests.length) {

        tbody.innerHTML = `
        <tr>
            <td colspan="9" class="text-center py-4">
                No Leave Requests Found
            </td>
        </tr>
        `;

        return;

    }

    // Sort: Pending first, then Approved, then Rejected
    const statusOrder = {
        pending:  0,
        approved: 1,
        rejected: 2
    };

    const requests = [...state.requests].sort(
        (a, b) =>
            statusOrder[a.status.toLowerCase()] -
            statusOrder[b.status.toLowerCase()]
    );

    tbody.innerHTML = requests.map(request => `

<tr>

<td>${escapeHtml(request.ref)}</td>

<td>

<div class="timeoff-employee-cell">

<div
class="timeoff-avatar"
style="background:${getAvatarColor(request.employeeName)}">

${escapeHtml(request.initials)}

</div>

<div>

<div class="timeoff-employee-name">

${escapeHtml(request.employeeName)}

</div>

<div class="timeoff-muted-text">

${escapeHtml(request.department)}

</div>

</div>

</div>

</td>

<td>${escapeHtml(request.type)}</td>

<td>${formatDate(request.fromDate)}</td>

<td>${formatDate(request.toDate)}</td>

<td>${request.days}</td>

<td>${escapeHtml(request.reason)}</td>

<td>

<span class="timeoff-badge-status ${getStatusClass(request.status)}">

${escapeHtml(request.status)}

</span>

</td>

<td>

${request.status.toLowerCase() === "pending"

?

`

<button
class="timeoff-btn-approve"
data-id="${request.id}">

Approve

</button>

<button
class="timeoff-btn-deny"
data-id="${request.id}">

Deny

</button>

`

:

`

<button
class="timeoff-btn-revert"
data-id="${request.id}">

↩ Revert

</button>

`

}

</td>

</tr>

`).join("");

    // Approve button — PATCH status to Approved then reload from API
    document.querySelectorAll(".timeoff-btn-approve").forEach(btn => {

        btn.onclick = async () => {

            try {

                const res = await fetch(
                    `http://localhost:3000/api/timeoff/${btn.dataset.id}`,
                    {
                        method:  "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body:    JSON.stringify({ status: "Approved" })
                    }
                );

                if (!res.ok) {
                    const err = await res.json();
                    console.error("Approve failed:", err);
                    return;
                }

            } catch (err) {
                console.error("Approve error:", err);
                return;
            }

            await loadTimeOffData();

        };

    });

    // Deny button — PATCH status to Rejected then reload from API
    document.querySelectorAll(".timeoff-btn-deny").forEach(btn => {

        btn.onclick = async () => {

            try {

                const res = await fetch(
                    `http://localhost:3000/api/timeoff/${btn.dataset.id}`,
                    {
                        method:  "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body:    JSON.stringify({ status: "Rejected" })
                    }
                );

                if (!res.ok) {
                    const err = await res.json();
                    console.error("Deny failed:", err);
                    return;
                }

            } catch (err) {
                console.error("Deny error:", err);
                return;
            }

            await loadTimeOffData();

        };

    });

    // Revert button — PATCH status back to Pending then reload from API
    document.querySelectorAll(".timeoff-btn-revert").forEach(btn => {

        btn.onclick = async () => {

            try {

                const res = await fetch(
                    `http://localhost:3000/api/timeoff/${btn.dataset.id}`,
                    {
                        method:  "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body:    JSON.stringify({ status: "Pending" })
                    }
                );

                if (!res.ok) {
                    const err = await res.json();
                    console.error("Revert failed:", err);
                    return;
                }

            } catch (err) {
                console.error("Revert error:", err);
                return;
            }

            await loadTimeOffData();

        };

    });

}

// ─── Create-request modal ─────────────────────────────────────────────────────

function setupCreateModal() {

    const openBtn   = document.getElementById("openCreateRequestBtn");
    const modal     = document.getElementById("createRequestModal");
    const cancelBtn = document.getElementById("cancelCreateRequest");
    const form      = document.getElementById("createRequestForm");
    const errorDiv  = document.getElementById("createRequestError");

    if (!openBtn || !modal || !cancelBtn || !form) return;

    openBtn.addEventListener("click", () => {
        modal.classList.add("timeoff-modal--visible");
        if (errorDiv) errorDiv.textContent = "";
        form.reset();
    });

    cancelBtn.addEventListener("click", () => {
        modal.classList.remove("timeoff-modal--visible");
    });

    // Close on backdrop click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("timeoff-modal--visible");
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await submitCreateRequest(form, modal, errorDiv);
    });

}

function populateEmployeeDropdown(employees) {

    const select = document.getElementById("createEmpSelect");
    if (!select) return;

    // Keep the placeholder option, replace the rest
    select.innerHTML = `<option value="">— Select Employee —</option>`;

    employees.forEach(emp => {
        const option = document.createElement("option");
        option.value       = emp.employee_id;
        option.textContent = `${emp.name} (${emp.department})`;
        select.appendChild(option);
    });

}

async function submitCreateRequest(form, modal, errorDiv) {

    const employee_id = form.querySelector("#createEmpSelect").value;
    const leave_type  = form.querySelector("#createLeaveType").value;
    const start_date  = form.querySelector("#createStartDate").value;
    const end_date    = form.querySelector("#createEndDate").value;
    const reason      = form.querySelector("#createReason").value.trim();

    // Client-side validation before hitting the server
    if (!employee_id) {
        if (errorDiv) errorDiv.textContent = "Please select an employee.";
        return;
    }
    if (!leave_type) {
        if (errorDiv) errorDiv.textContent = "Please select a leave type.";
        return;
    }
    if (!start_date) {
        if (errorDiv) errorDiv.textContent = "Start date is required.";
        return;
    }
    if (!end_date) {
        if (errorDiv) errorDiv.textContent = "End date is required.";
        return;
    }
    if (new Date(end_date) < new Date(start_date)) {
        if (errorDiv) errorDiv.textContent = "End date cannot be before start date.";
        return;
    }

    const submitBtn = form.querySelector("#submitCreateRequest");
    if (submitBtn) submitBtn.disabled = true;

    try {

        const res = await fetch("http://localhost:3000/api/timeoff", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ employee_id, leave_type, start_date, end_date, reason: reason || null })
        });

        const data = await res.json();

        if (!res.ok) {
            if (errorDiv) errorDiv.textContent = data.error || "Failed to create request.";
            return;
        }

        // Success — close modal and reload data from MySQL
        modal.classList.remove("timeoff-modal--visible");
        await loadTimeOffData();

    } catch (err) {
        console.error("submitCreateRequest:", err);
        if (errorDiv) errorDiv.textContent = "Network error — please try again.";
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }

}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusClass(status) {

    status = (status || "").toLowerCase();

    if (status === "approved") return "timeoff-status-approved";
    // DB value is "rejected"; CSS class name is unchanged
    if (status === "rejected") return "timeoff-status-denied";

    return "timeoff-status-pending";

}

function getInitials(name) {

    return (name || "")
        .split(" ")
        .filter(Boolean)
        .map(word => word[0].toUpperCase())
        .slice(0, 2)
        .join("");

}

function getAvatarColor(name) {

    const colors = [
        "#0ea5e9",
        "#0284c7",
        "#6366f1",
        "#ca8a04",
        "#9333ea",
        "#d97706"
    ];

    let hash = 0;

    for (let i = 0; i < (name || "").length; i++) {
        hash += name.charCodeAt(i);
    }

    return colors[hash % colors.length];

}

function formatDate(value) {

    if (!value) return "-";

    // MySQL returns dates as "YYYY-MM-DD" strings; parse with local midnight to avoid UTC shift
    const parts = String(value).split("T")[0].split("-");
    if (parts.length === 3) {
        const d = new Date(
            parseInt(parts[0], 10),
            parseInt(parts[1], 10) - 1,
            parseInt(parts[2], 10)
        );
        return d.toLocaleDateString("en-ZA");
    }

    return new Date(value).toLocaleDateString("en-ZA");

}

function escapeHtml(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function renderCalendar() {

    const grid  = document.getElementById("calendarGrid");
    const title = document.getElementById("calendarTitle");

    if (!grid) return;

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    title.textContent = `${months[currentMonth]} ${currentYear} Leave Calendar`;

    grid.innerHTML = "";

    const firstDay  = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Empty leading cells
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-day empty";
        grid.appendChild(empty);
    }

    // One cell per day of the month
    for (let day = 1; day <= totalDays; day++) {

        const cell = document.createElement("div");
        cell.className = "calendar-day";

        const number = document.createElement("div");
        number.className = "day-number";
        number.textContent = day;
        cell.appendChild(number);

        // Build a Date for this cell at midnight local time to compare with request ranges
        const cellDate = new Date(currentYear, currentMonth, day);

        // Fixed: match every day in the inclusive [start_date, end_date] range, not just start_date
        const requests = state.requests.filter(request => {

            // Parse MySQL date strings as local-midnight dates to avoid UTC-offset shifts
            const parseLocalDate = (str) => {
                const p = String(str).split("T")[0].split("-");
                return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
            };

            const from = parseLocalDate(request.fromDate);
            const to   = parseLocalDate(request.toDate);

            return cellDate >= from && cellDate <= to;

        });

        if (requests.length) {

            const approved = requests.filter(r => r.status.toLowerCase() === "approved");
            const pending  = requests.filter(r => r.status.toLowerCase() === "pending");
            // DB stores "Rejected"; CSS class calendar-denied is unchanged
            const denied   = requests.filter(r => r.status.toLowerCase() === "rejected");

            if (approved.length) {
                cell.classList.add("calendar-approved");
            } else if (pending.length) {
                cell.classList.add("calendar-pending");
            } else if (denied.length) {
                cell.classList.add("calendar-denied");
            }

            const badge = document.createElement("div");
            badge.className = "leave-count";
            badge.textContent = requests.length;
            cell.appendChild(badge);

            const tooltip = document.createElement("div");
            tooltip.className = "calendar-tooltip";

            // Tooltip now uses the real employee name from the SQL JOIN
            tooltip.innerHTML = requests.map(r => `
                <strong>${escapeHtml(r.employeeName)}</strong><br>
                ${escapeHtml(r.status)}
            `).join("<hr>");

            cell.appendChild(tooltip);

        }

        grid.appendChild(cell);

    }

}