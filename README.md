# Chandan Vishwakarma — Portfolio

A responsive Vite/React portfolio for a Java software engineer and application-support professional.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and set `VITE_CONTACT_FORM_ENDPOINT`
3. Run the app:
   `npm run dev`

## Contact form

## Visual portfolio admin

Run `npm run dev`, then open `/admin`. The Visual Studio uses the same React portfolio renderer in an isolated iframe, with desktop, tablet, and mobile viewport widths.

The console has workspace navigation, a document toolbar, structure/design/content controls, a central canvas, and a text inspector. In **Edit** mode, click a text element to change its font, size, color, highlight, weight, italics, underline, alignment, line height, or letter spacing. Plain text elements also support wording overrides. **Interact** mode lets you test the preview's menus and controls. Undo and redo apply to editor changes.

Text formatting applies to a whole selected element, not arbitrary character ranges within a sentence. Overrides use paths within each section, so editing the component markup or changing positions inside dynamic lists can require reapplying their formatting. Projects and experience are edited under Content in the main editor. Formatting is stored with the portfolio configuration and rendered on the public page after publishing.

- Layers: select sections by clicking the preview; drag or use arrows to reorder; hide sections; adjust section background and extra spacing; add and delete text/image/link sections.
- Design: change global accent, background, foreground, font, content width, corner radius, and dark component appearance.
- Content: edit profile, contacts, statistics, skills, education, certifications, code examples, projects, and experience in the main editor. On initial load, existing projects and experience are loaded from their API if the published design does not contain them. Publishing stores these collections with the design; the public renderer then uses those published collections. Legacy manager URLs redirect to the main editor.
- Changes remain in the editor until **Publish changes** stores the design in SQLite at `/api/settings/portfolio`. Undo keeps the last 40 editor changes. Discard restores the published configuration. The public page reloads published data when it regains focus.

The **Website / Resume** document switch keeps both documents in one editor. The resume is an editable HTML document sharing profile and collection data with the portfolio. Resume formatting is independent of website formatting. Resume sections can be reordered, removed, and restored under Structure. **Print / Save as PDF** opens the browser print dialog for the current resume draft. The public resume viewer and `/resume` use the published design; the original downloadable PDF remains available separately.

Select any text element, then use **Remove text element** to hide it, or use position and spacing controls to offset it. Restore removed text under Structure or use Undo. Offsets do not move surrounding content out of the way, so verify responsive previews for overlap.

This is a component-based editor, not an unrestricted drawing canvas. New interactive functionality requires registering a React component. Existing component-specific internal layouts are not all independently editable. Editor drafts are in memory and are lost on reload; the browser warns about unpublished changes.

Production runs the authenticated Express API and built frontend together behind Caddy HTTPS. Database, sessions, and uploads persist in the portfolio_data volume. Vite proxies the API locally.

Validation: `npm run lint`, `npm run build`, and `node --test server/tests/portfolio-config.test.js`.

### Images and local media storage

In **Content**, expand **candidate Info** to replace the profile image, or **projects Data → a project** to attach its image. For summary or other custom blocks, select the section under **Structure** and use **Section image**. Click an existing image in the preview to open its image inspector directly.

**Choose saved / upload image** opens the reusable media library. **Upload new** saves a file locally; click its thumbnail to attach it to the current field. Set alt text, width, height, cover/contain/fill, crop focus, alignment, and corner radius. Width `0` fills the available container, and height `0` preserves the image proportions. Removing an image only removes its association from that section. Publish saves these image choices and presentation settings with the portfolio design.

Uploads accept PNG, JPEG, WebP, GIF, AVIF, and PDF files, up to 10 MB. Image fields show images only; PDFs can be stored and opened from Media library. Existing files in `public/uploads` are automatically listed. Files and their name metadata live in `public/uploads`; SQLite holds the published design. This uses the local filesystem, not browser `localStorage`, so media survives browser refreshes and can be reused across sessions. Both local data locations are ignored by Git. Back them up together. For container deployment, mount persistent storage and serve `/uploads` through the API. `UPLOAD_DIR` can override the default upload directory.

