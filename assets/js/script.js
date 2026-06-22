// EclipX MC Store JS

function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// FAQ ACCORDION
function initFAQAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    const toggle = () => {
      document.querySelectorAll('.faq-item').forEach(o => {
        if (o !== item) {
          o.classList.remove('active');
          const otherQ = o.querySelector('.faq-question');
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
        }
      });
      const isActive = item.classList.toggle('active');
      q.setAttribute('aria-expanded', isActive);
    };
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

// HERO PARTICLES
function initHeroParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('div');
    p.classList.add('hero-particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (7 + Math.random() * 12) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    const size = 1 + Math.random() * 2;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.opacity = 0.15 + Math.random() * 0.35;
    container.appendChild(p);
  }
}

// ━━ IP COPY ━━
function initIPCopy() {
  const el = document.getElementById('ipCopy');
  if (!el) return;
  el.addEventListener('click', () => {
    const ip = el.querySelector('.ip-copy-value').textContent;
    navigator.clipboard.writeText(ip).then(() => {
      el.classList.add('copied');
      const label = el.querySelector('.ip-copy-label');
      const orig = label.textContent;
      label.textContent = 'Copied!';
      setTimeout(() => {
        el.classList.remove('copied');
        label.textContent = orig;
      }, 2000);
    });
  });
}

// ━━ FLIP FADE TEXT ━━
function initFlipFade() {
  const el = document.querySelector('.flip-fade-wrap');
  if (!el) return;

  const phrases = ['Welcome to EclipX MC', 'Dominate the MCVerse'];

  phrases.forEach((phrase, idx) => {
    const word = document.createElement('span');
    word.className = 'flip-fade-word';
    if (idx === 0) word.classList.add('active');

    for (let i = 0; i < phrase.length; i++) {
      const letter = document.createElement('span');
      letter.className = 'flip-fade-letter';
      letter.style.setProperty('--i', i);
      letter.textContent = phrase[i] === ' ' ? '\u00A0' : phrase[i];
      word.appendChild(letter);
    }

    el.appendChild(word);
  });

  let current = 0;
  const interval = 5000;

  setInterval(() => {
    const words = el.children;
    const prev = current;
    current = (current + 1) % words.length;

    words[prev].classList.remove('active');
    words[prev].classList.add('exiting');
    words[current].classList.add('active');

    setTimeout(() => {
      words[prev].classList.remove('exiting');
    }, 2000);
  }, interval);
}

// ━━ ROUTING SYSTEM ━━
const Router = {
  routes: {
    '/': 'hero',
    '/store': 'store',
    '/vote': 'vote',
    '/faq': 'faq',
    '/policies': 'policies'
  },

  init() {
    // Intercept all link clicks
    document.addEventListener('click', e => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Skip add-to-cart buttons — they handle navigation themselves
      if (anchor.classList.contains('add-to-cart')) return;

      // Handle sidebar links specially
      if (anchor.classList.contains('sidebar-link')) {
        e.preventDefault();
        const categoryPath = anchor.getAttribute('data-category-path');
        this.navigate(`/store/${categoryPath}`);
        return;
      }

      // Handle internal links (starting with / or #)
      if (href.startsWith('/') || href.startsWith('#')) {
        e.preventDefault();
        let path = href.startsWith('#') ? '/' + href.substring(1) : href;
        if (path === '/#') path = '/';
        this.navigate(path);
      }
    });

    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname);
    });

    // Handle initial load
    this.handleRoute(window.location.pathname, window.location.hash);
  },

  navigate(path) {
    const cleanPath = path.replace(/^\/?index\.html/, '') || '/';

    if (window.location.pathname === cleanPath) return;

    const currentRoot = window.location.pathname.split('/')[1] || '';
    const targetRoot = cleanPath.split('/')[1] || '';

    if (currentRoot !== targetRoot) {
      window.location.href = cleanPath;
      return;
    }

    window.history.pushState(null, '', cleanPath);
    this.handleRoute(cleanPath);
  },

  handleRoute(path, hash = null) {
    // Normalize path (remove trailing slash)
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    if (path.endsWith('index.html')) path = '/';

    // Check if it's a store category
    if (path.startsWith('/store/')) {
      const categoryPath = path.replace('/store/', '');
      this.scrollToSection('store');
      this.handleStoreCategory(categoryPath);
      return;
    }

    // Priority to hash if provided (for initial load like index.html#store)
    if (hash) {
      const sectionId = hash.substring(1);
      if (sectionId) {
        this.scrollToSection(sectionId);
        this.updateNavbarActive('/' + sectionId);
        return;
      }
    }

    const sectionId = this.routes[path] || 'hero';
    this.scrollToSection(sectionId);

    // Update navbar active state
    this.updateNavbarActive(path);
  },

  scrollToSection(id) {
    if (id === 'hero' || id === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  handleStoreCategory(categoryPath) {
    const link = document.querySelector(`.sidebar-link[data-category-path="${categoryPath}"]`);
    if (link) {
      const categoryName = link.getAttribute('data-category');
      switchStoreTab(link, categoryName, false);
    }
  },

  updateNavbarActive(path) {
    const links = document.querySelectorAll('.spotlight-link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      let targetPath;
      if (href === '#') {
        targetPath = '/';
      } else if (href.includes('#')) {
        targetPath = '/' + href.substring(href.indexOf('#') + 1);
      } else {
        targetPath = href;
      }
      const isActive = path === targetPath;
      link.classList.toggle('active', isActive);
      if (isActive) {
        updateAmbience(parseInt(link.getAttribute('data-index')));
      }
    });
  }
};

