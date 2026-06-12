# Design Audit — Perfume Collection Tracker

Extracted from `perfume_collection.jsx` (827 lines, 29 perfume entries, June 2026).

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-dark-start` | `#0d0d12` | Gradient start (top) |
| `bg-dark-mid` | `#1a1025` | Gradient middle (40%) |
| `bg-dark-end` | `#0d1a1a` | Gradient end (bottom) |
| `text-primary` | `#e8e0d5` | Base body text |
| `text-heading` | `#f0e6cc` | Headlines, card names |
| `text-scent` | `#c8b890` | Scent type labels |
| `text-muted-1` | `#9a8e7a` | Subtitle text |
| `text-muted-2` | `#8a8078` | Filter labels inactive |
| `text-muted-3` | `#7a7068` | Section labels |
| `text-muted-4` | `#6a6058` | Inspired-by text |
| `text-muted-5` | `#5a5550` | Footer text, result count |
| `accent-gold` | `#b49c60` | Brand labels, borders, headings accent, tag borders, card number, chevron active |
| `accent-gold-bright` | `#c9a84c` | Active "All" filter text |
| `accent-gold-tag` | `#c8a84c` | Tag text color |
| `accent-teal` | `#7ec8d8` | Occasion filter active, occasion badge |
| `season-spring` | `#7ecba1` | Spring tag chip |
| `season-summer` | `#f9c74f` | Summer tag chip |
| `season-fall` | `#f4845f` | Fall tag chip |
| `season-winter` | `#90c2e7` | Winter tag chip |
| `notes-top` | `#a8d8a8` | Top notes label |
| `notes-heart` | `#f4d58d` | Heart notes label |
| `notes-base` | `#d4a574` | Base notes label |
| `card-bg` | `rgba(255,255,255,0.05)` → `rgba(255,255,255,0.02)` | Card gradient |
| `card-border` | `rgba(255,255,255,0.08)` | Default card border |
| `card-border-active` | `rgba(180,140,80,0.5)` | Expanded card border |
| `card-shadow` | `0 2px 12px rgba(0,0,0,0.3)` | Default card shadow |
| `card-shadow-active` | `0 8px 40px rgba(180,140,80,0.1)` | Expanded card shadow |
| `header-border` | `rgba(180,140,80,0.3)` | Header bottom border |
| `divider` | `rgba(180,140,80,0.2)` | Expanded card divider |
| `footer-border` | `rgba(180,140,80,0.15)` | Footer top border |
| `input-bg` | `rgba(255,255,255,0.06)` | Search input background |
| `input-border` | `rgba(180,140,80,0.25)` | Search input border |

---

## Typography

| Property | Value |
|----------|-------|
| **Font family** | `Georgia, serif` (applied to all elements) |
| **Heading (h1)** | `clamp(26px, 4vw, 48px)`, weight normal, `letter-spacing: 0.02em`, `line-height: 1.2` |
| **Subtitle** | 15px, color `#9a8e7a` |
| **Section label (eyebrow)** | 11px, `letter-spacing: 5`, uppercase, color `#b49c60` |
| **Card brand** | 11px, `letter-spacing: 2`, uppercase, color `#b49c60` |
| **Card name** | 16px, weight normal, `line-height: 1.3`, color `#f0e6cc` |
| **Card scent type** | 13px, color `#c8b890` |
| **Card longevity** | 12px, color `#8a9888` |
| **Card inspired-by** | 12px, italic, color `#6a6058` |
| **Notes label** | 10px, `letter-spacing: 1`, uppercase |
| **Notes value** | 11px, color `#c8c0b0`, `line-height: 1.5` |
| **Analysis text** | 13.5px, color `#c0b8a8`, `line-height: 1.7` |
| **Tags** | 11px, color `#c8a84c` |
| **Season chips** | 11px |
| **Occasion badge** | 11px, color `#7ec8d8` |
| **Filter buttons** | 13px |
| **Filter labels** | 12px, `letter-spacing: 2`, uppercase, color `#7a7068` |
| **Result count** | 12px, color `#5a5550` |
| **Legend items** | 12px |
| **Card number** | 11px, `letter-spacing: 1`, color `rgba(180,140,80,0.4)` |

---

## Component Hierarchy

