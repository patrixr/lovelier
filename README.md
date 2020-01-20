# Lovelier

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

A Love2D reloader with Moonscript support.

## Dependencies

* [Love2D](https://love2d.org)
* [Moonscript](http://moonscript.org) (optional)

## Installation

```bash
$> npm install -g lovelier
```

## Usage

```bash
$> lovelier --help

Usage: lovelier [options] [command]

Options:
  -V, --version  output the version number
  -m, --moon     use moonscript
  -b, --bin      love binary path
  -h, --help     output usage information

Commands:
  dev <folder>   run the game in development mode
```

### Running your Love2D Project

```bash
$> cd myProject
$> lovelier dev .
```

#### With Moonscript

```bash
$> cd myProject
$> lovelier --moon dev .
```

#### With a specific Love2D path

```bash
$> cd myProject
$> lovelier --bin /usr/local/bin/love dev .
```