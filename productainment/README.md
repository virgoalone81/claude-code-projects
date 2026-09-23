# Productainment

One song in. A 30-day TikTok and YouTube Shorts plan out. One task a day, a confidence note before each post, and a streak counter.

- **Free:** 1 song, days 1 to 7
- **$12/month:** unlimited songs, all 30 days

## Go live in 5 steps

### 1. Supabase (logins and data)
1. Create a free project at supabase.com.
2. Open **SQL Editor**, paste all of `supabase/schema.sql`, click **Run**.
3. Open **Authentication > URL Configuration**. Set **Site URL** to your live address (for example `https://productainment.vercel.app`) and add `https://productainment.vercel.app/auth/callback` under **Redirect URLs**. Add `http://localhost:3000/auth/callback` too for testing.
4. Open **Project Settings > API Keys** and copy the Project URL, the publishable key, and the secret key.

### 2. Claude (writes the plans)
1. Go to console.anthropic.com, add $10 of credit, and create an API key.

### 3. Stripe (payments)
1. In Stripe, create a product called **Productainment Full Plan**, recurring, $12/month. Copy its **Price ID** (`price_...`).
2. Copy your secret key from **Developers > API keys**.
3. Turn on the customer portal at **Settings > Billing > Customer portal** so people can cancel on their own.

### 4. Vercel (hosting)
1. Import this GitHub repository at vercel.com. Set **Root Directory** to `productainment`.
2. Add every variable from `.env.example` under **Settings > Environment Variables**. Set `NEXT_PUBLIC_SITE_URL` to your Vercel address.
3. Deploy.

### 5. Connect the Stripe webhook
1. In Stripe, go to **Developers > Webhooks > Add endpoint**.
2. URL: `https://YOUR-SITE/api/stripe/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the signing secret (`whsec_...`) into `STRIPE_WEBHOOK_SECRET` in Vercel and redeploy.

Test everything in Stripe test mode with the card `4242 4242 4242 4242`. Switch to live keys when it works.

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
| Prices and free limits | `src/lib/limits.ts` |
| Landing page | `src/app/page.tsx` |
| Song questions | `src/app/songs/new/SongForm.tsx` |
| Today's task screen | `src/app/songs/[id]/TodayCard.tsx` |
| Database setup | `supabase/schema.sql` |

Each plan costs about 10 to 20 cents in Claude usage.
