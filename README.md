# DevFolio Pro

**A full-stack developer portfolio with a visual editor, an editable resume, and an authenticated administration console.**

DevFolio Pro combines a public portfolio with tools to manage its content and appearance. Visitors can explore projects, skills, experience, and education, while administrators can update content, customize the design, upload media, and publish changes through a browser.

[Repository](https://github.com/chan2516/portfolio_V1) · [Detailed administration and deployment guide](docs/ADMIN_AND_DEPLOYMENT.md)

## Features

- **Responsive portfolio:** profile, projects, skills, experience, education, certifications, code examples, and contact information.
- **Visual editing studio:** desktop, tablet, and mobile previews, zoom controls, edit/interact modes, and undo/redo.
- **Design customization:** colors, typography, spacing, section order and visibility, navigation, icons, and custom text, image, link, and blog sections.
- **Editable resume:** shared profile data, independent element formatting, and browser-based Print / Save as PDF.
- **Publishing:** SQLite-backed configuration with version checks to prevent stale drafts from overwriting another administrator's publication.
- **Account management:** owner/admin roles, salted scrypt password hashes, database-backed sessions, and session revocation after password resets or account disabling.
- **Media library:** reusable image/PDF uploads, a 10 MB limit, file-signature validation, and protection against deleting files referenced by saved content.
- **Contact form:** configurable JSON form endpoint with a pre-filled email fallback when submission is unavailable.
- **Deployment automation:** multi-stage Docker builds, persistent storage, API health checks, Caddy HTTPS, and GitHub Actions.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router |
| Interface | Tailwind CSS 4, Motion, Lucide React |
| Backend | Node.js, Express, Multer |
| Database | SQLite, Sequelize |
| Authentication | Node.js crypto, HTTP-only session cookies |
| Testing | Jest, Supertest, Node.js test runner |
| Deployment | Docker, Docker Compose, Caddy, GitHub Actions, Docker Hub |

## Architecture

```text
Development
Browser → Vite (:3000) → /api and /uploads proxy → Express (:5000)
                                                    ├── SQLite
                                                    └── Uploaded files

Production
Browser → Caddy (HTTPS) → Express
                           ├── Built React frontend
                           ├── REST API
                           └── Persistent database and uploads
```

The public website reads published configuration from the API. The editor uses the same portfolio renderer for its preview and publishes through authenticated API requests.

## Getting started

Use **Node.js 22** and npm to match the Docker and CI environments.

```sh
git clone https://github.com/chan2516/portfolio_V1.git
cd portfolio_V1
npm ci
```

Copy the environment example:

```powershell
# Windows PowerShell
Copy-Item .env.example .env.local
```

```sh
# macOS / Linux
cp .env.example .env.local
```

Set `VITE_CONTACT_FORM_ENDPOINT` to your own form-service endpoint, or leave it empty to use the email fallback. The example currently points to the original portfolio's form.

```sh
npm run dev
```

| Page | Local URL |
| --- | --- |
| Portfolio | http://localhost:3000 |
| Resume | http://localhost:3000/resume |
| Admin console | http://localhost:3000/admin |
| API health | http://localhost:5000/api/health |

The backend creates its SQLite tables automatically; no external database service is needed.

### Owner setup and publishing

1. Open `/admin/login` and select **Create owner account** when no accounts exist.
2. Choose a username of 3–64 letters, numbers, dots, underscores, or hyphens, and a password of at least 12 characters. Initial setup closes once an account exists.
3. Edit your information under **Content**, organize sections under **Structure**, and customize the appearance under **Design**.
4. Check the device previews and switch to **Resume** to review its layout.
5. Publish the changes to save them and update the public website.

The owner can create additional administrators. Administrators can edit and publish content; account management is reserved for the owner.

Drafts stay in browser memory until published and are lost on reload. Undo retains the last 40 editor changes. If another administrator publishes first, load the latest published configuration and review your draft before publishing again.

## Configuration

Vite reads frontend values from `.env.local`. Express loads its default `.env` file or process environment variables; it does not automatically load backend settings from `.env.local`.

| Variable | Purpose | Default / behavior |
| --- | --- | --- |
| `VITE_CONTACT_FORM_ENDPOINT` | JSON-compatible contact form endpoint | Set your own; embedded at frontend build time |
| `VITE_API_TARGET` | Development proxy target | `http://localhost:5000` |
| `PORT` | Express port | `5000` |
| `DB_STORAGE` | SQLite file location | `./database.sqlite` |
| `UPLOAD_DIR` | Media storage directory | `public/uploads` |
| `ADMIN_ORIGIN` | Additional trusted admin request origin | Optional for same-origin use |
| `NODE_ENV` | Runtime mode | `production` serves the built frontend and enables secure cookies |
| `TRUST_PROXY_HOPS` | Trusted reverse-proxy hops | Production Compose sets `1` for Caddy |

Credentials are stored in SQLite. Production authentication requires HTTPS because session cookies are marked secure.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start frontend and backend |
| `npm run dev:frontend` | Start Vite only |
| `npm run dev:backend` | Start the backend development launcher |
| `npm run lint` | TypeScript checking (`tsc --noEmit`) |
| `npm test` | API and configuration tests |
| `npm run build` | Build frontend into `dist/` |
| `npm run preview` | Preview frontend build; does not start the API |
| `npm start` | Start Express; production mode also serves `dist/` |

Before proposing a code change:

```sh
npm run lint
npm test
npm run build
```

Tests cover authentication, projects, settings, media, portfolio configuration, and studio configuration features. Review editor behavior and responsive layouts separately in the browser.

## Project structure

```text
src/
  admin/                 Visual editor, authentication, media and account tools
  components/            Portfolio sections and resume components
  data/                  Default portfolio content
  App.tsx                Application routes
  Portfolio.tsx          Public portfolio renderer
  siteConfig.tsx         Portfolio configuration and shared state
server/
  models/                Sequelize models
  routes/                Content, settings, theme and media APIs
  tests/                 API and configuration tests
  auth.js                Authentication, sessions and account management
  server.js              Express entry point
public/                  Static assets and original downloadable resume
docs/                    Detailed administration and deployment guide
.github/workflows/       Validation and deployment automation
Dockerfile               Multi-stage application image
docker-compose.prod.yml  Production application, storage initializer and Caddy
```

## Deployment

### Local container preview

With Docker and Docker Compose installed:

```sh
docker compose up --build -d
```

Open http://localhost:8080 to inspect the public page and API. Production-mode admin cookies require HTTPS, so this HTTP preview is intended for public-page and API health checks.

### Production

The workflow in `.github/workflows/aws-deploy.yml` runs on pushes to `main`. It checks types, runs tests, builds the frontend and container, checks container health with persistent storage, pushes to Docker Hub, and deploys the commit-tagged image over SSH.

Configure these GitHub Actions repository secrets:

| Secret | Value |
| --- | --- |
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `IP` | Server IP address or hostname |
| `SERVER_USER` | Server user with Docker permissions |
| `SERVER_PASS` | SSH password used by the current workflow |

The server needs Docker, a current Compose plugin supporting `up --wait`, and inbound SSH, HTTP, and HTTPS access. Deployment defaults to `/opt/portfolio`.

The checked-in Caddy configuration and workflow HTTPS checks target `chandandev.me` and `www.chandandev.me`. For your own deployment, update both files to your domain and point its DNS records at the server. Configure your own contact endpoint before building. Caddy manages HTTPS and forwards requests to the private application container.

See the [detailed guide](docs/ADMIN_AND_DEPLOYMENT.md) for server setup, manual deployment, storage migration, editor controls, and troubleshooting.

### Storage and backups

Local development stores data in `database.sqlite` and `public/uploads`. Production uses `/data/database.sqlite` and `/data/uploads` in the `portfolio_data` volume. Accounts, sessions, published content, and media are runtime data and are not bundled into the image.

Back up the database and uploads together using a consistent snapshot or while application writes are stopped. Do not run `docker compose down -v` against production: it deletes persistent volumes. A fresh production database requires creating its own owner account.

## Current limitations

- New interactive layouts require registering or editing React components.
- Text formatting applies to whole elements. Markup or list-position changes can require reapplying formatting.
- Drafts do not survive browser reloads. Element offsets can overlap surrounding content and need responsive checks.
- Resume export uses the browser print dialog; the original downloadable PDF remains a separate static file.
- SQLite and local uploads suit a single-server deployment. Multiple application instances would need a different shared-storage and database design.

## Author

**Chandan Vishwakarma** · [GitHub](https://github.com/chan2516)

## License

No license file is currently included. Add an appropriate license before offering reuse under specific open-source terms.