### Development port conflicts

`EADDRINUSE` means another process already listens on the requested port. `npm run dev:backend` now checks `/api/health` and reuses an existing portfolio API on port 5000 instead of starting a duplicate. Nodemon watches only the server directory, so uploads and README edits do not restart the backend. Run one `npm run dev` session for normal development. If an older crashed nodemon session remains open, stop that session with Ctrl+C and start it again to use the updated launcher.

For another API port, set `PORT` for the backend and `VITE_API_TARGET` for Vite to the matching origin (for example `http://localhost:5001`). An unrelated service on the chosen port is reported rather than terminated.

Media integration checks: `node --test server/tests/media.test.js server/tests/portfolio-config.test.js`.

The form posts JSON to `VITE_CONTACT_FORM_ENDPOINT`. A simple setup is to create a Formspree form using `chandanv345459@gmail.com`, verify the email address, and place the generated endpoint in `.env.local` for local development and in the production build environment. If the endpoint is missing or unavailable, the UI offers a pre-filled `mailto:` fallback and never displays a false success message.

## Deploy with Docker Hub and GitHub Actions

The workflow in `.github/workflows/aws-deploy.yml` builds the image, pushes both a commit tag and `latest` to Docker Hub, then updates the server with the commit tag. This avoids deploying an image that can change underneath a running release.

### One-time server setup

Install Docker and the Compose plugin on the server, create the deployment directory, and allow the deploy user to run Docker:

```sh
sudo mkdir -p /opt/portfolio
sudo chown "$USER":"$USER" /opt/portfolio
sudo usermod -aG docker "$USER"
```

Log out and back in after changing the Docker group. The server must allow inbound SSH, HTTP, and HTTPS traffic. If the Docker Hub repository is private, the deploy user also needs permission to pull it; the workflow performs a non-interactive Docker Hub login during each deployment.

### HTTPS endpoint

The production Compose stack runs the portfolio privately inside Docker and uses Caddy as the public reverse proxy. Caddy listens on ports `80` and `443`, automatically obtains and renews a Let's Encrypt certificate, and forwards traffic to the portfolio container.

Before deploying HTTPS, create these DNS records for the server IP:

| Type | Name | Value |
| --- | --- | --- |
| `A` | `@` | Your server IP |
| `A` | `www` | Your server IP |

After DNS has propagated and ports `80` and `443` are open in both the cloud firewall and UFW, the site is available at `https://chandandev.me`. Do not run another service on host ports `80` or `443`; Caddy owns those ports.

### GitHub repository secrets

Add these under **Settings > Secrets and variables > Actions**:

| Secret | Value |
| --- | --- |
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | A Docker Hub access token, not your account password |
| `IP` | The server IP address or DNS name |
| `SERVER_PASS` | The server user's SSH password |
| `SERVER_USER` | A non-root server user in the `docker` group |

The workflow uses `sshpass -e` for the existing password-based server access. The password is read from the GitHub secret and is not written to a file or committed. SSH host-key acceptance is limited to the first connection; SSH keys are still the stronger long-term option. After adding the secrets, push to `main` to deploy.

### Admin access and portfolio links

Open /admin/login. If no accounts exist, use **Create owner account** to choose your username and password (at least 12 characters). The first owner is saved in the database, and setup closes once an account exists. No environment credentials are needed. Sign in and use **My account** to change your username or password. Use **Admin accounts** to create additional admins and manage their access.

Admin API writes require an authenticated session. Accounts and eight-hour sessions are stored in SQLite and survive server restarts. Passwords use salted scrypt hashes; session tokens are stored as SHA-256 hashes. Production requires HTTPS for the secure session cookie. If the frontend has a different origin, set ADMIN_ORIGIN to its exact origin.

In Admin → Content, expand projects to edit Source repository URL and Live demo URL. Expand experience entries to edit Company website URL and Public work / case study URL. Links are optional; leave unavailable or private work blank. Publish saves the links with your portfolio content. Use public HTTP or HTTPS URLs; invalid links are rejected before saving.

