# Updates

## 2026-02-21

### Scope
- Fixed mismatch between frontend login key usage and backend management authentication.
- Enabled guest-mode visibility and connectivity behavior for the deployed web UI.

### Changes
- Frontend:
- Updated guest management-key fallback in `src/stores/useAuthStore.ts`.
- Ensured guest mode remains read-only in UI behavior while keeping backend read access available.

- Deployment/runtime:
- Confirmed `openai.wbuai.me` is served by Nginx static SPA root (`/var/www/cliproxy/index.html`), not `CLIProxyAPI/static/management.html`.
- Rebuilt and deployed latest frontend bundle to the Nginx-served path.
- Set `MANAGEMENT_PASSWORD` in `cli-proxy-api.service` to align admin login credential and restarted service.

### Validation
- Admin key can access management API endpoints successfully.
- Guest login entry is visible in the web UI.
- Core services remain active after restart.
