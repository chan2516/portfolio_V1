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

## Deployment (EC2 + ECR via GitHub Actions)

The repository now deploys to **EC2** on every push to `main` using:
- `Dockerfile` to build the app image
- Amazon ECR to store images
- SSH from GitHub Actions to your EC2 host for rollout

Legacy ECS service update is retired in `.github/workflows/aws-deploy.yml`.

### 1) Prepare EC2 instance

Open inbound ports: **22**, **80**, **443**.

Install Docker and runtime tools on EC2:

```bash
sudo apt-get update
sudo apt-get install -y docker.io awscli curl
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
mkdir -p /opt/portfolio
```

Then reconnect your SSH session so docker group changes apply.

### 2) Required GitHub secrets

Add these repository secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_KEY` (private key contents)

Adjust workflow env values if needed:
- `AWS_REGION`
- `ECR_REPOSITORY`
- `CONTAINER_NAME`

### 3) Deployment behavior

On push to `main`, workflow will:
1. Build and push `latest` and commit-hash Docker images to ECR.
2. SSH into EC2 and authenticate Docker to ECR.
3. Pull latest image, replace container `portfolio` on `80:80`, with `--restart unless-stopped`.
4. Run health check (`curl http://localhost`).
5. If health check fails, rollback to the previous image when available.
