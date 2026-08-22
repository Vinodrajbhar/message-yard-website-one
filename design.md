# 🎨 MESSAGE YARD — DESIGN.md v4.0
## Logo-Derived Design System · Dark-First · Gradient Spectrum
### Definitive Build Specification

---

## 0. WHAT THE LOGO TELLS US

The logo is not decoration — it is the design system in miniature. Before writing a single line of CSS, here is what it dictates:

### 0.1 Extracted Colors (Sampled Directly)

| Element | Hex | RGB | Role |
|---|---|---|---|
| Tile — top-left | `#29BBF0` | 41, 187, 240 | Spectrum start (Cyan) |
| Tile — mid-left | `#329EF3` | 50, 158, 243 | Spectrum step |
| Tile — top-right | `#3790F5` | 55, 144, 245 | Spectrum core (Blue) |
| Tile — bottom-left | `#3B83F6` | 59, 131, 246 | Spectrum step |
| Tile — mid-right | `#4C7AF6` | 76, 122, 246 | Spectrum step |
| Tile — bottom-right | `#7C64F6` | 120, 101, 246 | Spectrum end (Violet) |
| Canvas | `#070B17` | 7, 11, 23 | Deep space background |
| Canvas edge | `#09101E` | 9, 16, 30 | Slightly lifted background |
| Wordmark "Message" | `#FFFFFF` | 255, 255, 255 | Primary text |

### 0.2 Structural Reads

**The mark is a speech bubble containing a 3×2 grid of tiles.**

This gives us three non-negotiable design principles:

1. **The container holds the grid.** A conversation (speech bubble) is the outer frame; organized message units (tiles) live inside it. Every layout on the site should echo this: an outer conversational frame holding structured, gridded content.

2. **The gradient flows diagonally.** Cyan sits at top-left, violet at bottom-right. Every gradient on the site must run at the same **135° diagonal angle** — never vertical, never horizontal, never reversed. This diagonal is the brand's signature vector.

3. **This is a dark-first brand.** The logo is built for `#070B17`. The white stroke of the speech bubble only reads on dark. Light mode is the secondary theme, not the primary.

### 0.3 The Tile Grid Is the Layout Grid

The 3×2 tile arrangement in the logo is literally the site's card grid ratio. The 6-pillar feature section uses a 3×2 grid. The tile corner radius (relative to tile size, roughly 22%) sets our card radius ratio. The tile gap sets our grid gap rhythm.

---

## 1. BRAND FOUNDATION

- **Name:** MessageYard
- **Category:** Marketing Cloud + CPaaS (Communications Platform as a Service)
- **Tagline:** *"The Marketing Cloud with real infrastructure underneath."*
- **Metaphor:** A yard is where things are built, sorted, and shipped. MessageYard is where messages are composed, routed, and delivered.
- **Aesthetic:** Deep-space precision. Think Vercel's dark confidence × Linear's geometric restraint × Stripe's editorial clarity.
- **Voice:** Confident, exact, unadorned. State numbers. Never exclaim.

---

## 2. COLOR SYSTEM

### 2.1 The Spectrum (Brand Gradient)

The single most important brand asset after the logo. Three stops, 135° diagonal, always.

```css
--gradient-brand: linear-gradient(135deg, #29BBF0 0%, #3B82F6 50%, #7C64F6 100%);
```

```
STOP 1 — SIGNAL CYAN     #29BBF0    Ingress. Where messages enter.
STOP 2 — ROUTE BLUE      #3B82F6    Transit. The core infrastructure.
STOP 3 — DISPATCH VIOLET #7C64F6    Egress. Where messages land.
```

**Individual spectrum colors (for solid fills, borders, icons):**

```css
--cyan:        #29BBF0;   /* Ingress, inbound, receiving */
--cyan-dim:    #1E96C4;   /* Pressed/hover state */
--blue:        #3B82F6;   /* Primary action, core brand, links */
--blue-dim:    #2E6BD4;   /* Pressed/hover state */
--violet:      #7C64F6;   /* Dispatch, outbound, AI features */
--violet-dim:  #6450D0;   /* Pressed/hover state */
```

**Spectrum tints (for backgrounds, subtle fills):**

```css
--cyan-a08:    rgba(41, 187, 240, 0.08);
--cyan-a16:    rgba(41, 187, 240, 0.16);
--blue-a08:    rgba(59, 130, 246, 0.08);
--blue-a16:    rgba(59, 130, 246, 0.16);
--blue-a24:    rgba(59, 130, 246, 0.24);
--violet-a08:  rgba(124, 100, 246, 0.08);
--violet-a16:  rgba(124, 100, 246, 0.16);
```

### 2.2 Dark Theme (Primary)

```css
/* Surfaces — each step is a "lift" in elevation */
--bg-void:        #070B17;   /* Page background. Deepest layer. */
--bg-base:        #0A0F1E;   /* Section backgrounds */
--bg-surface:     #101728;   /* Cards, panels */
--bg-elevated:    #16203440; /* Hover states, raised cards */
--bg-overlay:     rgba(16, 23, 40, 0.72);  /* Modals, nav pill (with blur) */

/* Borders — hairlines only, never heavy */
--border-subtle:  rgba(255, 255, 255, 0.06);
--border-default: rgba(255, 255, 255, 0.10);
--border-strong:  rgba(255, 255, 255, 0.16);
--border-brand:   rgba(59, 130, 246, 0.32);

/* Text */
--text-primary:   #FFFFFF;
--text-secondary: #9BA5BC;   /* Body copy */
--text-tertiary:  #5F6B85;   /* Captions, metadata */
--text-disabled:  #3A4459;
```

### 2.3 Light Theme (Secondary)

