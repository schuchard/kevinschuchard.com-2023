---
templateKey: blog-post
title: Configuring Typescript 3.7 with Prettier
date: 2019-11-12T00:00:00.000Z
description: Getting those new features in Typescript 3.7 to work with Prettier
tags:
  - typescript
  - prettier
---

# Typescript

Typescript 3.7 brought some long awaited changes, such as [Optional Chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining) and [Nullish Coalescing](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing) among other things. When I upgraded my first project to try out the new features, my trusty formatter I use with all of my [projects](https://github.com/schuchard/prettier-schematic), [Prettier](https://prettier.io/), immediately stopped working.

```bash
✖ prettier --write found some errors. Please fix them and try committing again.

[error] src/index.ts: SyntaxError: Expression expected. (66:31)
[error]   65 |     switchMap(() => {
[error] > 66 |       const project = context?.target?.project;
```

A quick search revealed that a fix was in the works, [targeted](https://github.com/prettier/prettier/issues/6595#issuecomment-551146688) for the next day in fact.

# Solution

Install Prettier `1.19`, release [notes](https://prettier.io/blog/2019/11/09/1.19.0.html).
