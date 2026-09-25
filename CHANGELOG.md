# Changelog

All notable changes to Mane Control are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- MIT licence, logo, social card and changelog.

### Changed

- README rewritten to the house layout for BB plugins.

## 0.1.2 - 2026-09-19

### Changed

- Fuller store listing: a longer `bb.description` and a new
  `PLUGIN_OVERVIEW.md`.

## 0.1.1 - 2026-09-19

### Fixed

- Ponytail installed as a user skill or from a registry such as skills.sh is
  now detected. Before, only the Ponytail plugin's own skill counted.

## 0.1.0 - 2026-08-31

### Added

- A horse button beside the thread composer that switches Ponytail between
  Off, Lite, Full and Ultra by sending `/ponytail <mode>` into the thread.
- The button shows each thread's mode, and its icon changes with it.
- Messages that are just `/ponytail <mode>` render as `Ponytail · Mode` pills.
- The control is disabled, and mode changes are refused, when Ponytail is not
  installed.
