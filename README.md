# 🪐 Aastha Chaturvedi — Developer Portfolio

> A space-themed personal portfolio built with **vanilla HTML, CSS & JavaScript** — no frameworks, no build step, just the platform.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Canvas](https://img.shields.io/badge/Canvas_API-000000?logo=html5&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-22d3ee)

**Live Demo:** _add your deployed link here_ &nbsp;·&nbsp; **Author:** [Aastha Chaturvedi](https://github.com/aasthass2009)

---

## ✨ Features

- **Animated starfield** — a `<canvas>` field of twinkling stars with mouse + scroll parallax and the occasional shooting star.
- **Comet cursor** — a glowing dot trailed by a lagging ring that grows over interactive elements (desktop only).
- **3D-tilt project cards** — cards tilt toward the pointer with a glow that follows the cursor.
- **Magnetic buttons** — buttons and social links subtly pull toward the cursor.
- **Cosmic hero** — nebula gradient name, a ringed planet with an orbiting moon, and a faded star grid.
- **Scroll-progress comet** — a gradient bar with a glowing head that tracks reading progress.
- **Reveal-on-scroll** — sections fade and rise into view via `IntersectionObserver`.
- **Sticky navbar** — frosted-glass on scroll, with active-section highlighting and a slide-in mobile menu.
- **Fully responsive** and **accessible** — respects `prefers-reduced-motion` and disables pointer effects on touch devices.

## 🛠️ Tech Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties, grid/flexbox, `backdrop-filter`, keyframe animations
- **JavaScript (ES6+)** — no dependencies; Canvas API + IntersectionObserver
- **Google Fonts** — Space Grotesk, Inter, JetBrains Mono

## 📂 Project Structure

```text
portfolio/
├── index.html      # Markup & content — all five sections
├── style.css       # Cosmic theme: layout, colors, animations
├── script.js       # Starfield, comet cursor, tilt, scroll logic
└── README.md
```

The site is organized into five sections: **Hero → About → Skills → Projects → Contact.**

## 🚀 Getting Started

No installation or build tools required — it's fully static.

```bash
# 1. Clone the repository
git clone https://github.com/aasthass2009/portfolio.git
cd portfolio

# 2a. Open it directly in your browser
open index.html            # macOS  (use "start" on Windows)

# 2b. …or run a quick local server for a cleaner dev experience
python3 -m http.server 5500
# then visit http://localhost:5500
```

> An internet connection is needed for the Google Fonts to load as intended.

## 🎨 Customization

**Add a project** — copy the project-card block in `index.html` and update the title, description, tags, and links:

```html
<!-- Copy this whole <article> block to add another project -->
<article class="project-card reveal" data-tilt>
  ...
</article>
```

**Update your social links** — replace the placeholder LinkedIn and LeetCode URLs in the Contact section (look for the `TODO` comments in `index.html`).

**Change the accent / theme** — tweak the CSS custom properties at the top of `style.css`:

```css
:root {
  --cyan: #22d3ee;
  --violet: #a78bfa;
  --magenta: #f472b6;
}
```

## ♿ Accessibility

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) and descriptive `aria-label`s.
- Visible `:focus-visible` outlines for keyboard navigation.
- All motion (starfield, cursor, tilt, reveals) is disabled under `prefers-reduced-motion: reduce`.
- Pointer-driven effects are skipped on touch devices so the native experience stays clean.

## ☁️ Deployment

Being fully static, it deploys anywhere:

- **Vercel** — import the repo and deploy (no settings needed).
- **GitHub Pages** — Settings → Pages → deploy from the `main` branch root.
- **Netlify** — drag-and-drop the folder, or connect the repo.

## 📬 Contact

- **Email:** [aasthass2009@gmail.com](mailto:aasthass2009@gmail.com)
- **GitHub:** [@aasthass2009](https://github.com/aasthass2009)
- **Location:** Satna, Madhya Pradesh, India

## 📄 License

Released under the **MIT License** — feel free to use this as a reference for your own portfolio.

---

<p align="center">Designed &amp; built by Aastha Chaturvedi · Made with 💜 &amp; a little stardust</p>
