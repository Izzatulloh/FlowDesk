Next.js 16 (App Router, SSR)

AG-Grid Community v35

Supabase (Auth + Postgres + RLS)

Tailwind CSS v3 · TypeScript


src/
  app/
    actions/
      auth.ts        # signIn / signUp / signOut server actionlari
      invoices.ts    # getInvoices() server tarafda sort + filter bilan
      orders.ts      # getOrders() server tarafda sort + filter bilan
      view.ts        # grid_views uchun CRUD (har bir user uchun alohida)
    auth/callback/
      route.ts       # Supabase email tasdiqlash handleri
    login/page.tsx   # Kirish / Ro'yxatdan o'tish sahifasi
    dashboard/page.tsx  # SSR himoyalangan dashboard (saqlangan viewlarni ko'rsatadi)
    invoices/page.tsx   # Invoices grid + serverdan qayta ma'lumot olish
    orders/page.tsx     # Orders grid + serverdan qayta ma'lumot olish
  components/
    GenericGrids.tsx # Qayta ishlatiladigan AG-Grid + view management + server refetch callback
    Navbar.tsx       # Navigatsiya paneli + logout tugmasi + user email
    ui/input.tsx
  lib/
    server.ts            # Supabase SSR client
    supabase-browser.ts  # Supabase browser client (logout uchun)
    utils.ts
  middleware.ts    # Route himoyasi — login qilmagan userlarni /login ga redirect qiladi
  
  
  
✅ Email + Parol orqali Ro‘yxatdan o‘tish (email tasdiqlash bilan) va Kirish

✅ Next.js middleware orqali himoyalangan sahifalar

✅ SSR data olish (getInvoices / getOrders serverda ishlaydi)

✅ Server-side filtering va sorting — barcha sort/filter Supabase serverda bajariladi, clientda emas

✅ Qayta ishlatiladigan GenericGrid komponenti (onServerRefetch callback bilan)

✅ Har bir user uchun view saqlash (Supabase RLS orqali grid_views jadvali)

✅ To‘liq view CRUD — Yangi saqlash, Yangilash, O‘chirish

✅ Default ko‘rinadigan columnlar (boshqa columnlar yashirin lekin mavjud)

✅ Saqlanmagan o‘zgarishlar indikatori + Defaultga qaytarish

✅ Saqlangan viewni URL orqali ochish (?view=<id>)

✅ Dashboard sahifasida har bir page uchun saqlangan viewlar soni ko‘rsatiladi



Stack
Next.js 16(App Router, SSR)
AG-Grid Community v35
Supabase (Auth + Postgres + RLS)
Tailwind CSS v3 
TypeScript

 Architecture

src/
  app/
    actions/
      auth.ts        # signIn / signUp / signOut server actions
      invoices.ts    # getInvoices() with server-side sort+filter
      orders.ts      # getOrders() with server-side sort+filter
      view.ts        # CRUD for grid_views (user-scoped)
    auth/callback/
      route.ts       # Supabase email confirmation handler
    login/page.tsx   # Sign in / Sign up tabs
    dashboard/page.tsx  # SSR protected dashboard (shows saved views)
    invoices/page.tsx   # Invoices grid + server refetch
    orders/page.tsx     # Orders grid + server refetch
  components/
    GenericGrids.tsx # Reusable AG-Grid with view management + server refetch callback
    Navbar.tsx       # Nav + logout button + user email
    ui/input.tsx
  lib/
    server.ts            # Supabase SSR client
    supabase-browser.ts  # Supabase browser client (for logout)
    utils.ts
  middleware.ts    # Route protection — redirects unauthenticated users to /login
```

## Features
- ✅ Email + Password **Sign Up** (with email confirmation) & **Sign In**
- ✅ Protected routes via Next.js **middleware**
- ✅ SSR data fetching (`getInvoices` / `getOrders` called server-side)
- ✅ **Server-side filtering & sorting** — every sort/filter change hits Supabase, not the client
- ✅ Reusable `GenericGrid` component with `onServerRefetch` callback
- ✅ Per-user view persistence via Supabase **RLS** (`grid_views` table)
- ✅ Full view CRUD — Save as New, Update, Delete
- ✅ Default visible columns (extra columns hidden but accessible)
- ✅ Unsaved changes indicator + Reset to Default
- ✅ Deep-link a saved view via `?view=<id>` URL param
- ✅ Dashboard shows saved view counts per page


### 2. Configure `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run SQL Migration
Open `supabase_migration.sql` in your Supabase SQL Editor and run it.
This creates `invoices`, `orders`, `grid_views` tables, inserts 15 rows of sample data each, and configures RLS.

### 4. Enable Email Auth in Supabase
Dashboard → Authentication → Providers → Email → Enable

### 5. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

## Pages
| Route | Description |
|-------|-------------|
| `/login` | Sign in / Sign up |
| `/dashboard` | Protected dashboard with saved view summary |
| `/invoices` | Invoices grid with view management |
| `/orders` | Orders grid with view management |

## Server-Side Sort & Filter
When the user sorts or filters in AG-Grid, `onSortChanged` / `onFilterChanged` fires → extracts the AG-Grid sort/filter model → calls `getInvoices(sortModel, filterModel)` as a Next.js Server Action → Supabase builds the query server-side → new data replaces the grid rows. No data processing happens on the client.
