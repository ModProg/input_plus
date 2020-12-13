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
- [ ] Tab completion
- [ ] Highlighting
- [ ] anything else

## Files

- `mod.ts` Is the main module.
- `utils.ts` Contains some utility functions to make using Input Plus more bearable
- `helpers.ts` Contains some helpers used in the other files.
- `example.ts` Example to showcase Input Plus
- `mod_test.ts` Tests (test with `deno --unstable test mod_test.ts`)
- `deps.ts` Dependecies
- `dev_deps.ts` Development Dependencies
