# EclipxMC — Minecraft Server Webstore & Landing Page

Welcome to the EclipxMC webstore frontend — a polished landing page and shopping experience for the EclipxMC Minecraft server.

## :rocket: Features

- **Spotlight Navigation:** Fixed navbar with dynamic spotlight glow and ambience effects that highlight the active section.
- **Immersive Hero Section:** Animated particles, flip-fade subtitle, and one-click IP copy.
- **Interactive Store Preview:** Sidebar-driven category system (Ranks, Epix Dust, Keys) with client-side routing.
- **Visual Polish:**
  - **Gradient Glints:** Cards feature tinted gradient backgrounds with color-matched shimmer effects.
  - **Glassmorphism:** Subtle semi-transparent surfaces with reduced blur for performance.
  - **Smooth Scrolling:** Seamless navigation between sections.
- **Custom Branding:** Bricolage Grotesque & Epic Pro fonts, server-specific assets.
- **Discord Checkout:** Local shopping cart redirects to Discord for manual ticket-based purchasing.

## :wrench: Tech Stack

- **HTML5:** Semantic structure.
- **CSS3:** Custom properties (variables), Flexbox, Grid, keyframe animations, and glassmorphism.
- **Vanilla JavaScript:** Zero dependencies, modular initialization, DOM manipulation, and history-based SPA client routing.
- **Vercel Routing:** Configuration (`vercel.json`) to redirect store categories and pages back to `index.html` for clean client-side routing.

---

## :memo: Configuration / Customization Guide

This guide tells you exactly what to change and where to customize the website for your own Minecraft server.

### 1. Server IP Address

**File:** `index.html`
**Search for:** `ip-copy-value`
**Example line (around line 101):**
```html
<span class="ip-copy-value">play.eclipxmc.fun</span>
```
**Change:** `play.eclipxmc.fun` to your actual server IP address.

---

### 2. Discord Server Link

Used in multiple places (Hero, Join Community banner, Footer, and Checkout redirect).

**Files:** `index.html`, `cart.html`, `assets/js/script.js`
**Search for:** `discord.gg/`
**Action:** Replace the invite code `pvc3CJpKaY` with your own Discord invite code.

| Location | File | Line(s) | Current Value |
|----------|------|---------|----------------|
| Hero (Join Discord button) | `index.html` | Line 96 | `https://discord.gg/pvc3CJpKaY` |
| Discord CTA section | `index.html` | Line 529 | `https://discord.gg/pvc3CJpKaY` |
| Footer links (Home page) | `index.html` | Lines 551, 554 | `https://discord.gg/pvc3CJpKaY` |
| Footer links (Cart page) | `cart.html` | Lines 138, 142 | `https://discord.gg/pvc3CJpKaY` |
| Checkout redirect logic | `assets/js/script.js` | Line 441 | `https://discord.gg/pvc3CJpKaY` |

---

### 3. Server Name / Branding

**Files:** `index.html`, `cart.html`
**Search for:** `EclipX MC`
**Action:** Update your server name throughout the site (titles, meta tags, hero subtitle, welcome headers, policy section, and footers).

---

### 4. Store Categories & Packages

**File:** `index.html`
**Search for:** `sidebar-link` or `package-card`

- **Sidebar categories** are defined in the store sidebar (lines 302-311).
  Each link has `data-category` and `data-category-path` attributes.
- **Package cards** are defined inside a single container `<div class="package-grid">` (lines 363-469).
  Each card uses `data-category` (e.g. `ranks`, `epix-dust`, `keys`) to filter dynamically.

**To add/edit products:**
1. Find the package grid (around line 363 in `index.html`).
2. Add or modify package cards (`<div class="card package-card" ...>`) with appropriate data attributes:
   - `data-category`: Category name matching the sidebar link's path (e.g., `ranks`, `epix-dust`, `keys`).
   - `data-product-id`: Unique identifier for the item (e.g., `vip-rank`).
   - `data-product-title`: Name shown on the card and modal.
   - `data-product-price`: Price formatted as a number (e.g., `4.99`).
   - `data-product-image`: Path to the product image.
   - `data-product-description`: Brief text describing the product.
   - `data-product-ingame`: List of in-game perks.
   - `data-product-howto`: Instructions on how the package is claimed.

---

### 5. Checkout Process (Discord Ticket System)

**Files:** `cart.html` and `assets/js/script.js`
**Search for:** `checkoutBtn`

The checkout button redirects the user to your Discord server via JavaScript:
- To update the redirect link, replace the URL inside `assets/js/script.js` (around line 441).
- To edit the instructions shown to the customer inside the checkout card, modify the `<div class="checkout-info">` section in `cart.html` (lines 109-117).

---

### 6. Footer Information

**Files:** `index.html`, `cart.html`
**Search for:** `<footer class="footer">`

- Update server copyright years and info in `footer-disclaimer`.
- Update the navigation links in `footer-center` (lines 549-551 in `index.html`).
- Update the credit link / social icons in `footer-right`.

---

### 7. Images & Assets

**Folder:** `assets/images/`

| Image / Asset | Purpose |
|---------------|---------|
| `eclipxmc_logo.png` | Site logo & favicon |
| `coin.png` | Epix Dust product icons |
| `stars-bg.png` | Animated backdrop background |


**Tips:**
- Keep images optimized (use WebP or compressed PNGs for better performance).
- Ensure product images have transparent backgrounds where applicable.

---

### 8. Theme Colors (Advanced)

**File:** `assets/css/styles.css`
**Search for:** `:root` (lines 15-32)

```css
:root {
  --bg: #000000;
  --surface: rgba(255,255,255,0.03);
  --glass: rgba(255,255,255,0.05);
  --glass-border: rgba(255,255,255,0.08);
  --border: rgba(255,255,255,0.06);
  --accent: #ffffff;
  --text: #ffffff;
  /* ... other variables */
}
```

---

## :computer: Local Development

### Run Locally

**Option 1: Direct Batch Script (Windows)**
Double-click `run-preview.bat` to spin up a quick server or open the pages.

**Option 2: Using Vercel CLI (Recommended for Routing)**
Since the website uses client-side routing, page reloads on paths like `/store/ranks` require redirection logic.
```bash
# Install Vercel CLI
npm install -g vercel

# Run development server with vercel.json routing
vercel dev
```

**Option 3: Quick Local Server**
```bash
# Python 3
python -m http.server 8000

# Or using npx
npx serve
```
*Note: If using Python or standard static servers, manual browser reloads on dynamic paths (e.g. `/store/ranks`) may return 404s. Use Vercel dev for full routing emulation.*

---

## :warning: Important Notes for Public Deployment

1. **Remove sensitive data:** Ensure you do not commit any secret variables or private staff details.
2. **Discord category & bot:** Ensure your Discord server has a designated ticket system corresponding to the instructions given in `cart.html`.
3. **Terms & Policies:** Customize the Terms of Service, Privacy Policy, and Refund Policy under the policies grid in `index.html` (lines 124-137) before launching.

---

## Support

**Contact** - businesszephy07@gmail.com