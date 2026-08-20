// Global State Management Variables
const API_BASE_URL = "http://localhost:3000/api";
let employees = [];
const seedEmployees = [];
let selectedEmployeeId = null;
let activeVisibility = "Public";
let attachedWordFile = null;

// Core async initializer engine
async function loadEmployees() {
    try {
        const res = await fetch(`${API_BASE_URL}/dashboard/employees`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const rawData = await res.json();
        
        // Flexible array extractor supporting direct arrays or object wrappers
        const rawList = Array.isArray(rawData) 
            ? rawData 
            : (rawData.data?.employeeInformation || rawData.employeeInformation || rawData.employees || rawData.data || []);

        employees = rawList.map(emp => ({
            employeeId: emp.employeeId || emp.id,
            name: emp.name || "Unknown",
            department: emp.department || "General",
            position: emp.position || "Staff Associate",
            createdDate: emp.createdDate || new Date().toISOString().split('T')[0],
            employmentHistory: Array.isArray(emp.employmentHistory) ? emp.employmentHistory : []
        }));
    } catch (err) {
        console.error("JSON Loading Error:", err);
        employees = seedEmployees.map(emp => ({
            ...emp,
            createdDate: emp.createdDate || new Date().toISOString().split('T')[0],
            employmentHistory: Array.isArray(emp.employmentHistory) ? emp.employmentHistory : []
        }));
    }        
    
    if (employees.length === 0) {
        const container = document.getElementById('employeeListContainer');
        if (container) container.innerHTML = '<div class="text-muted">Unable to load employees from the server.</div>';
        return;
    }

    renderList();
    
    // Auto-select first item on boot
    if (employees.length > 0) {
        selectEmployee(employees[0].employeeId);
    }
}

function getInitials(name) {
    if (!name) return 'EE';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 65%, 50%)`;
}

// Dynamic listing render loop with real-time text matching
function renderList() {
    const container = document.getElementById('employeeListContainer');
    if (!container) return; // Prevent errors if loaded on wrong page
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    container.innerHTML = '';

    // Defensively filter to prevent crashes on undefined/null properties
    const filtered = employees.filter(emp => {
        const name = (emp.name || '').toLowerCase();
        const department = (emp.department || '').toLowerCase();
        const position = (emp.position || '').toLowerCase();

        return name.includes(searchTerm) || 
               department.includes(searchTerm) || 
               position.includes(searchTerm);
    });

    filtered.forEach(emp => {
        const color = stringToColor(emp.name || 'EE');
        const initials = getInitials(emp.name || 'EE');
        const isActive = emp.employeeId === selectedEmployeeId ? 'active' : '';
        const textClass = emp.employeeId === selectedEmployeeId ? 'text-primary text-decoration-underline' : 'text-secondary';
        const count = emp.employmentHistory ? emp.employmentHistory.length : 0;
        const targetDate = emp.createdDate || new Date().toISOString().split('T')[0];

        const itemHtml = `
            <div class="list-group-item employee-item d-flex align-items-center justify-content-between py-2 border-0 border-bottom ${isActive}" 
                 onclick="selectEmployee(${emp.employeeId})">
                <div class="d-flex align-items-center min-w-0">
                    <div class="avatar-circle me-3" style="background-color: ${color};">${initials}</div>
                    <div class="text-truncate">
                        <div class="fw-bold ${textClass} text-truncate" style="font-size: 0.95rem;">${emp.name || 'Unknown'}</div>
                        <div class="text-muted small text-truncate">${emp.department || 'General'}</div>
                    </div>
                </div>
                <div class="text-end flex-shrink-0">
                    <span class="badge text-dark bg-transparent p-0 small fw-bold">${count}</span>
                    <div class="text-muted-sm">${targetDate}</div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHtml);
    });
}

// Synchronizes structural review views upon selection toggles
function selectEmployee(id) {
    selectedEmployeeId = id;
    const emp = employees.find(e => e.employeeId === id);
    if (!emp) return;

    // Repaint selection active highlights
    renderList();

    // Bind main review card info
    if (document.getElementById('activeName')) document.getElementById('activeName').innerText = emp.name;
    if (document.getElementById('activeRole')) document.getElementById('activeRole').innerText = `${emp.position} · ${emp.department}`;
    
    const activeAvatar = document.getElementById('activeAvatar');
    if (activeAvatar) {
        activeAvatar.innerText = getInitials(emp.name);
        activeAvatar.style.backgroundColor = stringToColor(emp.name);
    }

    // Repaint history list space container Workspace
    renderHistory(emp);
}

