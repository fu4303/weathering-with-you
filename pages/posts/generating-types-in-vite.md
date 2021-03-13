---
title: Genearting Types in Vite
date: 2021-02-22T16:00:00Z
duration: 5min
description: Proident amet deserunt Lorem est duis veniam officia commodo.
---

I've seen a lot of people recently trying to figure out how to generate types in [Vite's Library Mode](https://vitejs.dev/guide/build.html#library-mode). There are a few ways we can go about this, each with their own tradeoffs. In this article we will explore two methods, tsc and rollup-plugin-typescript2


### Using TSC

The first and easiest method would be to use the typescript compiler and have it emit declarations for your library.
The main thing to be aware of when using this method is that it will not generate types for your Vue SFC, it will only
generate types for your typescript files.

```json
// tsconfig.json

{
  "compilerOptions": {
    "declarationDir": "./dist",
    "declaration": true,
  }
}
```

```json
// package.json

{
  "scripts": {
    "build": "vite build && tsc --emitDeclarationOnly"
  }
}
```

### Using rollup-plugin-typescript2

If you would like to generate types for your Vue SFC, things are going to get a little more complicated. We are going to need to use
[`rollup-plugin-typescript`](https://github.com/ezolenko/rollup-plugin-typescript2). This plugin when run after your Vue SFC are compiled,
so types for all your components will have types generated. The downside of this plugin, is that it is not compatible with `esbuild`, so we are
going to have to get a little tricky with our vite config 

```bash
$ npm i -D rollup-plugin-typescript2
```

```json
// tsconfig.json

{
  "compilerOptions": {
    "declarationDir": "./dist",
    "declaration": true,
  }
}
```

```ts
// vite.config.ts

import { defineConfig } from 'vite'
import ts from 'rollup-plugin-typescript2'

const config = defineConfig({
  plugins: [
    {
      apply: 'build',
      ...ts({
        check: false,
        useTsconfigDeclarationDir: true,
      })
    }
  ]
})

export defauilt({ command }) => ({
  ...config,
  esbuild: command === 'serve'
})
```
