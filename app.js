(function () {
  "use strict";

  const config = window.STORE_CONFIG;
  const products = window.PRODUCTS;
  const categories = ["All", ...new Set(products.map(function (product) { return product.category; }))];
  const state = { category: "All", query: "", sort: "featured", showAll: false, cart: [] };

  const grid = document.getElementById("productGrid");
  const tabs = document.getElementById("categoryTabs");
  const search = document.getElementById("searchInput");
  const sort = document.getElementById("sortSelect");
  const showAllButton = document.getElementById("showAllButton");
  const emptySearch = document.getElementById("emptySearch");
  const bagCount = document.getElementById("bagCount");
  const drawerCount = document.getElementById("drawerCount");
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("cartBackdrop");
  const cartItems = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");
  const subtotalEl = document.getElementById("subtotal");
  const toast = document.getElementById("toast");

  function money(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: config.currency || "USD" }).format(value);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
    });
  }

  function saveCart() {
    localStorage.setItem("key-of-life-cart", JSON.stringify(state.cart));
  }

  function loadCart() {
    try { state.cart = JSON.parse(localStorage.getItem("key-of-life-cart")) || []; }
    catch (_) { state.cart = []; }
  }

  function filteredProducts() {
    let result = products.filter(function (product) {
      const inCategory = state.category === "All" || product.category === state.category ||
        (state.category === "Accessories" && product.category.includes("Accessories")) ||
        (state.category === "Lingerie" && product.category.includes("Lingerie")) ||
        (state.category === "Home Decor" && product.category.includes("Home Decor"));
      const inSearch = (product.name + " " + product.category + " " + (product.details || "")).toLowerCase().includes(state.query.toLowerCase());
      return inCategory && inSearch;
    });
    if (state.sort === "low") result.sort(function (a, b) { return a.price - b.price; });
    if (state.sort === "high") result.sort(function (a, b) { return b.price - a.price; });
    if (state.sort === "new") result.sort(function (a, b) { return b.id - a.id; });
    return result;
  }

  function renderTabs() {
    tabs.innerHTML = categories.map(function (category) {
      return '<button type="button" class="' + (state.category === category ? "active" : "") + '" data-tab-category="' + escapeHtml(category) + '">' + escapeHtml(category) + '</button>';
    }).join("");
  }

  function renderProducts() {
    const matches = filteredProducts();
    const visible = state.showAll ? matches : matches.slice(0, 8);
    grid.innerHTML = visible.map(function (product) {
      return '<article class="product-card">' +
        '<div class="product-image-wrap">' +
          '<img class="product-primary-image" src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) + '" loading="lazy">' +
          (product.hoverImage ? '<img class="product-hover-image" src="' + escapeHtml(product.hoverImage) + '" alt="" loading="lazy">' : "") +
          (product.badge ? '<span class="badge">' + escapeHtml(product.badge) + '</span>' : '') +
          '<button class="quick-add" type="button" data-add="' + product.id + '">Add to bag <span>+</span></button>' +
        '</div>' +
        '<div class="product-info"><p>' + escapeHtml(product.category) + '</p><h3>' + escapeHtml(product.name) + '</h3><small>' + escapeHtml(product.details || "") + '</small>' +
        '<div class="price"><strong>' + money(product.price) + '</strong>' + (product.oldPrice ? '<del>' + money(product.oldPrice) + '</del>' : '') + '</div></div>' +
      '</article>';
    }).join("");
    emptySearch.hidden = matches.length !== 0;
    showAllButton.hidden = state.showAll || matches.length <= 8;
    renderTabs();
  }

  function addToCart(id) {
    const product = products.find(function (item) { return item.id === id; });
    const existing = state.cart.find(function (item) { return item.id === id; });
    if (existing) existing.quantity += 1;
    else state.cart.push(Object.assign({}, product, { quantity: 1 }));
    saveCart();
    renderCart();
    showToast(product.name + " added to your bag");
  }

  function updateQuantity(id, change) {
    const item = state.cart.find(function (product) { return product.id === id; });
    if (!item) return;
    item.quantity += change;
    state.cart = state.cart.filter(function (product) { return product.quantity > 0; });
    saveCart();
    renderCart();
  }

  function removeItem(id) {
    state.cart = state.cart.filter(function (item) { return item.id !== id; });
    saveCart();
    renderCart();
  }

  function renderCart() {
    const count = state.cart.reduce(function (total, item) { return total + item.quantity; }, 0);
    const subtotal = state.cart.reduce(function (total, item) { return total + item.price * item.quantity; }, 0);
    bagCount.textContent = count;
    drawerCount.textContent = count;
    subtotalEl.textContent = money(subtotal);
    cartFooter.hidden = state.cart.length === 0;

    if (!state.cart.length) {
      cartItems.innerHTML = '<div class="empty-cart"><span>☥</span><h3>Your bag is waiting</h3><p>Choose something meaningful from the collection.</p><button class="primary-button" id="emptyShopButton" type="button">Start shopping</button></div>';
      return;
    }

    cartItems.innerHTML = state.cart.map(function (item) {
      return '<div class="cart-item"><img src="' + escapeHtml(item.image) + '" alt=""><div><small>' + escapeHtml(item.category) + '</small><h3>' + escapeHtml(item.name) + '</h3><p>' + money(item.price) + '</p><div class="quantity"><button type="button" data-qty="-1" data-id="' + item.id + '">−</button><span>' + item.quantity + '</span><button type="button" data-qty="1" data-id="' + item.id + '">+</button></div></div><button class="remove" type="button" data-remove="' + item.id + '">Remove</button></div>';
    }).join("");
  }

  function openCart() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    document.body.style.overflow = "";
  }

  function selectCategory(category) {
    state.category = category;
    state.showAll = false;
    renderProducts();
    document.getElementById("mainNav").classList.remove("open");
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  }

  function showToast(message) {
    toast.innerHTML = escapeHtml(message) + " <span>✓</span>";
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () { toast.hidden = true; }, 2200);
  }

  function orderText() {
    const lines = state.cart.map(function (item) { return item.quantity + " × " + item.name + " — " + money(item.price * item.quantity); });
    const subtotal = state.cart.reduce(function (total, item) { return total + item.price * item.quantity; }, 0);
    return "Hello " + config.storeName + ",\n\nI would like to place this order:\n\n" + lines.join("\n") + "\n\nSubtotal: " + money(subtotal) + "\n\nName:\nShipping address:\nPhone:";
  }

  function sendOrder() {
    if (!state.cart.length) return;
    const message = orderText();
    if (config.whatsappNumber) {
      window.open("https://wa.me/" + config.whatsappNumber + "?text=" + encodeURIComponent(message), "_blank", "noopener");
      return;
    }
    if (config.orderEmail) {
      window.location.href = "mailto:" + config.orderEmail + "?subject=" + encodeURIComponent("New Key of Life order") + "&body=" + encodeURIComponent(message);
      return;
    }
    navigator.clipboard.writeText(message).then(function () {
      showToast("Order copied — add your email or WhatsApp in products.js");
    }).catch(function () {
      window.prompt("Copy your order:", message);
    });
  }

  document.addEventListener("click", function (event) {
    const categoryButton = event.target.closest("[data-category]");
    const tabButton = event.target.closest("[data-tab-category]");
    const addButton = event.target.closest("[data-add]");
    const quantityButton = event.target.closest("[data-qty]");
    const removeButton = event.target.closest("[data-remove]");
    if (categoryButton) { event.preventDefault(); selectCategory(categoryButton.dataset.category); }
    if (tabButton) selectCategory(tabButton.dataset.tabCategory);
    if (addButton) addToCart(Number(addButton.dataset.add));
    if (quantityButton) updateQuantity(Number(quantityButton.dataset.id), Number(quantityButton.dataset.qty));
    if (removeButton) removeItem(Number(removeButton.dataset.remove));
    if (event.target.id === "emptyShopButton") { closeCart(); selectCategory("All"); }
  });

  search.addEventListener("input", function () { state.query = search.value; state.showAll = false; renderProducts(); });
  sort.addEventListener("change", function () { state.sort = sort.value; renderProducts(); });
  showAllButton.addEventListener("click", function () { state.showAll = true; renderProducts(); });
  document.getElementById("bagButton").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  backdrop.addEventListener("click", closeCart);
  document.getElementById("menuButton").addEventListener("click", function () { document.getElementById("mainNav").classList.toggle("open"); });
  document.getElementById("sendOrderButton").addEventListener("click", sendOrder);
  document.getElementById("newsletterForm").addEventListener("submit", function (event) { event.preventDefault(); showToast("Welcome to the Key of Life circle"); event.target.reset(); });
  document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeCart(); });

  document.querySelectorAll("[data-contact-link]").forEach(function (link) {
    link.href = config.orderEmail ? "mailto:" + config.orderEmail : (config.whatsappNumber ? "https://wa.me/" + config.whatsappNumber : "#");
  });
  const socialLinks = { instagram: config.instagramUrl, facebook: config.facebookUrl, pinterest: config.pinterestUrl };
  Object.keys(socialLinks).forEach(function (name) {
    const link = document.querySelector('a[href="#' + name + '"]');
    if (link && socialLinks[name]) link.href = socialLinks[name];
  });

  loadCart();
  renderProducts();
  renderCart();
})();
