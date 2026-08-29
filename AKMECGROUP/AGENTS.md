# AGENTS.md — AKMEC LLP Website Redesign

> **Role:** You are a senior product designer + front-end engineer.
> **Mission:** Design & build a complete, production-grade marketing website for **AKMEC LLP** that replaces the existing WordPress site at `akmecgroup.com`.
> **Non-negotiable:** The site must be a *curated showcase* of 9 modern UI design languages — Skeuomorphism, Neumorphism, Glassmorphism, Claymorphism, Minimalism, Maximalism, Brutalism, Liquid Glass, Bento Grid, Spatial UI — each applied **where it makes functional sense**, not randomly. See §6 for the authoritative style-to-section map.
> **Images:** Use ONLY the files in `akmec-assets/` (extracted from the company profile PDF + the existing website). No AI-generated images, no stock photos, no placeholder services. See §2.5 — this is a hard constraint.
> **Read this whole file before writing a single line of code.**

---

## 1. Company Snapshot (source of truth)

| Field | Value |
|---|---|
| Legal name | **AKMEC LLP** (brand: AKMEC / AKMEC GROUP) |
| Tagline (existing) | *Committed to Value, Committed to Excellence* |
| Positioning line (new, from profile) | *Empowering Industries with Quality & Trust* |
| One-liner | AKMEC delivers complete industrial solutions — Inspection, Audit, Testing, Asset Integrity, Technical Solutions, Manpower Outsourcing & Training. |
| Certification | ISO 9001:2015 certified |
| Founded / operating | Since 2021 · **5+ years empowering industries** |
| Reach | India (Vadodara, Mumbai, Nashik) + Saudi Arabia (Jubail) · "Worldwide reach, trusted everywhere" |
| Primary email | inquiry@akmecgroup.com |
| Primary phones | +91 9226112227 · +91 9920702095 |
| Website | www.akmecgroup.com |
| Copyright | © 2026 AKMEC LLP. All rights reserved. |

### Mission
> AKMEC is committed to delivering end-to-end industrial services — ensuring safety, compliance and client satisfaction in every project.

### Vision
> AKMEC strives to build a safer, smarter and more sustainable industrial future — driving excellence through innovation, integrity and trusted partnerships.

### Key stats (use as animated counters)
- **50+** competent inspectors ready for mobilization
- **5+** years empowering industries
- **100+** successful projects
- **Global** service footprint
- **Wide range** of services

### Brand qualities (from existing site — keep)
Compliance · Transparency · Availability · Quality · Competence · Reliability

---

## 2. Complete Content Inventory (DO NOT invent, DO NOT drop)

Everything below exists in the company profile PDF and/or the current website. All of it must appear somewhere on the new site.

### 2.1 Service Pillars (6 top-level)
1. **Inspection & Audit**
2. **Examination & Testing (NDT)** — Conventional NDT, Advanced NDT, Advanced Techniques & Others
3. **Asset Integrity, Engineering & Technical Solutions**
4. **Manpower Supply & Outsourcing**
5. **Training & Certification**
6. **Heat Treatment Services** *(also listed under Advanced Techniques — cross-link it)*

> Legacy site also markets: Construction, Operation & Maintenance, Facility Management, Industrial Services, Human Resources, Consulting Services, Engineering Consultant. Fold these into pillar 4 & 3 as sub-capabilities — do not lose the keywords (SEO value).

#### 2.1.1 Inspection & Audit — full list
Second Party Inspection · Third Party Inspection · Expediting · Audit · Vendor / Source Inspection · Quantity Survey · Pre-Shipment Inspection · Quality Assurance & Control · Lab Test Witness & Inspection · NDT Inspector (ASNT, PCN, ISO) · EPC & Turnkey Project Inspection · Shutdown / Turnaround Inspection · In-Service Inspection · Fuel Tanker & Truck Inspection · ISO Inspector & Auditor · RTFI

**Certified & approved categories:**
- Client approvals: **ARAMCO (PID, VID, QM approved)**, **SABIC**, **ADNOC**, **ORPIC**, **FLUOR**, **Chevron**, etc.
- **API certified:** API 510 / 570 / 653 / 580 / 571 / 936 / 982 / 1169 / 1104, Q1 & Q2
- **Painting/Coating:** NACE, BGAS, AMPP, FROSIO
- **Welding Inspector:** CSWIP, AWS, CWI
- **ISO:** 9001, 9712, 22000

