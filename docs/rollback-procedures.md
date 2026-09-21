# Disaster Recovery & Rollback Procedures Runbook

This runbook outlines standard operating procedures for rolling back deployments and recovering from database failures.

---

## 1. Rollback Triggers

Initiate a rollback immediately if:
- Health/Readiness endpoint `/api/health/ready` returns HTTP 503 for more than 2 minutes following deployment.
- Error rate on public or admin routes exceeds 2% over a 5-minute window.
- Critical authentication or database migration failures occur during or immediately after deployment.

---

## 2. Application Code Rollback

### Step A: Identify Last Known Stable Commit
```bash
git log --oneline -n 5
```

### Step B: Revert or Checkout Stable Release
```bash
# Option 1: Git revert the bad merge/commit
git revert <commit-hash> -m 1
git push origin main

# Option 2: Point production environment to previous tag or image
git checkout v1.0.X
npm run build
npm start
```

---

## 3. Database Migration Rollback

Prisma uses forward migrations. When rolling back a release that introduced a new migration:

### Scenario 1: Reverting Schema Changes
1. Identify the previous applied migration in `server/prisma/migrations`.
2. Generate a corrective migration or down-migration SQL script:
```bash
cd server
# Inspect applied migrations
npx prisma migrate status
```
3. If necessary, execute down SQL scripts or apply the previous schema state:
```bash
npx prisma migrate deploy
```

### Scenario 2: Restoring from an Automated Backup
If data corruption or destructive schema migrations occurred:

1. Locate the latest verified backup in `server/backups/`:
```bash
ls -la server/backups/
```
2. Run the automated restoration script:
```bash
npm run db:restore --workspace server server/backups/backup-<TIMESTAMP>.json
```
3. Verify backup checksum verification in stdout.
4. Confirm database health:
```bash
curl -i http://localhost:4000/api/health/ready
```
Ensure the endpoint returns HTTP `200 OK` with `"database": { "status": "connected" }`.

---

## 4. Post-Rollback Verification Checklist

- [ ] Liveness probe returns 200: `GET /api/health`
- [ ] Readiness probe returns 200: `GET /api/health/ready`
- [ ] Admin login succeeds: `POST /api/auth/login`
- [ ] Public projects return: `GET /api/public/projects`
- [ ] Image uploads succeed: `POST /api/uploads/image`
- [ ] Frontend client connects and loads without console errors.
