# Production Deployment Secrets Catalog & Management Runbook

This guide defines all required and optional environment variables and secrets required to operate the Portfolio platform in staging and production environments.

---

## 1. Required Secrets Catalog

| Variable | Description | Where to Set | Security Level | Recommended Generation |
| :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | Server / Host | **CRITICAL** | Managed PostgreSQL URI with SSL (`?sslmode=require`) |
| `JWT_SECRET` | Secret key used for signing session & OAuth tokens | Server / Host | **CRITICAL** | `openssl rand -hex 32` (at least 32 characters) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | Server / Host | **HIGH** | From Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Server / Host | **HIGH** | From Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Server / Host | **CRITICAL** | From Cloudinary Dashboard |

---

## 2. Optional & OAuth Secrets

| Variable | Description | Where to Set | Notes |
| :--- | :--- | :--- | :--- |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Web Client ID | Server / Host | Required only if Google login is enabled |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Web Client Secret | Server / Host | Required only if Google login is enabled |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | Server / Host | Required only if GitHub login is enabled |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Secret | Server / Host | Required only if GitHub login is enabled |
| `PORT` | API listener port | Server / Host | Defaults to `4000` |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins | Server / Host | e.g. `https://samueltale.dev,https://admin.samueltale.dev` |
| `CLIENT_URL` | Public base URL of the client application | Server / Host | Used for OAuth redirection |
| `PUBLIC_API_URL` | Public base URL of the API endpoints | Server / Host | Used for public API references |

---

## 3. Secret Generation & Ingestion

### Generating Strong Secrets
To generate cryptographically secure random values:
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate Bootstrap Admin Password
openssl rand -base64 18
```

### GitHub Actions Secrets
Configure the following secrets in GitHub Repository Settings (`Settings` -> `Secrets and variables` -> `Actions`):
- `DATABASE_URL` (for staging/production workflows)
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## 4. Secret Rotation Procedures

### Rotating `JWT_SECRET`
1. Generate a new secret: `openssl rand -base64 32`.
2. Update the environment configuration on the server or cloud provider.
3. Restart the server (`npm start` or container restart).
4. *Effect*: All existing admin session tokens are invalidated immediately. Admins must re-authenticate.

### Rotating Cloudinary Credentials
1. Generate new API credentials in the Cloudinary Console under **Settings > Security**.
2. Deploy the updated `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` to the environment.
3. Verify uploads using `npm run test --workspace server`.
4. Revoke the previous API key from Cloudinary Console.