**Inspection disciplines:** Electrical & Instrumentation · CompEx · E&I Inspector · Scaffolding · Material · HVAC · Bridge & Tunnel · Static · Piping · Pipe · Structure · Pipeline · Tank · Rotary · Cargo · Container · Lifting Equipment · and many others

#### 2.1.2 Examination & Testing
**Conventional NDT:** Penetrant Testing (PT) · Magnetic Particle Testing (MPT) · UT Flaw Detection · UT Thickness Gauging · Holiday Test · Ferritic Test · Hardness Test · Leak Testing

**Advanced NDT:** Eddy Current Testing (ECT) · Magnetic Flux Leakage (MFL) · Near Field Testing (NFT) · Internal Rotary Inspection System (IRIS) · Remote Field Testing (RFT) · Phased Array Ultrasonic Testing (PAUT) · Time of Flight Diffraction (TOFD)

**Advanced Techniques & Others:** Eddy Current Array (ECA) · Borescope Inspection · Corrosion Mapping · Infrared Thermography · Positive Material Identification (PMI) · Vacuum Box Test · Heat Treatment Services

> Heat Treatment detail (from legacy site): pre-heating, post-heating, stress relieving (SR), intermediate SR, dehydrogenation, drying of refractory material.

#### 2.1.3 Asset Integrity, Engineering & Technical Solutions
Corrosion Control Document (CCD) · Risk Based Inspection (RBI) · Asset Integrity Management · Develop Inspection Scope & Technique · Residual / Remaining Life Assessment · Fitness For Service (API 579 / ASME) · Corrosion Loop & Corrosion Circuit · Assessment of UG / Cross-country Pipeline · Asset Life Extension Study · Isometric, P&ID and PFD Drafting · CML Identification & Optimization · Study of Online Corrosion Probes & Coupons · Process Environment Severity Analysis (PESA) · Inspection Data Management & Automation · Industrial Failure Analysis with Effective Remedies · Assessment of Small-bore Piping / Critical Equipment · Design Consultation

#### 2.1.4 Manpower Supply & Outsourcing
Delivering skilled manpower across all sectors listed in "Industries We Serve" and more:
Engineering Services · EPC & Turnkey Projects · Shutdown & Turnaround · Operation & Maintenance · Project Management · Testing & Commissioning · Vigilance & Surveillance · Construction & Manufacturing · Technical Staffing

#### 2.1.5 Training & Certification
NDT Levels (RT, PT, UT, MT) · QC Engineer Training · Shutdown / Turnaround for QC · Inspection & QC Engineer · API 510 · API 570 · API 653 · API 580 · API 571 · API 936

#### 2.1.6 Vendor Inspection (keep from legacy site)
QA/QC · Material Inspection · Factory Acceptance Test (FAT) · Capability Assessment · Pre-Shipment Inspection

### 2.2 Industries We Serve (33 — all must render)
Oil & Gas · Refinery · Petrochemical · Chemical · Fertilizer · Nuclear · Marine · Mining · Sugar Industries · Port / Shipping · Cement · Power Generation · Metal Fabrication · Forging & Casting · Manufacturing · Pipeline · Tanks · EPC & Turnkey · Electronics & Electricals · Construction · Solar · Wind · Building & Infrastructure · Food & Beverages · Railways & Metro · Aerospace & Defense · Pharmaceutical / Medical · Automobile · Textile · Transportation · General Industries · Pulp & Paper · Renewable Energy

### 2.3 Offices (Contact)
| Office | Address |
|---|---|
| **Registered Office** | AKMEC Workshop, Gate No. 1, Plot No. 45, Survey No. 104/2/A, Malegaon, Nashik, Maharashtra – 423203, INDIA |
| **Operational Office — Vadodara** | 309 Siddharth Magnum Plus, Dhanteshwar Ring Road, Vadodara – 390004, Gujarat, INDIA |
| **Mumbai** | Gala 180B, Kurla Scrap Merchant Ass., Mankhurd Mandala, G M Link Road, Mumbai – 400043, INDIA |
| **Overseas — Saudi Arabia (Jubail)** | Masar NDTS Operation & Maintenance, Building No. 4258, Al Safat Dist., Al-Jubail City Centre – 35514, Kingdom of Saudi Arabia · sales@masarNDT.com |

### 2.4 Clients & End Users
The profile's client-logo wall (page 9) has been extracted — **34 real logo files** are in `akmec-assets/clients/`. Build a **bento logo wall + marquee** fed by `data/clients.ts`, using those files only.

