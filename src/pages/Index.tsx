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
  { id: 1, name: "Oversized Hoodie «NEON»", price: 4990, oldPrice: 7200, category: "Одежда", badge: "ХИТ", badgeColor: "bg-vivid-pink", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/files/e2e1a5ab-71d3-4ba0-bc30-f70e3b8b7474.jpg" },
  { id: 2, name: "Кроссовки «PULSE MAX»", price: 8900, oldPrice: 12000, category: "Обувь", badge: "−26%", badgeColor: "bg-vivid-orange", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/files/75dc82a4-e882-4098-b264-4bfe89ed351d.jpg" },
  { id: 3, name: "Сумка-тоут «VIBRANT»", price: 3200, category: "Аксессуары", badge: "НОВИНКА", badgeColor: "bg-vivid-cyan text-vivid-dark", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/files/aa1667fa-e7f8-4c48-ac22-d01ef62b57bb.jpg" },
  { id: 4, name: "Джинсы «ACID WASH»", price: 5600, oldPrice: 6800, category: "Одежда", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/files/e2e1a5ab-71d3-4ba0-bc30-f70e3b8b7474.jpg" },
  { id: 5, name: "Очки «CHROME WAVE»", price: 2100, category: "Аксессуары", badge: "ТОП", badgeColor: "bg-vivid-purple", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/files/75dc82a4-e882-4098-b264-4bfe89ed351d.jpg" },
  { id: 6, name: "Куртка «STREET FLOW»", price: 12500, oldPrice: 16000, category: "Одежда", badge: "−22%", badgeColor: "bg-vivid-orange", image: "https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/files/aa1667fa-e7f8-4c48-ac22-d01ef62b57bb.jpg" },
];

const CATEGORIES = ["Все", "Одежда", "Обувь", "Аксессуары"];

const REVIEWS = [
  { id: 1, name: "Алина К.", rating: 5, text: "Обожаю этот магазин! Качество просто огонь, всё пришло быстро, упаковка супер.", avatar: "А" },
  { id: 2, name: "Максим Р.", rating: 5, text: "Заказываю уже третий раз. Стиль реально отличный, всё соответствует фото.", avatar: "М" },
  { id: 3, name: "Дарья В.", rating: 5, text: "Наконец-то нашла магазин с актуальными трендами! Кроссовки — это вообще шедевр.", avatar: "Д" },
  { id: 4, name: "Илья С.", rating: 4, text: "Отличный сервис, быстрая доставка. Буду заказывать ещё!", avatar: "И" },
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
            <span className="font-oswald text-2xl font-bold gradient-text">VIVID</span>
            <span className="text-white/30 text-xs font-golos mt-1">STORE</span>
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
                <button className="w-full py-3.5 rounded-xl gradient-btn font-oswald font-semibold text-lg text-white tracking-wide">
                  Оформить заказ
                </button>
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
              {[["500+", "товаров"], ["48 ч", "доставка"], ["4.9★", "рейтинг"]].map(([num, label]) => (
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
                      <p className="font-semibold text-white text-sm">Oversized Hoodie «NEON»</p>
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
                VIVID — это не просто магазин, это пространство для тех, кто живёт ярко. Мы выбираем только самые актуальные тренды мировой моды и делаем их доступными.
              </p>
              <p className="text-white/40 leading-relaxed">
                Каждая вещь в нашем каталоге проходит строгий отбор — только качественные материалы, честные цены и стиль, который говорит сам за себя.
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
            <div className="relative">
              <div className="rounded-3xl overflow-hidden neon-border-cyan">
                <img
                  src="https://cdn.poehali.dev/projects/e6438cfe-3961-4c68-8ad8-24f852060995/files/aa1667fa-e7f8-4c48-ac22-d01ef62b57bb.jpg"
                  alt="О магазине"
                  className="w-full h-[460px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass neon-border-cyan rounded-2xl p-5">
                <p className="font-oswald text-4xl font-bold gradient-text-cool">2018</p>
                <p className="text-white/40 text-sm">год основания</p>
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

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: "Zap", color: "text-vivid-yellow", bg: "border-vivid-yellow/20", title: "Экспресс", time: "1–2 дня", price: "590 ₽", desc: "Курьерская доставка до двери" },
              { icon: "Truck", color: "text-vivid-cyan", bg: "border-vivid-cyan/20", title: "Стандарт", time: "3–5 дней", price: "290 ₽", desc: "Доставка в пункт выдачи" },
              { icon: "Package", color: "text-vivid-pink", bg: "border-vivid-pink/20", title: "Бесплатно", time: "5–7 дней", price: "0 ₽", desc: "При заказе от 5 000 ₽" },
            ].map(item => (
              <div key={item.title} className={`p-6 rounded-2xl bg-vivid-card border ${item.bg} card-hover`}>
                <Icon name={item.icon} size={32} className={`${item.color} mb-4`} />
                <h3 className="font-oswald text-xl font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-white/40 text-sm mb-4">{item.desc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-white/40 text-sm">{item.time}</span>
                  <span className={`font-oswald text-xl font-bold ${item.color}`}>{item.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-vivid-card border border-white/10">
            <h3 className="font-oswald text-xl font-semibold text-white mb-4">Способы оплаты</h3>
            <div className="flex flex-wrap gap-3">
              {["💳 Карта Visa/MC", "📱 SberPay", "📱 T-Pay", "💰 Наличными", "🔄 Рассрочка"].map(pay => (
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
                  { icon: "Phone", label: "Телефон", value: "+7 (800) 555-00-00", color: "text-vivid-cyan" },
                  { icon: "Mail", label: "Email", value: "hello@vivid.store", color: "text-vivid-pink" },
                  { icon: "MapPin", label: "Адрес", value: "Москва, ул. Арбат, 24", color: "text-vivid-orange" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Вс: 9:00 – 21:00", color: "text-vivid-yellow" },
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
                <textarea
                  rows={4}
                  placeholder="Ваш вопрос или сообщение..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-vivid-pink/50 focus:outline-none text-white placeholder:text-white/25 transition-colors resize-none text-sm"
                />
              </div>
              <button className="w-full py-3.5 rounded-xl gradient-btn font-oswald font-semibold text-lg text-white tracking-wide">
                Отправить сообщение
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("home")}>
            <span className="font-oswald text-xl font-bold gradient-text">VIVID</span>
            <span className="text-white/20 text-xs">STORE</span>
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