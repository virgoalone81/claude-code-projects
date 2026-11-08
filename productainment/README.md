# Productainment

One song in. A 30-day TikTok and YouTube Shorts plan out. One task a day, a confidence note before each post, and a streak counter.

- **Free week (first 10 sign-ups only):** 1 song, days 1 to 7, no card. The landing page shows how many of the 10 spots are left.
- **Full plan, $12/month:** unlimited songs, all 30 days. Everyone after the first 10 starts here.

## Launch checklist

### 1. Supabase (logins and data). Your project "Productainment" already exists.
1. Sign in at supabase.com/dashboard, open **Productainment** and click **Restore**. It was paused on Sep 30, 2026 for inactivity and can be restored until about Dec 28, 2026. After launch, the daily keep-alive (`vercel.json`) stops it from pausing again.
2. Open **SQL Editor**, paste all of `supabase/schema.sql` and click **Run**. It is safe to run more than once.
3. Open **Authentication > URL Configuration**. Set **Site URL** to `https://app.musicbizmanifesto.com` and add `https://app.musicbizmanifesto.com/auth/callback` and `http://localhost:3000/auth/callback` under **Redirect URLs**.
4. Connect a real email sender for login links. Supabase's built-in email only reaches your own team, 2 emails an hour. The fastest route: a free Resend account, then Resend's Supabase integration, which fills in **Authentication > Emails > SMTP Settings** for you.
5. Copy the keys from **Project Settings > API Keys** into Vercel (step 4), or connect Supabase from Vercel's **Integrations** page and it fills them in for you.

### 2. Claude (writes the plans). You have $100 of API credit.
1. At platform.claude.com open **API Keys**, create a key named `Productainment` and put it in Vercel as `ANTHROPIC_API_KEY`. Each plan costs about 10 to 20 cents, so $100 covers roughly 500 to 1,000 plans.

### 3. Stripe (payments). Your recurring price already exists.
1. In **Product catalog**, rename the product "Productianment" to **Productainment Full Plan**. Customers see this name at checkout and on receipts.
2. Check the price is **$12.00 a month, recurring**. Copy its **Price ID** (`price_...`) into Vercel as `STRIPE_PRICE_ID`.
3. Open **Settings > Billing > Customer portal** and turn on cancellations, so people can cancel on their own.
4. Copy your secret key from **Developers > API keys** into Vercel as `STRIPE_SECRET_KEY`. Start in test mode.

### 4. Vercel (hosting). Your account already exists.
1. Move to the **Pro** plan. Vercel's free Hobby plan does not allow apps that take payments.
2. **Add New > Project**, import `virgoalone81/claude-code-projects`, set **Root Directory** to `productainment`.
3. Add every variable from `.env.example` under **Settings > Environment Variables**, then **Deploy**.
4. Under **Settings > Domains**, add `app.musicbizmanifesto.com`. Vercel shows one CNAME record to add at GoDaddy.

### 5. Stripe webhook
1. In Stripe, **Developers > Webhooks > Add endpoint**.
2. URL: `https://app.musicbizmanifesto.com/api/stripe/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the signing secret (`whsec_...`) into Vercel as `STRIPE_WEBHOOK_SECRET` and redeploy.

### 6. Test, then launch
1. Sign up with your own email, build a plan, pay with Stripe's test card `4242 4242 4242 4242`, then cancel under **Manage billing**.
2. In Supabase **SQL Editor**, run `supabase/reset-free-spots.sql`. Your test accounts give their free spots back, so all 10 go to real artists.
3. Switch Stripe to live mode: live secret key, live Price ID and a live webhook secret in Vercel. Redeploy.
4. Announce it. The first 10 artists get the free week.

## Run it on your computer

```bash
cd productainment
cp .env.example .env.local   # fill in the values
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

| What | File |
| --- | --- |
| The instructions Claude follows to write each plan | `src/lib/plan.ts` |
| Prices, free week and the 10 free spots | `src/lib/limits.ts` (and `trial_spots_total()` in `supabase/schema.sql`) |
| Landing page and the free-spots counter | `src/app/page.tsx` |
| Song questions | `src/app/songs/new/SongForm.tsx` |
| Today's task screen | `src/app/songs/[id]/TodayCard.tsx` |
| Terms, Privacy, Refunds | `src/app/terms`, `src/app/privacy`, `src/app/refunds` |
| Database setup | `supabase/schema.sql` |
| Daily keep-alive for Supabase | `vercel.json` and `src/app/api/keepalive/route.ts` |