The site is dark-first, but certain sections invert for contrast and rhythm — specifically the Pricing section and the Industry Solutions section. This "surfacing" from dark to light is a deliberate narrative beat.

```css
--bg-void-light:      #FFFFFF;
--bg-base-light:      #F7F9FC;
--bg-surface-light:   #FFFFFF;
--border-subtle-light: rgba(0, 0, 0, 0.06);
--text-primary-light:  #070B17;
--text-secondary-light: #4A5568;
--text-tertiary-light:  #8B96AB;
```

### 2.4 Semantic Colors

```css
--success:  #10B981;   /* Delivered, active, online */
--warning:  #F59E0B;   /* Queued, pending, throttled */
--danger:   #EF4444;   /* Failed, bounced, error */
--whatsapp: #25D366;   /* Channel-specific (WhatsApp green) */
```

### 2.5 Gradient Usage Rules

```
✓ ALLOWED
  - Logo mark (always)
  - Primary CTA button backgrounds
  - Section heading accent words (via background-clip: text)
  - Active tab indicator underline
  - Card border on featured/highlighted cards (1px gradient border)
  - Decorative glow orbs in section backgrounds (heavily blurred, low opacity)
  - Progress bars and data visualization fills

✗ FORBIDDEN
  - Body text (illegible)
  - Large background fills (overwhelming — use blurred orbs instead)
  - Multiple gradients competing in one viewport
  - Any angle other than 135°
  - Reversed direction (violet → cyan)
```

### 2.6 The Glow System

Because this is a dark theme, glows replace shadows as the primary depth cue.

```css
--glow-cyan:   0 0 40px rgba(41, 187, 240, 0.18);
--glow-blue:   0 0 40px rgba(59, 130, 246, 0.20);
--glow-violet: 0 0 40px rgba(124, 100, 246, 0.18);
--glow-brand:  0 0 32px rgba(59, 130, 246, 0.24), 0 0 64px rgba(124, 100, 246, 0.12);

/* Shadows still exist for physical elevation, but are near-black */
--shadow-sm:   0 2px 8px rgba(0, 0, 0, 0.32);
--shadow-md:   0 8px 24px rgba(0, 0, 0, 0.40);
--shadow-lg:   0 20px 56px rgba(0, 0, 0, 0.48);
--shadow-xl:   0 32px 80px rgba(0, 0, 0, 0.56);
```

---

## 3. TYPOGRAPHY

The logo wordmark is a **heavy geometric sans** — that sets the tone for headings.

```css
--font-display: "Plus Jakarta Sans", "Inter", sans-serif;   /* Headings */
--font-body:    "Inter", sans-serif;                        /* Body, UI */
--font-mono:    "JetBrains Mono", monospace;                /* Telemetry, code */
```

### 3.1 Scale

```
DISPLAY (Hero H1)
  Size:     clamp(44px, 5.5vw, 76px)
  Weight:   700 (matches logo wordmark weight)
  Tracking: -0.035em
  Leading:  1.05
  Balance:  text-wrap: balance

H2 (Section headings)
  Size:     clamp(32px, 3.8vw, 52px)
  Weight:   600
  Tracking: -0.03em
  Leading:  1.15

H3 (Card titles)
  Size:     20px–24px
  Weight:   600
  Tracking: -0.02em
  Leading:  1.3

BODY LARGE (Hero subhead, section intros)
  Size:     18px
  Weight:   400
  Leading:  1.6
  Color:    var(--text-secondary)

BODY (Card copy, paragraphs)
  Size:     15px–16px
  Weight:   400
  Leading:  1.65
  Color:    var(--text-secondary)

CAPTION
  Size:     13px
  Weight:   400
  Color:    var(--text-tertiary)

TELEMETRY (Badges, labels, eyebrows, code)
  Font:     var(--font-mono)
  Size:     11px–12px
  Weight:   500
  Tracking: 0.08em
  Case:     UPPERCASE
```

### 3.2 The Gradient Word Technique

The logo splits "Message" (white) from "Yard" (gradient). Headings echo this: one key word per heading receives the gradient treatment.

```css
.gradient-word {
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

```
EXAMPLES
  "The Marketing Cloud with real infrastructure underneath."
                              └─ gradient ─┘

  "Two products. One platform."
                     └gradient┘

  "Built for your industry."
             └─gradient─┘

RULE: Maximum ONE gradient word per heading. Never two.
```

---

## 4. SHAPE LANGUAGE — DERIVED FROM THE TILE GRID

### 4.1 Radii

The logo tiles have a radius roughly 22% of their width. We apply that ratio consistently.

```css
--radius-xs:    6px;    /* Badges, small chips */
--radius-sm:    10px;   /* Inputs, small buttons */
--radius-md:    14px;   /* Tiles, icon containers */
--radius-lg:    20px;   /* Cards */
--radius-xl:    24px;   /* Large panels, browser frames */
--radius-pill:  999px;  /* Pill buttons, nav bar */
```

### 4.2 The Tile — The Atomic Unit

Every icon container, feature marker, and channel indicator is a "tile" that references the logo.

```css
.tile {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);          /* 14px — matches logo ratio */
  background: var(--gradient-brand);
  display: grid;
  place-items: center;
}

.tile--outline {                             /* Inactive/secondary state */
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
}

.tile--glow {                                /* Active/featured state */
  background: var(--gradient-brand);
  box-shadow: var(--glow-brand);
}
```

**Tile grid rhythm:** When multiple tiles appear together (feature grids, channel selectors), use a **12px gap** — proportionally matching the logo's tile spacing.

### 4.3 The Bubble Frame

The speech bubble outline in the logo becomes a recurring container treatment for testimonials, quotes, and conversational UI mockups.

```css
.bubble-frame {
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius-xl);
  position: relative;
}