Identified: Bureau Veritas · TÜV SÜD · Applus Velosi · SGS · BEUMER Group · K2M Consultant & Services · Rotostat · SEZ · ICS · MILTEC Engineering · DECPL · RESC · Vasant Group · Thermax · VCS (Energising Quality) · Fulkrum · Alfred H Knight · DNV · EIL · ONGC MRPL · Bharat Petroleum · HRRL · Indian Oil · ADNOC · Dangote · Larsen & Toubro · LRQA · KTI · Apave.
Five files are named `logo-unknown-01…05.png` — render them, but add `{/* TODO: confirm company name with AKMEC */}` and give them a neutral alt like "Client logo".

Never fabricate client names beyond these. ARAMCO, SABIC, ADNOC, ORPIC, FLUOR and Chevron are stated as **approvals** — label that block **"Approved / Registered With"**, not "Our Clients", to stay legally accurate.

---

---

## 2.5 🚫 IMAGE POLICY — HARD RULE (read twice)

> **Use ONLY the images supplied in the `akmec-assets/` folder.**
> These 88 files were extracted directly from the AKMEC company profile PDF and downloaded from the existing akmecgroup.com website. They are the *complete and only* permitted image library.

**Forbidden — no exceptions:**
- ❌ AI-generated images of any kind
- ❌ Stock photography (Unsplash, Pexels, Pixabay, Shutterstock, etc.)
- ❌ Hotlinking any external image URL or CDN
- ❌ Placeholder services (`placehold.co`, `picsum.photos`, `via.placeholder.com`, `dummyimage`)
- ❌ Random/illustrative photos "to fill space"
- ❌ Inventing client logos not present in `akmec-assets/clients/`


### 2.5.1 Asset inventory — `akmec-assets/`

```
brand/
  akmec-logo.png              1152×337   primary logo (from PDF, clean)
  akmec-logo-web.png          7248×2368  hi-res logo from live site
  world-map.png               1803×738   grey dotted world map (profile p10) → global presence

hero/
  offshore-platform-aerial.jpg     2666×1498  ★ best hero image — night aerial of offshore rig
  refinery-tanks-dusk.jpg          1000×561   refinery + storage tanks at dusk
  slider-pre-shipment-inspection.webp 1921×1130
  slider-offshore.webp             1537×1080
  slider-oil-and-gas.webp           900×550
  slider-plant-inspection.webp      720×480
  about-industrial-pvf.webp         900×550   industrial pipes/valves/fittings

services/
  insp-workshop-qc-tablet.png       421×281  QC engineer with tablet, machined parts
  insp-pressure-vessel-fabrication.jpg 241×180
  insp-offshore-lifting.jpg         421×281  inspector in orange PPE, offshore crane
  insp-container-preshipment.jpg    415×284  container inspection
  insp-audit-illustration.jpg       407×299  flat teal AUDIT illustration
  insp-vernier-measurement.jpg      392×345  vernier caliper measurement
  construction-web.jpg             2560×1707
  operation-maintenance-web.webp    800×534
  industrial-services-web.jpg      1431×954
  consulting-services-web.jpeg     2131×1440

ndt/
  pt-penetrant-flange.jpg           377×283  dye penetrant on flange
  mt-magnetic-particle-pipe.jpg     319×239  MPI on pipe weld
  ut-thickness-probe.jpg            392×274  UT thickness gauge in hand
  ut-flaw-detection-pipe.jpg        402×302  UT flaw detection on pipe
  hardness-leak-test-plate.jpg      392×261
  field-ndt-crew-site.jpg           476×298  site crew doing field NDT
  eddy-current-pmi-spool.jpg        372×278
  borescope-inspection.jpg          386×295  borescope with live screen
  infrared-thermography-panel.jpg   808×264  IR thermography on electrical panel
  heat-treatment-vacuum-box.jpg     579×303
  conventional-ndt-web.webp         950×634
  advanced-ndt-web.webp            1000×668
  heat-treatment-web.webp           600×450
  ndt-inspection-services-web.jpg   500×309

asset-integrity/
  asset-integrity-oil-gas-banner.jpg 591×444  "ASSET INTEGRITY in Oil & Gas" banner
  pipework-valves-mono.jpg          500×333  monochrome pipework + valves ★
  engineering-drawings-desk.jpg     414×395  engineers over drawings, hard hat
  engineering-consultant-web.jpg    600×450

manpower/
  workforce-group.jpg               600×600  large diverse workforce, white bg
  training-classroom.jpg            762×508  training/whiteboard session
  human-resources-web.jpg           600×450
  human-resources-web-2.jpeg       2174×1440

clients/   34 logo files — see §2.4
icons/     stat-years · stat-projects · stat-inspectors · stat-global-service ·
           stat-wide-range (line icons from profile p3)
           icon-phone · icon-email · icon-web · icon-location (orange square icons, p10)
           icon-phone-web.webp · icon-mail-web.webp
```

