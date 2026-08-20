# ModernTech HR Portal Backend

## Overview

Node.js/Express ESM API backed by MySQL. It serves the frozen frontend from
`Frontend/` and provides dashboard, reports, and time-off APIs.

## Requirements

- Node.js 18 or newer
- npm
- MySQL 8-compatible server listening on port 3307 by default

## Setup

```powershell
Copy-Item .env.example .env
# Edit .env with the local MySQL password and any environment-specific values.
npm install
```

Initialize the shared database and seed data:

```powershell
Get-Content -Raw '.\sql\timeoff-sql-table.sql' |
  mysql -h localhost -P 3307 -u root -p moderntech_hr

Get-Content -Raw '.\sql\new-dash-reports.sql' |
  mysql -h localhost -P 3307 -u root -p moderntech_hr
```

Start locally:

```powershell
npm run dev
# or
npm start
```

The API is available at `http://localhost:3000`.

## Checks

```powershell
npm run build
npm run lint
npm run typecheck
npm test
```

This is plain JavaScript, so `typecheck` performs Node's syntax validation;
there is no TypeScript type system in this project.

## API smoke checks

```powershell
Invoke-RestMethod http://localhost:3000/api/health
Invoke-RestMethod http://localhost:3000/api/dashboard/stats
Invoke-RestMethod http://localhost:3000/api/dashboard/attendance
Invoke-RestMethod http://localhost:3000/api/dashboard/leaves
Invoke-RestMethod http://localhost:3000/api/dashboard/employees
Invoke-RestMethod http://localhost:3000/api/timeoff
Invoke-RestMethod http://localhost:3000/api/reports
```

See [HANDOFF.md](HANDOFF.md) for architecture, endpoint contracts,
troubleshooting, limitations, and the stabilization record.
