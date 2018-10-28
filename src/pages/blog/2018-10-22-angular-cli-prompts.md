---
templateKey: blog-post
title: Angular CLI Prompts
date: 2018-10-22T00:00:00.000Z
description: Angular CLI prompts are easy to configure and improve usability and validation
tags:
  - angular
  - cli
  - schematic
---

# Angular 7

The release of Angular 7 brought with it CLI prompts for schematics. This is nothing new for CLI’s in general but improves the user experience for Angular CLI schematics.

![prettier-schematic](../../img/blog/2018-10-22-angular-cli-prompts/prettier-schematic-cli.gif)

# What’s different

Before version 7, the only way to pass schematic configuration options was to append a value or double dash key/values after the schematic like in the following examples

```bash
ng g c newComponent --selector my-new-component
```

This method is probably common for many developers and is used across other CLI’s. In fact, this way still works with the latest changes. If you specify an option like this with a schematic that uses prompts it will skip that prompt and use the value you supplied. +1 for backward compatibility :)

What’s new is that when executing a schematic you will now be prompted for configuration values if the developer has requested them in the collection. This is done inside the schematics `schema.json` file but more on that later.

# What’s better

All this is to say that schematics have now become easier to use and more helpful. Easier in that you will likely not have to remember how a schematic is intended to be used as more schematics begin to leverage prompts. They can now suggest or guide you to the appropriate configuration, reducing the number of flags you have to remember or look up. A schematic can leverage the `enum` type and provide a list of options for the user to select.

They can also reveal new features. For example, did you know there’s a flag when `ng new`’ing an application, `--experimental-ivy`. It “Specifies whether to create a new application which uses the Ivy rendering engine.”

# How to use CLI prompts

If you’re a schematic consumer there’s not much to do. First, you’ll need to upgrade your local `@angular/cli` to version 7.

```bash
npm i -g @angular/cli
```

Once the schematics you use begin leveraging this feature, you’ll see any new prompts your schematic has enabled. There are three new prompts types.

**confirmation** - A yes or no question; ideal for boolean options

**input** - textual input; ideal for string or number options

**list** - a predefined set of items which may be selected

If you’re a schematic author the process is almost just a simple. You’ll want to upgrade your schematic dependencies to their respective @angular version 7. Then in your `schema.json` file, you’ll enable a prompt for each configuration value in one of two ways, longhand, and shorthand.

[Shorthand](https://github.com/angular/angular-cli/blob/fb4e8187824fe66e50b42c16f95458e82b4787a8/docs/specifications/schematic-prompts.md#shorthand-form) is more succinct than [longhand](https://github.com/angular/angular-cli/blob/fb4e8187824fe66e50b42c16f95458e82b4787a8/docs/specifications/schematic-prompts.md#longhand-form) and quite capable across all prompt types so that’s the example I’ll be discussing.

Here’s an example of a schematic configuration option from the `schema.json` file before converting it to a prompt.

```json
"printWidth": {
    "type": "number",
    "description": "Specify the line length that the printer will wrap on.",
    "default": 80
}
```

In order to prompt the user for a selection, you can both provide suggestions and limit the possible choices with the `enum` type. The message displayed to the user is specified in the `x-prompt` field.

```json
"printWidth": {
    "enum": [80, 100, 120, 140],
    "description": "Specify the line length that the printer will wrap on.",
    "default": 80,
    "x-prompt": "Specify the line length that the printer will wrap on (default: 80)"
}
```

For `boolean`'s you likely already have `type: boolean` and/or a `default` value. To enable a prompt just add the `x-prompt` key and value with the prompt and you’re done. Same goes for inputs, given a `”type: string | number | integer”`, add an `x-prompt` key/value and you’re done.

Here's an example diff migrating to CLI prompts - [Github](https://github.com/schuchard/prettier-schematic/commit/c9264171fd71e3adc9a83508ad06f3ca1a506c3c?diff=split)

## Validation

All user responses are validated against the property's schema. For example, string type properties can use a minimum length or regular expression constraint to control the allowed values. In the event the response fails validation, the user will be asked to enter a new value.

*Copy of shorthand table from the prompt [docs](https://github.com/angular/angular-cli/blob/fb4e8187824fe66e50b42c16f95458e82b4787a8/docs/specifications/schematic-prompts.md):*

| Property Schema  | Prompt Type | Notes |
| - | - | - |
| `"type": "boolean"` | `confirmation`  |   |
| `"type": "string"`  | `input`  |   |
| `"type": "number"`  | `input` | only valid numbers accepted  |
| `"type": "integer"` | `input` | only valid numbers accepted  |
| `"enum": [...]` | `list` | enum members become list selections

## CLI prompt example

Here's an example of the CLI prompts from my [Angular Prettier schematic](https://github.com/schuchard/prettier-schematic).

![prettier-schematic](../../img/blog/2018-10-22-angular-cli-prompts/prettier-schematic-cli.gif)

## Resources

- schematic prompt [docs](https://github.com/angular/angular-cli/blob/fb4e8187824fe66e50b42c16f95458e82b4787a8/docs/specifications/schematic-prompts.md)
- schema.json configuration [example](https://github.com/schuchard/prettier-schematic/blob/master/src/prettier/schema.json)