### 2.5.2 Recommended placement

| Section | Asset |
|---|---|
| Home hero (spatial layers) | `hero/offshore-platform-aerial.jpg` far layer, heavily darkened + blurred; inline-SVG pipeline wireframe as mid layer |
| Hero alt / secondary banner | `hero/refinery-tanks-dusk.jpg` |
| Trust bar background | none — solid glass strip |
| Services bento tiles (6) | Inspection → `services/insp-offshore-lifting.jpg` · NDT → `ndt/ut-thickness-probe.jpg` · Asset Integrity → `asset-integrity/pipework-valves-mono.jpg` · Manpower → `manpower/workforce-group.jpg` · Training → `manpower/training-classroom.jpg` · Heat Treatment → `ndt/heat-treatment-web.webp` |
| KPI skeuomorphic panel | `icons/stat-*.png` on the metal plate; metal texture itself is CSS/SVG |
| About — Who We Are (minimal) | one image only: `hero/about-industrial-pvf.webp`, full-bleed duotone |
| Mission & Vision (clay) | no photos — inline SVG blob icons |
| Six Qualities (neumorphic) | no photos — inline SVG icons |
| Industries maximalist | duotone-recolour a rotating subset of `hero/*` + `services/*` + `ndt/*`; the other industries get typographic colour-block tiles. Never source new photos for the 33. |
| Certifications (brutalist) | no photos — type only, mono codes in hard-bordered boxes |
| Clients wall | `clients/*` |
| NDT method explorer | `ndt/*` per method (mapping above) + inline-SVG exploded weld diagram |
| Asset Integrity page | `asset-integrity/*` |
| Contact / global presence | `brand/world-map.png` styled dark, office pins as SVG |
| Footer / header | `brand/akmec-logo.png` |

### 2.5.3 Handling constraints
- Many PDF-sourced photos are **small (240–800px wide)**. Use them in constrained slots (bento tiles, cards, thumbnails) — never as a full-bleed 1920px hero. Only `offshore-platform-aerial.jpg`, `construction-web.jpg`, `human-resources-web-2.jpeg`, `consulting-services-web.jpeg` and `slider-pre-shipment-inspection.webp` are large enough for full-width use.
- Convert everything to `.webp`/`.avif` at build time and serve via `next/image` with explicit width/height. Keep originals in `public/media/`.
- Photos vary in colour temperature. Unify them with a shared treatment: slight desaturation + a steel-teal/orange duotone or a `mix-blend-mode: luminosity` layer over `--steel-900`. This is what will make a mismatched stock-ish library look like one coherent brand.
- Client logos are raster with mixed backgrounds. Render them in a fixed-height flex slot with `object-fit: contain`, default `filter: grayscale(1) opacity(.7)`, hover → full colour. Put logos on a **white/light tile** — several have white-on-transparent marks that vanish on dark.
- Every image needs a descriptive, non-decorative `alt` (e.g. "Inspector performing ultrasonic thickness gauging on a carbon-steel pipe").

---

## 3. Site Map

```
/                     Home
/about                Who We Are · Mission · Vision · Qualities · Timeline · Stats
/services             Overview — 6 pillars (bento hub)
  /services/inspection-and-audit
  /services/ndt-testing            (tabs: Conventional / Advanced / Advanced Techniques)
  /services/asset-integrity
  /services/manpower-outsourcing
  /services/training-certification
  /services/heat-treatment
/industries           33 industries, filterable
/certifications       API / ISO / NACE / CSWIP / client approvals
/clients              Clients & end users, approvals
/contact              4 offices, map, enquiry form
/quote                Request-a-Quote multi-step form (optional but recommended)
/privacy  /terms      Legal
```

Global: sticky header, mega-menu for Services, footer, cookie notice, 404 page.

---

## 4. Tech Stack (default — change only if user says otherwise)

- **Next.js 14+ (App Router) + TypeScript**
- **Tailwind CSS** with a custom design-token layer (`@theme` / `tailwind.config.ts`)
- **Framer Motion** for entrance, parallax, spatial and morph transitions
- **Lucide React** icons; custom inline SVG for industrial iconography
- **next/font** — self-hosted (no external CDN font calls)
- Forms: React Hook Form + Zod → `/api/contact` route (stub SMTP/Resend, env-driven)
- SEO: `next-seo`-style metadata API, JSON-LD `Organization` + `LocalBusiness` (×4 offices) + `Service` schemas, sitemap.xml, robots.txt
- Deploy target: Vercel. No database required — all content in typed files under `/content` or `/data`.

