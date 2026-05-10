# Vektor Core — Design System

## Identity
This is a hospital management platform with an integrated emergency 
crisis response system (Rapid Crisis Response / RCR). The product 
serves two audiences: hospital staff (clinical, admin, billing) and 
the RCR emergency response system (real-time crisis coordination).

## Tech Stack
- Next.js 16 App Router
- Tailwind CSS v4
- TypeScript
- Lucide React icons
- Plus Jakarta Sans (body font) via --font-jakarta
- Fraunces (heading font, serif) via --font-fraunces

## CSS Variables (use these, never hardcode hex values)
--background: #f3f5f2      warm off-white page background
--foreground: #111a17      primary text
--surface: #fbfcfa         card/panel background
--surface-strong: #e7ece7  table headers, hover states
--line: #d2dcd4            borders, dividers
--brand: #0e5f4f           primary brand teal — CTAs, active states
--brand-strong: #094336    hover state for brand
--brand-soft: #cfe8df      brand background tints, chips
--danger: #a4252c          errors, emergencies, critical alerts
--warning: #b26f15         warnings, amber alerts
--success: #146c43         success states

## Utility Classes (already defined — use these)
.panel              rounded-2xl border border-line bg-surface
.chip               small pill badge, inline-flex rounded-full
.soft-grid          subtle dot/line grid background pattern

## Typography Rules
- h1, h2, h3, h4 use Fraunces serif — elegant, medical authority
- Body text uses Plus Jakarta Sans — clean, readable
- Never use bold for decorative purposes
- Bold is ONLY for critical values (allergy names, alert numbers)
- Headings should be large and unhurried — not compressed

## Spacing and Layout
- Generous padding inside sections — 24px minimum
- Cards use rounded-2xl corners
- Sections separated by space-y-5 or space-y-8
- Max content width: 1400px centered
- Desktop first — mobile is secondary for staff views

## Color Usage Rules
- Brand teal: navigation active states, primary CTAs, accent labels
- Danger red: ONLY for real emergencies, allergies, critical alerts
- Warning amber: caution states, abnormal values, flags
- Success green: confirmation only — never decorative
- No gradients except subtle brand-soft blur blobs for hero sections
- No dark backgrounds — this is a light theme product

## Component Patterns

### Panel / Card
<article className="panel p-5">
  content
</article>

### Chip / Badge
<span className="chip bg-brand-soft text-brand">Label</span>
<span className="chip border-danger/30 bg-danger/10 text-danger">Critical</span>

### Primary Button
<button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">
  Action
</button>

### Secondary Button
<button className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium">
  Action
</button>

### Alert Strip
<p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-danger text-sm">
  Emergency message
</p>

### Section Header Pattern
<section className="panel p-6">
  <p className="chip bg-brand-soft text-brand">Module Label</p>
  <h1 className="mt-4 text-3xl">Page Title</h1>
  <p className="mt-2 text-sm text-foreground/70">Subtitle</p>
</section>

## Design Personality
Clinical but not cold. Modern but not startup-flashy. 
The product serves doctors, nurses, and emergency responders — 
people making high-stakes decisions. The UI should feel:
- Trustworthy and precise
- Calm under pressure
- Information-dense without feeling cluttered
- The emergency sections should feel urgent but not panicked

## Two Modes of the Product
1. HMS Mode (hospital staff): calm, structured, data-forward
2. RCR Mode (crisis response): same design language but with 
   danger/warning accents, live countdowns, real-time updates
   
The landing page must communicate BOTH of these clearly.