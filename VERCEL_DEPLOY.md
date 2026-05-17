# VALISEARCH 2.0 - DEPLOY TO VERCEL (COMPLETE GUIDE)

---

## PREREQUISITES

Before deploying to Vercel, ensure you have:

1. **GitHub Account** with your VALISEARCH repository
2. **Vercel Account** (free at https://vercel.com)
3. **Supabase Project** created at https://supabase.com
4. **API Keys** ready:
   - OpenRouter API key (https://openrouter.ai)
   - Jina AI API key (https://jina.ai)
   - Payment gateway keys (Stripe, Lemon Squeezy, etc.)

---

## STEP 1: PREPARE YOUR CODE

### 1.1 Ensure code is on GitHub
```bash
# If not already done, push your code
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 1.2 Verify build works locally
```bash
npm run build
```
Should show: 40 routes, 0 errors

---

## STEP 2: SET UP SUPABASE

### 2.1 Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Enter:
   - **Name:** MY VALISEARCH
   - **Database Password:** Set a strong password (save it!)
   - **Region:** Choose closest to you
4. Click "Create new project"
5. Wait 2-3 minutes for setup

### 2.2 Get Credentials
1. Go to Project Settings (gear icon) → API
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
3. Go to Settings → API → Service Role Key
4. Copy **service_role** key (BE CAREFUL - this has full access)

### 2.3 Push Database Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Navigate to your project
cd YOUR_VALISEARCH_PATH

# Link to your project (use your project ref from URL)
npx supabase link --project-ref YOUR_PROJECT_REF
# Example: npx supabase link --project-ref abcdefghij

# Enter your database password when prompted

# Push all migrations
npx supabase db push
```

### 2.4 Set Edge Function Secrets
```bash
npx supabase secrets set OPENROUTER_API_KEY=your-openrouter-key
npx supabase secrets set JINA_API_KEY=your-jina-key
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2.5 Verify Database Tables
In Supabase Dashboard → SQL Editor, run:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```
You should see 25+ tables.

---

## STEP 3: CREATE VERCEL PROJECT

### 3.1 Go to Vercel
1. Visit https://vercel.com
2. Log in (use GitHub account)
3. Click "Add New..." → Project

### 3.2 Import from GitHub
1. Find your VALISEARCH repository
2. Click "Import"
3. Configure:
   - **Framework Preset:** Next.js (should auto-detect)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

### 3.3 Environment Variables
Scroll down to "Environment Variables" and add:

| Name | Value | Type |
|------|-------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `your-anon-key` | Public |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Public |

**Note:** Secret keys (like OPENROUTER_API_KEY) will be set via Vercel Secrets, not here.

### 3.4 Deploy
1. Click "Deploy"
2. Wait 2-5 minutes for build
3. You'll see "Ready" when done

---

## STEP 4: CONFIGURE SECRETS (POST-DEPLOYMENT)

### 4.1 Go to Project Settings
In Vercel dashboard:
1. Click your project
2. Go to Settings → Environment Variables

### 4.2 Add Secret Variables
Add these as **Secret** (not plain text):

```
OPENROUTER_API_KEY=your-openrouter-key
JINA_API_KEY=your-jina-key
SE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4.3 Add Payment Gateway Secrets (Optional)
```
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
LEMON_SQUEEZY_SECRET=your-ls-secret
FLUTTERWAVE_SECRET_KEY=your-fw-key
PAYSTACK_SECRET_KEY=your-ps-key
```

### 4.4 Redeploy
After adding secrets, go to Deployments tab and click "Redeploy" on the latest deployment.

---

## STEP 5: VERIFY DEPLOYMENT

### 5.1 Check Health Endpoint
```bash
curl https://your-project.vercel.app/api/health
```
Expected response:
```json
{"status":"ok","timestamp":"2026-05-11T...","app":"ValiSearch 2.0"}
```

### 5.2 Visit Your Site
1. Go to `https://your-project.vercel.app`
2. Check landing page loads
3. Check navigation works

### 5.3 Test Login
1. Go to `/login`
2. Try to register a new account
3. Should redirect to onboarding

### 5.4 Test AI Analysis
1. After logging in, go to dashboard
2. Enter a test idea: "AI-powered meal planning app"
3. Click analyze
4. Should see 12 agents running

---

## STEP 6: CUSTOM DOMAIN (OPTIONAL)

### 6.1 Buy a Domain
Buy from Namecheap, Cloudflare, or domain registrar of choice.

### 6.2 Add Domain to Vercel
1. Go to Project Settings → Domains
2. Enter your domain (e.g., `valisearch.com`)
3. Vercel will give you DNS records to add

### 6.3 Update DNS at Registrar
Add the DNS records Vercel provides:
- Typically: A record pointing to Vercel's IP
- Or: CNAME pointing to `cname.vercel-dns.com`

### 6.4 Wait for Propagation
- DNS can take 24-48 hours
- Check with: `nslookup your-domain.com`

---

## STEP 7: MONITORING & LOGS

### 7.1 View Logs
In Vercel dashboard:
1. Go to Deployments
2. Click on any deployment
3. View "Function Logs" for API route issues

### 7.2 Check Runtime Errors
1. Go to Dashboard → Runtime
2. Look for any errors

### 7.3 Supabase Logs
In Supabase dashboard:
1. Go to Logs → Explorer
2. Query for errors

---

## TROUBLESHOOTING

### Issue: "Project is paused" (Supabase)
**Solution:** In Supabase dashboard, click "Resume project" (free tier pauses after 7 days of inactivity)

### Issue: "Connection refused"
**Solution:** Check NEXT_PUBLIC_SUPABASE_URL is correct and project is not paused

### Issue: "RLS policy denied"
**Solution:** User not authenticated. Ensure user is logged in before API calls

### Issue: "Edge Function deployment failed"
**Solution:** Ensure secrets are set correctly in Supabase

### Issue: Build failed on Vercel
**Solution:** Check build logs in Vercel. Common issues:
- Missing dependencies
- TypeScript errors
- Environment variables missing

### Issue: Webhooks not working
**Solution:** 
- Verify webhook URL is publicly accessible
- Check webhook signatures match
- Check Supabase project is not paused

---

## QUICK COMMANDS REFERENCE

```bash
# Build locally
npm run build

# Deploy to Vercel (if CLI installed)
vercel --prod

# Check environment
echo $NEXT_PUBLIC_SUPABASE_URL

# Test API locally
curl http://localhost:3000/api/health

# Supabase commands
npx supabase db push
npx supabase functions serve
npx supabase secrets set KEY=value
```

---

## IMPORTANT NOTES

1. **Supabase Free Tier:** Pauses after 7 days of inactivity. Either:
   - Upgrade to paid (~$25/month)
   - Or keep using regularly to prevent pause

2. **API Rate Limits:** OpenRouter and Jina have rate limits. Monitor usage in their dashboards.

3. **Environment Variables in Build:** 
   - Public vars (NEXT_PUBLIC_*) are embedded at build time
   - If you change them, you must rebuild/deploy again

4. **Vercel Analytics:** Enable in dashboard for performance monitoring

---

## NEXT STEPS

After successful deployment:
1. Test all features thoroughly
2. Set up payment gateway test mode
3. Add custom domain (optional)
4. Enable Vercel Analytics
5. Set up monitoring alerts

---

*For full system documentation, see SYSTEM_REPORT.md*
*For other deployment platforms, see CLOUDFLARE_DEPLOY.md or COOLIFY_DEPLOY.md*