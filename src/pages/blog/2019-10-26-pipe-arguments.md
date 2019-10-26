---
templateKey: blog-post
title: Dynamic Pipe Parameters in Angular
date: 2019-10-26T00:00:00.000Z
description: How to dynamically change parameters used with Angular Pipes
tags:
  - angular
  - pipes
---

# Angular Pipes

Pipes are [powerful](https://angular.io/guide/pipes) when it comes to transforming data, especially in template files. Lets look at a quick component example.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-birthday',
  template: `<p>The hero's birthday is {{ birthday | date }}</p>`
})
export class HeroBirthdayComponent {
  birthday = new Date(1988, 3, 15); // April 15, 1988
}
```

The pipe we're using in this example is the `date` pipe which is declared after the `|`:

```html
<p>The hero's birthday is {{ birthday | date }}</p>
```

## Pipe Parameters

Pipes are similar to functions in that they can accept multiple parameters separated by a colon (`:`). The `date` pipe accepts a format `string` that controls how a date is displayed.

```html
<p>The hero's birthday is {{ birthday | date:"MM/dd/yy" }} </p>
```

The [docs](https://angular.io/guide/pipes#parameterizing-a-pipe) point out that parameters don't have to be hard coded in templates though.
> The parameter value can be any valid [template expression](https://angular.io/guide/template-syntax#template-expressions)

This means we can control pipe parameters and thus the functionality in a more programmatic and dynamic way instead of hard coding strings. We could for example use a component instance property.

```html
<p>The hero's birthday is {{ birthday | date:format }}</p>
<button (click)="toggleFormat()">Toggle Format</button>
```

## Demo

The following demo shows how we can control a pipes parameters with a component instance property allowing for more control over how a pipe functions.

- [stackblitz](https://stackblitz.com/edit/ng-date-dynamic-props)