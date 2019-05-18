---
templateKey: blog-post
title: Interpolating Schematic files and filenames
date: 2019-05-17T00:00:00.000Z
description:
tags:
  - angular
  - schematic
---

The process of moving and interpolating template files in schematics is extremely powerful. You can provide variables and methods to use in the files and filenames during interpolation which is very similar to what's available in Angular components.

# Adding files

When adding template files there's generally three common steps to take. Lets assume the following directory of template files that our example schematic will use.

```text
files
  ├── __name@dasherize__.component.__style__
  ├── __name@dasherize__.component.html
  ├── __name@dasherize__.component.spec.ts
  └── __name@dasherize__.component.ts
```

1. Use the `url` method to get a `Source`. This is a relative path to the ./files folder containing our template files above.
2. Then apply the first of two `Rule`'s with the `template` method. This provides the values and methods to be used or interpolated in the files and filenames.
3. Lastly apply the second `Rule` to `move` the `Source` to the root of the host application that the schematic is running against. This is everything in the ./files directory above. In this example we're hard coding the path in `move('./')` but this could also be dynamically set.

```ts{3-7}
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

If you want to provide your own values or methods you can merge them into the `template` method `Rule`. These could be custom values, helper functions or conditional variables for decision logic inside the template files and filenames.

```ts{4}
const templateSource = apply(url('./files'), [
  template({
    ...options,
    ...{ENV_1: 'some-value'},
     'if-flat': (s: string) => options.flat ? '' : s,
  }),
  move('./'),
]);
```

# Using values in files

Schematics use a similar interpolation concept to Angular in that special characters wrap a value or method and interpolate it. In Angular we accomplish this like so.

```html
<h1>{{ name }}</h1>
```

In schematic template files it's slightly different with `<%=` and `%>`.

```html
<h1><%= name %></h1>
```

Note that the spacing inside the wrapping elements doesn't matter after the file is interpolated. If `name = 'Michael Scott'` you'll end up with.

```html
<h1>Michael Scott</h1>
```

Methods can also be used if they've been provided as mentioned above with the `template` method.

```html
<h1><%= uppercase(name) %></h1>
```

# Using values in filenames

Filenames operate similarly in how they interpolate both values, methods, and conditionals. The main difference is how you signal what part of the filename should be interpolated. In filenames you use a double underscore to wrap values and methods.

```text
__name__.component.ts
```

As you might expect, the `__name__` will be interpolated to the match value provided from the `template` method.

Methods are also accessible in the filenames and are called with the `@` symbol.

```text
__name@dasherize__.component.ts
```

Here the `name` value will be used in the `dasherize` function and returned. If `name = 'MyApp'` then the above would produce something like `my-app.component.ts`

# Conditional template logic

Templates can use values provided in the `template` method to make logical decisions. This could look like deciding when to add or remove code inside the templates. Lets look at a snippet from the Angular component schematic [template file](https://github.com/angular/angular-cli/blob/master/packages/schematics/angular/component/files/__name%40dasherize%40if-flat__/__name%40dasherize__.component.ts.template). At first glance, this may look like a jumbled mess. However, if you look closely you'll see the familiar wrapping elements from before, `<%=` and `%>`.

```ts
@Component({
  selector: '<%= selector %>',<% if(inlineTemplate) { %>
  template: `
    <p>
      <%= dasherize(name) %> works!
    </p>
  `,<% } else { %>
  templateUrl: './<%= dasherize(name) %>.component.html',<% } if(inlineStyle) { %>
  styles: []<% } else { %>
  styleUrls: ['./<%= dasherize(name) %>.component.<%= style %>']<% } %><% if(!!viewEncapsulation) { %>,
  encapsulation: ViewEncapsulation.<%= viewEncapsulation %><% } if (changeDetection !== 'Default') { %>,
  changeDetection: ChangeDetectionStrategy.<%= changeDetection %><% } %>
})
```

While this template file as a whole is not executable in it's current form, you can think of the code between the `<%=` and `%>` elements as being so. So if we look at the style conditionals we can see that it's a basic `if` / `else` block.

```ts
templateUrl: './<%= dasherize(name) %>.component.html',<% } if(inlineStyle) { %>
styles: []<% } else { %>
styleUrls: ['./<%= dasherize(name) %>.component.<%= style %>']<% } %><% if(!!viewEncapsulation) { %>,
```

- `if` the `inlineStyle` value is truthy, it prints the styles Array property, `styles: []`, whose closing bracket is on the next line
- `else` it prints the `stylesUrls` property and interpolates the `dasherize`d file `name` and `style` file extension.

# Conditional file logic

If you've run the Angular CLI schematics you've likely seen an option called `--flat`, which usually is a "Flag to indicate if a dir is created". This is useful when you want to add a conditional check to the creation of a directory. If we provide a `template` method called `if-flat`, it can be used in the filename. In this example, it will either use the folder it's applied on to create a directory or add the directory contents without the containing folder.

```ts
template({
  ...options,
   'if-flat': (s: string) => options.flat ? '' : s,
}),
```

Once that method is available it can be used on a directory.

```text
files/__name@dasherize@if-flat__
```

Test this functionality out by creating an Angular CLI component schematic with different `--flat` options

```bash
ng g c flatA --flat=false
ng g c flatB --flat=true
```

## Resources

- The Angular CLI component [schematic](https://github.com/angular/angular-cli/tree/master/packages/schematics/angular/component) uses all of the things discussed in this article.
- Checkout my [Schematic Sandbox](https://github.com/schuchard/schematic-starter) for rapidly developing schematics.