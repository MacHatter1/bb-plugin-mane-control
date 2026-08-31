# Mane Control

> Requires [Ponytail](https://github.com/DietrichGebert/ponytail) to be installed
> and enabled for the thread's provider environment. Mane Control detects the
> `ponytail` skill and blocks mode changes when the prerequisite is missing.

A tiny BB plugin that puts a horse button beside the thread composer. Its menu
immediately switches Ponytail between Off, Lite, Full, and Ultra, and shows the
current selection on the trigger. Mode-command messages render as compact
`Ponytail · Mode` status pills while retaining the real command underneath.

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
- `output/playwright/` — privacy-safe captures from the running BB app

```sh
npm install
npm test
npm run check
npm run build
bb plugin install .
```
