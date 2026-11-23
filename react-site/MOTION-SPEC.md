| Section / element | Trigger | Properties: from → to | Timing | Library / technique |
|---|---|---|---|---|
| Global > anchor scrolling | Click anchor | Scroll position: current → target | Browser default smooth duration/easing | CSS `scroll-behavior: smooth` |
| Loader > full-screen overlay | First visit per tab session; video end or click to skip | Opacity: `1 → 0`; unmount after completion | `0.45s`; no delay/stagger; default Motion easing | Motion; HTML video; `sessionStorage`; React state |
| Loader > film | On load | Video playback: start → end | Native video duration | HTML video: muted, autoplay, playsInline; no loop |
| Navbar > header | Scroll direction after `80px` | `y: 0% → -100%` on down; `-100% → 0%` on up | `0.3s`; no delay/stagger; default Motion easing | Motion; passive window scroll listener |
| Navbar > background | Scroll crosses `80px` | Background: transparent → 85% background token; backdrop filter: none → `blur(16px)` | Immediate; no transition declared | React state; CSS `color-mix()` / `backdrop-filter` |
| Menu overlay > backdrop | Mobile menu click / close click or link click | Opacity: `0 → 1`; exit `1 → 0` | `0.25s`; no delay/stagger; default Motion easing | Motion `AnimatePresence`; React state |
| Menu overlay > navigation links | Overlay opens | Opacity: `0 → 1`; `y: 30px → 0` | `0.4s` each; `0.08s` stagger; default Motion easing | Motion variants |
| Hero > headline lines | On load | Opacity: `0 → 1`; `y: 30px → 0` | `0.6s` each; `0.12s` stagger; `easeOut` | Motion variants |
| Hero > active slide | Previous / next click | Incoming opacity: `0 → 1`; outgoing opacity: `1 → 0` | `0.8s`; synchronous crossfade; default Motion easing | Motion `AnimatePresence` in `sync` mode |
| Hero > first-slide film | On load while slide `01` is active | Video playback loops continuously | Native video duration | HTML video: muted, loop, autoplay, playsInline; poster image replaces video below `md` |
| About > heading words | Scroll into view once; 40% threshold | Opacity: `0 → 1`; `y: 100% → 0` | `0.55s` each; `0.08s` stagger; `easeOut` | Motion `whileInView` |
| About > paragraphs and team link | Scroll into view once; 25% threshold | Opacity: `0 → 1`; `y: 24px → 0` | `0.5s` each; `0.1s` stagger; `easeOut` | Motion `whileInView` |
| Disciplines > numbered rows | Scroll into view once; 10% threshold | Opacity: `0 → 1`; `y: 36px → 0` | `0.55s` each; `0.1s` stagger; `easeOut` | Motion `whileInView` variants |
| Disciplines > service list | Row hover start/end or expand button click | Height: `0 → auto → 0`; opacity: `0 → 1 → 0` | `0.35s`; no delay/stagger; `easeOut` | Motion `AnimatePresence`; React state |
| Work > project grid | Filter click or “view all” click | Grid/card layout geometry: previous → filtered layout | Layout transition automatic; card transition declares `0.45s`; default Motion easing | Motion `layout`; `AnimatePresence` in `popLayout` mode |
| Work > project card | Scroll into view once; 15% threshold | Opacity: `0 → 1`; `y: 30px → 0`; exit opacity: `1 → 0` | `0.45s`; no delay/stagger; default Motion easing | Motion `whileInView` / `AnimatePresence` |
| Work > project image | Card hover | Scale: `1 → 1.03` | `0.45s`; no delay/stagger; `easeOut` | Motion hover variant |
| Work > project tags | Card hover | Opacity: `0 → 1`; `y: 12px → 0` | Inherits card transition context; no explicit child timing | Motion hover variant |
| Project modal > full-screen panel | Project card click / close button / `Esc` | Opacity: `0 → 1`; exit `1 → 0` | `0.35s`; no delay/stagger; default Motion easing | Motion `AnimatePresence`; React state; keyboard listener |
| Project modal > gallery image | Scroll into view once; 20% threshold | Opacity: `0 → 1`; `y: 24px → 0` | `0.5s`; no delay/stagger; default Motion easing | Motion `whileInView` |
| Project modal > project content | Previous / next button or `←` / `→` key | Project data: current → wrapped previous/next | Immediate; no transition declared | React state; keyboard listener |
| Clients > logo tiles | Scroll into view once; 10% threshold per sector | Opacity: `0 → 1` | `0.35s` each; `0.03s` stagger; default Motion easing | Motion `whileInView` variants |
| Clients > logo image | Hover | Filter: `grayscale(1) → grayscale(0)` | `0.25s`; no delay/stagger; default Motion easing | Motion hover variant; CSS filter |
| Footer > “Start a conversation” CTA | Scroll into view once; 50% threshold | Opacity: `0 → 1`; scale: `0.9 → 1` | `0.65s`; no delay/stagger; `easeOut` | Motion `whileInView` |

