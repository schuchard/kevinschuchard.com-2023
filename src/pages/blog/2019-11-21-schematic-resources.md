---
templateKey: blog-post
title: Schematic Resources
date: 2019-11-21T00:00:00.000Z
description: Libraries and tools for working with Schematics
tags:
  - angular
  - schematics
---

### A few Angular Schematics I've built and worked on

- [Setup Prettier with Angular](https://github.com/schuchard/prettier-schematic)
- [Setup Jest with Angular](https://github.com/briebug/jest-schematic)
- [Creating NGRX Entities](https://github.com/briebug/ngrx-entity-schematic)
- [Development Sandbox for Schematics](https://github.com/schuchard/schematic-starter)
- [Setup Cypress with Angular](https://github.com/briebug/cypress-schematic)

## AST Explorers

- [ts-ast-viewer](https://ts-ast-viewer.com/#code/AIYQ9gtgDmB2CmsAuAKA3gXwJQCgBmArrAMZICWcABONHIqlpWjpZcXAM5IBOBpY3FFG5kAbgEMk8SgQ7xuAZXmiyxeAC5KAVTmLlq+I2asMODEA) - tool for inspecting Typescript AST metadata and provides a query to find a node or token based on the code you provide and highlight.
- [ast-explorer](https://astexplorer.net/) - an tool for inspecting AST metadata but not limited to just typescript.

## Typescript codes

- [Typescript Kind codes](https://github.com/Microsoft/TypeScript/blob/964565e06968259fc4e6de6f1e88ab5e0663a94a/lib/typescript.d.ts#L62)
This enum list can be mapped to an AST's `kind` (or `originalKeywordKind` if you're using [ts-ast-viewer](https://ts-ast-viewer.com/#code/AIYQ9gtgDmB2CmsAuAKA3gXwJQCgBmArrAMZICWcABONHIqlpWjpZcXAM5IBOBpY3FFG5kAbgEMk8SgQ7xuAZXmiyxeAC5KAVTmLlq+I2asMODEA)) value when inspecting a node.

## Manipulation and navigation

- [ts-query](https://github.com/phenomnomnominal/tsquery) - a port of the ESQuery API for TypeScript! TSQuery allows you to query a TypeScript AST for patterns of syntax using a CSS style selector system.
- [ts-morph](https://ts-morph.com/) - This library wraps the TypeScript compiler API so it's simple.
- [VSCode schematic snippets](https://marketplace.visualstudio.com/items?itemName=MikeHuang.vscode-schematics-snippets) - Code snippets collection for writing schematics

## Learning resources other tools

- [Babel Handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md) - Babel works with AST's to read and apply transformations. Other languages available [here](https://github.com/jamiebuilds/babel-handbook)
- [Unified.js](https://unifiedjs.com/) - an interface for processing text with syntax trees and transforming between them.
- [Typescript Architecture Overview](https://github.com/microsoft/TypeScript/wiki/Architectural-Overview)
- [Using Typescript Compiler API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)