function renderHistory(emp) {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;
    historyContainer.innerHTML = '';
    
    const entries = emp.employmentHistory || [];
    if (document.getElementById('historyHeader')) {
        document.getElementById('historyHeader').innerText = `History · ${entries.length} Entries`;
    }

    if (entries.length === 0) {
        historyContainer.innerHTML = `<div class="text-center text-muted py-4 small card card-custom">No logs found for this employee profile context.</div>`;
        return;
    }

    // Render entries backwards chronologically
    [...entries].reverse().forEach(entry => {
        let badgeColorClass = 'text-primary border-primary-subtle';
        if (entry.type === 'Check-in') badgeColorClass = 'text-info border-info-subtle';
        if (entry.type === 'Performance') badgeColorClass = 'text-warning border-warning-subtle';
        if (entry.type === 'Commendation') badgeColorClass = 'text-success border-success-subtle';
        if (entry.type === 'Disciplinary') badgeColorClass = 'text-danger border-danger-subtle';

        const privateBadge = entry.visibility === 'Private' 
            ? `<span class="badge bg-light text-secondary border px-2 py-1 ms-1">Private</span>` 
            : '';

        const cardHtml = `
            <div class="card card-custom p-3 animate-entry mb-2">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <span class="badge bg-light ${badgeColorClass} border px-2 py-1">${entry.type}</span>
                        ${privateBadge}
                    </div>
                    <div class="text-end">
                        <div class="fw-semibold text-muted-sm text-dark">${entry.date}</div>
                        <div class="text-muted-sm">Admin User</div>
                    </div>
                </div>
                <p class="small text-secondary m-0" style="line-height: 1.6;">${entry.text}</p>
            </div>
        `;
        historyContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}

function setFormVisibility(visibility) {
    activeVisibility = visibility || 'Public';
    document.querySelectorAll('#visibilityGroup .btn').forEach((button) => {
        button.classList.toggle('active', button.innerText.trim() === activeVisibility);
    });
}

function evaluateFileStatus(input) {
    handleFileSelection(input);
}

function filterEmployeeList() {
    renderList();
}

// Reviews remain in-memory because the shared schema has no reviews table.
function saveReviewEntry() {
    if (!selectedEmployeeId) {
        alert('Please select an active employee profile track first.');
        return;
    }

    const commentBox = document.getElementById('reviewComment');
    const commentText = commentBox ? commentBox.value.trim() : '';
    const reviewType = document.getElementById('reviewType')?.value || 'Check-in';

    if (!commentText) {
        alert('Please enter a comment before saving.');
        return;
    }

    const targetEmployee = employees.find(emp => emp.employeeId === selectedEmployeeId);
    if (!targetEmployee) return;

    const newEntry = {
        type: reviewType,
        visibility: activeVisibility,
        date: new Date().toISOString().split('T')[0],
        text: commentText
    };

    // Append to local state array for immediate dynamic rendering
    targetEmployee.employmentHistory.push(newEntry);

    // Reset form inputs & attachments
    if (commentBox) commentBox.value = '';
    if (document.getElementById('charCount')) document.getElementById('charCount').innerText = '0 chars';
    if (document.getElementById('wordFileInput')) document.getElementById('wordFileInput').value = '';
    
    const statusDiv = document.getElementById('fileUploadStatus');
    if (statusDiv) statusDiv.classList.add('d-none');
    attachedWordFile = null;

    // Refresh UI
    selectEmployee(selectedEmployeeId);
}

function addNewEmployee() {
    const nameInput = document.getElementById('newEmpName');
    const posInput = document.getElementById('newEmpPos');
    const deptInput = document.getElementById('newEmpDept');
    
    const name = nameInput ? nameInput.value.trim() : '';
    const position = posInput ? posInput.value.trim() || "Staff Associate" : "Staff Associate";
    const department = deptInput ? deptInput.value : 'General';

    if (!name) {
        alert('Please enter an employee name');
        return;
    }

    const newEmp = {
        name: name,
        department: department,
        position: position,
        createdDate: new Date().toISOString().split('T')[0],
        employmentHistory: []
    };

    const assignedId = employees.length > 0
        ? Math.max(...employees.map(emp => Number(emp.employeeId) || 0)) + 1
        : 1;

    newEmp.employeeId = assignedId;
    employees.push(newEmp);
    
    // Reset Inputs
    if (nameInput) nameInput.value = '';
    if (posInput) posInput.value = '';
    
    // Close Bootstrap Modal / Collapse dropdowns
    const collapseEl = document.getElementById('addEmployeeForm');
    if (collapseEl && window.bootstrap) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
        if (bsCollapse) bsCollapse.hide();
    }

    // Switch selection context view automatically over to newly created employee
    selectEmployee(assignedId);
}

function toggleVisibility(element) {
    const group = document.getElementById('visibilityGroup');
    if (group) {
        group.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));
    }
    element.classList.add('active');
    activeVisibility = element.innerText.trim();
}

function updateCharCount(textarea) {
    if (document.getElementById('charCount')) {
        document.getElementById('charCount').innerText = `${textarea.value.length} chars`;
    }
}

function handleFileSelection(input) {
    const statusDiv = document.getElementById('fileUploadStatus');
    const commentBox = document.getElementById('reviewComment');
    
    if (input.files && input.files[0]) {
        attachedWordFile = input.files[0];
        if (statusDiv) statusDiv.classList.remove('d-none');
        
        if (commentBox && commentBox.value.trim() === "") {
            commentBox.value = `[Imported from Shared Drive File: ${attachedWordFile.name}]\n`;
            updateCharCount(commentBox);
        }
    } else {
        attachedWordFile = null;
        if (statusDiv) statusDiv.classList.add('d-none');
    }
}

// Event Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchInput')?.addEventListener('input', renderList);
    loadEmployees();
});