// ━━ PRELOADER ━━
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) {
    // If no preloader, init router immediately
    Router.init();
    return;
  }

  const finishPreloader = () => {
    preloader.classList.add('fade-out');
    
    setTimeout(() => {
      preloader.remove();
      Router.init();
    }, 1000);
  };

  // Use both 'load' and a safety timeout
  window.addEventListener('load', () => {
    setTimeout(finishPreloader, 1200);
  });

  // Safety timeout in case 'load' doesn't fire for some reason
  setTimeout(() => {
    if (preloader.parentElement) finishPreloader();
  }, 5000);
}

// ━━ UI SOUND EFFECTS ━━
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_audioCtx.state === 'suspended') {
    _audioCtx.resume();
  }
  return _audioCtx;
}

function playClickSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.03);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.start(now);
    osc.stop(now + 0.06);
  } catch (_) {}
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('button, .btn-primary, .btn-outline, .btn-cancel, .btn-text, .add-to-cart, .spotlight-link, .sidebar-link, [data-featured-category], .faq-question, .back-to-top, [onclick]');
  if (btn) playClickSound();
}, true);

const CART_STORAGE_KEY = 'store_cart';
const INR_EXCHANGE_RATE = 95;
const CART_VERSION = 2;

let currentCurrency = 'USD';

function getCart() {
  try {
    const savedVer = localStorage.getItem('store_cart_ver');
    if (savedVer !== String(CART_VERSION)) {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.setItem('store_cart_ver', String(CART_VERSION));
      return {};
    }
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  localStorage.setItem('store_cart_ver', String(CART_VERSION));
}

function formatCurrency(amount) {
  if (currentCurrency === 'INR') {
    return (amount * INR_EXCHANGE_RATE).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function initCurrencySwitcher() {
  const switcher = document.getElementById('currencySwitcher');
  if (!switcher) return;

  const btn = switcher.querySelector('.currency-switcher-btn');
  const currentLabel = switcher.querySelector('.currency-switcher-current');
  const options = switcher.querySelectorAll('.currency-option');

  const savedCurrency = localStorage.getItem('store_currency');
  if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'INR')) {
    currentCurrency = savedCurrency;
  }

  function setCurrencyIcon(currency) {
    const inrIcon = currentLabel.querySelector('.currency-icon-inr');
    const usdIcon = currentLabel.querySelector('.currency-icon-usd');
    const text = currentLabel.querySelector('.currency-text');
    if (inrIcon) inrIcon.style.display = currency === 'INR' ? '' : 'none';
    if (usdIcon) usdIcon.style.display = currency === 'USD' ? '' : 'none';
    if (text) text.textContent = currency;
  }

  setCurrencyIcon(currentCurrency);
  options.forEach(opt => {
    opt.classList.toggle('active', opt.getAttribute('data-currency') === currentCurrency);
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    switcher.classList.toggle('open');
  });

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const currency = opt.getAttribute('data-currency');
      if (currency === currentCurrency) {
        switcher.classList.remove('open');
        return;
      }
      currentCurrency = currency;
      localStorage.setItem('store_currency', currency);
      setCurrencyIcon(currency);
      options.forEach(o => o.classList.toggle('active', o.getAttribute('data-currency') === currency));
      switcher.classList.remove('open');
      updateAllDisplayedPrices();
    });
  });

  document.addEventListener('click', () => {
    switcher.classList.remove('open');
  });
}

