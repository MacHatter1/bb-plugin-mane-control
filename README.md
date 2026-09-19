<div align="center">

<img src="assets/logo.png" alt="Mane Control logo" width="112" height="112">

# Mane Control

**Switch [Ponytail](https://github.com/DietrichGebert/ponytail) modes from the thread composer — no slash commands.**

[![BB plugin](https://img.shields.io/badge/BB-plugin-f59e0b?style=flat-square)](https://github.com/MacHatter1/bb-plugin-mane-control)
[![version](https://img.shields.io/github/package-json/v/MacHatter1/bb-plugin-mane-control?style=flat-square&color=f59e0b)](package.json)
[![requires Ponytail](https://img.shields.io/badge/requires-Ponytail-f59e0b?style=flat-square)](https://github.com/DietrichGebert/ponytail)
[![license](https://img.shields.io/github/license/MacHatter1/bb-plugin-mane-control?style=flat-square&color=f59e0b)](LICENSE)

<img src="output/playwright/mane-control-menu.png" alt="Ponytail mode menu open beside the BB composer" width="640">

</div>

## What it does

A horse button sits beside the thread composer. Open it, pick a mode, and the
matching `/ponytail` command goes into the thread straight away — the button
keeps the active mode in view, and its icon changes with it.

| Mode | Sends | Ponytail behaviour |
| --- | --- | --- |
| Off | `/ponytail off` | Disable Ponytail |
| Lite | `/ponytail lite` | Build it, mention the lazier path |
| Full | `/ponytail full` | The practical default ladder |
| Ultra | `/ponytail ultra` | YAGNI with the reins off |

Mode commands in the transcript collapse into compact `Ponytail · Mode` status
pills, with the real command still available underneath.

## Install

```sh
bb plugin install https://github.com/MacHatter1/bb-plugin-mane-control
```

[Ponytail](https://github.com/DietrichGebert/ponytail) must also be installed
and available for the thread's provider. Mane Control accepts the Ponytail
plugin skill, a user skill, or a registry install such as skills.sh. When
Ponytail is missing, the control stays disabled and mode changes are blocked.

Requires BB `>= 0.40`.

## Screenshots

These use disposable fixture data in a real BB thread.

| Thread control | Lite mode | Ultra mode |
| --- | --- | --- |
| ![Mane Control in BB](output/playwright/mane-control-thread.png) | ![Mane Control switched to Lite](output/playwright/mane-control-lite.png) | ![Mane Control switched from Lite to Ultra](output/playwright/mane-control-ultra.png) |

## Development

```sh
npm install
npm test
npm run check
npm run build
bb plugin install .
```

- `src/` — BB server and app entries
- `src/lib/` — shared mode parsing and types
- `test/` — backend and message-recognition checks
- `assets/` — theme-aware horse icons, logo, social preview
- `PLUGIN_OVERVIEW.md` — long-form store overview
- `output/playwright/` — privacy-safe captures from the running BB app

## License

[MIT](LICENSE)
