import { useState, useEffect, useCallback, memo } from 'react';
import { products as PRODUCTS } from "./data/products";
import {
  Crown, MessageCircle, Gamepad2, Key, Zap, Star, ShieldCheck,
  ChevronRight, Plus, Minus, Home, Clock, CheckCircle2,
  Sparkles, Menu, X, AlertTriangle, Tag,
} from 'lucide-react';

type Page = 'home' | 'funtime' | 'client' | 'cheat';

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: 'client' | 'funtime' | 'cheat';
  price_uzs: number;
  unit_label: string | null;
  badge_text: string | null;
  has_quantity: boolean;
  accent_color: string;
  is_popular: boolean;
  sort_order: number;
  image_pexels: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ACCENT: Record<string, { btn: string; glow: string; text: string }> = {
  amber:  { btn: 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-amber-500/30',   glow: 'bg-amber-900/30',   text: 'text-amber-400'  },
  cyan:   { btn: 'bg-gradient-to-r from-cyan-500 to-teal-500 shadow-cyan-500/30',       glow: 'bg-cyan-900/30',    text: 'text-cyan-400'   },
  violet: { btn: 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-violet-500/30', glow: 'bg-violet-900/30',  text: 'text-violet-400' },
  sky:    { btn: 'bg-gradient-to-r from-sky-500 to-blue-500 shadow-sky-500/30',         glow: 'bg-sky-900/30',     text: 'text-sky-400'    },
  orange: { btn: 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-500/30',  glow: 'bg-orange-900/30',  text: 'text-orange-400' },
  pink:   { btn: 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-500/30',       glow: 'bg-pink-900/30',    text: 'text-pink-400'   },
  yellow: { btn: 'bg-gradient-to-r from-yellow-500 to-amber-400 shadow-yellow-500/30',  glow: 'bg-yellow-900/30',  text: 'text-yellow-400' },
  red:    { btn: 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30',         glow: 'bg-red-900/30',     text: 'text-red-400'    },
  emerald:{ btn: 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/30',glow: 'bg-emerald-900/30', text: 'text-emerald-400'},
};
const ac = (c: string) => ACCENT[c] || ACCENT.emerald;

function fmt(n: number) {
  return new Intl.NumberFormat('uz-UZ').format(n) + ' so\'m';
}

function calcTotal(product: Product, qty: number): number {
  const base = product.price_uzs * qty;
  // 50% discount on Maneta when qty >= 50 (i.e. 50 million maneta)
  if (product.unit_label?.toLowerCase().includes('maneta') && qty >= 50) {
    return Math.round(base * 0.5);
  }
  return base;
}

function tgLink(product: Product, qty: number, total: number) {
  const qtyStr = product.has_quantity ? ` (${qty} dona)` : '';
  const discount = product.unit_label?.toLowerCase().includes('maneta') && qty >= 50
    ? ' | 50% SKIDKA!' : '';
  return `https://t.me/MuxammaddinTairov?text=${encodeURIComponent(
    `Assalomu alaykum! Men ${product.name}${qtyStr} sotib olmoqchiman. Jami: ${fmt(total)}${discount}`
  )}`;
}

// ─── Product Card (memoized — never unmounts when qty changes) ─────────────────
const ProductCard = memo(function ProductCard({
  product, qty, onQty,
}: {
  product: Product;
  qty: number;
  onQty: (delta: number) => void;
}) {
  const colors = ac(product.accent_color);
  const total = calcTotal(product, qty);
  const isManeta = !!product.unit_label?.toLowerCase().includes('maneta');
  const hasDiscount = isManeta && qty >= 50;
  const baseTotal = product.price_uzs * qty;

  // Unit label display: "1 000 000 Maneta = 1 000 so'm"
  function renderUnitLabel() {
    if (!product.unit_label) return null;
    return (
      <div className="qty-track px-3 py-2 text-xs text-gray-400 leading-relaxed">
        <span className={`font-semibold ${colors.text}`}>{product.unit_label}</span>
        {' = '}
        <span className="font-semibold text-gray-300">{fmt(product.price_uzs)}</span>
      </div>
    );
  }

  const unitSuffix = isManeta ? 'mln maneta'
    : product.unit_label?.includes('token') ? '× 5k token'
    : product.unit_label?.includes('Donat') ? 'kalit'
    : product.unit_label?.includes('Token Key') ? 'kalit'
    : 'obuna';

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Image */}
     <div className="relative h-44 overflow-hidden shrink-0">
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover"
    loading="lazy"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-[#12121c]/90 via-[#12121c]/20 to-transparent" />
</div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="text-lg font-bold text-white leading-tight">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">{product.description}</p>
          )}
        </div>

        {renderUnitLabel()}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
            <Tag className="w-3 h-3" />
            50 mln+ maneta — 50% skidka!
          </div>
        )}

        {/* Quantity */}
        {product.has_quantity && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onQty(-1)}
              className="qty-btn"
              aria-label="Kamaytirish"
            >
              <Minus className="w-3.5 h-3.5 text-white" />
            </button>
            <span className="flex-1 qty-track text-center py-1.5 text-sm font-semibold text-white tabular-nums">
              {qty}
            </span>
            <button
              onClick={() => onQty(1)}
              className="qty-btn"
              aria-label="Ko'paytirish"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </button>
            <span className="text-xs text-gray-500 shrink-0">{unitSuffix}</span>
          </div>
        )}

        {/* Price + Buy */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">
              {product.has_quantity ? 'Jami' : 'Narx'}
            </div>
            {hasDiscount && (
              <div className="text-xs text-gray-600 line-through tabular-nums">{fmt(baseTotal)}</div>
            )}
            <div
              className={`font-bold leading-tight tabular-nums transition-all duration-200 ${colors.text} ${total >= 100000 ? 'text-base' : 'text-xl'}`}
            >
              {fmt(total)}
            </div>
          </div>
          <a
            href={tgLink(product, qty, total)}
            target="_blank"
            rel="noopener noreferrer"
            className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg ${colors.btn} transition-all duration-200 hover:scale-105 hover:shadow-xl`}
            >
         <MessageCircle className="w-4 h-4" />
         Sotib olish
        </a>
      </div>
     </div>
    </div>
   );
  });

// ─── Product Grid (top-level stable component — no re-mount on qty change) ────
const ProductGrid = memo(function ProductGrid({
  products, quantities, onQty, limit,
}: {
  products: Product[];
  quantities: Record<string, number>;
  onQty: (id: string, delta: number) => void;
  limit?: number;
}) {
  const shown = limit ? products.slice(0, limit) : products;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {shown.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          qty={quantities[p.id] ?? 1}
          onQty={(d) => onQty(p.id, d)}
        />
      ))}
    </div>
  );
});

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const updateQty = useCallback((id: string, delta: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] ?? 1) + delta) }));
  }, []);

useEffect(() => {
  setProducts(PRODUCTS);

  const q: Record<string, number> = {};

  PRODUCTS.forEach((p) => {
    q[p.id] = 1;
  });

  setQuantities(q);
  setLoading(false);
}, []);

  const navigate = useCallback((p: Page) => {
    setPage(p);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const funtime = products.filter((p) => p.category === 'funtime');
  const clients = products.filter((p) => p.category === 'client');
  const cheats  = products.filter((p) => p.category === 'cheat');

  const PAGE_COLOR: Record<Page, string> = {
    home: 'text-emerald-400', funtime: 'text-amber-400',
    client: 'text-violet-400', cheat: 'text-cyan-400',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="glow-blob w-[500px] h-[500px] bg-emerald-900/20 -top-40 -left-40" />
        <div className="glow-blob w-[600px] h-[600px] bg-violet-900/15 top-1/2 -right-60" style={{ animationDelay: '3s' }} />
        <div className="glow-blob w-[400px] h-[400px] bg-cyan-900/15 bottom-0 left-1/3" style={{ animationDelay: '6s' }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-[60px] gap-6">
            <button onClick={() => navigate('home')} className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold text-white">
                Muxa <span className="text-emerald-400">Vault</span>
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1 flex-1">
              {([ 'home', 'funtime', 'client', 'cheat'] as Page[]).map((p) => {
                const labels: Record<Page,string> = { home:'Bosh sahifa', funtime:'Funtime.su', client:'Clientlar', cheat:'Cheatlar' };
                return (
                  <button
                    key={p}
                    onClick={() => navigate(p)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      page === p
                        ? `${PAGE_COLOR[p]} bg-white/5 border border-white/10`
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {labels[p]}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              
              <a
                href="https://t.me/MuxammaddinTairov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Telegram</span>
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-white/5"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden pb-3 pt-1 border-t border-white/5">
              {([ 'home', 'funtime', 'client', 'cheat'] as Page[]).map((p) => {
                const labels: Record<Page,string> = { home:'Bosh sahifa', funtime:'Funtime.su', client:'Clientlar', cheat:'Cheatlar' };
                const icons: Record<Page, React.ReactNode> = {
                  home: <Home className="w-4 h-4" />, funtime: <Key className="w-4 h-4" />,
                  client: <Gamepad2 className="w-4 h-4" />, cheat: <Zap className="w-4 h-4" />,
                };
                return (
                  <button
                    key={p}
                    onClick={() => navigate(p)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      page === p ? `${PAGE_COLOR[p]} bg-white/5` : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {icons[p]}{labels[p]}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* ── Pages ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20">

        {/* ══ HOME ══ */}
        {page === 'home' && (
          <div>
            <section className="pt-10 pb-12">
              <div className="hero-glass p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-violet-900/20 pointer-events-none" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    2026 · Liquid Glass UI
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                    Minecraft uchun <span className="text-emerald-400">barchasi</span>
                    <br />bir joyda.
                  </h1>
                  <p className="text-gray-400 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
                    Funtime.su uchun maneta, token, donat va token keylar. Premium
                    Minecraft clientlar va eng yaxshi cheatlar — qulay va tez.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => navigate('funtime')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-sm font-semibold shadow-lg shadow-amber-500/25 hover:scale-105 transition-all">
                      <Key className="w-4 h-4" />Funtime katalog
                    </button>
                    <button onClick={() => navigate('client')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/8 border border-white/10 text-white text-sm font-medium hover:bg-white/12 transition-all">
                      <Gamepad2 className="w-4 h-4" />Clientlar
                    </button>
                    <button onClick={() => navigate('cheat')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/8 border border-white/10 text-white text-sm font-medium hover:bg-white/12 transition-all">
                      <Zap className="w-4 h-4" />Cheatlar
                    </button>
                    <a href="https://t.me/MuxammaddinTairov" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/8 border border-white/10 text-white text-sm font-medium hover:bg-white/12 transition-all">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />@MuxammaddinTairov
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-8">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-xs text-gray-300"><Zap className="w-4 h-4 text-emerald-400"/>24/7 xizmat</div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-xs text-gray-300"><ShieldCheck className="w-4 h-4 text-sky-400"/>100% xavfsiz</div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-xs text-gray-300"><Star className="w-4 h-4 text-amber-400"/>{products.length}+ mahsulot</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="section-header">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs text-gray-500 mb-1"><Key className="w-3 h-3 text-amber-400"/>Funtime.su - Official store</div>
                  <h2 className="text-2xl font-bold text-white">Funtime.su <span className="text-amber-400">katalogi</span></h2>
                  <p className="text-sm text-gray-500 mt-1">Maneta, token va keylar — miqdorni tezlik bilan kiriting</p>
                </div>
                <button onClick={() => navigate('funtime')} className="hidden sm:flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                  Hammasi <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="section-divider" />
              <ProductGrid products={funtime} quantities={quantities} onQty={updateQty} />
            </section>

            <section className="mb-12">
              <div className="section-header">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs text-gray-500 mb-1"><Gamepad2 className="w-3 h-3 text-violet-400"/>Premium Minecraft Clientlar</div>
                  <h2 className="text-2xl font-bold text-white">Minecraft <span className="text-violet-400">Clientlar</span></h2>
                  <p className="text-sm text-gray-500 mt-1">Eng mashhur premium clientlarning obunalari</p>
                </div>
                <button onClick={() => navigate('client')} className="hidden sm:flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                  Hammasi <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="section-divider" />
              <ProductGrid products={clients} quantities={quantities} onQty={updateQty} limit={3} />
            </section>

            <section>
              <div className="section-header">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs text-gray-500 mb-1"><Zap className="w-3 h-3 text-cyan-400"/>Ghost & HvH Cheatlar · Bypass tayyor</div>
                  <h2 className="text-2xl font-bold text-white">Minecraft <span className="text-cyan-400">Cheatlar</span></h2>
                  <p className="text-sm text-gray-500 mt-1">Funtime, ReallyWorld va boshqa serverlar uchun</p>
                </div>
                <button onClick={() => navigate('cheat')} className="hidden sm:flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                  Hammasi <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="section-divider" />
              <ProductGrid products={cheats} quantities={quantities} onQty={updateQty} limit={3} />
            </section>
          </div>
        )}

        {/* ══ FUNTIME ══ */}
        {page === 'funtime' && (
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 text-xs text-gray-500 mb-3"><Key className="w-3 h-3 text-amber-400"/>Funtime.su - Official store</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Funtime.su <span className="text-amber-400">katalogi</span></h1>
            <p className="text-gray-400 mb-8">
              Kerakli miqdorni tanlang — narx avtomatik hisoblanadi. Sotib olish tugmasini bossangiz
              <br className="hidden sm:block"/>Telegram orqali yozma muloqotga o'tasiz.
            </p>
            <ProductGrid products={funtime} quantities={quantities} onQty={updateQty} />
          </div>
        )}

        {/* ══ CLIENTS ══ */}
        {page === 'client' && (
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 text-xs text-gray-500 mb-3"><Gamepad2 className="w-3 h-3 text-violet-400"/>Premium Minecraft Clientlar</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Clientlar <span className="text-violet-400">do'koni</span></h1>
            <p className="text-gray-400 mb-8">Eng mashhur premium clientlarning obunalari. Obuna muddatini miqdor sifatida tanlashingiz mumkin.</p>
            <ProductGrid products={clients} quantities={quantities} onQty={updateQty} />
          </div>
        )}

        {/* ══ CHEATS ══ */}
        {page === 'cheat' && (
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 text-xs text-gray-500 mb-3"><Zap className="w-3 h-3 text-cyan-400"/>Ghost & HvH Cheatlar · Bypass tayyor</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Minecraft <span className="text-cyan-400">Cheatlar</span></h1>
            <p className="text-gray-400 mb-8 max-w-xl">
              Funtime, ReallyWorld va boshqa serverlar uchun moslashtirilgan premium cheatlar.
              Har bir cheatning narxi va muddati aniq belgilangan.
            </p>
            <ProductGrid products={cheats} quantities={quantities} onQty={updateQty} />
            <div className="mt-10 flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-amber-300 mb-1">Diqqat</div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  Cheatlardan foydalanish o'yin qoidalariga zid bo'lishi mumkin. Mas'uliyat foydalanuvchining o'ziga yuklanadi. Biz faqat dasturiy ta'minot sotamiz.
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── Footer ── */}
      <footer className="footer-glass relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-sm text-gray-500">© 2026 Muxa Vault. Barcha huquqlar himoyalangan.</div>
          <a href="https://t.me/MuxammaddinTairov" target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            @MuxammaddinTairov
          </a>
        </div>
      </footer>
    </div>
  );
}