```
PerfumeAnalysis (root)
├── Header
│   ├── Decorative gradient overlays (radial ellipses)
│   ├── Eyebrow: "Collection Analysis · June 2026"
│   ├── h1: "Danish's Fragrance Collection"
│   └── Subtitle: "30 fragrances · Researched, rated & categorized"
├── Controls
│   ├── Search input (full width, dark bg, gold border)
│   ├── Season filter row (label + pill buttons)
│   │   └── Filter pills: All Seasons, Spring, Summer, Fall, Winter
│   ├── Occasion filter row (label + pill buttons)
│   │   └── Filter pills: All Occasions, Daily Wear, Evening/Special
│   └── Result count: "Showing X of Y fragrances"
├── Cards Grid (auto-fill, minmax(320px, 1fr), gap 20px)
│   └── PerfumeCard (×29, mapped from data)
│       ├── Card number (#01–#29, top-right corner)
│       ├── Brand (uppercase, gold)
│       ├── Name (heading-sized)
│       ├── Season chips (colored pills per season)
│       ├── Occasion badge (teal pill, abbreviated)
│       ├── Scent type (label + value)
│       ├── Longevity (with ⏱ emoji)
│       ├── Inspired by (italic, muted)
│       ├── Expand chevron (▼, rotates 180° when open)
│       └── Expanded content (conditional):
│           ├── Divider line
│           ├── Fragrance Notes (3-column grid)
│           │   ├── Top notes (green label)
│           │   ├── Heart notes (yellow label)
│           │   └── Base notes (brown label)
│           ├── Analysis paragraph
│           └── Tags (gold-bordered pills)
└── Legend Footer
    ├── Season color dots with labels
    └── "Click any card to expand details" hint
```

---

## Perfume Data Schema

Each perfume entry has these fields:

| Field | Type | Example |
|-------|------|---------|
| `id` | number | 1–29 |
| `name` | string | "Lattafa Khamrah Qahwa" |
| `brand` | string | "Lattafa" |
| `inspired` | string | "Kilian Angel's Share (coffee twist)" |
| `notes.top` | string | "Cinnamon, Cardamom, Ginger" |
| `notes.heart` | string | "Praline, Candied Fruits, White Flowers" |
| `notes.base` | string | "Coffee, Vanilla, Tonka Bean, Musk" |
| `scent_type` | string | "Gourmand Oriental" |
| `seasons` | string[] | ["Fall", "Winter"] |
| `occasion` | string | "Special Occasion / Evening" |
| `longevity` | string | "8–10 hrs \| Beast Mode" |
| `analysis` | string | Multi-sentence review paragraph |
| `tags` | string[] | ["Compliment Magnet", "Cold Weather King", "Heavy Hitter"] |

---

## Interactive Behaviors

| Behavior | Implementation |
|----------|---------------|
| **Card expand/collapse** | `onClick` sets `expanded` state to perfume.id (or null). Chevron rotates 180°. |
| **Search** | Filters by name, brand, or scent_type (case-insensitive). Real-time as user types. |
| **Season filter** | Pills toggle `activeSeason` state. "All" removes filter. |
| **Occasion filter** | Pills toggle `activeOccasion`. "All Occasions" removes. "Daily Wear" matches occasion containing "daily". "Evening/Special" matches "evening" or "special". |
| **Filter combination** | All three filters (search + season + occasion) apply simultaneously via `.filter()` |
| **Result counter** | Live-updating "Showing X of Y" text |
| **Hover states** | None defined beyond cursor change on pills and cards |

---

## Static Data

- **29 perfume objects** hardcoded in a `perfumes` array
- **Season color map**: `{ Spring: "#7ecba1", Summer: "#f9c74f", Fall: "#f4845f", Winter: "#90c2e7" }`
- **Occasion icon map**: Defined but **not used visually** in the rendered output
- **Filter arrays**: `["All", "Spring", "Summer", "Fall", "Winter"]` and `["All Occasions", "Daily Wear", "Evening/Special"]`

---

## Layout Dimensions

| Element | Value |
|---------|-------|
| Max content width | 1100px |
| Page padding (horizontal) | 32px |
| Card border radius | 14px |
| Filter pill border radius | 20px |
| Tag border radius | 10px |
| Season chip border radius | 10px |
| Card padding | 20px 22px |
| Search input border radius | 8px |
| Header padding | 40px 32px 28px |
| Footer padding | 20px 32px |
| Card grid columns | `repeat(auto-fill, minmax(320px, 1fr))` |
| Card grid gap | 20px |
| Notes grid columns | 3 equal columns (`1fr 1fr 1fr`) |

---

## What the JSX Does NOT Have (New Features to Add)

- Authentication (login/register/logout)
- User accounts
- Database persistence
- CRUD operations (add/edit/delete perfumes)
- Image uploads
- Dashboard analytics
- Pagination
- Rating system
- Purchase tracking (price, date, size, sprays)
- Collection status (Owned/Sold/Wishlist)
- Responsive sidebar navigation
- Toast notifications
- Form validation
- API endpoints
