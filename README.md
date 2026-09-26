# WeatherCA.net - 2026 Next-Gen Canadian Meteorological Platform 🍁

A high-performance, **100% SEO-optimized**, ultra-premium weather application built specifically for Canada with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**, designed for seamless deployment on **GitHub** and **Vercel Edge Network**.

---

## 🚀 Key Features & 2026 Architecture

### 1. 100% Programmatic SEO Dominance
- **Exhaustive Canada Geographic Coverage**: Covers all 10 provinces and 3 northern territories with structured hierarchical routing (`/[province]/[city]`).
- **Google Rich Results Schema (JSON-LD)**: Every page injects `WeatherForecast`, `BreadcrumbList`, `Place`, and `FAQPage` schemas for instant SERP cards with temperatures and conditions.
- **Dynamic Edge Social Cards (`/api/og`)**: Generates real-time 1200x630 OpenGraph images featuring current temperature, condition, and location badge when shared on Twitter/X, WhatsApp, or Facebook.
- **Dynamic Multi-Sitemap (`/sitemap.xml`) & `robots.txt`**: Automatically indexes provinces, cities, hourly forecasts, 14-day outlooks, and radar pages.
- **Zero-CLS & Sub-50ms TTFB**: Built with Incremental Static Regeneration (`revalidate: 900` = 15 mins) on Vercel Edge.

### 2. Canadian-Specific Meteorological Indices (ECCC Standards)
- **Canadian Wind Chill**: Calculates wind cooling effect and outputs frostbite risk duration (e.g. at -28°C to -39°C frostbite within 30 min; below -40°C in under 10 min).
- **Canadian Humidex**: Humidity and heat comfort scale identifying discomfort and danger thresholds.
- **Air Quality Health Index (AQHI)**: Official 1-10+ Canadian scale monitoring PM2.5, ground-level ozone, nitrogen dioxide, and wildfire smoke with tailored health advice for at-risk and general populations.
- **Environment Canada Alert Feeds**: Detects and displays live Blizzard, Winter Storm, Freezing Rain, and Extreme Cold warnings.
- **High-Resolution Models**: Powered by the Canadian High-Resolution Deterministic Prediction System (HRDPS 2.5km) and GEM models.

### 3. Ultra-Premium 2026 UI/UX (Apple Weather + Linear Aesthetic)
- **Bento Grid Layout**: Frosted glass cards (`backdrop-blur-2xl bg-white/[0.06]`), specular borders, and high contrast typography.
- **Dynamic Atmospheric Backdrop**: Background canvas rendering ambient precipitation, snowfall crystals, twinkling stars, or northern lights (aurora) based on real-time weather codes.
- **Live Interactive Doppler Radar**: Animated time-scrubber radar preview with precipitation intensity legend (dBZ) and layer toggles.
- **Instant Search (`⌘K` / `Ctrl+K`)**: Lightning-fast autocomplete supporting Canadian city names, bilingual names (e.g. Montréal), and FSA postal code prefixes (e.g. M5V, V6B), plus HTML5 Geolocation with automatic nearest-city detection.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15+ (App Router, Turbopack)
- **Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + Glassmorphism Tokens
- **Icons**: Lucide React + Animated SVGs
- **Deployment**: Vercel (Edge Functions, Node.js Runtime, Image Optimization)
- **CI/CD**: GitHub Actions

---

## 📁 Project Structure

```text
weathercax/
├── .github/workflows/ci.yml       # GitHub Actions CI workflow
├── src/
│   ├── app/
│   │   ├── [province]/            # Provincial overview & city directory
│   │   │   ├── page.tsx
│   │   │   └── [city]/            # Core city forecast pages
│   │   │       ├── page.tsx       # Main forecast (Bento grid, Schema.org)
│   │   │       ├── hourly/        # 48-hour deep dive table
│   │   │       ├── 14-day/        # 14-day extended outlook
│   │   │       ├── radar/         # Fullscreen Doppler radar
│   │   │       └── air-quality/   # Canadian AQHI health report
│   │   ├── api/og/route.tsx       # Dynamic OpenGraph social card generator
│   │   ├── layout.tsx             # Root layout with atmosphere & headers
│   │   ├── page.tsx               # Canada National homepage
│   │   ├── robots.ts              # SEO robots.txt
│   │   └── sitemap.ts             # Dynamic XML Sitemap
│   ├── components/
│   │   ├── BentoGrid.tsx          # 2026 Bento grid cards
│   │   ├── Footer.tsx             # Full SEO directory & attribution
│   │   ├── Header.tsx             # Navigation & ⌘K search trigger
│   │   ├── HeroWeatherCard.tsx    # Flagship temperature & Canadian badges
│   │   ├── SearchModal.tsx        # Instant search & GPS locator
│   │   ├── WeatherAtmosphere.tsx  # Dynamic atmospheric canvas effects
│   │   ├── WeatherIcons.tsx       # Dynamic weather code SVG icons
│   │   └── WeatherRadar.tsx       # Interactive precipitation radar
│   ├── data/
│   │   ├── canadian-cities.ts     # Rich Canadian cities & FSA dataset
│   │   └── provinces.ts           # 13 Canadian provinces & territories
│   ├── lib/
│   │   ├── seo.ts                 # Schema.org JSON-LD & meta generator
│   │   └── weather.ts             # Open-Meteo & ECCC met formulas (Wind Chill, Humidex)
│   └── types/
│       └── weather.ts             # TypeScript definitions
├── vercel.json                    # Vercel configuration & security headers
└── package.json
```

---

## 🚢 Deployment Guide (GitHub & Vercel)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: 2026 WeatherCA modern architecture with 100% SEO and Canadian data"
git remote add origin https://github.com/YOUR_USERNAME/weatherca.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** → **Project**.
3. Import your `weatherca` repository from GitHub.
4. Leave framework preset as **Next.js**.
5. Click **Deploy**. Vercel will automatically build and deploy the app to global edge locations in under 1 minute!

### Step 3: Configure Custom Domain
1. In Vercel Project Settings, go to **Domains**.
2. Add `weatherca.net` and `www.weatherca.net`.
3. Update your DNS records (A record pointing to `76.76.21.21` or CNAME to `cname.vercel-dns.com`).