**Hard rules**
- Everything renders offline: no external image/font/script CDNs. Inline SVG, data-URI textures, local assets only.
- All heavy visual effects must be `prefers-reduced-motion` aware and degrade gracefully.
- `backdrop-filter` fallbacks required (solid tint) for unsupported browsers.
- Lighthouse targets: Performance ≥ 90, Accessibility ≥ 95, SEO 100.

---

## 5. Design System (the "AKMEC Industrial OS")

**Concept:** *A precision instrument panel for heavy industry.* Cold engineered steel, safety-signal accents, and depth that feels physically machined. Serious and credible first; expressive second. Every "-morphism" must serve credibility, never novelty.

### 5.1 Color tokens
```
--steel-950  #0A0E14   base canvas (dark surfaces)
--steel-900  #111722
--steel-800  #1A2231
--steel-600  #3A4657
--steel-300  #A7B2C2
--steel-100  #E8ECF2   light canvas
--steel-050  #F5F7FA

--safety     #FF6A00   primary accent (safety orange — CTAs, alerts)
--signal     #00C2A8   secondary accent (teal — verified/pass states)
--warn       #FFC53D   caution
--danger     #E5484D   fail/defect states
--ink        #0B0F16   text on light
--paper      #FFFFFF
```
Accent usage cap: safety orange ≤ 10% of any viewport. It means "act here".

### 5.2 Typography
- **Display:** a tight geometric grotesk (Space Grotesk / Archivo / Chakra Petch) — uppercase, tracking `-0.02em`, for hero + section titles.
- **Body:** Inter / IBM Plex Sans, 16–18px, line-height 1.65.
- **Mono:** JetBrains Mono / IBM Plex Mono — for spec numbers, API codes, standards (API 570, PAUT, TOFD). Technical codes always in mono. This single rule sells the "engineering" credibility more than any effect.
- Scale: 12 / 14 / 16 / 18 / 21 / 28 / 38 / 52 / 72 / 96 (clamp-based fluid).

### 5.3 Spatial system
- 8px base grid; section vertical rhythm 96–160px desktop, 64–80px mobile.
- Max content width 1280px; bento zones may bleed to 1440px.
- Radii: `sm 8 / md 14 / lg 22 / xl 32 / clay 36 / pill 999`.

### 5.4 Shared effect tokens (define once, reuse — do not hand-roll per component)
```css
/* Glassmorphism */
--glass: { background: rgba(255,255,255,.08); backdrop-filter: blur(20px) saturate(160%);
           border: 1px solid rgba(255,255,255,.16); box-shadow: 0 8px 32px rgba(0,0,0,.28); }

/* Neumorphism (light surfaces ONLY, --steel-100 canvas) */
--neu-raised: box-shadow: 8px 8px 18px rgba(160,170,185,.55), -8px -8px 18px rgba(255,255,255,.95);
--neu-inset:  box-shadow: inset 6px 6px 12px rgba(160,170,185,.5), inset -6px -6px 12px rgba(255,255,255,.9);

/* Claymorphism */
--clay: border-radius:36px; background: linear-gradient(145deg,#fff,#e6ebf2);
        box-shadow: 0 18px 40px rgba(20,30,50,.16), inset 0 -8px 16px rgba(20,30,50,.10),
                    inset 0 8px 16px rgba(255,255,255,.9);

/* Skeuomorphism — brushed metal + machined bevel */
--metal: linear-gradient(180deg,#f2f4f7 0%,#d9dee6 48%,#c3cad4 52%,#eef1f5 100%)
         + repeating-linear-gradient(90deg, rgba(0,0,0,.03) 0 1px, transparent 1px 3px);
--bevel: inset 0 1px 0 rgba(255,255,255,.9), inset 0 -1px 0 rgba(0,0,0,.22), 0 2px 4px rgba(0,0,0,.25);

/* Brutalism */
--brutal: background:#fff; color:#000; border:3px solid #000; border-radius:0;
          box-shadow: 8px 8px 0 #000;   /* hover → translate(-3px,-3px), shadow 11px 11px */

/* Liquid Glass (Apple-style) */
--liquid: backdrop-filter: blur(24px) saturate(180%) brightness(1.06);
          background: linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,.06));
          border: 1px solid transparent;
          border-image: linear-gradient(135deg, rgba(255,255,255,.7), rgba(255,255,255,.05)) 1;
          + specular highlight sweep that tracks pointer + subtle chromatic edge (SVG feDisplacementMap
            or a 1px inset gradient ring). Must animate on hover: highlight follows cursor.
```

