# Backend Handoff

## 60-second overview

ModernTech HR Portal is a Node.js/Express ESM service using MySQL. The server
serves the frozen frontend in `Frontend/` and exposes `/api/dashboard`,
`/api/timeoff`, and `/api/reports`. The frontend is the primary consumer.
There are no external services besides MySQL. `/api/health` is the liveness
endpoint.

## Architecture and data flow

`server.js` creates the Express app, applies CORS and JSON parsing, mounts the
three routers, serves static frontend files, and starts one HTTP server.
`config/db.js` owns the shared `mysql2/promise` pool. Routers delegate to
controllers, and controllers delegate to SQL models.

The default database is `moderntech_hr`:

- `employees` — employee identity and department.
- `employee_information` — position, department, salary, history, contact.
- `attendance` — daily Present/Absent records.
- `leave_requests` — dashboard leave records.
- `payroll` — seeded final salary records.
- `time_off_requests` — time-off workflow records.

The dashboard SQL is additive/idempotent for its seed rows. The time-off SQL
deliberately truncates and reseeds `time_off_requests`; do not run it against
production data without confirming that reset is intended.

## Directory map

```text
server.js                  Express entry point and lifecycle management
config/db.js               MySQL pool
Controllers/               HTTP request/response handling
models/                    SQL access and response data assembly
Routes/                    Express route definitions
sql/                       Database setup and seed scripts
tests/                     Node built-in smoke/contract tests
scripts/check-syntax.mjs   Build/lint syntax checker
Frontend/                  Frozen static frontend
README.md                  Setup and command reference
HANDOFF.md                 This document
CHANGELOG.md               Stabilization release notes
```

Start reading in this order: `README.md`, `server.js`,
`Routes/DashboardRoutes.js`, `Controllers/DashboardController.js`,
`models/DashboardModels.js`, and the SQL scripts.

## Setup and operation

Prerequisites are Node.js 18+, npm, and MySQL. Copy `.env.example` to `.env`,
set the database password, then run `npm install`.

Initialize the database from the repository root:

```powershell
Get-Content -Raw '.\sql\timeoff-sql-table.sql' |
  mysql -h localhost -P 3307 -u root -p moderntech_hr

Get-Content -Raw '.\sql\new-dash-reports.sql' |
  mysql -h localhost -P 3307 -u root -p moderntech_hr
```

Run locally with `npm run dev` or production-style with `npm start`. The
server listens on `PORT` or 3000. It starts the HTTP listener even when MySQL
is unavailable so `/api/health` remains useful; database-backed endpoints
return errors until credentials and schema are available.

Run checks with:

```powershell
npm run build
npm run lint
npm run typecheck
npm test
```

This is plain JavaScript, so `typecheck` performs Node syntax validation; no
TypeScript type system is used.

Deployment is platform-neutral: install production dependencies with
`npm install --omit=dev`, provide `.env` through the hosting platform's secret
store, run both SQL scripts during database provisioning, and launch with
`npm start`. Put TLS, authentication, and rate limiting at the deployment
boundary unless separately approved.

## Active endpoint contracts

- `GET /api/health` → `{ status: "ok", service, timestamp }`.
- `GET /api/dashboard/stats` → `{ success, data: { summary, departments } }`.
- `GET /api/dashboard/attendance` → `{ success, data: { summary, dailyAttendance, recentAttendance } }`.
- `GET /api/dashboard/leaves` → `{ success, data: { summary, recentLeaves } }`.
- `GET /api/dashboard/employees` → `{ success, data: { employeeInformation } }`.
- `GET /api/timeoff` → rows from `time_off_requests`.
- `PATCH /api/timeoff/:id` with `{ "status": "Pending|Approved|Rejected" }` updates a positive integer request ID.
- `GET /api/reports` → `{ success: true, data: [] }` until report persistence is designed.

## What was fixed

### Critical/high

- Added `npm test`, `npm run build`, `npm run lint`, and `npm run typecheck`.
- Made `server.js` import-safe by exporting `app` and starting the listener
  only when executed directly.
- Added graceful SIGINT/SIGTERM shutdown and MySQL pool cleanup.
- Added a 1 MB JSON request limit.
- Replaced raw database error messages in controllers with safe client-facing
  messages while retaining server-side logs.

### Medium

- Added positive-integer validation for `/api/timeoff/:id`.
- Added built-in Node HTTP tests in `tests/server.test.mjs`.
- Added complete `.env.example`, `.gitignore`, README, and changelog.
- Documented the destructive time-off seed script and reports limitation.

## Known limitations and TODOs

1. Reports POST/DELETE are not persistent. The repository has no reports table,
   and adding one would cross the current database boundary.
2. The frozen frontend references legacy `/api/auth`, `/api/employees`,
   `/api/attendance`, and `/api/payroll` endpoints. Those routes were removed
   during consolidation, and their old implementations target tables such as
   `employees_table` and `payroll_table`, absent from the current SQL schema.
3. CORS is open via `cors()`. Restrict it before exposing the API outside a
   trusted local/deployment boundary.
4. No authentication middleware protects the active dashboard, reports, or
   time-off routes.
5. No CI workflow is present.

## Open questions

- Should legacy auth, employee, attendance, and payroll APIs be retired, or
  reintroduced against the current schema?
- Should reports become persistent, and what table and authorization rules
  should govern them?
- What production CORS origins and authentication provider are required?
- Should the time-off SQL script remain destructive for shared environments?

## Troubleshooting

### `Unable to connect to MySQL database`

Check that MySQL is running on the configured host/port, `moderntech_hr` exists,
and `.env` contains the correct password. The default port is 3307, not 3306.

### Dashboard endpoints return 500

Run both SQL scripts and verify the DB user has SELECT access to all dashboard
tables. The server logs the underlying error but does not return it to clients.

### `/api/timeoff` is empty or fails

Run `sql/timeoff-sql-table.sql` after confirming its truncate-and-seed behavior
is safe for the target database.

### `npm test` cannot find tests

Run commands from the repository root. The script targets
`tests/server.test.mjs` explicitly for Windows/Node compatibility.

### Port already in use

Set another local port in `.env`, stop the existing process, or use
`Get-NetTCPConnection -LocalPort 3000` to identify the listener.