/* The tail — a small triangle at bottom-left, matching the logo */
.bubble-frame::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 32px;
  width: 16px;
  height: 16px;
  background: inherit;
  border-left: 1.5px solid var(--border-strong);
  border-bottom: 1.5px solid var(--border-strong);
  transform: rotate(-45deg);
}
```

### 4.4 Spacing Scale

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;    /* Tile gap — logo-derived */
--space-4:  16px;
--space-5:  24px;
--space-6:  32px;
--space-8:  48px;
--space-10: 64px;
--space-12: 96px;
--space-16: 128px;   /* Section vertical padding (desktop) */

/* Layout */
--container-max:  1200px;
--container-wide: 1360px;   /* Matches logo file width — nice symmetry */
--section-py-desktop: 128px;
--section-py-tablet:  88px;
--section-py-mobile:  64px;
```

---

## 5. BACKGROUND SYSTEM

The logo sits on a subtle dotted grid over near-black. That's our page background.

### 5.1 Base Layer — The Dot Grid

```css
.bg-grid {
  background-color: var(--bg-void);
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(255, 255, 255, 0.05) 1px,
    transparent 0
  );
  background-size: 32px 32px;
}
```

A subtle **radial mask** fades the grid toward the page edges so it never feels like graph paper:

```css
mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%);
```

### 5.2 Ambient Glow Orbs

Instead of large gradient fills, use heavily blurred colored orbs positioned behind content. These give the page depth and color without overwhelming it.

```css
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.20;
  pointer-events: none;
  z-index: 0;
}

/* Placement rules */
.orb--cyan   { background: #29BBF0; width: 520px; height: 520px; }
.orb--blue   { background: #3B82F6; width: 640px; height: 640px; }
.orb--violet { background: #7C64F6; width: 480px; height: 480px; }
```

**Per-section orb placement:**

| Section | Orbs |
|---|---|
| Hero | Cyan top-left (−15%, −10%), Violet bottom-right (110%, 80%) |
| Two Products | Blue centered behind the divider, opacity 0.12 |
| Why MessageYard | Violet right side, opacity 0.16 |
| Pricing (light) | None — light sections stay clean |
| Footer | Blue bottom-center, opacity 0.10 |

**Orb animation:** Extremely slow drift — 24s ease-in-out infinite, translating ±40px. Barely perceptible, but keeps the page feeling alive.

### 5.3 Section Transitions

Moving from dark to light sections must never be a hard edge.

```css
/* Dark → Light transition band (80px tall) */
.transition-band {
  height: 80px;
  background: linear-gradient(to bottom, var(--bg-void), var(--bg-base-light));
}
```

---

## 6. COMPONENT SPECIFICATIONS

### 6.1 Buttons

```css
/* PRIMARY — Gradient fill */
.btn-primary {
  background: var(--gradient-brand);
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  font: 500 15px var(--font-body);
  border: none;
  transition: all 250ms var(--ease-out);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--glow-brand);
  filter: brightness(1.08);
}
.btn-primary:active {
  transform: translateY(0) scale(0.98);
  filter: brightness(0.95);
}

/* SECONDARY — Glass */
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  backdrop-filter: blur(12px);
  padding: 12px 24px;
  border-radius: var(--radius-pill);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: var(--border-strong);
  transform: translateY(-2px);
}

/* GHOST — Text only */
.btn-ghost {
  color: var(--text-secondary);
  padding: 12px 16px;
}
.btn-ghost:hover {
  color: var(--text-primary);
}
```

### 6.2 Cards

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 28px;
  transition: all 350ms var(--ease-out);
  position: relative;
  overflow: hidden;
}

/* Top-edge gradient hairline — appears on hover */
.card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: var(--gradient-brand);
  opacity: 0;
  transition: opacity 350ms var(--ease-out);
}

.card:hover {
  background: var(--bg-elevated);
  border-color: var(--border-default);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.card:hover::before { opacity: 1; }
```

**Featured card variant** — gradient border via mask technique:

```css
.card--featured {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--bg-surface), var(--bg-surface)) padding-box,
    var(--gradient-brand) border-box;
  box-shadow: var(--glow-brand);
}
```

### 6.3 Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: var(--radius-xs);
  font: 500 11px var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.badge--active   { background: rgba(16,185,129,0.12);  color: #34D399; }
.badge--dispatch { background: var(--violet-a16);      color: #A78BFA; }
.badge--branch   { background: var(--blue-a16);        color: #60A5FA; }
.badge--ingress  { background: var(--cyan-a16);        color: #67D9F5; }
.badge--queued   { background: rgba(255,255,255,0.06); color: var(--text-tertiary); }
```

Each badge carries a leading **6px status dot** in the matching color. Active/success dots pulse:

```css
@keyframes signalPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.45); }
  50%      { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
}
```

### 6.4 Navigation Pill

```css
.nav {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1140px;
  width: calc(100% - 32px);
  padding: 10px 16px 10px 20px;
  border-radius: var(--radius-pill);
  background: var(--bg-overlay);
  backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid var(--border-subtle);
  z-index: 100;
  transition: all 350ms var(--ease-out);
}

/* Scrolled state */
.nav--scrolled {
  padding: 8px 14px 8px 18px;
  border-color: var(--border-default);
  box-shadow: var(--shadow-md);
}
```

Nav link hover: underline scales from center (`transform-origin: center; scaleX(0) → scaleX(1)`), colored with `var(--gradient-brand)`.

Smart hide/show: slides to `translateY(-120%)` on scroll-down, returns on scroll-up.

---

## 7. HERO SECTION

### 7.1 Structure