| Behavior | Specification |
|---|---|
| Loader | Shown once per browser-tab session using `3kg-loader-shown`; locks body scroll; plays `loader.mp4`; click or video end starts fade; unmount restores prior body overflow. |
| Hero slider `01 / 03` | Three cyclic slides; `←` decrements and wraps; `→` increments and wraps; counter is zero-padded; slide `01` is looping video on desktop and poster image on mobile; slides crossfade synchronously. |
| Menu overlay | Mobile “menu” sets open state and locks body scroll; overlay fades in; five links stagger upward; close button or any link closes; `AnimatePresence` runs exit fade; body overflow resets. |
| Work filter | Eight filters recompute project data and counts; “All work” initially shows 6 of 23; other filters show all matching projects; Motion `layout` reflows cards and `popLayout` removes exits from document flow. |
| Project modal | Card click opens full-screen panel and locks scroll; close button or `Esc` closes; header/footer buttons and arrow keys cycle through the currently filtered project list with wraparound; close restores prior body overflow. |
| Reduced motion | `MotionConfig reducedMotion="user"` plus `useReducedMotion()` sets Motion durations/staggers and positional/scale offsets to `0` or neutral; CSS media query disables smooth scroll and reduces animation/transition duration to `0.01ms`. |

| Token category | Token / usage | Value |
|---|---|---|
| Color | `--color-background` | `#ffffff` |
| Color | `--color-foreground` | `#121212` |
| Color | `--color-muted` | `#707070` |
| Color | `--color-line` | `rgb(16 16 16 / 14%)` |
| Color | `--color-accent` | `#ff3b00` |
| Color | `--color-inverse-background` | `#101010` |
| Color | `--color-inverse-foreground` | `#ffffff` |
| Font | `--font-sans` | `Instrument Sans`, system UI fallback; weights `400`, `500`, `600` |
| Font | `--font-mono` | `IBM Plex Mono`, monospace fallback; weight `500` |
| Font size | Utility labels / metadata | `text-xs: 0.75rem`; `text-sm: 0.875rem`; body emphasis `text-lg: 1.125rem` |
| Font size | Menu links | `clamp(2.5rem, 14vw, 5rem)` |
| Font size | Hero headline | `clamp(3.5rem, 12vw, 10rem)` |
| Font size | About heading | `clamp(3rem, 8vw, 7rem)` |
| Font size | Disciplines heading / row | `clamp(3.5rem, 10vw, 9rem)` / `clamp(2.5rem, 7vw, 6.5rem)` |
| Font size | Work / Clients heading | `clamp(4rem, 12vw, 11rem)` |
| Font size | Modal heading | `clamp(3.5rem, 11vw, 10rem)` |
| Font size | Footer CTA | `clamp(3.5rem, 11vw, 10rem)` |
| Spacing | `--space-page` | `clamp(1.25rem, 4vw, 4rem)` |
| Spacing | `--space-section` | `clamp(4rem, 12vw, 10rem)` |
| Spacing | Common component gaps | `0.5rem`, `0.75rem`, `1rem`, `1.25rem`, `1.5rem`, `2rem`, `2.5rem`, `3rem`, `4rem` via Tailwind utilities |
| Border | Dividers | `1px solid var(--color-line)`; active links use `var(--color-foreground)` |
| Border radius | Global / animated components | `0`; no border-radius token or rounded utility is declared |