### 5.5 Motion
- Ease: `cubic-bezier(.2,.8,.2,1)`. Durations 180ms (micro) / 420ms (card) / 700ms (section).
- Scroll reveals: 16–24px translateY + opacity, stagger 60ms. Never bounce on corporate content.
- Spatial parallax layers: background 0.15× / mid 0.4× / foreground 1×.
- Respect `prefers-reduced-motion: reduce` → all transforms off, opacity fades only.

### 5.6 Accessibility (blocking requirements)
- Text contrast ≥ 4.5:1 on **every** glass/neumorphic surface — put an opaque tint layer behind text if blur alone fails.
- Neumorphic controls must add a visible 1px border + focus ring (`2px solid --safety`, offset 2px) — shadow alone is not an affordance.
- Brutalist sections must still pass contrast and keep a logical heading order.
- Full keyboard nav, skip-link, semantic landmarks, alt text on all imagery.
- No pure-decorative motion that conveys information.

---

## 6. ⚙️ Style-to-Section Map (AUTHORITATIVE)

Apply exactly this. One dominant language per section, at most one supporting accent. **Never stack three effects on one component.**

| # | Section / Surface | Dominant style | Why / How |
|---|---|---|---|
| 1 | **Hero (Home)** | **Spatial UI + Liquid Glass** | Dark `--steel-950` canvas, layered depth: blurred plant/refinery imagery far layer, animated wireframe pipeline SVG mid-layer, floating liquid-glass stat pods (50+ / 100+ / 5+) foreground with pointer-tracked specular sweep and mouse-parallax. Headline: "Empowering Industries with Quality & Trust". Dual CTA: `Request an Inspection` (safety-orange solid) + `Download Company Profile` (liquid-glass ghost). |
| 2 | **Sticky header / nav** | **Liquid Glass** | Transparent at top → on scroll becomes a floating liquid-glass pill bar with a soft specular top edge. Active link marked by an orange underglow. |
| 3 | **Services mega-menu** | **Glassmorphism + Bento** | Full-width glass panel over a dimmed page, contents laid out as a mini bento of the 6 pillars with icon + 3 sub-items each. |
| 4 | **Home — services hub** | **Bento Grid** | Asymmetric 12-col bento, 6 tiles of varying span (2×2 hero tile for Inspection & Audit, 1×2 for NDT, etc.). Each tile: dark steel base, mono discipline tags, orange arrow on hover, gentle 3D tilt (max 6°). This is the anchor section of the homepage. |
| 5 | **Stats / KPI strip** | **Skeuomorphism** | A machined instrument panel: brushed-metal plate (`--metal` + `--bevel`), recessed digital counters with a faint LED glow, screw-head details at the four corners, subtle noise texture. Counters animate on scroll into view. This is the "industrial credibility" moment — make it convincing, not cartoonish. |
| 6 | **About — Who We Are** | **Minimalism** | Maximum whitespace on `--steel-050`, single column, 21px body, one hairline rule, one full-bleed duotone photograph. Zero effects. Deliberate calm between two loud sections. |
| 7 | **Mission & Vision** | **Claymorphism** | Two large soft clay cards, 36px radius, pastel-steel gradient with inner top-light. Friendly, human, approachable — the emotional beat of the site. Big rounded icon blobs. |
| 8 | **Brand Qualities** (Compliance, Transparency, Availability, Quality, Competence, Reliability) | **Neumorphism** | Light `--steel-100` panel, 6 raised soft-UI tiles; hover presses them into inset state (tactile "button" metaphor). Add borders + focus rings per §5.6. |
| 9 | **Industries We Serve (33)** | **Maximalism** | Deliberately dense, high-energy: overlapping type, riso-style duotone industry photos, orange/teal color blocking, diagonal tape strips, a scrolling ticker of industry names, and an interactive filter. Chaos is *organized* by a strict underlying grid. This section proves scale — 33 industries should feel overwhelming, in a good way. |
| 10 | **Certifications & Approvals** (API/ISO/NACE/CSWIP/ARAMCO/SABIC/ADNOC/ORPIC/FLUOR/Chevron) | **Brutalism** | Black-on-white, 3px hard borders, `8px 8px 0` offset shadows, uppercase mono codes, zero radius. Standards are non-negotiable facts — present them as raw stamped documents. Hover: card shifts up-left, shadow deepens. Ideal for a compliance-badge wall. |
| 11 | **NDT method explorer** (PT/MPT/UT/PAUT/TOFD/ECT/IRIS/RFT/MFL/NFT/ECA…) | **Spatial UI + Glass** | Interactive: left rail of methods, right a 3D-ish exploded cutaway (SVG/CSS-3D) of a pipe/weld showing where each method applies. Method detail slides in on a glass panel with depth shadow and z-layered parallax. Flagship interaction of the site. |
| 12 | **Service detail pages** | **Minimalism base + Bento sub-grids** | Clean editorial reading column; capability lists rendered as compact bento chips; sticky in-page nav on the left; glass CTA card at bottom. |
| 13 | **Asset Integrity page** | **Spatial UI (diagram)** | Layered lifecycle diagram (RBI → CCD → FFS → life extension) with depth and scroll-driven layer separation. |
| 14 | **Clients / Approved-with wall** | **Bento + Glass** | Bento logo wall; monochrome logos that colorize on hover; a slow marquee row beneath. Header must read "Approved / Registered With". |
| 15 | **Testimonials / project highlights** | **Glassmorphism** | Glass cards over a dark blurred plant photo, soft float animation. |
| 16 | **Modals / popups / lightbox** | **Liquid Glass** | Backdrop blur 24px + darken, panel with animated specular edge, spring scale-in from 0.96. Applies to: quote popup, profile-download gate, image lightbox, mobile menu overlay. |
| 17 | **Toasts, tooltips, cookie bar** | **Liquid Glass (compact)** | Small floating pills, blur + hairline gradient border, bottom-center, auto-dismiss. |
| 18 | **Forms (contact / quote)** | **Neumorphism** | Inset soft-UI fields on light canvas, raised submit button that depresses on click. Validation states use `--danger` / `--signal` rings. Multi-step quote form with a neumorphic progress track. |
| 19 | **Contact — office cards (4)** | **Claymorphism** | Four chunky clay cards (Nashik, Vadodara, Mumbai, Jubail KSA) with flag/pin blobs, tap-to-call and tap-to-mail. Warm and inviting. |
| 20 | **Map** | **Glass overlay** | Muted dark map tile/SVG with glass info cards pinned per office. |
| 21 | **Footer** | **Brutalism (softened) + Bento** | Big uppercase wordmark, hard-ruled bento of link columns, mono contact block, thin orange top rule. Confident sign-off. |
| 22 | **404 / empty states** | **Brutalism** | Oversized type, hard border box, single orange link back home. |
| 23 | **Buttons — global** | Primary = flat safety-orange (minimal) · Secondary = liquid glass · Tertiary = brutalist outline. Never neumorphic on dark surfaces. |
| 24 | **Loading / skeletons** | **Neumorphism shimmer** on light, **glass shimmer** on dark. |

