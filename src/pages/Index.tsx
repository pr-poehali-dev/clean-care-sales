import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  badge?: string;
  badgeColor?: string;
  image: string;
}

interface CartItem extends Product {
  qty: number;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Набор многоразовых трубочек", price: 230, category: "Кухня", badge: "ХИТ", badgeColor: "bg-vivid-pink", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/files/278a6662-abaf-4a8e-b157-f264fb789a9c.jpg" },
  { id: 2, name: "Баночки для соусов 4 шт.", price: 260, category: "Кухня", badge: "НОВИНКА", badgeColor: "bg-vivid-cyan text-vivid-dark", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/bucket/95e926cd-61da-4685-9ca9-9efd76c33f29.jpg" },
  { id: 3, name: "Миски для соусов", price: 320, category: "Кухня", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/bucket/e6012c69-d63a-4f41-b83b-f13fbd6448d9.jpg" },
  { id: 4, name: "Соусники 3 шт.", price: 450, category: "Кухня", badge: "ТОП", badgeColor: "bg-vivid-purple", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/bucket/35cd5c2c-146f-4b20-853c-9f9b70071637.jpg" },
  { id: 5, name: "Кружки для чая/кофе 3 шт.", price: 490, category: "Кухня", badge: "НОВИНКА", badgeColor: "bg-vivid-orange", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/bucket/b4e03b65-1c7a-4208-aa80-8dce2392834a.jpg" },
  { id: 6, name: "Распылитель для масла", price: 230, category: "Кухня", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/bucket/908af635-07d1-4f9b-aa36-edb52f36c5e5.jpg" },
];

const CATEGORIES = ["Все", "Кухня"];

const REVIEWS = [
  { id: 1, name: "Алина К.", rating: 5, text: "Очень довольна покупкой! Товар точь-в-точь как на фото, качество отличное. Доставка быстрая, упаковано аккуратно. Буду заказывать ещё!", avatar: "А" },
  { id: 2, name: "Максим Р.", rating: 5, text: "Заказывал уже несколько раз — всегда всё на высшем уровне. Товар из-за рубежа, но цены очень приятные. Рекомендую всем!", avatar: "М" },
  { id: 3, name: "Дарья В.", rating: 5, text: "Нашла здесь то, что давно искала. Качество превзошло ожидания, менеджер ответил мгновенно и помог с выбором. Спасибо огромное!", avatar: "Д" },
  { id: 4, name: "Илья С.", rating: 5, text: "Отличный магазин! Цены ниже, чем где-либо, а качество — выше всяких похвал. Получил заказ быстро, всё в целости.", avatar: "И" },
];

const NAV_LINKS = [
  { id: "home", label: "Главная" },
  { id: "catalog", label: "Каталог" },
  { id: "about", label: "О магазине" },
  { id: "delivery", label: "Доставка" },
  { id: "reviews", label: "Отзывы" },
  { id: "contacts", label: "Контакты" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );
  };

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [...NAV_LINKS].map(l => l.id).reverse();
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = activeCategory === "Все" ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-vivid-dark text-white font-golos">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("home")}>
            <span className="font-oswald text-2xl font-bold gradient-text">ЯРКИЙ</span>
            <span className="text-vivid-orange font-oswald text-2xl font-bold">ВЫБОР</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-sm font-medium transition-all duration-200 relative pb-1 ${
                  activeSection === link.id ? "text-vivid-pink" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gradient-to-r from-vivid-pink to-vivid-orange rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-vivid-pink/50 transition-all duration-200"
            >
              <Icon name="ShoppingBag" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full gradient-btn flex items-center justify-center text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/10 px-4 py-4 flex flex-col gap-2">
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-left text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                  activeSection === link.id ? "text-vivid-pink bg-vivid-pink/10" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* CART SIDEBAR */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-md glass border-l border-white/10 flex flex-col animate-slide-in-right">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-oswald text-xl font-semibold">Корзина</h2>
                {cartCount > 0 && (
                  <p className="text-white/40 text-sm">{cartCount} товар{cartCount === 1 ? "" : cartCount < 5 ? "а" : "ов"}</p>
                )}
              </div>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-20">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Icon name="ShoppingBag" size={32} className="text-white/20" />
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">Корзина пуста.<br />Добавьте товары из каталога!</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">{item.name}</p>
                      <p className="text-vivid-pink font-semibold mt-1 font-oswald">{(item.price * item.qty).toLocaleString("ru")} ₽</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >−</button>
                        <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >+</button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 hover:text-vivid-pink transition-colors self-start"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Итого</span>
                  <span className="font-oswald text-2xl font-bold gradient-text">{cartTotal.toLocaleString("ru")} ₽</span>
                </div>
                <p className="text-white/40 text-xs text-center">Выберите удобный способ оформления:</p>
                <a
                  href={`https://t.me/Dmitriy_Alexeevich1?text=${encodeURIComponent("Здравствуйте! Хочу оформить заказ:\n\n" + cart.map(i => `• ${i.name} × ${i.qty} = ${(i.price * i.qty).toLocaleString("ru")} ₽`).join("\n") + `\n\nИтого: ${cartTotal.toLocaleString("ru")} ₽`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#229ED9] hover:bg-[#1a8bc4] font-oswald font-semibold text-white tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-[#229ED9]/30"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.91c-.12.57-.45.71-.91.44l-2.52-1.86-1.22 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1L7.9 15.04l-2.46-.77c-.53-.17-.54-.53.12-.78l9.61-3.71c.44-.16.83.11.47.02z"/>
                  </svg>
                  Заказать через Telegram
                </a>
                <a
                  href={`https://vk.com/jeess_leess?sel=jeess_leess`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    const msg = "Здравствуйте! Хочу оформить заказ:\n\n" + cart.map(i => `• ${i.name} × ${i.qty} = ${(i.price * i.qty).toLocaleString("ru")} ₽`).join("\n") + `\n\nИтого: ${cartTotal.toLocaleString("ru")} ₽`;
                    navigator.clipboard?.writeText(msg);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#4C75A3] hover:bg-[#3d6090] font-oswald font-semibold text-white tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-[#4C75A3]/30"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.734 3.23C14.734 12.813 14 12.126 14 11.11V7.603A1.104 1.104 0 0 0 12.896 6.5h-2.474a1.982 1.982 0 0 0-1.75.813s1.255-.204 1.255 1.49c0 .42.022 1.626.04 2.64a.73.73 0 0 1-1.272.503 21.54 21.54 0 0 1-2.498-4.543.693.693 0 0 0-.63-.403h-2.99a.508.508 0 0 0-.48.685C3.005 10.175 6.918 18 11.38 18h1.878a.742.742 0 0 0 .742-.742v-1.135a.73.73 0 0 1 1.23-.53l2.247 2.112a1.09 1.09 0 0 0 .746.295h2.953c1.424 0 1.424-.988.647-1.753-.546-.538-2.518-2.617-2.518-2.617a1.02 1.02 0 0 1-.078-1.323c.637-.84 1.68-2.212 2.122-2.8.603-.804 1.697-2.507.197-2.507z"/>
                  </svg>
                  Заказать через ВКонтакте
                </a>
                <p className="text-white/20 text-[10px] text-center">При нажатии «ВКонтакте» заказ скопируется в буфер обмена</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-vivid-purple/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-vivid-pink/20 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vivid-pink/10 border border-vivid-pink/30 text-sm text-vivid-pink font-medium animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-vivid-pink animate-pulse" />
              Новая коллекция 2026
            </div>
            <h1 className="font-oswald text-6xl md:text-7xl lg:text-8xl font-bold leading-none animate-fade-in animate-delay-100">
              <span className="gradient-text">БУДЬ</span><br />
              <span className="text-white">В ТРЕНДЕ</span><br />
              <span className="gradient-text-cool">СЕГОДНЯ</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-md animate-fade-in animate-delay-200">
              Яркая мода, живые цвета и уникальный стиль — всё в одном месте. Открой коллекцию и найди свой образ.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-300">
              <button
                onClick={() => scrollTo("catalog")}
                className="px-8 py-3.5 rounded-xl gradient-btn font-oswald font-semibold text-lg text-white tracking-wide"
              >
                Смотреть каталог
              </button>
              <button
                onClick={() => scrollTo("about")}
                className="px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 font-medium transition-all duration-200 text-white"
              >
                О магазине
              </button>
            </div>
            <div className="flex gap-8 animate-fade-in animate-delay-400">
              {[["500+", "товаров"], ["48 ч", "доставка"], ["5.0★", "рейтинг"]].map(([num, label]) => (
                <div key={label}>
                  <div className="font-oswald text-2xl font-bold gradient-text">{num}</div>
                  <div className="text-white/30 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in animate-delay-200">
            <div className="relative rounded-3xl overflow-hidden neon-border">
              <img
                src="https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/files/e2e1a5ab-71d3-4ba0-bc30-f70e3b8b7474.jpg"
                alt="Hero"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vivid-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass rounded-2xl p-4 neon-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/40 text-xs">Хит продаж</p>
                      <p className="font-semibold text-white text-sm">Яркий Выбор — твой стиль</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/30 text-xs line-through">7 200 ₽</p>
                      <p className="font-oswald text-xl font-bold gradient-text">4 990 ₽</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl gradient-btn flex flex-col items-center justify-center rotate-12 shadow-2xl">
              <span className="font-oswald text-xl font-black text-white leading-none">−30%</span>
              <span className="text-white/80 text-[9px] font-medium">СКИДКА</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/20 text-xs">Листай вниз</span>
          <Icon name="ChevronDown" size={20} className="text-white/20" />
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-vivid-pink text-sm font-medium mb-2 uppercase tracking-widest">Коллекция</p>
              <h2 className="font-oswald text-5xl font-bold">
                <span className="text-white">НАШ </span>
                <span className="gradient-text">КАТАЛОГ</span>
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? "gradient-btn text-white shadow-lg"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div key={product.id} className="group card-hover rounded-2xl overflow-hidden bg-vivid-card border border-white/10 cursor-pointer">
                <div className="relative overflow-hidden h-64">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vivid-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {product.badge && (
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white ${product.badgeColor || "bg-vivid-pink"}`}>
                      {product.badge}
                    </span>
                  )}
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 left-4 right-4 py-2.5 rounded-xl gradient-btn font-semibold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                  >
                    В корзину
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-white/30 text-xs mb-1">{product.category}</p>
                  <h3 className="font-semibold text-white mb-3 leading-tight">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-oswald text-xl font-bold text-vivid-pink">{product.price.toLocaleString("ru")} ₽</span>
                      {product.oldPrice && (
                        <span className="text-white/25 text-sm line-through">{product.oldPrice.toLocaleString("ru")} ₽</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-9 h-9 rounded-xl bg-white/5 hover:bg-vivid-pink/20 border border-white/10 hover:border-vivid-pink/50 flex items-center justify-center transition-all duration-200 text-white"
                    >
                      <Icon name="Plus" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-vivid-cyan text-sm font-medium mb-2 uppercase tracking-widest">Наша история</p>
                <h2 className="font-oswald text-5xl font-bold">
                  <span className="text-white">О </span>
                  <span className="gradient-text-cool">МАГАЗИНЕ</span>
                </h2>
              </div>
              <p className="text-white/50 text-lg leading-relaxed">
                Наш магазин предлагает вам качественный товар из-за рубежа по низким ценам.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "Award", title: "Топовое качество", desc: "Только проверенные бренды", color: "text-vivid-yellow" },
                  { icon: "Truck", title: "Быстрая доставка", desc: "По всей России за 48 ч", color: "text-vivid-cyan" },
                  { icon: "RefreshCw", title: "Лёгкий возврат", desc: "14 дней без вопросов", color: "text-vivid-orange" },
                  { icon: "Headphones", title: "Поддержка 24/7", desc: "Всегда на связи", color: "text-vivid-pink" },
                ].map(item => (
                  <div key={item.title} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-vivid-cyan/30 transition-all duration-200">
                    <Icon name={item.icon} size={22} className={`${item.color} mb-2`} />
                    <p className="font-semibold text-sm text-white">{item.title}</p>
                    <p className="text-white/30 text-xs mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center neon-border-cyan rounded-3xl p-10">
              <div className="text-center">
                <p className="font-oswald text-8xl font-bold gradient-text-cool">2026</p>
                <p className="text-white/40 text-lg mt-2">год основания</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERY */}
      <section id="delivery" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-vivid-orange text-sm font-medium mb-2 uppercase tracking-widest">Логистика</p>
            <h2 className="font-oswald text-5xl font-bold">
              <span className="text-white">ДОСТАВКА И </span>
              <span className="gradient-text">ОПЛАТА</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[
              { icon: "Truck", color: "text-vivid-cyan", bg: "border-vivid-cyan/20", activeBg: "border-vivid-cyan bg-vivid-cyan/10", title: "Стандарт", time: "3–5 дней", price: 290, priceLabel: "290 ₽", desc: "Доставка в пункт выдачи" },
              { icon: "Package", color: "text-vivid-pink", bg: "border-vivid-pink/20", activeBg: "border-vivid-pink bg-vivid-pink/10", title: "Бесплатно", time: "5–7 дней", price: 0, priceLabel: "0 ₽", desc: "При заказе от 5 000 ₽" },
            ].map(item => {
              const isSelected = selectedDelivery === item.title;
              const handleSelect = () => {
                setSelectedDelivery(item.title);
                setCart(prev => {
                  const filtered = prev.filter(i => i.id !== -1);
                  if (item.price === 0) return filtered;
                  return [...filtered, { id: -1, name: `Доставка: ${item.title}`, price: item.price, category: "Доставка", image: "", qty: 1 }];
                });
              };
              return (
              <div key={item.title} onClick={handleSelect} className={`p-6 rounded-2xl bg-vivid-card border cursor-pointer transition-all ${isSelected ? item.activeBg : item.bg} card-hover`}>
                <div className="flex justify-between items-start mb-4">
                  <Icon name={item.icon} size={32} className={`${item.color}`} />
                  {isSelected && <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.color} bg-white/10`}>Выбрано</span>}
                </div>
                <h3 className="font-oswald text-xl font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-white/40 text-sm mb-4">{item.desc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-white/40 text-sm">{item.time}</span>
                  <span className={`font-oswald text-xl font-bold ${item.color}`}>{item.priceLabel}</span>
                </div>
              </div>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-vivid-card border border-white/10">
            <h3 className="font-oswald text-xl font-semibold text-white mb-4">Способы оплаты</h3>
            <div className="flex flex-wrap gap-3">
              {["📱 СБП", "💳 2204 3210 2578 1980 (Озон Банк)", "💳 2202 2018 0765 3494 (Сбер Банк)"].map(pay => (
                <span key={pay} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60">{pay}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-40" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-vivid-purple text-sm font-medium mb-2 uppercase tracking-widest">Мнения</p>
            <h2 className="font-oswald text-5xl font-bold">
              <span className="text-white">ОТЗЫВЫ </span>
              <span className="gradient-text-cool">КЛИЕНТОВ</span>
            </h2>
            <p className="text-white/30 mt-3">Более 1 200 довольных покупателей</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map(review => (
              <div key={review.id} className="p-5 rounded-2xl bg-vivid-card border border-white/10 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center font-oswald font-bold text-white">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{review.name}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i} className="text-vivid-yellow text-xs">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-vivid-pink text-sm font-medium mb-2 uppercase tracking-widest">Связь</p>
              <h2 className="font-oswald text-5xl font-bold mb-6 text-white">
                КОНТАКТЫ
              </h2>
              <p className="text-white/40 mb-10">Есть вопрос? Напишите нам — ответим в течение часа.</p>

              <div className="space-y-3">
                {[
                  { icon: "MapPin", label: "Адрес 1", value: "г. Краснодар", color: "text-vivid-orange" },
                  { icon: "MapPin", label: "Адрес 2", value: "Ростовская область", color: "text-vivid-pink" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 8:00 – 20:00 (МСК)", color: "text-vivid-yellow" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                    <Icon name={item.icon} size={20} className={item.color} />
                    <div>
                      <p className="text-white/30 text-xs">{item.label}</p>
                      <p className="font-medium text-sm text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-vivid-card border border-white/10 neon-border space-y-4">
              <h3 className="font-oswald text-2xl font-semibold text-white">Написать нам</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-vivid-pink/50 focus:outline-none text-white placeholder:text-white/25 transition-colors text-sm"
                />
                <input
                  type="tel"
                  placeholder="Телефон или email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-vivid-pink/50 focus:outline-none text-white placeholder:text-white/25 transition-colors text-sm"
                />
                <div>
                  <p className="text-white/40 text-xs mb-2 pl-1">Способ доставки</p>
                  <select
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-vivid-pink/50 focus:outline-none text-white transition-colors text-sm appearance-none cursor-pointer"
                    style={{ backgroundColor: '#14141E' }}
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-vivid-card text-white/40">Выберите способ доставки</option>
                    <option value="courier" className="bg-vivid-card text-white">⚡ Экспресс-курьер (1–2 дня) — 590 ₽</option>
                    <option value="pickup" className="bg-vivid-card text-white">🚚 Стандарт в пункт выдачи (3–5 дней) — 290 ₽</option>
                    <option value="post" className="bg-vivid-card text-white">📦 Почта России (5–7 дней) — бесплатно от 5 000 ₽</option>
                    <option value="sdek" className="bg-vivid-card text-white">📬 СДЭК (2–4 дня) — 350 ₽</option>
                  </select>
                </div>
                <textarea
                  rows={3}
                  placeholder="Ваш вопрос или сообщение..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-vivid-pink/50 focus:outline-none text-white placeholder:text-white/25 transition-colors resize-none text-sm"
                />
              </div>
              <button className="w-full py-3.5 rounded-xl gradient-btn font-oswald font-semibold text-lg text-white tracking-wide">
                Отправить сообщение
              </button>

              <div className="pt-2 border-t border-white/10">
                <p className="text-white/30 text-xs mb-3">Или напишите напрямую менеджеру:</p>
                <div className="space-y-2">
                  <a
                    href="https://t.me/Dmitriy_Alexeevich1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#229ED9]/10 border border-[#229ED9]/30 hover:bg-[#229ED9]/20 hover:border-[#229ED9]/50 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#229ED9] flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.68 7.91c-.12.57-.45.71-.91.44l-2.52-1.86-1.22 1.17c-.13.13-.25.25-.51.25l.18-2.57 4.65-4.2c.2-.18-.04-.28-.31-.1L7.9 15.04l-2.46-.77c-.53-.17-.54-.53.12-.78l9.61-3.71c.44-.16.83.11.47.02z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white group-hover:text-[#229ED9] transition-colors">@Dmitriy_Alexeevich1</p>
                      <p className="text-white/30 text-xs">Telegram — менеджер по заказам</p>
                    </div>
                    <Icon name="ArrowRight" size={16} className="text-white/30 group-hover:text-[#229ED9] transition-colors" />
                  </a>
                  <a
                    href="https://vk.ru/jeess_leess"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#4C75A3]/10 border border-[#4C75A3]/30 hover:bg-[#4C75A3]/20 hover:border-[#4C75A3]/60 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#4C75A3] flex items-center justify-center flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.734 3.23C14.734 12.813 14 12.126 14 11.11V7.603A1.104 1.104 0 0 0 12.896 6.5h-2.474a1.982 1.982 0 0 0-1.75.813s1.255-.204 1.255 1.49c0 .42.022 1.626.04 2.64a.73.73 0 0 1-1.272.503 21.54 21.54 0 0 1-2.498-4.543.693.693 0 0 0-.63-.403h-2.99a.508.508 0 0 0-.48.685C3.005 10.175 6.918 18 11.38 18h1.878a.742.742 0 0 0 .742-.742v-1.135a.73.73 0 0 1 1.23-.53l2.247 2.112a1.09 1.09 0 0 0 .746.295h2.953c1.424 0 1.424-.988.647-1.753-.546-.538-2.518-2.617-2.518-2.617a1.02 1.02 0 0 1-.078-1.323c.637-.84 1.68-2.212 2.122-2.8.603-.804 1.697-2.507.197-2.507z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white group-hover:text-[#4C75A3] transition-colors">jeess_leess</p>
                      <p className="text-white/30 text-xs">ВКонтакте — менеджер по покупкам</p>
                    </div>
                    <Icon name="ArrowRight" size={16} className="text-white/30 group-hover:text-[#4C75A3] transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("home")}>
            <span className="font-oswald text-xl font-bold gradient-text">ЯРКИЙ</span>
            <span className="text-vivid-orange font-oswald text-xl font-bold">ВЫБОР</span>
          </div>
          <p className="text-white/25 text-sm">© 2026 VIVID Store. Все права защищены.</p>
          <div className="flex gap-5 flex-wrap justify-center">
            {NAV_LINKS.slice(0, 4).map(link => (
              <button key={link.id} onClick={() => scrollTo(link.id)} className="text-white/30 hover:text-white text-sm transition-colors">
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}