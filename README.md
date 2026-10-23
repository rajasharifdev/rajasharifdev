# rajasharifdev

Portfolio site for Raja Umer Sharif. Plain JavaScript + Vite, with a Three.js / GLSL particle system that morphs into a different shape for each section as you scroll.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static output in dist/ — deploy to Netlify, Vercel, GitHub Pages, etc.
```

## Editing content

All content lives in [`src/data/profile.js`](src/data/profile.js). You shouldn't need to touch any other file.

- `person`: name, email, phone, location, résumé link, social links. Empty fields are hidden.
- `experience`: work history. The highlights are written so they read correctly for every role.
- `roles`: one preset per kind of portfolio:

| key        | Use for                 |
| ---------- | ----------------------- |
| `ai`       | AI / LLM developer      |
| `mern`     | MERN / full stack JS    |
| `dotnet`   | C# / .NET developer     |
| `frontend` | Front end / UI engineer |

  Each preset sets its own job titles, headline, summary, skill groups, the tech stack shown under each job, sample projects and colour theme. The WebGL scene picks up the theme colours too.

### Choosing a role

- Set `site.defaultRole` for the deployed site, **or**
- link to a specific variant with `?role=ai`, `?role=mern`, `?role=dotnet` or `?role=frontend`.

During `npm run dev`, a role switcher appears in the nav so you can preview every preset. To show it in production, set `site.showRoleSwitcher: true` or add `?switcher` to the URL.

### Adding a new role

Copy one of the presets in `roles`, give it a new key (for example `python`) and edit it. It appears in the switcher automatically.

## WebGL

- `src/webgl/scene.js` — renderer, scroll-driven morphing, mouse interaction and bloom. The `STATES` array sets where each section's shape sits.
- `src/webgl/shapes.js` — the shapes: sphere, torus knot, wave field, DNA helix, galaxy, and the monogram drawn as text.
- `src/webgl/shaders.js` — GLSL for the particles, the aurora background and the floating dust.

Performance:
- Phones get fewer particles and no bloom.
- Users with `prefers-reduced-motion` get slower, calmer motion.
- Browsers without WebGL 2 get a CSS gradient background instead.
