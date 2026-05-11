# VALISEARCH 2.0 - DEPLOY TO CLOUDFLARE PAGES (COMPLETE GUIDE)

---

## PREREQUISITES

Before deploying to Cloudflare, ensure you have:

1. **Cloudflare Account** (free at https://cloudflare.com)
2. **GitHub Account** with your VALISEARCH repository
3. **Supabase Project** created at https://supabase.com
4. **API Keys** ready:
   - OpenRouter API key
   - Jina AI API key
   - Payment gateway keys

---

## STEP 1: SET UP CLOUDFLARE ACCOUNT

### 1.1 Create Account
1. Go to https://cloudflare.com
2. Click "Sign Up"
3. Enter email and password
4. Verify email

### 1.2 Verify Access
1. Log in to Cloudflare Dashboard
2. You should see your account overview

---

## STEP 2: PREPARE CODE FOR CLOUDFLARE

### 2.1 Install Required Packages
```bash
cd YOUR_VALISEARCH_PATH
npm install @cloudflare/next-on-pages
```

### 2.2 Update next.config.ts
Read your current next.config.ts:

```typescript
// Before
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // your config
};

export default nextConfig;

// After - with Cloudflare adapter
import { createNextjsAdapter } from '@cloudflare/next-on-pages/config';

const nextConfig = {
  // your existing config
};

export default createNextjsAdapter(nextConfig);
```

### 2.3 Update package.json
```json
{
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "deploy": "npm run build && npx @cloudflare/next-on-pages"
  }
}
```

### 2.4 Create wrangler.toml
Create `wrangler.toml` in project root:

```toml
name = "valisearch"
compatibility_date = "2024-07-01"
compatibility_flags = ["nodejs_compat"]

[vars]
NEXT_PUBLIC_SUPABASE_URL = "https://placeholder.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "placeholder"
NEXT_PUBLIC_APP_URL = "https://your-app.pages.dev"

# Note: Secret keys (OPENROUTER_API_KEY, etc.) are set via CLI, NOT here
```

### 2.5 Update .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://valisearch.pages.dev
```

### 2.6 Test Build Locally
```bash
npm run build
```
Should compile without errors. Cloudflare will show some warnings about Edge Runtime - these are normal.

---

## STEP 3: PUSH CODE TO GITHUB
```bash
git add .
git commit -m "Prepare for Cloudflare deployment"
git push origin main
```

---

## STEP 4: CREATE CLOUDFLARE PAGES PROJECT

### 4.1 Go to Cloudflare Dashboard
1. Log in to https://dash.cloudflare.com
2. Select your account
3. Click "Workers & Pages" in left sidebar
4. Click "Create application"

### 4.2 Connect GitHub
1. Click "Connect GitHub"
2. Authorize Cloudflare to access your GitHub
3. Select your GitHub account
4. Select the VALISEARCH repository

### 4.3 Configure Build Settings
In the setup form:

| Setting | Value |
|---------|-------|
| **Production branch** | `main` |
| **Build command** | `npm run build` |
| **Output directory** | `.next` |
| **Node.js version** | `18` (or 20) |

### 4.4 Add Environment Variables
Scroll to "Environment variables" and add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `your-anon-key` |
| `NEXT_PUBLIC_APP_URL` | (will be auto-generated) |

### 4.5 Deploy
1. Click "Save and Deploy"
2. Wait 3-5 minutes
3. You'll get a URL like: `https://valisearch.pages.dev`

---

## STEP 5: SET UP SECRETS (CRITICAL)

### 5.1 Set Secrets via Wrangler CLI

Cloudflare requires secrets to be set via CLI for security:

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login
# Opens browser - authorize

# Set each secret
wrangler secret put OPENROUTER_API_KEY
# Enter your OpenRouter API key when prompted

wrangler secret put JINA_API_KEY
# Enter your Jina AI key

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Enter your Supabase service role key
```

### 5.2 Set Payment Gateway Secrets (Optional)
```bash
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put LEMON_SQUEEZY_SECRET
wrangler secret put FLUTTERWAVE_SECRET_KEY
wrangler secret put PAYSTACK_SECRET_KEY
```

### 5.3 Verify Secrets
In Wrangler, you can check but not view secrets:
```bash
wrangler secret list
```
Should show your secrets listed.

---

## STEP 6: SET UP SUPABASE

### 6.1 Create Supabase Project
If you haven't already:
1. Go to https://supabase.com
2. Create new project "MY VALISEARCH"
3. Wait for setup

### 6.2 Get Credentials
In Supabase Dashboard → Settings → API:
- Project URL
- anon public key
- service_role key

### 6.3 Push Migrations
```bash
npm install -g supabase
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

### 6.4 Set Supabase Edge Function Secrets
```bash
npx supabase secrets set OPENROUTER_API_KEY=your-openrouter-key
npx supabase secrets set JINA_API_KEY=your-jina-key
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## STEP 7: CONFIGURE SUPABASE FOR CLOUDFLARE

### 7.1 Add Cloudflare to Supabase Allowed Origins
In Supabase Dashboard:
1. Go to Settings → API
2. Find "Allowed Origins" or "CORS"
3. Add your Cloudflare URL:
   - `https://valisearch.pages.dev`
   - `https://*.pages.dev` (for all branches)

### 7.2 Update Environment Variables in Cloudflare
Go back to Cloudflare dashboard:
1. Workers & Pages → Your project → Settings
2. Environment Variables
3. Update with actual Supabase URL and key

### 7.3 Trigger Redeploy
1. Go to Deployments
2. Click "Redeploy" to pick up new environment variables

---

## STEP 8: VERIFY DEPLOYMENT

### 8.1 Check Health Endpoint
```bash
curl https://your-app.pages.dev/api/health
```
Expected:
```json
{"status":"ok","timestamp":"2026-05-11T...","app":"ValiSearch 2.0"}
```

### 8.2 Visit Your Site
1. Go to `https://your-app.pages.dev`
2. Check landing page loads
3. Verify all navigation works

### 8.3 Test Authentication
1. Go to `/login`
2. Try registering
3. Should work with Supabase Auth

### 8.4 Test AI Analysis
1. Log in
2. Enter a test idea
3. Click analyze
4. Watch 12 agents run

---

## STEP 9: ADD CUSTOM DOMAIN

### 9.1 Buy Domain
Buy from Cloudflare directly (cheaper) or other registrar.

### 9.2 Add Domain in Cloudflare
1. Go to Workers & Pages → Your project
2. Click "Custom domains"
3. Enter your domain
4. Cloudflare will provide DNS records

### 9.3 Configure DNS
If bought elsewhere, add these records at your registrar:

| Type | Name | Value |
|------|------|-------|
| CNAME | @ | your-project.pages.dev |
| CNAME | www | your-project.pages.dev |

### 9.4 Enable SSL
Cloudflare automatically provisions SSL. If issues:
1. Go to SSL/TLS → Overview
2. Set to "Full" or "Flexible"

---

## STEP 10: CLOUDFLARE SPECIFIC CONFIGURATION

### 10.1 Edge Runtime Compatibility
Cloudflare Workers use Edge Runtime. Some Next.js features may not work:

**Works:**
- API Routes
- Server Components
- Static pages

**May need adjustment:**
- Some npm packages (check compatibility)
- WebSockets (not supported natively)

### 10.2 Cache Configuration
In `wrangler.toml`:
```toml
[[routes]]
pattern = "/api/*"
hostname = "valisearch.pages.dev"
```

### 10.3 Timeout Settings
Cloudflare Workers have:
- CPU time: 50ms (free) / 300ms (paid)
- Duration: 15s (free) / 30s (paid)

If AI analysis times out, consider:
1. Breaking into smaller calls
2. Upgrading to Pro

---

## TROUBLESHOOTING

### Issue: "Module not found" during build
**Solution:** Some packages don't work on Edge. Add to `next.config.ts`:
```typescript
experimental: {
  serverComponentsExternalPackages: ['package-name'],
}
```

### Issue: Function timeout
**Solution:** AI analysis can take 60-90 seconds. This may exceed Cloudflare's free tier limits. Consider:
1. Upgrading to paid plan
2. Breaking analysis into chunks
3. Using Vercel instead for AI features

### Issue: "Could not resolve host"
**Solution:** Environment variables not set correctly. Check:
1. NEXT_PUBLIC_SUPABASE_URL is correct
2. Supabase project is not paused

### Issue: RLS errors
**Solution:** Users not authenticated. Ensure:
1. Auth flow works correctly
2. RLS policies allow authenticated users

### Issue: Webhooks not receiving
**Solution:** Cloudflare URLs may not be static. For webhooks:
1. Use a different deployment (Vercel or VPS)
2. Or configure proper DNS for webhook URL

---

## CLOUDFLARE LIMITS (FREE TIER)

| Resource | Limit |
|----------|-------|
| Requests/day | 100,000 |
| Build minutes/month | 500 |
| CPU time per request | 50ms |
| Max response size | 1MB |
| Bandwidth | 1GB/month |

**Note:** AI analysis (12 parallel agents) may hit these limits. Consider upgrading if needed.

---

## MONITORING

### View Logs
In Cloudflare Dashboard:
1. Workers & Pages → Your project → Functions
2. Click "Logs"
3. View real-time requests and errors

### Check Analytics
1. Workers & Pages → Your project → Analytics
2. View request counts, errors, latency

---

## QUICK COMMANDS REFERENCE

```bash
# Install dependencies
npm install @cloudflare/next-on-pages

# Build for Cloudflare
npm run build
npx @cloudflare/next-on-pages

# Set secrets
wrangler secret put OPENROUTER_API_KEY
wrangler secret put JINA_API_KEY

# Check secrets
wrangler secret list

# Login
wrangler login

# Test locally (advanced)
npx wrangler dev
```

---

## IMPORTANT NOTES

1. **Edge Runtime Differences:** Some Node.js packages won't work on Cloudflare Edge. Test thoroughly.

2. **Function Timeouts:** AI analysis is slow. May exceed free tier limits.

3. **Webhooks:** Payment webhooks may have issues with Cloudflare. Consider using a separate endpoint.

4. **Supabase Paused:** Free tier pauses after 7 days. Either upgrade or keep active.

5. **Build Times:** Cloudflare builds can take longer than Vercel.

---

## NEXT STEPS AFTER DEPLOYMENT

1. Test all features
2. Monitor usage in Cloudflare dashboard
3. Set up custom domain (optional)
4. Consider upgrading for better limits

---

*For full system documentation, see SYSTEM_REPORT.md*
*For other platforms, see VERCEL_DEPLOY.md or COOLIFY_DEPLOY.md*