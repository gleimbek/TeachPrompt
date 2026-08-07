# TeachPrompt — AI Studio for Educators

**AI-powered prompt studio for educators · v1.3.1**

TeachPrompt (formerly ClassVision / Lina's AI Teaching Toolkit) is a production-quality, modular web application that helps educators compose precise, model-aware prompts for generating classroom-ready instructional graphics (infographics, flowcharts, timelines, concept maps, diagrams, comparison charts, process illustrations, and more).

---

## 📱 Visual and Device Compatibility Analysis

Yes, **all files and layout components are fully optimized and correctly visible across all devices** (Laptop, Tablet, and Mobile). 

Here is a breakdown of how the design system and CSS guarantee seamless display across viewports:

| Device Category | Screen Width / Viewport | Layout Strategy & Visibility |
| :--- | :--- | :--- |
| **Laptop / Desktop** | `> 1024px` | **Two-Column Split Layout**: The main configuration workspace takes up the left side while the live prompt terminal stays fixed/sticky on the right (`var(--preview-width)`), utilizing full screen height for optimal workflow. |
| **Tablet** | `768px – 1024px` | **Adaptive Stack & Sticky Preview**: Converts smoothly to a single-column stacked layout. The live preview panel shifts to a top-sticky floating drawer (`max-height: 50vh`), keeping the current prompt visible while scrolling through inputs. |
| **Mobile / Phone** | `< 640px` | **Mobile-First Touch Architecture**: Form grids collapse into single columns (`grid-template-columns: 1fr`). Header branding adapts dynamically (hiding text-heavy taglines to avoid clutter), buttons expand for easy touch targets, and touch scroll padding prevents overflow. |

### Technical Verification Checklist:
- **Responsive Viewport Configuration**: Configured with `<meta name="viewport" content="width=device-width, initial-scale=1" />` in `index.html`.
- **Flexible Grid & Flexbox Containers**: CSS uses auto-fill grids (`repeat(auto-fill, minmax(185px, 1fr))`) for graphic types and models, guaranteeing smooth reflow on small screens.
- **PWA / Standalone Support**: Custom `manifest.json` handles responsive icons (`192x192`, `512x512`, and `maskable`) for iOS, Android, and Desktop installability.
- **Dynamic Typography & Units**: Fluid typography (`clamp()`, `rem`, `vw`) ensures zero text clipping or horizontal overflow.

---

## ✨ Key Features

- **Live Prompt Composition** — Every form selection updates a single master prompt in real-time.
- **16 Graphic Types** — Concept Map, Flowchart, Infographic, Timeline, Comparison Chart, Labeled Diagram, Cycle, Hierarchy, Venn Diagram, 2×2 Matrix, Mind Map, Sequence, Anatomy, Data Visualization, Visual Analogy, Reference Poster.
- **Content Controls** — Topic, Subject Area, Grade Level, Audience, Learning Objective, Bloom's Taxonomy Level.
- **Visual Controls** — Style, Tone, Color Palette, Complexity, Icon/Illustration preferences.
- **Layout & Output Specifications** — Size presets (US Letter, A4, 16:9 Slides, Poster), Orientation, Text density, File format (PNG, SVG, PDF, JPG, WebP), Resolution (72–600 DPI), Transparency, Bleed margins.
- **Accessibility Constraints (WCAG 2.2)** — Color-blind-safe options, Alt-text generation, High contrast, Distance legibility, Large labels.
- **Pedagogical Standards** — Factual accuracy enforcement, Visual hierarchy, Citation requirements, Age appropriateness, Grade-level scaffolding.
- **Model-Aware Phrasing** — Dedicated optimization for Claude, ChatGPT, Gemini, Grok, Perplexity, and Generic LLMs.
- **Direct Model Execution** — Instant copy and auto-launch to selected AI model interfaces.
- **Quick-Start Templates** — Pre-configured settings for Classroom Activities, Lectures, Skills Training, and Learning Summaries.
- **Presets & Data Portability** — Save, load, delete named configurations (`localStorage`), and export/import portable `.json` files.
- **Prompt History** — Automatic logging of copied or downloaded prompts (up to 30 entries) with one-click restoration.
- **Installable PWA** — Offline caching via Service Worker (`service-worker.js`).
- **Dark & Light Mode** — Persisted user theme preference with seamless CSS variables.

---

## 📁 Project Structure

```text
teachprompt/
├── index.html              # Main HTML entry point & semantic app shell
├── manifest.json           # Web App Manifest for PWA installation
├── service-worker.js       # App-shell caching for offline access
├── css/
│   └── styles.css          # Design system, themes, and media queries
├── js/
│   ├── app.js              # Application bootstrapper & SW registration
│   ├── config.js           # Single source of truth for options & state defaults
│   ├── prompt-builder.js   # Pure prompt generation & constraint composition
│   ├── storage.js          # localStorage, history, and preset import/export
│   └── ui.js               # Reactive UI rendering, events, & modals
└── assets/
    ├── logo.png            # Main branding visual
    ├── logo-mark.svg       # Vector icon mark
    ├── logo-full.svg       # Vector logo with wordmark
    └── icons/              # Favicons and PWA homescreen icons
        ├── favicon-32.png
        ├── apple-touch-icon.png
        ├── icon-192.png
        ├── icon-512.png
        └── icon-maskable-512.png
```

---

## 🚀 Getting Started

### Local Development
No build tools, compilation steps, or Node.js required! Serve the folder using any HTTP server:

```bash
# Using Python 3
python -m http.server 8080
```
Then open **http://localhost:8080** in your browser.

> *Note: Because the project uses native ES Modules (`import`/`export`) and Service Workers, it must be served over `http://` or `https://` (opening `index.html` via `file://` will cause browser security blocks).*

### Deployment (PWA Requirements)
To enable offline support and allow users to install TeachPrompt as a desktop/mobile app, host the files on any static HTTPS web server (e.g., **GitHub Pages**, **Vercel**, **Netlify**, or **Cloudflare Pages**).

---

## 📄 License

Built for educators and instructional designers. Free to use and adapt.
