# VALISEARCH 2.0 - DEPLOY TO COOLIFY VPS (COMPLETE GUIDE)

---

## WHAT IS COOLIFY?

Coolify is an open-source, self-hosted PaaS (Platform as a Service) that lets you deploy applications on your own VPS (Virtual Private Server). It's a great alternative to Vercel/Cloudflare when you want full control or need to stay within budget.

**Benefits:**
- Free and open-source
- Full control over server
- No vendor lock-in
- Supports many frameworks (Next.js, Docker, etc.)
- Built-in database management

---

## PREREQUISITES

Before deploying to Coolify, you need:

1. **VPS Server** (Ubuntu 20.04+ recommended)
   - Minimum: 2GB RAM, 2 CPU, 20GB SSD
   - Recommended: 4GB RAM, 4 CPU, 50GB SSD
   - Providers: DigitalOcean, Linode, Hetzner, AWS, etc.
2. **SSH Access** to your server
3. **Supabase Project** (external or self-hosted)
4. **GitHub Repository** with your code

---

## STEP 1: SET UP VPS

### 1.1 Get a VPS
Create a server from any provider:

**DigitalOcean (Recommended)**
1. Go to https://digitalocean.com
2. Create Droplet:
   - Image: Ubuntu 20.04 LTS
   - Size: $10/month (2GB, 1CPU) or $20/month (4GB, 2CPU)
   - Region: Choose closest to users
3. Add your SSH key
4. Create - note the IP address

**Linode / Hetzner / AWS**
Similar process - choose Ubuntu 20.04 LTS

### 1.2 Access Your Server
```bash
ssh root@YOUR_SERVER_IP
# Replace YOUR_SERVER_IP with your actual IP
```

### 1.3 Update System
```bash
apt update && apt upgrade -y
```

---

## STEP 2: INSTALL COOLIFY

### 2.1 Run Coolify Installer
```bash
# As root user, run:
curl -fsSL https://get.coolify.io | bash
```

This will:
- Install Docker
- Install Coolify
- Set up the Coolify UI

### 2.2 Access Coolify
1. Wait 2-5 minutes for installation
2. Open browser: `https://YOUR_SERVER_IP:8000`
3. You'll see the Coolify setup page

### 2.3 Initial Setup
1. Create admin account:
   - Email: your@email.com
   - Password: strong-password
2. Complete the setup wizard

---

## STEP 3: CONFIGURE GITHUB

### 3.1 Add GitHub Integration
In Coolify dashboard:
1. Go to "Settings" (gear icon) → "GitHub"
2. Click "Add GitHub App"
3. Follow the link to create a GitHub App
4. Select your VALISEARCH repository
5. Copy the App ID and private key
6. Paste into Coolify

### 3.2 Add Deploy Key
Coolify needs access to your repository:
1. In GitHub → Your repo → Settings → Deploy keys
2. Add the public key from Coolify
3. Grant read access

---

## STEP 4: CREATE PROJECT IN COOLIFY

### 4.1 Create New Project
1. In Coolify dashboard, click "Create New Project"
2. Name: "ValiSearch"
3. Click Create

### 4.2 Add Git Repository
1. Click "Add New Resource"
2. Select "Git Repository"
3. Configure:
   - **Name:** valisearch-web
   - **Git Repository:** https://github.com/YOUR_USERNAME/VALISEARCH
   - **Branch:** main
   - **Build Pack:** Select "NPM" (or auto-detect)

---

## STEP 5: CONFIGURE BUILD

### 5.1 Build Settings
Set in the resource configuration:

| Setting | Value |
|---------|-------|
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Port** | `3000` |
| **Node Version** | `20` |

### 5.2 Environment Variables
Add these in Coolify resource settings:

```
# Public (browser-safe)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-coolify-domain.com

# Secret (server-side)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=your-openrouter-key
JINA_API_KEY=your-jina-key

# Payment gateways (optional)
STRIPE_SECRET_KEY=your-stripe-key
LEMON_SQUEEZY_SECRET=your-ls-secret
```

---

## STEP 6: SET UP SUPABASE

### 6.1 Option A: Use Supabase Cloud (Recommended)
Since you're deploying to VPS, use Supabase's cloud service:

1. Go to https://supabase.com
2. Create project "MY VALISEARCH"
3. Get credentials (URL, anon key, service role key)
4. Add to Coolify environment variables (Step 5.2)

### 6.2 Option B: Self-Host Supabase (Advanced)
If you want fully self-hosted:
1. In Coolify, add new resource → "Supabase"
2. Configure and deploy
3. Use the internal URL for database

**Note:** Self-hosting Supabase is complex. Recommended to use cloud for now.

---

## STEP 7: DEPLOY APPLICATION

### 7.1 Initial Deploy
1. In Coolify, click "Deploy" button
2. Watch the logs:
   ```
   [INFO] Cloning repository...
   [INFO] Installing dependencies...
   [INFO] Running build...
   [INFO] Build completed!
   [INFO] Starting application...
   ```

### 7.2 Check Status
- Green = Success
- Red = Failed (check logs)

### 7.3 Get Your URL
Coolify provides a URL like:
- `https://valisearch-web.your-server-ip.nip.io`
- Or use custom domain

---

## STEP 8: VERIFY DEPLOYMENT

### 8.1 Check Health
```bash
curl https://your-coolify-url/api/health
```
Expected:
```json
{"status":"ok","timestamp":"2026-05-11T..."}
```

### 8.2 Visit in Browser
1. Go to your Coolify URL
2. Check landing page
3. Test login/registration
4. Test AI analysis