```
┌─────────────────────────────────────────────────┐
│  [Nav Pill — floating, glass]                   │
│                                                 │
│         ● MARKETING CLOUD + CPaaS               │  ← Eyebrow badge
│                                                 │
│      The Marketing Cloud with                   │  ← H1, "real
│      real infrastructure underneath.            │     infrastructure"
│                                                 │     is gradient
│      Plan campaigns, build journeys, and        │  ← Subhead
│      segment audiences — then send it all       │
│      through the same infrastructure that       │
│      powers 12 billion conversations a year.    │
│                                                 │
│      [Start free trial]  [Book a demo]          │  ← CTAs
│                                                 │
│      No credit card · 99.999% uptime · SOC 2    │  ← Trust line
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │     [Studio Console — browser frame]      │  │  ← Product UI
│  └───────────────────────────────────────────┘  │
│                                                 │
│   3,200+    12B+     34%      190+              │  ← Metrics strip
└─────────────────────────────────────────────────┘
```

### 7.2 Background Composition

```
Layer 0: --bg-void (#070B17)
Layer 1: Dot grid (32px, masked to fade at edges)
Layer 2: Cyan orb top-left (blur 120px, opacity 0.20)
Layer 3: Violet orb bottom-right (blur 120px, opacity 0.18)
Layer 4: Floating channel tiles (parallax, see below)
Layer 5: Content (text, CTAs)
Layer 6: Studio Console (raised, shadow-xl)
```

### 7.3 Floating Channel Tiles

Six tiles echo the logo's 3×2 grid, floating in 3D space behind and around the hero text. Each represents a channel.

```
TILE POSITIONS (desktop, relative to hero container)

  [1] SMS       left: 6%,   top: 20%    rotateY(14deg)  parallax 1.12x
  [2] WhatsApp  right: 8%,  top: 16%    rotateY(-12deg) parallax 1.16x
  [3] Email     left: 12%,  top: 52%    rotateY(10deg)  parallax 0.88x
  [4] Voice     right: 5%,  top: 48%    rotateY(-16deg) parallax 0.92x
  [5] RCS       left: 3%,   top: 76%    rotateY(8deg)   parallax 1.08x
  [6] Push      right: 14%, top: 78%    rotateY(-10deg) parallax 0.86x

EACH TILE
  Size:       64px × 64px
  Radius:     var(--radius-md) — 14px
  Background: var(--bg-surface) with 1px var(--border-default)
  Icon:       24px monoline channel icon, var(--text-secondary)
  Shadow:     var(--shadow-md)

  Two tiles (WhatsApp + SMS) are "active" — gradient background,
  white icon, var(--glow-brand). The rest are outline state.

FLOAT ANIMATION (staggered per tile)
  @keyframes tileFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%      { transform: translateY(-8px) rotate(1deg); }
  }
  Duration: 4s–6s (varied per tile), infinite, ease-in-out
  Delay: staggered 0s, 0.7s, 1.4s, 2.1s, 2.8s, 3.5s
```

**Connecting lines:** Thin SVG bezier paths link the tiles to the center of the hero (where the headline sits), suggesting all channels route through one platform. Lines are `1px`, `rgba(255,255,255,0.06)`, with animated `stroke-dashoffset` so a faint pulse of light travels along each path every 3 seconds.

### 7.4 Hero Entrance Choreography

```
Beat 0 (0ms):     Logo mark tiles draw in sequentially (6 tiles × 60ms)
Beat 1 (200ms):   Orbs fade in, 900ms
Beat 2 (400ms):   Eyebrow badge fades up from translateY(14px)
Beat 3 (550ms):   H1 reveals line-by-line via clip-path inset wipe, 700ms
                  Gradient word's background-position animates 0% → 100%
Beat 4 (850ms):   Subhead fades up, 500ms
Beat 5 (1000ms):  CTAs fade up + scale(0.96 → 1), 450ms
Beat 6 (1150ms):  Channel tiles scale in (0.7 → 1) staggered 80ms apart,
                  drifting to final positions
Beat 7 (1400ms):  Connecting lines draw via stroke-dashoffset, 900ms
Beat 8 (1600ms):  Studio Console rises from translateY(60px) + scale(0.94 → 1),
                  shadow expands beneath, 800ms
Beat 9 (2000ms):  Trust line + metrics strip fade in
```

### 7.5 Studio Console

```
FRAME
  Width:      min(1120px, 92vw)
  Radius:     var(--radius-xl) — 24px
  Background: var(--bg-surface)
  Border:     1px solid var(--border-default)
  Shadow:     var(--shadow-xl)
  Perspective: parent has perspective: 1800px
  Initial tilt: rotateX(6deg) — flattens to rotateX(0) as it scrolls to center

TITLE BAR
  Height: 40px
  Three window dots (12px): #FF5F57, #FEBC2E, #28C840
  Center: URL-style pill reading "app.messageyard.com/studio"
  Font: var(--font-mono), 11px, var(--text-tertiary)

TABS (below title bar)
  "Journey Builder" | "Campaign Composer" | "Team Inbox"
  Active tab: white text + 2px gradient underline
  Inactive: var(--text-tertiary)
  Switch animation: 150ms fade-out + translateY(6px), then
                    200ms fade-in from translateY(-6px), 50ms overlap
```

**Tab 1 — Journey Builder:** Flow nodes connected by bezier lines with animated dash-flow. Node 1 = `⚡ Cart Abandoned (30m)` + `ACTIVE` badge. Node 2 = `⌥ VIP Customer?` + `BRANCH` badge. Node 3 = `💬 WhatsApp 1-Click Buy` + `DISPATCH` badge + `34% lift` stat.

**Tab 2 — Campaign Composer:** Left = form fields with `{{first_name}}` merge tags and a blinking cursor. Right = phone mockup rendering a rich WhatsApp card, tilted `rotateY(-6deg)`.

**Tab 3 — Team Inbox:** Three columns — conversation queue (with pulsing signal dots), live chat thread with staggered bubble entrances, CRM panel showing `€2,450.00` lifetime spend and behavioral tags.

