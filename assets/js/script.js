// EclipX MC Store JS

// NAVBAR SCROLL
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// FAQ ACCORDION
function initFAQAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      document.querySelectorAll('.faq-item').forEach(o => {
        if (o !== item) o.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  });
}

// SCROLL REVEAL
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 70}ms`;
    observer.observe(el);
  });
}

// HERO PARTICLES
function initHeroParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
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

// ━━ ROUTING SYSTEM ━━
const Router = {
  routes: {
    '/': 'hero',
    '/team': 'team',
    '/store': 'store',
    '/policies': 'policies',
    '/faq': 'faq'
  },

  init() {
    // Intercept all link clicks
    document.addEventListener('click', e => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

const href = anchor.getAttribute('href');
if (!href) return;

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
    if (window.location.pathname === path) return;
    
    // If we are on cart.html and want to go to a section on index.html
    if (window.location.pathname.includes('cart.html')) {
      window.location.href = 'index.html' + (path === '/' ? '' : '#' + path.substring(1));
      return;
    }

    window.history.pushState(null, '', path);
    this.handleRoute(path);
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
    const links = document.querySelectorAll('.spotlight-nav-link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      const targetPath = href === '#' ? '/' : '/' + href.substring(1);
      
      if (path === targetPath) {
        link.classList.add('active');
        // Update spotlight nav indicator if needed
        const idx = link.getAttribute('data-index');
        if (idx !== null && typeof updateAmbience === 'function') {
           updateAmbience(parseInt(idx));
        }
      } else {
        link.classList.remove('active');
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
    document.body.classList.add('is-loaded');
    
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

// ━━ SUBTLE CARD TILT & GLOW ━━
function initCardTilt() {
  document.querySelectorAll('.card, .cart-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (card.classList.contains('card')) {
        const centerX = x / rect.width - 0.5;
        const centerY = y / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${centerX * 3}deg) rotateX(${-centerY * 3}deg) translateY(-4px)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      if (card.classList.contains('card')) {
        card.style.transform = '';
      }
    });
  });
}

const CART_STORAGE_KEY = 'store_cart';

function formatCurrency(amount) {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function getProductFromCard(card) {
  if (!card) return null;
  const id = card.getAttribute('data-product-id');
  const title = card.getAttribute('data-product-title');
  const price = parseFloat(card.getAttribute('data-product-price')) || 0;
  const image = card.getAttribute('data-product-image') || '';
  if (!id || !title) return null;
  return { id, title, price, image };
}

function addToCart(product, quantity = 1) {
  if (!product || !product.id) return;
  const cart = getCart();
  const existing = cart[product.id];
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart[product.id] = { ...product, quantity };
  }
  saveCart(cart);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge-nav');
  if (!badge) return;
  const cart = getCart();
  const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
}

function initCartButtons() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      const card = button.closest('.package-card');
      const product = getProductFromCard(card);
      if (!product) return;
      addToCart(product, 1);
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
  const items = Object.values(cart);

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
    <article class="cart-item" data-product-id="${item.id}">
      <img class="cart-item-img" src="${item.image}" alt="${item.title}">
      <div class="cart-item-body">
        <div>
          <strong class="cart-item-title">${item.title}</strong>
          <div class="cart-item-meta">${formatCurrency(item.price)} each</div>
        </div>
        <div class="cart-item-controls">
          <div class="cart-quantity">
            <button type="button" class="qty-button" data-action="decrease">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button type="button" class="qty-button" data-action="increase">+</button>
          </div>
          <div class="total-row">
            <span>Total</span>
            <strong>${formatCurrency(item.price * item.quantity)}</strong>
          </div>
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
}

function updateCartItem(productId, change) {
  const cart = getCart();
  const item = cart[productId];
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + change);
  if (item.quantity <= 0) {
    delete cart[productId];
  }
  saveCart(cart);
  renderCartPage();
  updateCartBadge();
}

function removeCartItem(productId) {
  const cart = getCart();
  if (!cart[productId]) return;
  delete cart[productId];
  saveCart(cart);
  renderCartPage();
  updateCartBadge();
}

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

    if (action === 'increase') updateCartItem(productId, 1);
    if (action === 'decrease') updateCartItem(productId, -1);
    if (action === 'remove') removeCartItem(productId);
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
    window.location.href = 'https://discord.gg/pvc3CJpKaY';
  });
}

function initCartSystem() {
  initCartButtons();
  updateCartBadge();
  if (document.getElementById('cart-items')) {
    initCartPage();
  }
}

function initProductSearch() {
  const searchInput = document.getElementById('productSearch');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.package-card');
    const activeLink = document.querySelector('.sidebar-link.active');
    const activeCategory = activeLink ? activeLink.getAttribute('data-category-path') : null;

    cards.forEach(card => {
      const title = card.getAttribute('data-product-title').toLowerCase();
      const category = card.getAttribute('data-category');
      
      const matchesSearch = title.includes(query);
      const matchesCategory = !activeCategory || category === activeCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

function initProductModal() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('closeProduct');
  const overlay = modal?.querySelector('.modal-overlay');

  if (!modal) return;

  const showModal = (product) => {
    document.getElementById('modalProductImg').src = product.image;
    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductPrice').textContent = formatCurrency(product.price);
    document.getElementById('modalProductDescription').textContent = product.description;
    
    const addToCartBtn = document.getElementById('modalAddToCart');
    // Clear previous listeners to avoid duplicates
    const newBtn = addToCartBtn.cloneNode(true);
    addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
    
    newBtn.addEventListener('click', () => {
      addToCart(product, 1);
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

function initLiveActivity() {
  const container = document.createElement('div');
  container.className = 'live-activity-container';
  document.body.appendChild(container);

  const showNotification = (order) => {
    // Basic item parsing for notification text
    const firstItem = order.items && order.items.length > 0 ? order.items[0].title : 'a package';
    
    const toast = document.createElement('div');
    toast.className = 'purchase-toast';
    toast.innerHTML = `
      <img src="https://mc-heads.net/avatar/${order.User.username}/40" alt="${order.User.username}" class="purchase-toast-avatar">
      <div class="purchase-toast-content">
        <span class="purchase-toast-user">${order.User.username}</span>
        <span class="purchase-toast-text">Just purchased <strong>${firstItem}</strong></span>
        <span class="purchase-toast-time">Just now</span>
      </div>
    `;

    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('active'), 100);
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => toast.remove(), 600);
    }, 6000);
  };
}

function initServerStatus() {
  const playerCountEl = document.getElementById('playerCount');
  const statusIndicator = document.querySelector('.status-indicator');
  if (!playerCountEl || statusIndicator?.classList.contains('offline')) return;

  let count = parseInt(playerCountEl.textContent);
  
  const updateCount = () => {
    const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
    count = Math.max(150, Math.min(500, count + change));
    playerCountEl.textContent = count;
    
    setTimeout(updateCount, 5000 + Math.random() * 5000);
  };

  setTimeout(updateCount, 3000);
}

function initLightbox() {
  window.openLightbox = (src) => {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    if (!lightbox || !img) return;
    img.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
}

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

// INIT
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initFAQAccordion();
  initScrollReveal();
  initHeroParticles();
  initIPCopy();
  initPreloader();
  initCardTilt();
  initCartSystem();
  initProductSearch();
  initProductModal();
  initLiveActivity();
  initServerStatus();
  initBackToTop();
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
      if (category.includes('Ranks')) headerP.innerHTML = 'Get yourself some awesome ranks! All ranks purchased here will apply only in our gamemode.';
      else if (category.includes('Coins')) headerP.innerHTML = 'Get yourself some coins to get awesome keys & perks from coinshop.';
      else if (category.includes('Keys')) headerP.innerHTML = 'Unlock powerful rewards with our custom crate keys. Each key provides a chance for rare items!';
      else headerP.innerHTML = `Browse our selection of ${category} and enhance your gameplay!`;
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

// SPOTLIGHT NAVBAR LOGIC
(function() {
  const nav = document.querySelector('.spotlight-nav');
  if (!nav) return;

  const links = nav.querySelectorAll('.spotlight-nav-link');
  let activeIndex = 0;
  let currentAmbienceX = 0;
  let targetAmbienceX = 0;

  window.updateAmbience = function(index, immediate = false) {
    const item = links[index];
    if (!item) return;
    
    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    targetAmbienceX = itemRect.left - navRect.left + itemRect.width / 2;
    
    if (immediate) {
      currentAmbienceX = targetAmbienceX;
      nav.style.setProperty('--ambience-x', `${currentAmbienceX}px`);
    }
  };

  links.forEach((link, idx) => {
    if (link.classList.contains('active')) activeIndex = idx;
    // Clicks are now handled by Router.init()
  });

  function animate() {
    const stiffness = 0.15;
    const friction = 0.8;
    let velocity = (targetAmbienceX - currentAmbienceX) * stiffness;
    currentAmbienceX += velocity;
    nav.style.setProperty('--ambience-x', `${currentAmbienceX}px`);
    requestAnimationFrame(animate);
  }
  
  setTimeout(() => {
    updateAmbience(activeIndex, true);
    animate();
  }, 100);

  nav.addEventListener('mousemove', (e) => {
    nav.classList.add('is-hovered');
    const rect = nav.getBoundingClientRect();
    const x = e.clientX - rect.left;
    nav.style.setProperty('--spotlight-x', `${x}px`);
  });

  nav.addEventListener('mouseleave', () => {
    nav.classList.remove('is-hovered');
  });
})();
