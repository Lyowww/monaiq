# MonAIQ — Marketing & SMM Handbook

**Purpose:** Single source of truth for social, performance, lifecycle, and partner marketing.  
**Product:** MonAIQ mobile app (Expo / iOS & Android).  
**Audience:** Marketing managers, SMM, copywriters, PR, and agencies.  
**Last updated from codebase:** April 2026.

---

## 1. What is MonAIQ? (Elevator pitch)

**MonAIQ** is an **Armenia-first, AMD-native personal finance companion** that helps people log income and spending, see balances and trends, manage bills and debts, and get **AI coaching grounded in their own data**—not generic investing advice.

**Official brand line:** *“Your financial friend.”*  
**Positioning line (auth / registration):** *“Green-field intelligence for your money. Secure sign-in.”* with *“Armenia & AMD first.”*

Use **MonAIQ** (capital M, AI, Q) consistently. Package IDs: `com.monaiq.app` (iOS/Android).

---

## 2. Problem we solve

| User pain | How MonAIQ helps |
|-----------|------------------|
| Money feels invisible at month-end | Clear **in / out**, **daily burn**, and **category** views from what they log |
| Hard to remember bills and loans | **Upcoming payments**, **obligations**, and **due-date** style awareness in the app |
| Generic finance apps ignore dram & local context | **AMD-first** formatting, **reference exchange rates**, multi-currency entry with **AMD conversion** |
| “ChatGPT” gives advice that ignores their wallet | **AI assistant** framed on **budget, affordability, past spending, what to pay first**—explicitly **not** generic investing advice |
| Logging is tedious | **Quick expense** text (e.g. `kfc 3500`), **quick add** with categories, optional **voice** input path |

---

## 3. Who is it for? (Target segments)

- **Everyday earners and households in Armenia** who want clarity on cash, card, bills, and loans in **AMD**.
- **People who are new to budgeting** and need **gentle coaching** and **plain-language** AI, not spreadsheets.
- **Privacy-conscious users** who want a **signed-in, session-based** app with insights tied to **their** history.
- **Bilingual users:** the app supports **English and Armenian** UI (EN / հայ toggle in-product).

Adjust tone: **friendly, practical, non-judgmental**—“friend,” not “bank.”

---

## 4. Core product pillars (messaging pillars)

Use these consistently in campaigns:

1. **Armenia-first, dram-native** — Balances, trends, and rates speak the user’s real context.  
2. **Your data, your coach** — AI answers are tied to **logged activity**, not the open web.  
3. **See money in motion** — Inflow, outflow, burn, categories, and upcoming obligations in one place.  
4. **Log fast, learn faster** — Quick text entry, categories, pockets (card vs cash), optional voice.  
5. **Plan with purpose** — **Financial plans** (caps, category limits, savings goals) that the **assistant reads** when replying.

---

## 5. Main navigation (what users see)

Bottom tabs (conceptual names in English copy):

| Tab | User-facing name | Role |
|-----|------------------|------|
| Home | **Home** / Smart board | Dashboard: balances, quick actions, burn, benchmarks strip, AI snapshot, recent activity |
| Stats | **Analytics** | Charts: spending flow, in/out, periods, coach copy, savings goals, obligations |
| Assistant | **Assistant** | AI hub: full chat, shortcuts, settings, suggested questions |
| Wallet | **Wallet** | Debts, bills, recurring, history, **exchange rates** entry |
| Profile | **Profile** | Language, currency, subscription, notifications, legal, AI entry points |

---

## 6. Feature catalog (detailed)

### 6.1 Account & onboarding

- **Email + password** registration and sign-in.  
- Profile fields include **first name, last name, date of birth** (YYYY-MM-DD).  
- **Secure session** experience (JWT access + refresh pattern in architecture).  
- **Branded splash** with tagline on load.

**Marketing note:** Emphasize **trust** and **simple onboarding**—no overwhelming bank paperwork language.

---

### 6.2 Home / “Smart board”

- **Personalized greeting** (“Hi, {name}”).  
- **Total balance** with split context: **on card** vs **cash on hand** (from logged activity).  
- **Monthly flow:** **In** and **Out** for the current month.  
- **AI insight** area: short **snapshot** when there is activity; placeholder nudge to log for tips.  
- **Priority strip:** **Loans & utilities — upcoming** (chips for loan vs utility where relevant).  
- **Daily burn (this month)** — gauge-style view of spend vs budget-style framing.  
- **Utilities vs Armenian median** benchmark (copy notes **when enough anonymized data is available**—do not overpromise mass benchmark in early launch).  
- **Privacy comfort:** **Show / hide balance** toggle.  
- **Quick income & expense** entry points; **“ghost mode”** style behavior (long-press hint in copy) for discrete logging.  
- **One-tap spend** bubbles and **liquid flow** tap targets for fast entry.  
- **Recent activity** list with **See all** affordance.  
- **Analytics preview** card linking to full **Analytics** tab.  
- **Text shortcut (advanced)** for power users.  
- **Menu:** language, sign out.

---

### 6.3 Logging & money movement