function updateAllDisplayedPrices() {
  // 1. Update product cards
  document.querySelectorAll('.package-card').forEach(card => {
    const rawPrice = parseFloat(card.getAttribute('data-product-price'));
    if (!isNaN(rawPrice)) {
      const priceEl = card.querySelector('.package-price');
      if (priceEl) priceEl.textContent = formatCurrency(rawPrice);
    }
  });

  // 2. Update modal price if modal is open
  const modal = document.getElementById('productModal');
  if (modal && modal.classList.contains('active')) {
    const rawPrice = parseFloat(modal.getAttribute('data-product-price'));
    if (!isNaN(rawPrice)) {
      const modalPriceEl = document.getElementById('modalProductPrice');
      if (modalPriceEl) modalPriceEl.textContent = formatCurrency(rawPrice);
    }
  }

  // 3. Re-render cart page if we're on it
  if (document.getElementById('cart-items')) {
    renderCartPage();
  }
}

function getTotalDust(title, quantity) {
  const match = title.match(/^(\d+(?:\+\d+)?)/);
  if (!match) return null;
  const dustPerUnit = match[1].includes('+')
    ? match[1].split('+').reduce((s, n) => s + parseInt(n, 10), 0)
    : parseInt(match[1], 10);
  return dustPerUnit * quantity;
}

function getProductFromCard(card) {
  if (!card) return null;
  const id = card.getAttribute('data-product-id');
  const title = card.getAttribute('data-product-title');
  const price = parseFloat(card.getAttribute('data-product-price')) || 0;
  const image = card.getAttribute('data-product-image') || '';
  const category = card.getAttribute('data-category') || '';
  if (!id || !title) return null;
  return { id, title, price, image, category };
}

function addToCart(product, quantity = 1, replace = false) {
  if (!product || !product.id) return;
  const cart = getCart();
  const existing = cart[product.id];
  if (existing) {
    if (replace) {
      existing.quantity = quantity;
    } else {
      existing.quantity += quantity;
    }
    existing.title = product.title;
    existing.price = product.price;
    existing.image = product.image;
    existing.category = product.category;
  } else {
    cart[product.id] = { ...product, quantity };
  }
  saveCart(cart);
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge-nav, .mobile-cart-badge');
  if (!badges.length) return;
  const cart = getCart();
  const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

function initCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      const card = button.closest('.package-card');
      const product = getProductFromCard(card);
      if (!product) return;
      addToCart(product, 1, true);
      updateCartBadge();
      const href = button.getAttribute('href');
      if (href) window.location.href = href;
    });
  });
}

