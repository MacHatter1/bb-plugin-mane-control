# Mane Control

Flips Ponytail between Off, Lite, Full, and Ultra from a horse button beside
the thread composer. Choosing a mode sends `/ponytail` into the thread and
keeps the active mode on the control. Mode-command messages render as compact
`Ponytail · Mode` status pills in the transcript.

> Requires [Ponytail](https://github.com/DietrichGebert/ponytail) for the
> thread's provider. Mane Control detects the `ponytail` skill from a plugin
> install, a user skill, or a registry install such as skills.sh, and blocks
> mode changes when it is missing.

## Showcase

These screenshots use disposable fixture data in a real BB thread.

| Thread control | Mode menu |
| --- | --- |
| ![Mane Control in BB](output/playwright/mane-control-thread.png) | ![Ponytail mode menu](output/playwright/mane-control-menu.png) |

| Lite mode | Ultra mode |
| --- | --- |
| ![Mane Control switched to Lite](output/playwright/mane-control-lite.png) | ![Mane Control switched from Lite to Ultra](output/playwright/mane-control-ultra.png) |

## Project layout

- `src/` — BB server and app entries
- `src/lib/` — shared mode parsing and types
- `test/` — backend and message-recognition checks
- `assets/` — theme-aware horse icons
- `PLUGIN_OVERVIEW.md` — long-form store overview
- `output/playwright/` — privacy-safe captures from the running BB app

```sh
npm install
npm test
npm run check
npm run build
bb plugin install .
```