- **Quick add transaction:** Expense or income, **category** (food & dining, transport, groceries, utilities, entertainment, health, general), **currency**, amount.  
- **Non-AMD amounts** converted to dram using **current reference rates** (linked to Wallet rate table).  
- **Pocket selection:** **Add income to** / **Pay expense from** — **on card** or **cash** (where money “lives” now).  
- **Post-income messaging** can reference **next bill** and timing when data allows.  
- **Quick entry / text command** (e.g. `kfc 3500`) with server-side parsing.  
- **Voice path:** Microphone for **voice input** → transcription pipeline (user must grant mic permission).  
- **Categories** aligned to everyday life—good for **relatable** social content (“groceries vs dining out”).

---

### 6.4 Analytics (Stats)

- **Subtitle:** Inflow & outflow.  
- **Spending flow** with **period** selection: **7 / 30 / 90 days**.  
- **In, out, net** summary.  
- **Inflow vs outflow (daily)** chart with tap affordances (per-day detail hints in copy).  
- **Top spending category** with honest empty state: need more logged debits.  
- **Sparkline**-style views with peak/low callouts where data exists.  
- **Coach section:** “What your activity suggests” — rules like: income missing vs spend-heavy, negative net, tight margin, **save money** priority, default “keep logging.”  
- **Saving money** block tied to **savings plan progress** (title, saved vs target).  
- **Obligations (30d)**, **load / pressure** language, **due-date reminders**, **projected shortfall** copy when applicable.  
- **Rule-based insights** and **“nothing critical right now”** states.  
- **MonAIQ Plus paywall** on **advanced cashflow / analytics** (see §7)—free users see **unlock** messaging pointing to **plans**.

---

### 6.5 AI assistant

- **Positioning:** “**AI finance coach**” with **“Your data”** emphasis.  
- **Scope statement (use verbatim in campaigns):** *“Budget, affordability, past spending, what to pay first. No generic investing advice here.”*  
- **Full-screen chat** with **plain-language** input.  
- **Suggested questions** (examples—good for ad hooks and story scripts):

  - Can I afford this purchase right now?  
  - How can I save more money this month?  
  - Why does it feel like I am overspending this month?  
  - Can I afford to spend 50,000 AMD this week?  
  - Should I pay loans or rent first?  
  - How much did I spend in the last 30 days?  
  - Will my balance cover upcoming bills?  
  - What are my biggest spending categories?  
  - How does my spending compare to my income this month?  
  - Do I have any payments or debts due soon?  
  - How can I set aside a small safety buffer next month?  
  - Should I focus on paying off debt or on saving first?  
  - Where did most of my money go recently?  
  - Can I still cover rent and utilities with my current balance?  
  - What weekly spending limit would be realistic for me?  
  - How can I reduce non-essential spending without a big lifestyle change?  
  - Based on my data, how is my spending split between cash and card?

- **AI hub** tiles: open full chat, **Analytics** shortcut, **Try asking**, **AI settings** (priority & coach preferences).  
- **AI settings:** **“I want to save money”** priority—analytics can **highlight save-friendly tips** when set.  
- **Recent chats** with history (with graceful error if a chat can’t load).  
- **Error copy** for network, server, auth, permission—SMM should not promise 100% uptime; position as *best effort*.

---

### 6.6 Financial plans (caps & goals)

- **List:** Active plans; empty state encourages **cap or savings goal** so the **assistant tracks them**.  
- **Types:** **Monthly cap**, **Category cap**, **Savings goal**.  
- Fields: title, amounts in **AMD**, category where relevant, **already saved** for goals, optional notes.  
- **Actions:** Save, archive, delete (with confirm copy).  
- **Marketing angle:** *“Tell the app what you’re trying to do; the coach remembers.”*

---

### 6.7 Wallet

- **Framing:** **Debts · bills · recurring**.  
- **Transaction history** (empty state for new users).  
- **Upcoming payments** and **recurring (pending)**.  
- **I owe** / **They owe me** (social lending clarity).  
- **Exchange rates** screen: **buy, sell, mid in AMD**; **as-of** date; **JPY** note (per 1 yen vs per 10 in references). **Error** state for offline/network.

---

### 6.8 Notifications

- In-app **Notifications** list.  
- Empty state: **bill reminders and balance nudges** *when available*.  
- Profile shows **bills** vs **low balance** style toggles in copy.  
- Push is part of the **value story** (reminders)—exact behavior may evolve; avoid promising specific cadence without product sign-off.

---

### 6.9 Profile & settings

- **Reminders** toggle.  
- **Currency** preference.  
- **Subscription** (Free vs Premium / Plus).  
- **Notifications** line item.  
- **Open AI** entry.  
- **Legal:** Terms of Service, Privacy Policy.  
- **Defaults** section.

---

### 6.10 MonAIQ Plus (subscription)

**Product name in-app:** *MonAIQ Plus*  
**Tagline:** *Unlock deeper analytics, planning tools, and more.*  
**CTA examples:** Subscribe now, Continue with Free, Upgrade, Manage subscription.  
**Demo note in app:** Subscription may **activate immediately on device** in demo builds **without card charge**—**do not** use this in public consumer claims unless the shipped store build matches.

