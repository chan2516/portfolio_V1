<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/c4e6eb14-6091-4f4e-9f1c-12d9f4e4a591

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

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