### 7.6 Metrics Strip

```
LAYOUT: 4-column grid, divided by 1px vertical hairlines
BACKGROUND: transparent (sits on the void)
PADDING: 40px 0

EACH METRIC
  Number:  clamp(32px, 3vw, 44px), weight 700, gradient text
  Label:   var(--font-mono), 11px, uppercase, var(--text-tertiary)

  3,200+   BRANDS ON MESSAGEYARD
  12B+     MESSAGES DELIVERED / YEAR
  34%      AVERAGE ENGAGEMENT LIFT
  190+     COUNTRIES REACHED

ANIMATION
  Count-up via requestAnimationFrame, 1800ms, eased deceleration
  Trigger: IntersectionObserver threshold 0.3
  On complete: subtle scale pulse (1.04 → 1.0, 300ms)
```

---

## 8. SECTION-BY-SECTION SPECIFICATION

### 8.1 Logo Marquee — Trust

```
Background: var(--bg-void)
Headline: "Trusted by 3,200+ brands worldwide" — 13px, var(--text-tertiary), centered
Marquee: infinite horizontal scroll, 40s loop, duplicated set for seamless wrap
Logos: white at 32% opacity, grayscale
Hover: pause marquee; hovered logo → 100% opacity
Edge mask: linear-gradient fade to transparent at left/right 15%
```

### 8.2 Two Products, One Platform

```
Background: var(--bg-base)
Headline: "Two products. One platform." — "One platform" gradient
Layout: 2 columns, gap 24px

LEFT CARD — Marketing Cloud
  Tile icon: cyan-dominant gradient
  Badge: "FOR MARKETERS" (cyan variant)
  H3: "No-code journey canvas, unified campaigns, dynamic segmentation."
  Image: Journey Builder screenshot, radius 14px, inset border
  Link: "Explore Marketing Cloud →"

RIGHT CARD — CPaaS Infrastructure
  Tile icon: violet-dominant gradient
  Badge: "FOR ENGINEERS" (violet variant)
  H3: "Programmable APIs, sub-second carrier delivery, AI agents."
  Image: Dark terminal showing a POST /v1/messages call with JSON payload
  Link: "Explore CPaaS →"

3D: left card rotateY(3deg), right card rotateY(-3deg) — both flatten on hover
CONNECTOR: animated gradient line bridging the two cards at center-bottom
ENTRANCE: left from translateX(-32px), right from translateX(32px), 600ms
```

### 8.3 Platform at a Glance — 6 Pillars

**This section directly mirrors the logo's 3×2 tile grid.**

```
Background: var(--bg-void)
Headline: "The platform, at a glance"
Layout: 3×2 grid, gap 12px (logo-derived tile spacing)

CARDS
  01 / Journey Builder        — Visual drag-and-drop workflow canvas
  02 / Campaign Manager       — Multichannel calendar & approval workflows
  03 / Audience Segmentation  — Dynamic behavioral segmenting, no SQL
  04 / Personalization Engine — 1:1 AI recommendations, send-time optimization
  05 / Analytics & Attribution— Multi-touch revenue attribution, cohort curves
  06 / Omnichannel CPaaS      — Native SMS, WhatsApp, Voice, Email delivery

EACH CARD
  Watermark number "01" — 64px, weight 700, rgba(255,255,255,0.03), top-right
  Tile icon: 48px, gradient background, white monoline icon
  H3 + 2-line description
  Bottom-pinned link: "Learn more →" (arrow slides 4px right on hover)

GRADIENT PROGRESSION (the standout detail)
  Each card's tile icon steps along the brand spectrum by position,
  exactly like the logo's tiles:
    Card 01 → #29BBF0 (cyan)
    Card 02 → #349DF3
    Card 03 → #3B82F6 (blue)
    Card 04 → #4C7AF6
    Card 05 → #6470F6
    Card 06 → #7C64F6 (violet)
  Reading the grid left-to-right, top-to-bottom reproduces the logo gradient.

3D: independent cursor-tracked perspective tilt, max ±3deg
ENTRANCE: staggered 80ms per card, translateY(24px) → 0
```

### 8.4 Why MessageYard

```
Background: var(--bg-base) + violet orb (right side, opacity 0.16)
Layout: 2 columns (5:7 ratio)

LEFT — The Argument
  H2: "Marketing platforms promise omnichannel. We own the channel."
      ("own the channel" = gradient)
  5 checklist items, each with a gradient check icon:
    ✓ Zero vendor markup on every message sent
    ✓ Same infrastructure handles transactional and marketing
    ✓ Sub-second delivery across 190+ countries
    ✓ 99.999% uptime SLA — contractual, not aspirational
    ✓ SOC 2 Type II and HIPAA-eligible out of the box

  Entrance: items appear one by one, 120ms stagger
  Check icon: spring scale-in (0 → 1.15 → 1.0)

RIGHT — Telemetry Dashboard
  Large dark dashboard screenshot in a bubble-frame container
  3D: rotateY(-7deg), flattens to rotateY(-3deg) on scroll to center
  Live elements inside:
    - Throughput bars fill upward on viewport entry (staggered 60ms)
    - "99.999%" counts up from 99.000%
    - Latency ticker cycles "12ms → 11ms → 13ms → 12ms" every 2s
    - A gradient sparkline draws left-to-right via stroke-dashoffset
```

### 8.5 Industry Solutions — LIGHT SECTION

The first inversion. Coming up from the dark infrastructure into daylight.

