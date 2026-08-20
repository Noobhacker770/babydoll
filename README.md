# A Little Universe

A client-side React + TypeScript interactive romantic mini-world.

## Netlify deployment

This repository is already configured for Netlify.

1. Upload this folder to GitHub, or drag the folder/ZIP into Netlify's deploy UI.
2. If Netlify asks for build settings, use:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Node 22 is configured in `netlify.toml`.

For Git-based deployment, Netlify will install dependencies and run the build automatically.

## Local run

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Personalize

Edit `src/main.tsx`, near the top, inside `CONFIG`:
- `HER_NAME`, `YOUR_NAME`, `NICKNAME`
- colors and greeting
- final reveal lines
- custom compliments
- optional relationship date, music and asset paths

The site uses client-side state and localStorage. No backend or analytics is required.

## Included

- 18 interactive worlds
- slap/bonk game
- arcade, garden, cafe, cloud, cozy room, carnival, music box, chocolate factory
- pet room, dance stage, mystery puzzles, compliment machine, forbidden button, quiz
- achievement castle and moonlight room
- collectible progression and hidden final portal
- cinematic final reveal
- persistence, reset and replay
- responsive touch-first UI
- reduced-motion support
- Netlify configuration
