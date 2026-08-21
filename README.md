# Karol Malina — Portfolio

Jednostronicowe portfolio frontend/full-stack developera, dwujęzyczne (EN/PL), z animacjami GSAP.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS 4** (tokeny designu w `@theme` w `src/index.css`)
- **GSAP + @gsap/react** (animacje wejścia, poziomy scroll w sekcji Journey)
- **lucide-react** (ikony)

## Struktura

```
src/
├── i18n/
│   ├── content.json         # wszystkie treści EN + PL (jedno źródło prawdy)
│   └── LanguageContext.tsx  # provider języka + hooki useLanguage/useContent
├── lib/animations.ts        # współdzielone handlery hover (GSAP, reduced-motion aware)
├── components/              # sekcje strony (Navigation, Hero, Projects, Stack, Journey, Contact)
└── index.css                # tokeny designu + style globalne
```

## Komendy

```bash
npm install       # instalacja
npm run dev       # serwer deweloperski
npm run build     # typecheck + build produkcyjny (dist/)
npm run lint      # ESLint
npm run typecheck # samo tsc
```

## Edycja treści

Wszystkie teksty (oba języki) są w `src/i18n/content.json` — komponenty nie zawierają treści.
Linki do repozytoriów projektów: pola `projects.items[].repo`.

## Uwagi

- Zmiana języka jest natychmiastowa (React Context), wybór zapisywany w `localStorage`,
  `<html lang>` aktualizowany automatycznie.
- Animacje respektują `prefers-reduced-motion` (GSAP `matchMedia`).
- Przed wdrożeniem na własną domenę uzupełnij `og:url`/`og:image` w `index.html`
  oraz `robots.txt` i `public/sitemap.xml`.