### 6.1 Transition choreography between styles
Adjacent sections must never clash. Use these connectors:
- Skeuomorphic panel → Minimal section: a 120px gradient fade from metal to `--steel-050`.
- Maximalist industries → Brutalist certifications: hard cut with a full-width 3px black rule. Intentional whiplash.
- Dark spatial → light neumorphic: an angled clip-path divider with a subtle orange hairline.
- Rule of thumb: **loud → quiet → loud**. Never two maximal/brutal sections back-to-back.

---

## 7. Page-by-Page Build Spec

### 7.1 Home
1. Hero (spatial + liquid glass) — headline, sub, dual CTA, floating stat pods
2. Trust bar — ISO 9001:2015 · API certified · ARAMCO/SABIC/ADNOC approved (thin glass strip)
3. About teaser (minimal) — "Who We Are" + Know More
4. Services bento (6 pillars)
5. KPI instrument panel (skeuomorphic counters)
6. NDT method explorer teaser (spatial)
7. Industries maximalist band (33, with ticker)
8. Certifications brutalist wall
9. Approved-with / clients bento
10. Mission & Vision clay cards
11. CTA band — "Need an inspector mobilized this week?" (liquid glass over dark)
12. Footer

### 7.2 About
Who We Are · Journey timeline (2021 → today, spatial scroll) · Mission & Vision (clay) · Six Qualities (neumorphic) · Stats (skeuomorphic) · Global presence map · Leadership placeholder (`TODO`).

