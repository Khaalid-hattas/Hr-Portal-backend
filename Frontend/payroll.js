// NO hardcoded data - ONLY uses the database API.

let currentemployee = null;
const API_BASE_URL = "https://app-2b50813e-61a2-41f7-beb4-a39824980e68.cleverapps.io";

// ============================================================
// CONNECTION BANNER FUNCTIONS
// ============================================================

function showConnectionBanner() {
    const existingBanner = document.querySelector(".server-connection-banner");
    if (existingBanner) existingBanner.remove();

    const banner = document.createElement("div");
    banner.className = "server-connection-banner alert alert-warning text-center";
    banner.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        z-index: 9999;
        margin: 0;
        border-radius: 0;
        padding: 15px 20px;
        background-color: #ffc107;
        color: #856404;
        border-bottom: 3px solid #ff9800;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        animation: slideDown 0.3s ease-out;
    `;

    banner.innerHTML = `
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        <strong>Connecting to server...</strong>
        <span class="ms-2">Please ensure the backend server is running on http://localhost:3000</span>
        <button class="btn btn-sm btn-outline-dark ms-3" onclick="location.reload()">
            <i class="bi bi-arrow-clockwise"></i> Retry
        </button>
    `;

    document.body.prepend(banner);
    hideAllContent();
}

function removeConnectionBanner() {
    const banner = document.querySelector(".server-connection-banner");
    if (banner) banner.remove();
    showAllContent();
}

// ============================================================
// HIDE ALL CONTENT - ONLY NAVBAR + BANNER REMAIN
// ============================================================

function hideAllContent() {
    // Hide main container
    const mainContent = document.querySelector(".payroll-container");
    if (mainContent) {
        mainContent.style.display = "none";
    }
    
    // Hide header (title and date)
    const payrollHeader = document.querySelector(".payroll-header");
    if (payrollHeader) {
        payrollHeader.style.display = "none";
    }
    
    // Hide cards
    const rowCards = document.querySelector(".row-cards");
    if (rowCards) {
        rowCards.style.display = "none";
    }
    
    // Hide table
    const payrollTable = document.querySelector(".payroll-table");
    if (payrollTable) {
        payrollTable.style.display = "none";
    }
    
    // Hide payslip card (if on payslip page)
    const payslipCard = document.getElementById("prPayslipCard");
    if (payslipCard) {
        payslipCard.style.display = "none";
    }
    
    // Hide loading spinner (if on payslip page)
    const loadingState = document.getElementById("prLoadingState");
    if (loadingState) {
        loadingState.style.display = "none";
    }
    
    // Clear any error messages
    const errorContainer = document.getElementById("prErrorContainer");
    if (errorContainer) {
        errorContainer.innerHTML = "";
    }
}

function showAllContent() {
    // Show main container
    const mainContent = document.querySelector(".payroll-container");
    if (mainContent) {
        mainContent.style.display = "block";
    }
    
    // Show header
    const payrollHeader = document.querySelector(".payroll-header");
    if (payrollHeader) {
        payrollHeader.style.display = "flex";
    }
    
    // Show cards
    const rowCards = document.querySelector(".row-cards");
    if (rowCards) {
        rowCards.style.display = "flex";
    }
    
    // Show table
    const payrollTable = document.querySelector(".payroll-table");
    if (payrollTable) {
        payrollTable.style.display = "block";
    }
}

// ============================================================
// FETCH PAYROLL DATA FROM API
// ============================================================

async function loadPayrollData() {
    const payslipCard = document.getElementById("prPayslipCard");

    if (payslipCard) {
        await loadSingleEmployeePayslip();
        return;
    }

    await loadAllPayrollData();
}

// ============================================================
// FETCH ALL PAYROLL DATA (Payroll Page)
// ============================================================

async function loadAllPayrollData() {
    try {
        console.log("Fetching all payroll data from server...");
        const response = await fetch(`${API_BASE_URL}/payroll`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(3000),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Payroll data fetched successfully:", data);

        const transformedData = data.map((item) => ({
            employeeId: item.employee_id,
            name: item.name,
            position: item.position,
            basicSalary: Number(item.base_salary || item.salary || 0),
            hoursWorked: Number(item.hours_worked || 0),
            leaveDeductions: Number(item.leave_deductions || 0),
            finalSalary: Number(item.final_salary || 0),
        }));

        removeConnectionBanner();
        renderPayrollTable(transformedData);
        updatePayrollCards(transformedData);
        
    } catch (error) {
        console.log("Server connection error:", error.message);
        // Show banner and hide ALL content
        showConnectionBanner();
    }
}

// ============================================================
// FETCH SINGLE EMPLOYEE PAYSLIP (Payslip Page)
// ============================================================

async function loadSingleEmployeePayslip() {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get("id");

    if (!employeeId) {
        prShowError("No employee ID provided in the URL.");
        return;
    }

    try {
        console.log(`Fetching payslip for employee ${employeeId}...`);

        const response = await fetch(`${API_BASE_URL}/payroll/${employeeId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(3000),
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Employee not found.");
            }
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Payslip data fetched successfully:", data);

        const employee = {
            employeeId: data.employee_id,
            name: data.name,
            position: data.position,
            basicSalary: Number(data.base_salary || data.salary || 0),
            hoursWorked: Number(data.hours_worked || 0),
            leaveDeductions: Number(data.leave_deductions || 0),
            finalSalary: Number(data.final_salary || 0),
        };

        removeConnectionBanner();
        prShowPayslip(employee);
        
    } catch (error) {
        console.log("Server connection error:", error.message);
        // Show banner and hide ALL content
        showConnectionBanner();
    }
}

