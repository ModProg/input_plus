![Test](https://github.com/ModProg/input_plus/workflows/Deno/badge.svg)

# Input Plus

Input Plus is a module for advanced Input (multiline input, tab completion etc.)

You can try it with:

```
deno run --unstable https://deno.land/x/input_plus/example.ts
```

This is currently in early development.

## Implemented Features

- [x] Single line input
- [x] Multi line input
- [x] Tab completion
- [x] Highlighting
- [x] Yes/No Input
- [x] cliInput
  - [ ] More flexible Keywords for autocomplete
  - [ ] Support for highlighting
- [ ] anything else

## Files

- `mod.ts` Is the main module.
- `utils.ts` Contains some utility functions to make using Input Plus more
  bearable
- `helpers.ts` Contains some helpers used in the other files.
- `extensions.ts` Contains the extensions for easier import
- `extensions/*.ts` Implementation of extensions
- `examples/*.ts` Examples to showcase Input Plus
- `tests/*_test.ts` Tests (test with `deno --unstable test`)
- `deps.ts` Dependencies
- `dev_deps.ts` Development Dependencies
