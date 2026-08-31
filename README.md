# Mane Control

> Requires [Ponytail](https://github.com/DietrichGebert/ponytail) to be installed
> and enabled for the thread's provider environment. Mane Control detects the
> `ponytail` skill and blocks mode changes when the prerequisite is missing.

A tiny BB plugin that puts a horse button beside the thread composer. Its menu
immediately switches Ponytail between Off, Lite, Full, and Ultra, and shows the
current selection on the trigger. Mode-command messages render as compact
`Ponytail · Mode` status pills while retaining the real command underneath.

```sh
npm install
npm test
npm run check
npm run build
bb plugin install .
```