The owner can use **Admin → Admin accounts** to create other admins, disable or re-enable accounts, and reset their passwords. Admins can edit and publish portfolio content but cannot manage accounts. Disabling an account or resetting its password revokes its sessions immediately. The owner account cannot be disabled from this screen. Back up and persist `database.sqlite` along with uploaded media.

In **Admin → Media library**, use **Upload new file** to add an image or PDF (up to 10 MB), and **Delete** to remove an unused upload. Confirm deletion in the library. Files referenced by published settings cannot be deleted until their references are removed and published. Unpublished drafts are held in the browser, so remove their references before deleting files.

User accounts live in the dedicated `Users` table (UUID, unique username, password hash, owner/admin role, active status, timestamps). Existing `AdminUsers` records migrate automatically without changing passwords or sessions. All account lookups and updates use Sequelize query methods with scalar values; request fields and user IDs are validated, and client-supplied roles or query operators are rejected. Login and current-password checks are rate limited. Passwords and hashes are never returned in account API responses. The owner can edit an admin username and password through **Admin accounts → Edit login**.

### Visual editor controls

Use **Add user** in the editor header (owner only) to create a separate admin login for the same portfolio. Publish checks the version you loaded: if someone else publishes first, your draft stays open and **Load latest published** lets you load their version. Undo can restore your previous draft for review.

The right panel has **Text & links** and **Images** tabs. Click a specific word, heading, or labelled link to edit its text and typography; selected project and profile links also expose their destination URL. Click an image or select a profile, project, or custom-section image from **Images**. Paste an image URL, upload or choose a library file, adjust dimensions/crop/alignment, remove the image, or reset it. Image controls are available in Website view.

Use **Design** for the site font, heading font, paragraph size and line spacing. These settings apply to website and resume text; code remains monospace, and selected-element formatting takes priority. Use **Content** for source data and optional project, experience, or contact Website URL fields. Publish saves links, images and styles to the database. Invalid URLs show their exact field in the publish error.

### Studio preview and content controls

- Preview toolbar: zoom from 25% to 200%, Fit, and 100%. Zoom scales the canvas without changing the selected device viewport. Editing and image selection work inside the scaled iframe.
- Structure: add custom content or blog sections, edit posts, and reorder sections. New sections receive navigation items automatically and are inserted before the footer.
- Content → Navigation: rename menu items, choose section targets, add external website links, reorder, and remove items. Hidden sections are omitted from the menu.
- Design: shared typography, colors, spacing, and Lucide icon color/size/stroke. The Design guide explains editable controls. Individual icon shapes, animation behavior, and new component layouts are maintained in src/components.
- Publish website saves content, navigation, blogs, and icon styling in the database. Preview zoom is a local editor control. Existing published designs remain compatible.

### Updated full-stack deployment

Deploy the complete release, not just dist: the image now includes Express, SQLite dependencies, and the built frontend. Push to main to run lint, tests, build, and deployment. The API is private on port 5000; Caddy handles HTTPS, with TRUST_PROXY_HOPS=1 preserving secure request origins. Compose waits for database/API health before reporting success. The server needs the current Docker Compose plugin supporting up --wait.

Manual deployment: place docker-compose.prod.yml and Caddyfile in /opt/portfolio, set DOCKERHUB_USERNAME and IMAGE_TAG to the desired commit tag, then run `docker compose -f docker-compose.prod.yml pull` and `docker compose -f docker-compose.prod.yml up -d --wait --wait-timeout 120`. Inspect `docker compose -f docker-compose.prod.yml logs --tail=100` on failure. Never use `down -v` on production because it deletes persistent data.

Local accounts and published edits are not included in the Docker image. The old frontend-only stack has no application database; first deployment creates a fresh production database. Create the production owner at /admin/login over HTTPS. To transfer local data instead, stop writes, back up database.sqlite and public/uploads together, and restore them into the production volume at /data/database.sqlite and /data/uploads (owner UID/GID 1000:1000) before starting. Back up existing production data first; never overwrite a live database. HTTPS is required for production login cookies. Local Compose on port 8080 is for public-page/API health testing.