**Paywall** can reference a **locked feature** by name when user hits a premium gate (e.g. **advanced inflow & outflow trends** on Analytics).

**Backend feature catalog** (for plans, packaging, and B2B storytelling—these are **product intention**; confirm each is live in a given release before hard claims):

| Feature ID | Public title | One-line description |
|------------|--------------|----------------------|
| `ai_assistant_extended` | Extended AI assistant | Higher daily limits, longer context for finance Q&A |
| `advanced_analytics` | Advanced analytics | Trends, category breakdowns, custom date ranges |
| `smart_insights` | Smart insights | Automated summaries, unusual-spending detection |
| `debt_tools_pro` | Pro debt tools | Snowball/avalanche planners, payoff simulations |
| `scheduled_payments_sync` | Scheduled payments | Reminders, calendar sync for bills & subscriptions |
| `export_reports` | Exports & reports | CSV/PDF for transactions and tax prep |
| `multi_currency` | Multi-currency | Hold and convert AMD, USD, EUR with live rates |
| `custom_categories` | Custom categories & rules | Unlimited categories, auto-tagging rules |
| `priority_support` | Priority support | Faster responses from the MonAIQ team |
| `early_access` | Early access | New assistant models and beta features first |

**Marketing process:** For each campaign, get **product** to sign off on **“live in production”** vs **“on roadmap.”**

---

## 7. Technical trust story (non-technical summary)

- **Session-based sign-in** and **server-backed** data (not only on-device).  
- Architecture supports **offline-friendly** mobile usage (cached data / replay—good for *“works when connectivity is spotty”* only if QA validates).  
- **FX rates** from **reference / aggregated** sources—position rates as **indicative**, not a trading or bank execution price.

**Compliance:** Always defer **exact legal claims** to **Terms** and **Privacy** and **compliance** review for regulated language.

---

## 8. What we are not (guardrails for copy)

- **Not a bank** — No insured deposits, no lending decisions from the app copy unless product adds them.  
- **Not investment advice** — The assistant itself says **no generic investing advice**; marketing must align.  
- **Not a promise of “median Armenian” utility benchmarks** until data thresholds are met—use *“where available”* language.  
- **Not guaranteed bill pay** — Reminders and insights are **informational**.

---

## 9. SMM content angles (ready-to-use)

1. **“Dram in, dram out”** — Short videos of logging a coffee in seconds + weekly summary.  
2. **“Ask MonAIQ”** — Stitched stories using **suggested questions** (affordability, bills due, biggest categories).  
3. **Card vs cash** — Pocket split; relatable for Armenia spending habits.  
4. **Month-end clarity** — Before/after: fuzzy memory vs **in/out** chart.  
5. **Savings goal** — Human story + **plan** + AI **save** priority.  
6. **Bilingual** — EN/ՀՅ screens side-by-side for local authenticity.  
7. **Exchange rates** — *Indicative* table screenshot + “understand your FX lunch money.”  
8. **Responsible tone** — Normalize tradeoffs (*pay rent vs loan*) without shame.

**Hashtags (examples, localize):** `#MonAIQ` `#FinTechAM` `#AMD` `#PersonalFinance` `#AI` (compliant with each platform’s rules)

---

## 10. App store & listing boilerplate (draft — localize)

**Subtitle:** Your financial friend—money clarity, smart analytics, AI coach.  
**Short description (≈2–3 sentences):**  
MonAIQ helps you log income and spending in seconds, see balances and trends in **AMD**, manage bills and debts, and ask an **AI coach** that uses **your** data—so answers fit your life, not a random blog. Built **Armenia-first**, with **English and Armenian** support.

**Long description outline:**  
Problem → features (log, analytics, wallet, plans, AI) → exchange rates → Plus overview → security/legal links.

---

## 11. FAQ (for SMM and press)

**Q: Is MonAIQ a bank?**  
A: No. It’s a **personal finance tool** to track and understand your money.  

**Q: Does the AI give investment tips?**  
A: The product is **explicitly not** for generic investing advice. It focuses on **budgeting, affordability, bills, and spending** from **your logs**.  

**Q: What currency is primary?**  
A: **AMD (dram)** is native; you can work with other currencies and see **indicative** dram equivalents.  

**Q: Is my data used to train random models?**  
A: **Do not invent an answer**—point to **Privacy Policy** and product/legal for the official line.  

**Q: What’s MonAIQ Plus?**  
A: A **paid tier** for **deeper analytics**, more AI capacity, and other premium capabilities—see **§6.10** and live paywall in app.  

---

## 12. Handoff & updates

- **Source of in-product truth:** `mobile/src/locales/en.json`, `hy.json`, and `app.json` (name, bundle id).  
- **Subscription feature names:** `backend/src/modules/admin/subscription-features.catalog.ts`.  
- **README positioning:** `README.md` — *“Armenia-first personal finance coaching.”*

When the product team ships a new release, **update this handbook** and **re-export** the FAQ and store copy.

---

*This handbook is an internal marketing reference derived from the repository. It is not legal or financial advice.*
