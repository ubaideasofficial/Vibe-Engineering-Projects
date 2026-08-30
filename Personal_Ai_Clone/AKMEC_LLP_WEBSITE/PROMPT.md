# Short Prompt (paste into v0 / Lovable / Bolt / Cursor / Claude Code)

> Use this if you want a single copy-paste prompt. For the full build, give the agent **AGENTS.md** instead — it contains the complete content inventory.

---

Build a complete, production-grade marketing website for **AKMEC LLP** (akmecgroup.com) — an ISO 9001:2015 certified industrial services company operating since 2021 from India (Nashik, Vadodara, Mumbai) and Saudi Arabia (Jubail).

**Positioning:** "Empowering Industries with Quality & Trust." AKMEC delivers Inspection & Audit, NDT Examination & Testing, Asset Integrity & Technical Solutions, Manpower Supply & Outsourcing, Training & Certification, and Heat Treatment.

**Stack:** Next.js 14 App Router + TypeScript + Tailwind + Framer Motion. No external CDNs — self-hosted fonts, inline SVG. Lighthouse ≥ 90/95/100.

**Pages:** Home · About · Services hub + 6 detail pages · Industries (33) · Certifications · Clients · Contact (4 offices) · Quote · 404 · /style-guide.

**Design concept:** "Industrial OS" — a precision instrument panel for heavy industry. Palette: steel #0A0E14 → #F5F7FA, safety orange #FF6A00 (≤10% of viewport, CTAs only), signal teal #00C2A8. Geometric grotesk display, Inter body, **mono for every technical code** (API 570, PAUT, TOFD).

**Use all 9 design languages — but exactly where each earns its place:**
- **Spatial UI + Liquid Glass** → hero (parallax depth layers, pointer-tracked specular highlights, floating stat pods), sticky nav, NDT method explorer, all modals/popups/toasts
- **Bento Grid** → services hub (asymmetric 12-col, 6 tiles), mega-menu, client logo wall, footer link columns
- **Skeuomorphism** → the stats/KPI strip as a brushed-metal machined instrument panel with recessed LED counters, bevels and corner screws (50+ inspectors · 100+ projects · 5+ years)
- **Minimalism** → About "Who We Are" — max whitespace, zero effects, a deliberate quiet beat
- **Claymorphism** → Mission & Vision cards, and the 4 contact office cards (soft, warm, 36px radius)
- **Neumorphism** → the 6 brand-quality tiles (Compliance, Transparency, Availability, Quality, Competence, Reliability) and all form inputs (inset fields, depressing submit button)
- **Maximalism** → "Industries We Serve" — 33 industries, dense overlapping type, duotone riso photos, color blocking, scrolling ticker, chaos over a strict grid
- **Brutalism** → certifications & approvals wall (API 510/570/653/580/571/936/1104, ISO 9001/9712, NACE, CSWIP, AWS, ARAMCO, SABIC, ADNOC, ORPIC, FLUOR, Chevron) — black-on-white, 3px borders, 8px hard offset shadows, mono caps; also 404 and footer

**🚫 IMAGE RULE (hard constraint):** Use ONLY the images provided in the `akmec-assets/` folder — 87 files extracted from the AKMEC company profile PDF and the existing website (hero/, services/, ndt/, asset-integrity/, manpower/, clients/ 34 real client logos, icons/, brand/). **No AI-generated images. No stock photos (Unsplash/Pexels/etc). No placeholder services (placehold.co, picsum). No external hotlinks.** Hand-authored inline SVG for icons, diagrams and textures is encouraged and expected. If a section has no assigned photo, build it image-free with SVG, typography and colour blocking — do not go source one. Most PDF photos are small (240–800px), so use them in bento tiles and cards, not full-bleed; only `hero/offshore-platform-aerial.jpg` (2666×1498) and a few web images are hero-sized. Unify the mismatched library with one shared duotone/grade. Client logos: light tiles, `object-fit: contain`, grayscale → colour on hover.

**Rules:** one dominant style per section, never three effects stacked on one component; alternate loud → quiet → loud; every glass/neumorphic surface must still hit 4.5:1 contrast and show a visible focus ring; honour `prefers-reduced-motion`; provide `backdrop-filter` fallbacks.

Contact: inquiry@akmecgroup.com · +91 9226112227 · +91 9920702095. Footer: © 2026 AKMEC LLP. All rights reserved.

Do not invent clients, projects or certifications — mark unknowns as TODO.
