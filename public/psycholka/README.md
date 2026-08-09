# PsychOLKA assets

Each action lives in its own directory: `idle`, `wave`, `coffee`, `greeting`, `open-arms`, `read`, `walk`, `run`, `sit`, `celebrate`, `lost-shoe`, `sleep`.

## Naming

Use lowercase kebab-case: `<action>-<variant>-v<major>.<format>`, for example `coffee-default-v1.webp`.

## Formats

Prefer animated WebP for short loops and transparent PNG/WebP for stills. Use WebM only where browser support and performance have been checked. Every asset must have a transparent background; no baked-in cards, text, or coloured page backgrounds.

## Responsive variants

Provide a desktop source and a mobile source when the asset is wider than 240 px. Use the suffix `-mobile`, for example `read-default-mobile-v1.webp`. Keep important details inside the central safe area so cropping never obscures the character.

## Versioning

Never overwrite a released asset. Increment the major version in the filename and update the future animation manifest entry. Real animations must respect `prefers-reduced-motion` and must not cover controls or form fields.

Future playful actions (`lost_shoe`, `trip`, `confetti_fail`, `look_for_glasses`, `spider_scare`) must never be used in the first greeting sequence.
