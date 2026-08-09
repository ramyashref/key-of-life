/*
  تعديل المنتجات سهل:
  - انسخ أي منتج كاملًا.
  - غيّر id إلى رقم جديد غير مستخدم.
  - غيّر الاسم والقسم والسعر ورابط الصورة.
  - الأقسام المتاحة: Lingerie, Egyptian Gifts, Accessories, Home Decor
*/

window.STORE_CONFIG = {
  storeName: "Key of Life",
  currency: "USD",
  orderEmail: "ashrafelsayed612@gmail.com",
  whatsappNumber: "18177709380",
  instagramUrl: "#instagram",
  facebookUrl: "#facebook",
  pinterestUrl: "#pinterest"
};

window.PRODUCTS = [
  { id: 1, name: "Nile Satin Robe", category: "Lingerie", price: 68, oldPrice: 82, image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=85", badge: "Bestseller", details: "Champagne · Black" },
  { id: 2, name: "Lotus Lace Set", category: "Lingerie", price: 74, image: "https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=900&q=85", badge: "New", details: "Ivory · Garnet" },
  { id: 3, name: "Soft Cotton Lounge Set", category: "Lingerie", price: 59, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=85", details: "Sand · Rose" },
  { id: 4, name: "Ankh Brass Keepsake", category: "Egyptian Gifts", price: 42, image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=85", badge: "Handmade", details: "Antique Gold" },
  { id: 5, name: "Papyrus Story Frame", category: "Egyptian Gifts", price: 48, oldPrice: 56, image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85", details: "Natural Papyrus" },
  { id: 6, name: "Mini Egyptian Gift Box", category: "Egyptian Gifts", price: 36, image: "https://images.unsplash.com/photo-1607344645866-009c7d6c29ae?auto=format&fit=crop&w=900&q=85", badge: "Gift-ready", details: "Curated assortment" },
  { id: 7, name: "Key of Life Necklace", category: "Accessories", price: 46, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85", badge: "Bestseller", details: "Gold · Silver" },
  { id: 8, name: "Cleopatra Cuff", category: "Accessories", price: 38, oldPrice: 45, image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85", details: "Brushed Gold" },
  { id: 9, name: "Alexandria Silk Scarf", category: "Accessories", price: 52, image: "https://images.unsplash.com/photo-1601379329542-31c59347e2a3?auto=format&fit=crop&w=900&q=85", badge: "Limited", details: "Azure · Terracotta" },
  { id: 10, name: "Desert Glow Candle", category: "Home Decor", price: 34, image: "https://images.unsplash.com/photo-1602874801006-e26c8d421174?auto=format&fit=crop&w=900&q=85", details: "Amber & Oud" },
  { id: 11, name: "Nubian Woven Basket", category: "Home Decor", price: 65, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85", badge: "Artisan-made", details: "Natural fibers" },
  { id: 12, name: "Cairo Arch Vase", category: "Home Decor", price: 58, image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85", details: "Sandstone" }
];
