

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
NEXT_PUBLIC_SITE_URL='site-link'



 4. Enable Email Auth in Supabase
Dashboard → Authentication → Providers → Email → Enable



Pages
| Route | Description |
|-------|-------------|
| `/login` | Sign in / Sign up |
| `/dashboard` | Protected dashboard with saved view summary |
| `/invoices` | Invoices grid with view management |
| `/orders` | Orders grid with view management |

Server-Side Sort & Filter
When the user sorts or filters in AG-Grid, `onSortChanged` / `onFilterChanged` fires → extracts the AG-Grid sort/filter model → calls `getInvoices(sortModel, filterModel)` as a Next.js Server Action → Supabase builds the query server-side → new data replaces the grid rows. No data processing happens on the client.
