const API_BASE_URL = "http://localhost:3000/api";

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderDepartmentData(departments) {
    const labels = departments.map((item) => item.department);
    const values = departments.map((item) => Number(item.total || 0));
    const colors = ['#3B82F6', '#06B6D4', '#A855F7', '#F59E0B', '#10B981', '#EF4444', '#64748B'];
    const list = document.getElementById('departmentListContainer');
    if (list) {
        list.innerHTML = departments.map((item, index) => `
            <div class="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                <span class="d-flex align-items-center gap-2"><span class="dot" style="background-color: ${colors[index % colors.length]}"></span> ${escapeHtml(item.department)}</span>
                <span class="fw-semibold">${Number(item.total || 0)}</span>
            </div>`).join('');
    }

    const canvas = document.getElementById('departmentChart');
    if (!canvas) return;
    new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: { labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 0, weight: 0.5 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }
    });
}

function renderAttendanceChart(dailyAttendance) {
    const canvas = document.getElementById('attendanceChart');
    if (!canvas) return;
    new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: dailyAttendance.map((row) => row.date),
            datasets: [
                { label: 'Present', data: dailyAttendance.map((row) => Number(row.present || 0)), backgroundColor: '#3B82F6', barThickness: 8, borderRadius: 4 },
                { label: 'Absent', data: dailyAttendance.map((row) => Number(row.absent || 0)), backgroundColor: '#F59E0B', barThickness: 4, borderRadius: 2 },
                { label: 'Late', data: dailyAttendance.map(() => 0), backgroundColor: '#EF4444', barThickness: 4, borderRadius: 2 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { beginAtZero: true, ticks: { font: { size: 10 } }, grid: { borderDash: [4, 4] } } } }
    });
}

function renderLeaveRequests(leaves) {
    const container = document.getElementById('leaveRequestsContainer');
    if (!container) return;
    container.innerHTML = leaves.map((leave) => {
        const status = String(leave.status || '').toLowerCase();
        return `<div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-3">
                <div class="avatar-circle">${escapeHtml(String(leave.name || '').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase())}</div>
                <div><h6 class="fw-bold mb-0 text-body">${escapeHtml(leave.name)}</h6><small class="text-muted">${escapeHtml(leave.reason)} · ${escapeHtml(leave.date)}</small></div>
            </div><span class="status-badge status-${status}">${escapeHtml(leave.status)}</span>
        </div>`;
    }).join('');
}

async function loadDashboardData() {
    try {
        const [statsResponse, attendanceResponse, leavesResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/dashboard/stats`),
            fetch(`${API_BASE_URL}/dashboard/attendance`),
            fetch(`${API_BASE_URL}/dashboard/leaves`)
        ]);
        if (!statsResponse.ok || !attendanceResponse.ok || !leavesResponse.ok) throw new Error('Dashboard request failed');

        const statsResult = await statsResponse.json();
        const attendanceResult = await attendanceResponse.json();
        const leavesResult = await leavesResponse.json();
        const summary = statsResult.data?.summary || {};
        const attendance = attendanceResult.data || {};
        const present = Number(attendance.summary?.present || 0);
        const absent = Number(attendance.summary?.absent || 0);
        const attendanceTotal = present + absent;

        const totalEmployeesEl = document.getElementById('totalEmployeesValue');
        const monthlyPayrollEl = document.getElementById('monthlyPayrollValue');
        const openLeaveEl = document.getElementById('openLeaveValue');
        const attendanceEl = document.getElementById('attendanceValue');
        if (totalEmployeesEl) totalEmployeesEl.textContent = Number(summary.totalEmployees || 0);
        if (monthlyPayrollEl) monthlyPayrollEl.textContent = `R ${(Number(summary.totalPayroll || 0) / 1000000).toFixed(2)}M`;
        if (openLeaveEl) openLeaveEl.textContent = Number(summary.pendingLeaves || 0);
        if (attendanceEl) attendanceEl.textContent = `${attendanceTotal ? ((present / attendanceTotal) * 100).toFixed(1) : '0.0'}%`;
        renderAttendanceChart(attendance.dailyAttendance || []);
        renderDepartmentData(statsResult.data?.departments || []);
        renderLeaveRequests(leavesResult.data?.recentLeaves || []);
    } catch (error) {
        console.error('Dashboard API load failed:', error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const ctxPayroll = document.getElementById('payrollChart')?.getContext('2d');
    if (ctxPayroll) {
        new Chart(ctxPayroll, {
            type: 'line',
            data: {
                labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{ data: [1820, 1845, 1860, 1878, 1890, 1910], borderColor: '#3B82F6', backgroundColor: '#3B82F6', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#3B82F6', tension: 0.3 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { min: 1800, max: 1950, ticks: { stepSize: 40 }, grid: { borderDash: [4, 4] } } } }
        });
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (window.HRTheme) window.HRTheme.syncThemeControls(window.HRTheme.getSavedTheme());
    if (darkModeToggle) darkModeToggle.addEventListener('click', () => window.HRTheme?.toggleTheme());
    loadDashboardData();
});