function renderCartPage() {
  const cartItemsContainer = document.getElementById('cart-items');
  const summarySection = document.getElementById('cart-summary');
  if (!cartItemsContainer) return;

  const cart = getCart();
  const items = Object.values(cart).map(item => ({
    ...item,
    title: item.title.replace(/\s*\(LIFESTEAL\)/g, '').trim()
  }));

  if (!items.length) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty. Return to the store to add items to your order.</p>
      </div>
    `;
    if (summarySection) summarySection.style.display = 'none';
    return;
  }

  if (summarySection) summarySection.style.display = 'block';

  cartItemsContainer.innerHTML = items.map(item => `
    <article class="cart-item" data-product-id="${escapeHTML(item.id)}" data-category="${escapeHTML(item.category || '')}">
      ${item.image ? `<img class="cart-item-img" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}">` : ''}
      <div class="cart-item-body">
        <div>
          <strong class="cart-item-title">${escapeHTML(item.title)}${item.category === 'ranks' ? ' Rank' : ''}</strong>
          <div class="cart-item-meta">${escapeHTML(formatCurrency(item.price))} each</div>
        </div>
        <div class="cart-item-qty">
          ${item.category === 'epix-dust' ? `
            <button class="cart-qty-btn" data-action="decrease" type="button">−</button>
            <span class="cart-qty-value">${item.quantity}</span>
            <button class="cart-qty-btn" data-action="increase" type="button">+</button>
          ` : `<span class="cart-qty-value">Qty: ${item.quantity}</span>`}
        </div>
      </div>
      <button class="cart-remove" type="button" data-action="remove">Remove</button>
    </article>
  `).join('');

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalEl = document.getElementById('cart-subtotal');
  const countEl = document.getElementById('cart-count');
  if (subtotalEl) subtotalEl.textContent = formatCurrency(total);
  if (countEl) countEl.textContent = `${count} item${count === 1 ? '' : 's'}`;

  const summaryDetails = document.querySelector('.summary-details');
  if (summaryDetails) {
    const existingBreakdown = summaryDetails.querySelector('.summary-breakdown');
    if (existingBreakdown) existingBreakdown.remove();

    const breakdownDiv = document.createElement('div');
    breakdownDiv.className = 'summary-breakdown';
    breakdownDiv.innerHTML = items.map(item => {
      const dustTotal = item.category === 'epix-dust' ? getTotalDust(item.title, item.quantity) : null;
      const qtyDisplay = dustTotal !== null ? `${dustTotal} total dust` : `x${item.quantity}`;
      return `
      <div class="summary-item-row">
        <span class="summary-item-name">${escapeHTML(item.title)}${item.category === 'ranks' ? ' Rank' : ''}</span>
        <span class="summary-item-qty">${qtyDisplay}</span>
        <span class="summary-item-total">${escapeHTML(formatCurrency(item.price * item.quantity))}</span>
      </div>`;
    }).join('');
    summaryDetails.insertBefore(breakdownDiv, summaryDetails.querySelector('.subtotal'));
  }
}

function removeCartItem(productId) {
  const cart = getCart();
  if (!cart[productId]) return;
  delete cart[productId];
  saveCart(cart);
  renderCartPage();
  updateCartBadge();
}

// initCartPage
function initCartPage() {
  renderCartPage();
  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer) return;

  cartItemsContainer.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;
    const action = button.getAttribute('data-action');
    const itemCard = button.closest('.cart-item');
    const productId = itemCard?.getAttribute('data-product-id');
    if (!productId) return;

    if (action === 'remove') removeCartItem(productId);
    else if (action === 'increase' || action === 'decrease') {
      const cart = getCart();
      if (!cart[productId]) return;
      if (action === 'increase') cart[productId].quantity += 1;
      else {
        cart[productId].quantity -= 1;
        if (cart[productId].quantity <= 0) {
          delete cart[productId];
          saveCart(cart);
          renderCartPage();
          updateCartBadge();
          return;
        }
      }
      saveCart(cart);
      renderCartPage();
      updateCartBadge();
    }
  });

  const clearCartBtn = document.getElementById('clearCartBtn');
  const clearCartModal = document.getElementById('clearCartModal');
  const confirmClearCart = document.getElementById('confirmClearCart');
  const cancelClearCart = document.getElementById('cancelClearCart');
  
  clearCartBtn?.addEventListener('click', () => {
    clearCartModal?.classList.add('active');
  });

  confirmClearCart?.addEventListener('click', () => {
    saveCart({});
    renderCartPage();
    updateCartBadge();
    clearCartModal?.classList.remove('active');
  });

  cancelClearCart?.addEventListener('click', () => {
    clearCartModal?.classList.remove('active');
  });

  const checkoutBtn = document.getElementById('checkoutBtn');

  checkoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'https://dsc.gg/eclipxmc/';
  });
}

function initCartSystem() {
  initCartButtons();
  updateCartBadge();
  if (document.getElementById('cart-items')) {
    initCartPage();
    return;
  }
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('closeProduct');
  const overlay = modal?.querySelector('.modal-overlay');

  if (!modal) return;

  const showModal = (product) => {
    modal.setAttribute('data-product-price', product.price);
    document.getElementById('modalProductImg').src = product.image;
    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductPrice').textContent = formatCurrency(product.price);
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductIngame').textContent = product.ingame || 'No in-game info available.';
    document.getElementById('modalProductHowto').textContent = product.howto || 'No info available.';
    
    const addToCartBtn = document.getElementById('modalAddToCart');
    // Clear previous listeners to avoid duplicates
    const newBtn = addToCartBtn.cloneNode(true);
    addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
    
    newBtn.addEventListener('click', () => {
      addToCart(product, 1, true);
      updateCartBadge();
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('.btn-icon[title="View details"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.package-card');
      const product = getProductFromCard(card);
      if (!product) return;
      
      product.description = card.getAttribute('data-product-description') || 'No description available.';
      product.ingame = card.getAttribute('data-product-ingame') || '';
      product.howto = card.getAttribute('data-product-howto') || '';
      showModal(product);
    });
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  overlay?.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });
}

function initFeaturedCards() {
  document.querySelectorAll('[data-featured-category]').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.getAttribute('data-featured-category');
      const link = document.querySelector(`.sidebar-link[data-category-path="${category}"]`);
      if (link) link.click();
    });
  });
}

// BACK TO TOP
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ━━ PLAYER COUNT ━━
function initPlayerCount() {
  const valueEl = document.getElementById('playerCountValue');
  if (!valueEl) return;

  async function fetchCount() {
    try {
      const res = await fetch('https://api.mcsrvstat.us/2/play.eclipxmc.fun');
      const data = await res.json();
      if (data.online && data.players) {
        valueEl.textContent = `${data.players.online}/${data.players.max}`;
      } else {
        valueEl.textContent = 'Offline';
      }
    } catch {
      valueEl.textContent = '—';
    }
  }

  fetchCount();
  setInterval(fetchCount, 30000);
}

// ━━ SCROLL REVEAL ━━
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

// ━━ MOBILE SIDEBAR ━━
function initMobileSidebar() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const sidebar = document.querySelector('.mobile-sidebar');
  const overlay = document.querySelector('.mobile-sidebar-overlay');
  if (!toggle || !sidebar || !overlay) return;

  const closeBtn = sidebar.querySelector('.close-btn');
  const links = sidebar.querySelectorAll('nav a');

  function open() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    toggle.classList.add('hidden');
  }

  function close() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    toggle.classList.remove('hidden');
  }

  toggle.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  links.forEach(link => link.addEventListener('click', close));
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  initFAQAccordion();
  initHeroParticles();
  initIPCopy();
  initFlipFade();
  initPreloader();
  initCartSystem();
  initFeaturedCards();
  initBackToTop();
  initCurrencySwitcher();
  initPlayerCount();
  initScrollReveal();
  initMobileSidebar();
  updateAllDisplayedPrices();
});


// STORE PREVIEW TABS
function switchStoreTab(el, category, updateUrl = true) {
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => link.classList.remove('active'));
  el.classList.add('active');

  const indicator = document.querySelector('.sidebar-indicator');
  if (indicator) {
    const elRect = el.getBoundingClientRect();
    const parentRect = el.parentElement.getBoundingClientRect();
    const top = elRect.top - parentRect.top + (elRect.height / 2) - 12;
    indicator.style.top = `${top}px`;
    indicator.style.opacity = '1';
  }

  const catHeader = document.getElementById('store-category-header');
  const featuredSection = document.getElementById('featured-section');
  const grid = document.querySelector('.package-grid');
  
  if (!grid) return;

  if (featuredSection) featuredSection.style.display = 'none';
  if (catHeader) catHeader.style.display = 'block';
  grid.style.display = 'grid';

  grid.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  grid.style.opacity = '0';
  grid.style.transform = 'translateY(10px)';

  const headerH1 = catHeader?.querySelector('h1');
  const headerP = catHeader?.querySelector('p');

  const categoryPath = el.getAttribute('data-category-path');

  setTimeout(() => {
    if (headerH1) headerH1.textContent = category;
    if (headerP) {
      if (category.includes('Ranks')) headerP.textContent = 'Get yourself some awesome ranks! All ranks purchased here will apply only in our gamemode.';
      else if (category.includes('Epix Dust')) headerP.textContent = 'Get yourself some Epix Dust to get awesome keys & perks from the Epix Dust shop.';
      else if (category.includes('Crates')) headerP.textContent = 'Unlock exclusive rewards with our premium crates. Each crate contains rare items and valuable loot!';
      else headerP.textContent = `Browse our selection of ${category} and enhance your gameplay!`;
    }

    const cards = grid.querySelectorAll('.package-card');
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (!categoryPath || categoryPath === 'all' || cardCategory === categoryPath) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
    
    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';
    
    const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
    visibleCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 80);
    });
  }, 300);
}

// SPOTLIGHT NAVBAR
(function() {
  const nav = document.getElementById('spotlightNav');
  if (!nav) return;

  let activeIndex = 0;
  let ambienceX = 0;
  let ambienceVelocity = 0;
  let spotlightX = 0;
  let spotlightVelocity = 0;

  nav.querySelectorAll('.spotlight-link').forEach((link, idx) => {
    if (link.classList.contains('active')) activeIndex = idx;
  });

  function getItemCenter(index) {
    const item = nav.querySelector(`[data-index="${index}"]`);
    if (!item) return null;
    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    return itemRect.left - navRect.left + itemRect.width / 2;
  }

  window.updateAmbience = function(index) {
    const targetX = getItemCenter(index);
    if (targetX === null) return;
    activeIndex = index;
    ambienceVelocity = 0;
    ambienceX = targetX;
    nav.style.setProperty('--ambience-x', `${targetX}px`);
    spotlightVelocity = 0;
    spotlightX = targetX;
    nav.style.setProperty('--spotlight-x', `${targetX}px`);
  };

  function springToTarget() {
    const targetX = getItemCenter(activeIndex);
    if (targetX === null) return;

    const stiffness = 0.08;
    const damping = 0.75;
    
    function tick() {
      const dx = targetX - ambienceX;
      ambienceVelocity += dx * stiffness;
      ambienceVelocity *= damping;
      ambienceX += ambienceVelocity;
      nav.style.setProperty('--ambience-x', `${ambienceX}px`);
      
      if (Math.abs(dx) > 0.5 || Math.abs(ambienceVelocity) > 0.1) {
        requestAnimationFrame(tick);
      } else {
        ambienceX = targetX;
        nav.style.setProperty('--ambience-x', `${targetX}px`);
      }
    }
    tick();
  }

  function springSpotlightTo(targetX) {
    const stiffness = 0.06;
    const damping = 0.7;

    function tick() {
      const dx = targetX - spotlightX;
      spotlightVelocity += dx * stiffness;
      spotlightVelocity *= damping;
      spotlightX += spotlightVelocity;
      nav.style.setProperty('--spotlight-x', `${spotlightX}px`);

      if (Math.abs(dx) > 0.5 || Math.abs(spotlightVelocity) > 0.1) {
        requestAnimationFrame(tick);
      } else {
        spotlightX = targetX;
        nav.style.setProperty('--spotlight-x', `${targetX}px`);
      }
    }
    tick();
  }

  setTimeout(() => {
    const targetX = getItemCenter(activeIndex);
    if (targetX !== null) {
      spotlightX = targetX;
      ambienceX = targetX;
      nav.style.setProperty('--spotlight-x', `${targetX}px`);
      nav.style.setProperty('--ambience-x', `${targetX}px`);
    }
  }, 50);

  nav.addEventListener('click', (e) => {
    const link = e.target.closest('.spotlight-link');
    if (!link) return;
    const idx = parseInt(link.getAttribute('data-index'));
    if (!isNaN(idx)) {
      activeIndex = idx;
      springToTarget();
    }
  });

  nav.addEventListener('mousemove', (e) => {
    const rect = nav.getBoundingClientRect();
    const x = e.clientX - rect.left;
    spotlightX = x;
    nav.style.setProperty('--spotlight-x', `${x}px`);
    nav.classList.add('is-hovered');
  });

  nav.addEventListener('mouseleave', () => {
    nav.classList.remove('is-hovered');
    const targetX = getItemCenter(activeIndex);
    if (targetX !== null) {
      springSpotlightTo(targetX);
    }
  });

  window.addEventListener('resize', () => {
    const targetX = getItemCenter(activeIndex);
    if (targetX !== null) {
      updateAmbience(activeIndex);
      spotlightX = targetX;
      nav.style.setProperty('--spotlight-x', `${targetX}px`);
    }
  });
})();

window.addEventListener('pageshow', function(e) {
  if (e.persisted) location.reload();
});