// ============================================================
// PAYROLL TABLE RENDERING
// ============================================================

function formatCurrency(value) {
    return "R " + Number(value).toLocaleString("en-ZA", { minimumFractionDigits: 0 });
}

function updatePayrollCards(payrollData) {
    const grossValue = payrollData.reduce(
        (sum, item) => sum + Number(item.basicSalary || 0),
        0,
    );
    
    const netValue = payrollData.reduce(
        (sum, item) => sum + Number(item.finalSalary || 0),
        0,
    );

    // leaveDeductions contains leave hours/days, not a currency amount.
    // The monetary deduction is the difference between gross and net pay.
    const deductionsValue = Math.max(0, grossValue - netValue);

    const grossElement = document.getElementById("grossPayrollValue");
    const deductionsElement = document.getElementById("deductionsPayrollValue");
    const netElement = document.getElementById("netPayrollValue");

    if (grossElement) grossElement.textContent = formatCurrency(grossValue);
    if (deductionsElement) deductionsElement.textContent = formatCurrency(deductionsValue);
    if (netElement) netElement.textContent = formatCurrency(netValue);
}

function renderPayrollTable(payrollData) {
    const tbody = document.getElementById("payrollTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    payrollData.forEach((payrollItem) => {
        const salary = Number(payrollItem.basicSalary) || 0;
        const hours = Number(payrollItem.hoursWorked) || 0;
        const leaveDeductions = Number(payrollItem.leaveDeductions) || 0;
        const net = Number(payrollItem.finalSalary) || 0;

        const payslipLink = `payslip.html?id=${payrollItem.employeeId}`;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${payrollItem.name}</td>
            <td>${payrollItem.position}</td>
            <td>${formatCurrency(salary)}</td>
            <td>${hours}</td>
            <td>${leaveDeductions}</td>
            <td>${formatCurrency(net)}</td>
            <td><a href="${payslipLink}" class="btn btn-sm btn-outline-primary">Generate</a></td>
        `;
        tbody.appendChild(row);
    });
}

// ============================================================
// FUNCTIONS FOR PAYSLIP.HTML
// ============================================================

function prShowPayslip(employee) {
    // HIDE the loading spinner - THIS WAS COMMENTED OUT IN YOUR CODE
    const loadingState = document.getElementById("prLoadingState");
    if (loadingState) {
        loadingState.style.display = "none";
    }
    
    currentemployee = employee;
    const card = document.getElementById("prPayslipCard");
    if (!card) return;

    const baseSalary = Number(employee.basicSalary) || 0;
    const finalSalary = Number(employee.finalSalary) || 0;
    const leaveDeductions = Number(employee.leaveDeductions) || 0;
    const hoursWorked = Number(employee.hoursWorked) || 0;

    document.getElementById("prDisplayEmployeeId").textContent = employee.employeeId;
    document.getElementById("prDisplayHoursWorked").textContent = hoursWorked + " hours";
    document.getElementById("prDisplayLeaveDeductions").textContent = leaveDeductions + " hours";
    document.getElementById("prDisplayBaseSalary").textContent = formatCurrency(baseSalary);
    document.getElementById("prDisplayFinalSalary").textContent = formatCurrency(finalSalary);
    document.getElementById("prDisplayGeneratedDate").textContent = new Date().toLocaleString("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    card.dataset.employeeId = employee.employeeId;
    card.style.display = "block";
}

function prShowError(message) {
    // Hide loading spinner
    const loadingState = document.getElementById("prLoadingState");
    if (loadingState) {
        loadingState.style.display = "none";
    }
    
    // Hide payslip card
    const card = document.getElementById("prPayslipCard");
    if (card) {
        card.style.display = "none";
    }
    
    const container = document.getElementById("prErrorContainer") || document.body;
    const existingErrors = container.querySelectorAll(".alert");
    existingErrors.forEach((el) => el.remove());

    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger";
    errorDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>${message}`;
    container.prepend(errorDiv);
}

// ============================================================
// PDF GENERATION
// ============================================================

async function prDownloadPayslip() {
    if (!currentemployee) {
        alert("No payslip to download! Please generate a payslip first.");
        return;
    }

    const downloadBtn = document.getElementById("prDownloadBtn");
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = "Generating...";
    downloadBtn.disabled = true;

    try {
        const emp = currentemployee;
        const date = new Date().toLocaleString("en-ZA", {
            dateStyle: "medium",
            timeStyle: "short",
        });

        const baseSalary = formatCurrency(Number(emp.basicSalary) || 0);
        const finalSalary = formatCurrency(Number(emp.finalSalary) || 0);

        const printWindow = window.open("", "_blank", "width=800,height=600");

        if (!printWindow) {
            alert("Please allow popups for this site to download the payslip.");
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payslip - ${emp.name}</title>
                <style>
                    body {
                        font-family: Arial, Helvetica, sans-serif;
                        margin: 0;
                        padding: 40px;
                        background: #f5f5f5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    .payslip {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 40px;
                        background: #ffffff;
                        border: 2px solid #0b1a33;
                        border-radius: 8px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        border-bottom: 3px solid #0b1a33;
                        padding-bottom: 20px;
                        margin-bottom: 25px;
                    }
                    .header h1 {
                        color: #0b1a33;
                        font-size: 28px;
                        font-weight: 700;
                        letter-spacing: 2px;
                        margin: 0;
                    }
                    .header p {
                        color: #4a5b72;
                        font-size: 14px;
                        margin: 5px 0 0 0;
                        letter-spacing: 4px;
                    }
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 15px;
                    }
                    .info-row .label {
                        font-size: 12px;
                        color: #68768a;
                        margin: 0 0 3px 0;
                        font-weight: 600;
                    }
                    .info-row .value {
                        font-size: 18px;
                        font-weight: 700;
                        color: #0b1a33;
                        margin: 0;
                    }
                    .position-section {
                        margin-bottom: 20px;
                    }
                    .position-section .label {
                        font-size: 12px;
                        color: #68768a;
                        margin: 0 0 3px 0;
                        font-weight: 600;
                    }
                    .position-section .value {
                        font-size: 16px;
                        font-weight: 500;
                        color: #1f2a3f;
                        margin: 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 14px;
                        margin-top: 5px;
                    }
                    table tr {
                        border-bottom: 1px solid #eef2f7;
                    }
                    table td {
                        padding: 10px 6px;
                    }
                    table td:first-child {
                        color: #4a5b72;
                        font-weight: 500;
                    }
                    table td:last-child {
                        text-align: right;
                        font-weight: 600;
                        color: #0b1a33;
                    }
                    .total-row {
                        border-top: 3px solid #0b1a33 !important;
                        background: #f8faff;
                    }
                    .total-row td {
                        padding: 14px 6px;
                    }
                    .total-row td:first-child {
                        font-weight: 700;
                        color: #0b1a33;
                        font-size: 16px;
                    }
                    .total-row td:last-child {
                        font-weight: 700;
                        color: #1f7b4d;
                        font-size: 18px;
                    }
                    .footer {
                        margin-top: 25px;
                        padding-top: 15px;
                        border-top: 2px solid #eef2f7;
                        text-align: center;
                    }
                    .footer p {
                        font-size: 12px;
                        color: #a0b0c4;
                        margin: 0;
                    }
                    .footer .sub {
                        font-size: 11px;
                        color: #b8c4d4;
                        margin: 4px 0 0 0;
                    }
                    @media print {
                        body { background: white; padding: 20px; }
                        .payslip { border: 2px solid #0b1a33; box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                <div class="payslip">
                    <div class="header">
                        <h1>MODERNTECH</h1>
                        <p>PAYSLIP</p>
                    </div>

                    <div class="info-row">
                        <div>
                            <div class="label">EMPLOYEE ID</div>
                            <div class="value">${emp.employeeId}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="label">EMPLOYEE NAME</div>
                            <div class="value">${emp.name}</div>
                        </div>
                    </div>

                    <div class="position-section">
                        <div class="label">POSITION</div>
                        <div class="value">${emp.position}</div>
                    </div>

                    <table>
                        <tr>
                            <td>Hours Worked</td>
                            <td>${emp.hoursWorked} hours</td>
                        </tr>
                        <tr>
                            <td>Leave Deductions</td>
                            <td>${emp.leaveDeductions} hours</td>
                        </tr>
                        <tr>
                            <td>Base Salary</td>
                            <td>${baseSalary}</td>
                        </tr>
                        <tr class="total-row">
                            <td>FINAL SALARY</td>
                            <td>${finalSalary}</td>
                        </tr>
                    </table>

                    <div class="footer">
                        <p>Generated: ${date}</p>
                        <p class="sub">ModernTech HR Portal</p>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() { window.close(); }, 1000);
                    };
                <\/script>
            </body>
            </html>
        `);

        printWindow.document.close();
    } catch (error) {
        alert("Error generating payslip: " + error.message);
    }

    downloadBtn.innerHTML = originalText;
    downloadBtn.disabled = false;
}

// ============================================================
// DARK MODE TOGGLE
// ============================================================

function setupDarkModeToggle() {
    const themeToggle = document.getElementById("darkModeToggle");
    const toggleText = document.getElementById("toggleText");
    const isDarkMode = localStorage.getItem("darkMode") === "true";

    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        if (themeToggle) themeToggle.classList.add("dark-mode");
        if (toggleText) toggleText.textContent = "Light Mode";
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            themeToggle.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            localStorage.setItem("darkMode", isDark);
            if (toggleText) {
                toggleText.textContent = isDark ? "Light Mode" : "Dark Mode";
            }
        });
    }
}

function setupDownloadButton() {
    const downloadBtn = document.getElementById("prDownloadBtn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", prDownloadPayslip);
    }
}

// ============================================================
// AUTO-RETRY CONNECTION
// ============================================================

function setupAutoRetry() {
    setInterval(async () => {
        const banner = document.querySelector(".server-connection-banner");
        if (banner) {
            try {
                const response = await fetch(`${API_BASE_URL}/payroll`, {
                    method: "GET",
                    signal: AbortSignal.timeout(2000),
                });
                if (response.ok) {
                    console.log("Server is back. Refreshing...");
                    location.reload();
                }
            } catch (error) {
                console.log("Server still unavailable...");
            }
        }
    }, 30000);
}

// ============================================================
// PAGE INITIALIZATION
// ============================================================

function initPage() {
    setupDarkModeToggle();
    loadPayrollData();
    setupDownloadButton();
    setupAutoRetry();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
} else {
    initPage();
}