```
Background: var(--bg-base-light) #F7F9FC
Transition: 80px gradient band from --bg-base to --bg-base-light above

Headline: "Built for your industry." — var(--text-primary-light)
Layout: 4 cards in a row

CARDS (photographic)
  [1] Retail & eCommerce   — "Cart recovery & WhatsApp VIP shopping"
  [2] Financial Services   — "TCPA-compliant alerts & 2FA delivery"
  [3] Healthcare           — "HIPAA-eligible appointment journeys"
  [4] Travel & Hospitality — "Real-time itinerary pushes"

TREATMENT
  Aspect ratio: 4/5
  Radius: var(--radius-lg)
  Photo: object-fit cover, saturate(0.9)
  Overlay: linear-gradient(transparent 45%, rgba(7,11,23,0.85))
  Badge: category chip, top-left, glass background
  Text: white, bottom-aligned

HOVER
  Photo layer parallax-shifts opposite to cursor tilt (depth-of-field window)
  Text stays fixed
  Card lifts translateY(-4px)
  A gradient hairline appears along the bottom edge
```

### 8.6 Customer Proof

```
Background: var(--bg-base-light) — continues light
Headline: "Trusted by teams that ship."

LAYOUT: 3 testimonial cards, using the BUBBLE-FRAME component
  (This is where the logo's speech bubble shape earns its keep.)

CARDS
  [1] Priya Desai — VP Growth Marketing, Northbeam
  [2] Marcus Ellery — Head of Marketing Ops, Lumen Retail
  [3] Ana Beltrán — CMO, Finwave

EACH CARD
  Bubble frame with tail at bottom-left
  Background: #FFFFFF
  Border: 1.5px solid rgba(0,0,0,0.08)
  Quote: 16px, var(--text-primary-light), line-height 1.6
  Bottom: 44px circular avatar + name (600 weight) + title (13px, tertiary)
  Avatar has a 2px gradient ring

HOVER: perspective tilt max ±2deg, avatar translateZ(6px) forward pop

TRUST BADGE ROW (below)
  SOC 2 Type II | GDPR Ready | HIPAA-Eligible | ISO 27001 | TCPA | TLS 1.3
  Monoline outlined badges, var(--text-tertiary-light)
  Gentle float bob, staggered
```

### 8.7 Pricing — LIGHT SECTION

```
Background: var(--bg-base-light)
Headline: "Simple, transparent pricing." — "transparent" gradient
Layout: 3 tier cards, equal height, gap 20px

  STARTER
    Price: "Pay as you go"
    5,000 contacts · core channels · 1 AI agent · community support
    CTA: secondary button

  GROWTH  ← FEATURED
    Badge: "MOST POPULAR" (gradient chip, top-center, overlapping card edge)
    Price: "$499" + "/mo" (price counts up on scroll entry)
    100K contacts · all channels · 10 AI agents · priority support
    CTA: primary gradient button
    Card: gradient border (mask technique), var(--glow-brand),
          translateY(-12px) — physically elevated above siblings

  ENTERPRISE
    Price: "Custom"
    Unlimited contacts · dedicated carrier routes · custom SLA · SSO/SAML
    CTA: secondary button

COMPARISON TABLE (below, collapsible)
  Row hover: background → var(--blue-a08)
  Checkmarks: gradient-filled, animate in row-by-row (40ms stagger)
  Sticky header row on scroll
```

### 8.8 Contact & Leadership — RETURN TO DARK

```
Background: var(--bg-void) + transition band above
"Returning to the yard at night."

PART A — Leadership (4-column grid)
  Aarav Nair (CEO) · Elena Whitfield (CTO) · Jordan Tanaka (VP AI) · Priya Menon (VP Product)
  Photos: grayscale → full color on hover
  Hover: card tilts, photo gains a gradient ring, LinkedIn icon fades in

PART B — Contact (2 columns)
  LEFT: Three route cards
    sales@messageyard.com     — "Talk to our team about enterprise plans"
    support@messageyard.com   — "Technical help, 24/7 response"
    partners@messageyard.com  — "Integration and reseller partnerships"
    Each: tile icon + email + description; hover reveals gradient left border

  RIGHT: Contact form
    Fields: Name · Work email · Company · Message
    Style: var(--bg-surface) inputs, var(--border-default) borders
    Focus: border becomes gradient (mask technique) + soft glow
    Floating labels lift on focus
    Submit: primary gradient button, full width
```

### 8.9 Footer

```
Background: var(--bg-void), with a 1px gradient hairline as the top border
Blue orb, bottom-center, opacity 0.10

LAYOUT: 5 columns
  Col 1: Logo (full lockup) + tagline + social icons
  Col 2: Product      Col 3: Solutions
  Col 4: Company      Col 5: Legal

BOTTOM BAR
  Left:  © 2026 MessageYard. All rights reserved.
  Right: Privacy · Terms · Status ● (green pulse dot)

EASTER EGG
  Beneath the copyright, in var(--font-mono), 11px, var(--text-disabled):
  "MESSAGES DISPATCHED SINCE YOU ARRIVED: 4,231"
  Counts up at ~70/second. The yard never closes.

LINK HOVER: color → white + translateX(3px)

BACK-TO-TOP: floating gradient circle (↑), 48px, appears past hero,
             gentle float bob, smooth-scroll on click
```

---

## 9. ANIMATION SYSTEM

### 9.1 Easing Tokens

```css
--ease-out:    cubic-bezier(0.22, 1, 0.36, 1);      /* Entrances (default) */
--ease-in:     cubic-bezier(0.55, 0, 1, 0.45);      /* Exits */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);   /* Overshoot */
--ease-smooth: cubic-bezier(0.45, 0, 0.55, 1);      /* Symmetric, loops */

--dur-micro:  150ms;
--dur-fast:   250ms;
--dur-normal: 350ms;
--dur-reveal: 600ms;
--dur-hero:   800ms;
```

### 9.2 Scroll Reveals