### 7.3 Services hub + 6 detail pages
Hub = full-page bento of pillars. Each detail page: hero strip (glass over discipline photo), overview paragraph, capability list (bento chips), applicable standards (mono/brutalist chips), industries served (filtered subset), related services, CTA.
**NDT page** additionally carries the 3-tab explorer (Conventional / Advanced / Advanced Techniques) with the exploded-weld interaction.

### 7.4 Industries
Maximalist hero, filter chips (Energy / Process / Infra / Transport / Manufacturing), 33 cards, each opening a liquid-glass modal listing the AKMEC services relevant to that industry.

### 7.5 Certifications
Brutalist grid grouped: API · ISO · Coating (NACE/BGAS/AMPP/FROSIO) · Welding (CSWIP/AWS/CWI) · Client approvals. Each a stamped card with code in mono.

### 7.6 Contact
Clay office cards ×4 · glass map · neumorphic form (Name, Company, Email, Phone, Country, Service Interest [select from 6 pillars], Message) · direct phone/email/WhatsApp chips · downloadable company profile PDF.

---

## 8. Content & Copy Rules
- Tone: confident, technical, plain. Short sentences. No fluffy marketing adjectives.
- Never invent clients, projects, numbers, or certifications beyond §2. If a placeholder is needed, write real copy and add `{/* TODO: confirm with AKMEC */}`.
- Keep legacy SEO keywords alive: *facility management, NDT services India, third party inspection, vendor inspection, pre-shipment inspection, asset integrity, manpower supply, heat treatment*.
- Every acronym gets an expansion on first use or in a tooltip (PAUT → Phased Array Ultrasonic Testing).
- Copyright line: `© 2026 AKMEC LLP. All rights reserved.`

## 9. Deliverables & File Structure
```
app/                    routes per §3
components/
  ui/                   Button, Card, Modal, Input, Tabs, Marquee, Counter
  effects/              GlassPanel, LiquidGlass, NeuSurface, ClayCard,
                        BrutalBox, MetalPanel, BentoGrid, ParallaxLayer
  sections/             Hero, ServicesBento, KpiPanel, IndustriesMax,
                        CertWall, NdtExplorer, MissionVision, ContactBlock
data/                   services.ts industries.ts certifications.ts
                        offices.ts clients.ts stats.ts nav.ts
styles/                 tokens.css effects.css
public/media/           ← copy akmec-assets/ here verbatim; NO other images
public/                 company-profile.pdf, favicon, og image (composed from supplied assets only)
```
Also produce **`STYLE-GUIDE.md`** — a `/style-guide` route rendering every effect token side by side, so AKMEC can see all 9 languages in one place.

## 10. Definition of Done
- [ ] All 6 service pillars + every sub-item from §2 present and linked
- [ ] All 33 industries render and filter
- [ ] All 4 offices with correct addresses, tel: and mailto: links
- [ ] All 9 design languages used, each per the §6 map, none gratuitous
- [ ] **Zero images outside `akmec-assets/`** — no AI-generated, no stock, no placeholder services, no hotlinks. Grep the codebase for `unsplash|pexels|placehold|picsum|dummyimage|images.` and confirm 0 hits
- [ ] Every non-photo graphic is hand-authored inline SVG or CSS
- [ ] All photos unified with a shared duotone/grade so the library looks coherent
- [ ] Client logos on light tiles, grayscale→colour on hover, correct alt text
- [ ] Fully responsive: 360 / 768 / 1024 / 1440 / 1920
- [ ] Dark and light surfaces both readable; contrast audit passes
- [ ] `prefers-reduced-motion` honoured everywhere
- [ ] Lighthouse ≥ 90/95/100 (perf/a11y/SEO); no external CDN calls
- [ ] JSON-LD Organization + 4× LocalBusiness + Service schemas
- [ ] Contact + quote forms validate and post to a stubbed API route
- [ ] `/style-guide` route ships

## 11. How to Work
1. Scaffold project + design tokens + `components/effects/*` **first**. Every section consumes tokens; no inline magic values.
2. Build `data/*.ts` from §2 verbatim before building UI.
3. Build sections in homepage order; get Home fully right, then inner pages reuse.
4. After each page, self-audit against §5.6 and §10 and fix before moving on.
5. **Before building any section, check §2.5.2 for its assigned image.** If none is assigned, that section is intentionally image-free — build it with SVG/type/colour. Do not go looking for a photo.
6. Ask the user only if a fact is genuinely missing (the 5 unknown client logos, team photos, project case studies). Everything else is decided in this document — do not re-litigate design choices or the image policy.
