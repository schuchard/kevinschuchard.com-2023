---
templateKey: blog-post
title: Interpolating Schematic files and filenames
date: 2019-05-17T00:00:00.000Z
description:
tags:
  - angular
  - schematic
---

The process of moving and interpolating template files in schematics is extremely powerful. You can provide variables and methods to use in the files and filenames during interpolation. When adding template files there's three common steps to take.

Lets assume the following directory of template files:

```text
files
  ├── __name@dasherize__.component.__style__
  ├── __name@dasherize__.component.html
  ├── __name@dasherize__.component.spec.ts
  └── __name@dasherize__.component.ts
```

1. Use the `url` method to get a `Source` via a relative path to the files folder containing our template files.
2. Then apply the first of two `Rule`'s with the `template` method. This provides the values and methods to be used or interpolated in the files and filenames.
3. Then apply the second `Rule` to move the `Source`, which is everything in the ./files directory, to the root (`./`) of the host that the schematic is running against.

```ts
function addFiles(options: Options): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      template({
        ...options,
      }),
      move('./'),
    ]);

    return chain([mergeWith(templateSource)])(tree, context);
  };
}
```

# Adding custom template values

If you want to provide your own values or methods you can merge them into the `template` method `Rule`.

```ts{4}
const templateSource = apply(url('./files'), [
  template({
    ...options,
    ...{ENV_1: 'some-value'}
  }),
  move('./'),
]);
```

# Using values in files

The Schematics use a similar interpolation concept to Angular in that special characters wrap a value or method and interpolate it. In Angular we accomplish this like so:

```html
<h1>{{name}}</h1>
```

In schematics template files it's slightly different with `<%=` and `%>`.

```html
<h1><%= name %></h1>
```

Note that the spacing inside the wrapping elements doesn't matter after the file is interpolated. You'll end up with:

```html
<h1>Kevin</h1>
```

Methods can also be used if they've been provided as mentioned above with the `template` method.

```html
<h1><%= uppercase(name) %></h1>
```

# Using values in filenames

Filenames operate similarly in how they interpolate both values and methods in the filenames. The main difference is how you signal what part of the file name should be interpolated. In filenames you use a double underscore wrap values and methods.

```text
__name__.component.ts
```

As you might expect, the `__name__` will be interpolated to the match value provided from the `template` method.

Methods are also accessible in the filenames and are called with `@` symbol.

```text
__name@dasherize__.component.ts
```

Here the `name` value will be used in the `dasherize` function and returned. If `name = 'MyApp'` then the above would produce something like `my-app.component.ts`

## Resources

- The Angular CLI component [schematic](https://github.com/angular/angular-cli/tree/master/packages/schematics/angular/component) uses all of the things discussed in this article.
- Checkout my [Schematic Sandbox](https://github.com/schuchard/schematic-starter) for rapidly developing schematics.