```
Observer: single IntersectionObserver instance
Threshold: 0.15
rootMargin: "0px 0px -60px 0px"
Re-trigger: yes, debounced — element must be out of view 500ms+ first

VARIANTS
  fade-up      translateY(28px) → 0, opacity 0 → 1              [default]
  fade-lateral translateX(±32px) → 0                            [2-col splits]
  stagger      transition-delay: calc(var(--i) * 80ms)          [grids]
  scale-in     scale(0.94) → 1                                  [console, images]
  clip-wipe    clip-path: inset(0 100% 0 0) → inset(0 0 0 0)    [headlines]
  draw         stroke-dashoffset: len → 0                       [lines, sparklines]
```

### 9.3 Signature Animations

**Gradient Shimmer (headlines).** On reveal, the gradient word's `background-position` animates `0% → 100%` over 1200ms, making light sweep across the text once.

```css
.gradient-word {
  background-size: 200% 100%;
  animation: shimmer 1200ms var(--ease-out) forwards;
}
@keyframes shimmer {
  from { background-position: 0% 50%; }
  to   { background-position: 100% 50%; }
}
```

**Route Pulse (connecting lines).** A short bright segment travels along each SVG connector path every 3s, suggesting a message in transit.

```css
.route-line {
  stroke-dasharray: 8 400;
  animation: routePulse 3s linear infinite;
}
@keyframes routePulse {
  from { stroke-dashoffset: 408; }
  to   { stroke-dashoffset: 0; }
}
```

**Tile Cascade (logo + feature grid).** Tiles appear in the logo's reading order (top-left → bottom-right), 60ms apart, each scaling `0.6 → 1.08 → 1.0` with `--ease-spring`. This is the site's signature entrance and is reused for the 6-pillar grid.

**Card Lift.** `translateY(-4px)` + shadow deepen + top gradient hairline fades in, 350ms.

**Button Dispatch.** Hover: `translateY(-2px)` + glow. Active: `scale(0.98)`. On click, a 1px gradient line briefly draws outward from the button's right edge and fades over 400ms — the message leaving the yard.

**Counter.** `requestAnimationFrame`, 1800ms, eased deceleration, `Intl.NumberFormat` for separators, scale pulse on completion.

### 9.4 3D Perspective Tilt

```javascript
// Parent: perspective: 1200px
// Card: transform-style: preserve-3d

function handleTilt(card, e) {
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width  - 0.5;
  const y = (e.clientY - r.top)  / r.height - 0.5;
  card.style.transform = `rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
}

function resetTilt(card) {
  card.style.transition = 'transform 500ms var(--ease-out)';
  card.style.transform = 'rotateX(0) rotateY(0) translateY(0)';
}
```

Max rotation ±3°. A radial highlight gradient tracks the cursor position across the card surface at 6% opacity, simulating light reflection.

### 9.5 Parallax Depth Planes

```
PLANE -1  scroll × 0.3   Glow orbs, dot grid
PLANE  0  scroll × 1.0   All content
PLANE +1  scroll × 1.08  Nav pill, floating channel tiles, status badges
```

Implement via GSAP ScrollTrigger with `scrub: 0.6` for smoothing, or CSS `translateZ` within a perspective container.

---

## 10. RESPONSIVE BEHAVIOR

| Breakpoint | Behavior |
|---|---|
| **≥1200px** | Full 3D tilt, all parallax, 6 floating tiles, 3×2 and 4-col grids |
| **768–1199px** | Tilt reduced to ±2°, parallax off, 2 floating tiles only, 2-col grids, console shows one tab |
| **<768px** | **All 3D disabled.** Fade-up reveals only. Durations −30%. Single column. Nav → hamburger. Hero = text + one centered product screenshot. Orbs reduced to one, opacity 0.12. Glow effects simplified to flat shadows. |

---

## 11. PERFORMANCE BUDGET

**Target: Lighthouse Performance ≥ 90**

```
✓ Animate only transform, opacity, filter (GPU composited)
✓ One IntersectionObserver instance for all reveals
✓ will-change: transform only while element is in/near viewport; removed after
✓ Blurred orbs are CSS filter on static divs — never re-rendered per frame
✓ font-display: swap; preload Plus Jakarta Sans 600/700
✓ All images WebP/AVIF, loading="lazy", decoding="async"
✓ Hero critical images preloaded; total hero payload < 400KB
✓ Lenis for smooth scroll (better control than scroll-behavior)
✓ Backdrop-filter used sparingly — max 3 elements simultaneously

✗ Never animate width, height, margin, padding, top, left, box-shadow directly
✗ Never stack more than 4 blurred orbs in one viewport
✗ No WebGL/Three.js in the critical path — defer past LCP if used at all
```

---

## 12. ACCESSIBILITY

```
✓ prefers-reduced-motion: reduce → disable all transforms, parallax, counters,
  shimmer, pulse, float. Render final states immediately.
✓ Focus-visible: 2px solid var(--blue), 2px offset, on every interactive element
✓ Contrast (dark theme):
    #FFFFFF on #070B17      = 18.9:1  ✓ AAA
    #9BA5BC on #070B17      =  8.1:1  ✓ AAA
    #5F6B85 on #070B17      =  3.6:1  ✓ AA (large text / captions only)
