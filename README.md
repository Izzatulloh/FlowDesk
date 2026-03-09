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