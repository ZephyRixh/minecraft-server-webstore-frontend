# Official Store & Landing Page

Welcome to the official web repository for this modern store frontend. This project is a polished landing page and shopping experience designed for gaming communities and online stores.

## 🚀 Features

- **Spotlight Navigation:** A custom-engineered navbar with dynamic lighting effects that follow the mouse and highlight active sections.
- **Immersive Hero Section:** Featuring animated particles, ghost text layers, and a one-click "Copy IP" system.
- **Interactive Store Preview:** A responsive sidebar-driven category system (Ranks, Coins, etc.) with staggered fade-in animations.
- **Visual Polish:**
  - **Scroll Reveal:** Smooth intersection-based reveal animations as you scroll.
  - **3D Card Tilt:** Subtle mouse-tracking tilt and glow effects on store packages and cards.
  - **Smooth Scrolling:** Seamless navigation between sections.
- **Custom Branding:** Integrated custom fonts (Ethnocentric & Epic Pro) and server-specific assets.

## 🛠️ Tech Stack

- **HTML5:** Semantic structure.
- **CSS3:** Custom properties (variables), Flexbox, Grid, and advanced animations.
- **Vanilla JavaScript:** Zero dependencies, modular initialization, and high-performance DOM manipulation.

## 📂 Project Structure

```text
lazy/
├── assets/
│   ├── css/
│   │   └── styles.css      # Core styles and animations
│   ├── fonts/              # Custom brand fonts
│   ├── images/             # Logos, backgrounds, and team photos
│   └── js/
│       └── script.js       # Dynamic behavior and interactivity
├── index.html              # Main entry point
├── run-preview.bat         # Local preview utility script
└── README.md               # You are here!
```

## 🏁 Getting Started

### Prerequisites
A modern web browser (Chrome, Firefox, Edge, Safari).

### Local Development
1.  **Clone/Download:** Obtain the project files.
2.  **Run Preview:** Double-click `run-preview.bat` (Windows) or simply open `index.html` in your browser.
3.  **Customization:**
    - **Server IP:** Search for `ip-copy-value` in `index.html` to update the server address.
    - **Links:** Update Discord and Store links in the Hero and Welcome sections.
    - **Store Categories:** Modify the `switchStoreTab` function calls in `index.html` and the corresponding logic in `script.js`.

## 🎨 Design Notes

- **Colors:** Dominated by a dark theme with vibrant orange and red accents.
- **Typography:** Uses `Ethnocentric` for headers and `Epic Pro` for stylized elements.
- **Responsiveness:** The layout is designed to be fluid across desktop and mobile devices.