✓ Gradient text: always verify the darkest stop (#29BBF0 on dark = 7.2:1 ✓)
✓ Console tabs: role="tablist", aria-selected, ←/→ keyboard navigation
✓ Marquees pause on :hover and :focus-within
✓ All decorative orbs and grid: aria-hidden="true"
✓ Skip-to-content link as first focusable element
✓ Status dots always paired with text labels — never color alone
```

---

## 13. ANTI-PATTERNS

```
❌ Gradients at any angle other than 135°
❌ Reversing the gradient (violet → cyan)
❌ More than one gradient word per heading
❌ Introducing a color outside the spectrum + semantic set
   (no green CTAs, no orange accents, no pink)
❌ Large flat gradient background fills — use blurred orbs instead
❌ Heavy borders — hairlines only (0.06–0.16 white alpha)
❌ Placeholder copy — every metric, quote, and payload must be real
❌ Generic SaaS illustrations, blob people, isometric offices
❌ 3D transforms on mobile
❌ Scroll-jacking or mandatory scroll-snap
❌ Neon/cyberpunk styling — this is precise and premium, not Blade Runner
❌ Pure black (#000000) backgrounds — always #070B17, which has blue depth
❌ Animation without communicative purpose
```

---

## 14. COMPLETE TOKEN EXPORT

```css
:root {
  /* ── Brand Gradient ────────────────────────────── */
  --gradient-brand: linear-gradient(135deg, #29BBF0 0%, #3B82F6 50%, #7C64F6 100%);

  /* ── Spectrum ──────────────────────────────────── */
  --cyan: #29BBF0;        --cyan-dim: #1E96C4;
  --blue: #3B82F6;        --blue-dim: #2E6BD4;
  --violet: #7C64F6;      --violet-dim: #6450D0;

  --cyan-a08: rgba(41,187,240,0.08);
  --cyan-a16: rgba(41,187,240,0.16);
  --blue-a08: rgba(59,130,246,0.08);
  --blue-a16: rgba(59,130,246,0.16);
  --blue-a24: rgba(59,130,246,0.24);
  --violet-a08: rgba(124,100,246,0.08);
  --violet-a16: rgba(124,100,246,0.16);

  /* ── Dark Surfaces ─────────────────────────────── */
  --bg-void: #070B17;
  --bg-base: #0A0F1E;
  --bg-surface: #101728;
  --bg-elevated: #162034;
  --bg-overlay: rgba(16,23,40,0.72);

  /* ── Light Surfaces ────────────────────────────── */
  --bg-void-light: #FFFFFF;
  --bg-base-light: #F7F9FC;
  --bg-surface-light: #FFFFFF;

  /* ── Borders ───────────────────────────────────── */
  --border-subtle: rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.10);
  --border-strong: rgba(255,255,255,0.16);
  --border-brand: rgba(59,130,246,0.32);
  --border-subtle-light: rgba(0,0,0,0.06);

  /* ── Text ──────────────────────────────────────── */
  --text-primary: #FFFFFF;
  --text-secondary: #9BA5BC;
  --text-tertiary: #5F6B85;
  --text-disabled: #3A4459;
  --text-primary-light: #070B17;
  --text-secondary-light: #4A5568;
  --text-tertiary-light: #8B96AB;

  /* ── Semantic ──────────────────────────────────── */
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --whatsapp: #25D366;

  /* ── Glows & Shadows ───────────────────────────── */
  --glow-cyan: 0 0 40px rgba(41,187,240,0.18);
  --glow-blue: 0 0 40px rgba(59,130,246,0.20);
  --glow-violet: 0 0 40px rgba(124,100,246,0.18);
  --glow-brand: 0 0 32px rgba(59,130,246,0.24), 0 0 64px rgba(124,100,246,0.12);
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.32);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.40);
  --shadow-lg: 0 20px 56px rgba(0,0,0,0.48);
  --shadow-xl: 0 32px 80px rgba(0,0,0,0.56);

  /* ── Typography ────────────────────────────────── */
  --font-display: "Plus Jakarta Sans", "Inter", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* ── Radii ─────────────────────────────────────── */
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  /* ── Spacing ───────────────────────────────────── */
  --space-1: 4px;    --space-2: 8px;    --space-3: 12px;
  --space-4: 16px;   --space-5: 24px;   --space-6: 32px;
  --space-8: 48px;   --space-10: 64px;  --space-12: 96px;
  --space-16: 128px;

  --container-max: 1200px;
  --container-wide: 1360px;

  /* ── Motion ────────────────────────────────────── */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in: cubic-bezier(0.55, 0, 1, 0.45);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.45, 0, 0.55, 1);

  --dur-micro: 150ms;
  --dur-fast: 250ms;
  --dur-normal: 350ms;
  --dur-reveal: 600ms;
  --dur-hero: 800ms;
}
```

---

## 15. IMPLEMENTATION CHECKLIST

| # | Item | Section |
|---|---|---|
| 1 | Dot-grid background with radial edge mask | Global |
| 2 | Glow orb system (cyan/blue/violet, blur 120px) | Global |
| 3 | Floating glass nav pill with smart hide/show | Global |
| 4 | Gradient-word heading utility (`background-clip: text`) | Global |
| 5 | Tile component (gradient / outline / glow variants) | Global |
| 6 | Bubble-frame component with tail | Testimonials |
| 7 | Card with hover gradient top-hairline | Global |
| 8 | Gradient-border card via mask technique | Featured/Pricing |
| 9 | 6 floating channel tiles with parallax + route lines | Hero |
| 10 | 9-beat hero entrance choreography | Hero |
| 11 | Studio Console with 3 tabs + scroll flatten | Hero |
| 12 | Count-up metrics with gradient numbers | Hero, Pricing |
| 13 | Logo marquee with edge fade + hover pause | Trust |
| 14 | 6-pillar grid with stepped gradient tiles | Platform |
| 15 | Dark→light transition bands | Solutions, Contact |
| 16 | Photo-parallax industry cards | Solutions |
| 17 | Cursor-tracked 3D perspective tilt | All cards |
| 18 | Route-pulse SVG line animation | Hero, Journey Builder |
| 19 | Gradient shimmer on heading reveal | All headings |
| 20 | Live dispatch counter | Footer |
| 21 | `prefers-reduced-motion` global override | Global |