### 8.3 Check Logs
In Coolify:
1. Click on your resource
2. Go to "Logs" tab
3. Check for any errors

---

## STEP 9: ADD CUSTOM DOMAIN

### 9.1 Buy Domain
Buy from any registrar (Namecheap, Cloudflare, etc.)

### 9.2 Configure in Coolify
1. In your resource → Settings → Domain
2. Add your domain:
   - `yourdomain.com`
   - `www.yourdomain.com`

### 9.3 Update DNS
At your domain registrar, add:
| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR_SERVER_IP |
| CNAME | www | @ |

### 9.4 Wait for SSL
Coolify automatically provisions Let's Encrypt SSL. Wait 5-10 minutes.

---

## STEP 10: SET UP SUPABASE SECRETS

If using Supabase Cloud, set Edge Function secrets:

### 10.1 Install Supabase CLI
```bash
# SSH into your server
ssh root@YOUR_SERVER_IP

# Install Supabase CLI
npm install -g supabase
```

### 10.2 Set Secrets
```bash
# Link to project
npx supabase link --project-ref YOUR_PROJECT_REF

# Set secrets
npx supabase secrets set OPENROUTER_API_KEY=your-openrouter-key
npx supabase secrets set JINA_API_KEY=your-jina-key
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## STEP 11: DATABASE MIGRATIONS

### 11.1 Run Migrations
```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Go to project directory (Coolify mounts it)
cd /coolify/applications/YOUR_APP_UUID

# Push migrations
npx supabase db push
```

Or use Supabase Cloud dashboard directly.

---

## COOLIFY SPECIFIC CONFIGURATION

### 11.2 Node.js Version
Ensure you're using Node 18 or 20:
```json
// In package.json
"engines": {
  "node": ">=18"
}
```

### 11.3 Memory Limits
If build fails due to memory:
```bash
# In Coolify resource settings, add:
NODE_OPTIONS="--max_old_space_size=1024"
```

---

## MONITORING & MAINTENANCE

### View Logs
In Coolify dashboard:
1. Click your resource
2. Go to "Logs" tab
3. View real-time logs

### Backups
Coolify doesn't auto-backup. Configure:
1. Go to resource → Backups
2. Set up backup schedule
3. Choose retention

### Updates
To update your app:
1. Push changes to GitHub
2. Coolify auto-deploys (if webhook configured)
3. Or click "Redeploy" in Coolify

---

## TROUBLESHOOTING

### Issue: Build failed
**Check:**
- Node version correct?
- Dependencies in package.json?
- Environment variables set?

### Issue: App won't start
**Check:**
- Port 3000 available?
- No port conflicts?
- Check logs for errors

### Issue: Cannot connect to Supabase
**Check:**
- URL correct in environment?
- Supabase project not paused?
- IP whitelist in Supabase? (add your VPS IP)

### Issue: Very slow response
**Check:**
- Server resources (upgrade if needed)
- Database query performance
- Network latency

### Issue: Out of memory during build
**Solution:**
```bash
# Add to Coolify environment:
NODE_OPTIONS="--max_old_space_size=2048"
```

---

## COOLIFY COMMANDS REFERENCE

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Check Coolify status
coolifyctl status

# View logs
coolifyctl logs -f

# Restart application
coolifyctl restart

# Update Coolify
coolifyctl update
```

---

## VPS RECOMMENDATIONS

### Budget Option ($10/month)
- DigitalOcean Droplet: 2GB RAM, 1 CPU, 50GB SSD
- Good for: Testing, small usage

### Production Option ($20-40/month)
- DigitalOcean: 4GB RAM, 2 CPU, 80GB SSD
- Hetzner: Similar pricing, better specs
- Good for: Production with moderate traffic

### High Performance ($50+/month)
- 8GB+ RAM, 4+ CPUs
- Good for: Heavy usage, multiple apps

---

## COMPARISON: COOLIFY vs VERCEL vs CLOUDFLARE

| Feature | Coolify | Vercel | Cloudflare |
|---------|---------|--------|------------|
| **Cost** | Server cost | Free tier | Free tier |
| **Control** | Full | Limited | Limited |
| **Setup** | Medium | Easy | Easy |
| **AI Apps** | Good | Good | Limited |
| **SSL** | Auto | Auto | Auto |
| **Database** | Self-hosted | Supabase | Supabase |
| **Maintenance** | You | Minimal | Minimal |

---

## IMPORTANT NOTES

1. **Self-Maintenance:** You're responsible for server updates, security, backups.

2. **Server Costs:** Always-on server costs money ($10-40/month).

3. **Downtime:** If server fails, you handle recovery.

4. **Backups:** Set up regular backups in Coolify.

5. **Security:** Keep server updated, use strong passwords, configure firewall.

---

## NEXT STEPS

1. Deploy and test thoroughly
2. Set up monitoring (Coolify has built-in)
3. Configure backups
4. Add custom domain
5. Consider adding more resources (Redis, etc.)

---

## QUICK DEPLOY CHECKLIST

- [ ] VPS created and accessible
- [ ] Coolify installed
- [ ] GitHub connected
- [ ] Repository added to Coolify
- [ ] Environment variables configured
- [ ] Build settings correct
- [ ] First deployment successful
- [ ] Health check passes
- [ ] Custom domain (optional)
- [ ] Migrations run

---

## SUPPORT

- Coolify Docs: https://docs.coolify.io
- Coolify Discord: https://discord.gg/coolify
- GitHub Issues: https://github.com/coollabsio/coolify

---

*For full system documentation, see SYSTEM_REPORT.md*
*For other platforms, see VERCEL_DEPLOY.md or CLOUDFLARE_DEPLOY.md*