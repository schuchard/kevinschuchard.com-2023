---
templateKey: blog-post
title: Building an Angular Schematic for Jest
date: 2018-07-17T15:04:10.000Z
description: Jest is an alternative testing library that's compatible with Angular but requires some setup. I'll show you how I automated that process with Angular Schematics.
tags:
  - angular
  - schematic
  - jest
---
# Background

Schematics have been around for a little while in the Angular CLI ecosystem and they’ve proven to be immensely beneficial for developers. If you’re unsure of what schematics are, when you run `ng new my-app` or `ng generate component my-comp`, a schematic is responsible for adding and modifying files in your project. Schematics are designed to be extensible and reusable with a simple but powerful pipeable interface. They work by applying transformations to a `Tree` which is generally a representation of the file(s) in your application. By not performing actions directly against your filesystem or host, schematics are able to support dry runs and remove the need to clean up actions if a `Rule` errors somewhere in the chain of your schematic.

# Why

At BrieBug, we decided to build our own schematic that configured unit tests to run with Jest instead of Karma and Jasmine in Angular CLI applications. We’re big proponents of Jest for many reasons but in summary, Jest supports snapshots, interactive watch modes, parallelized tests, and a similar API to jasmine which makes the switch fairly seamless.

# How

First, let's map out what our goals were for the schematic. Simply put, we wanted to configure Jest to execute the unit tests instead of Karma and Jasmine. This involved several steps:
Install Jest and it’s dependencies (jest, jest-preset-angular)
Remove unnecessary devDependencies (karma, karma-*)
Remove unnecessary files (karma.conf.js, test.ts, setup-jest.ts, test-config.helper.ts)
Add supporting Jest files (jest.config.js, )
Update package.json test scripts

## Testing

Before writing any code, I wanted a way to test the schematic against an application as changes were made. It’s possible to write unit tests for schematics but I wanted something similar to an e2e test for a round trip test experience. So in the repo, I checked in an `ng new` application I refer to as the “sandbox”. Checking in an entire app may seem a little heavy or unnecessary, but by placing it under version control, I’m able to execute the schematic against it and easily see the changes that were applied to the sandbox application. I’m also able to verify that the schematic didn’t break anything by running `ng build` and in this case `npm run test` to verify that the tests execute with Jest. Once I make a new change, it's trivial to reset the state of the sandbox app and run the schematic again locally. Setting up this workflow in a single package.json script makes for a nice feedback loop when developing. Full development instructions can be found here.

Once I had the test loop setup and a plan for what needed to be done I started writing schematic code. A schematic describes actions to take against a host based on the `Rule` interface. So a schematic can be organized as a series of `Rule`’s with each `Rule` returning a `Tree` which will contain the changes you’ll apply to the host.

## Modifying files

Reading and modifying files will likely be a common task you’ll implement when writing a schematic and it’s one I did several times with the Jest schematic. First, you’ll likely start by taking the `Tree` and creating a string representation from a Node Buffer. This is done via a method on the `Tree` called `read()` from which we’ll eventually use to create an Abstract Syntax Tree (AST). A simplified example looks like this.

```js
const buffer = tree.read(pkgJson.Path)

const content = buffer.toString();

const packageJson = parseAsJsonAst(content, JsonParseMode.Strict);
```

Once we have the AST node we can search for the properties we’d like to remove or modify. In order to make these changes, we utilize methods that implement a `UpdateRecorder`. Under the hood, this creates a Linked List and manages modifications through the following methods.

```js
export interface UpdateRecorder {
    insertLeft(index: number, content: Buffer | string): UpdateRecorder;
    insertRight(index: number, content: Buffer | string): UpdateRecorder;
    remove(index: number, length: number): UpdateRecorder;
}
```

The AST returns several useful properties for each node in the tree. Here’s an example of `scripts.test` node from the package.json

```js
{
    "kind": "keyvalue",
    "key": {
        "kind": "string",
        "start": { "offset": 130, "line": 7, "character": 4 },
        "end": { "offset": 136, "line": 7, "character": 10 },
        "text": "\"test\"",
        "value": "test",
        "comments": []
    },
    "value": {
        "kind": "string",
        "start": { "offset": 138, "line": 7, "character": 12 },
        "end": { "offset": 147, "line": 7, "character": 21 },
        "text": "\"ng test\"",
        "value": "ng test",
        "comments": []
    },
    "start": { "offset": 130, "line": 7, "character": 4 },
    "end": { "offset": 147, "line": 7, "character": 21 },
    "text": "\"test\": \"ng test\"",
    "comments": []
}
```

The properties we’re interested in are the start and end keys. This information is useful when we need to remove or update properties on our host.

In the Jest schematic, I needed to change the `scripts.test` value in the package.json from `ng test` to `jest`. So once I had access to the `scripts` AST node, I could change the `test` value with the following.

```js
const { end, start } = innerNode;

recorder.remove(start.offset, end.offset - start.offset);
recorder.insertRight(start.offset, JSON.stringify(value));
```

In this example, I take the properties shown above from the AST and provide the starting point and length of characters to `remove()`. Then I insert the new `value`, in this case, “jest”.

In order to use the recorder, you’ll need to indicate that updates are being applied by creating a recorder object that you’ll call the `remove`, and `insertRight` methods from. Once your changes are done, call `commitUpdate` on the `Tree` passing the recorder as an argument. A full example can be found here.

```js
const recorder = tree.beginUpdate(pkgJson.Path);
// ...
tree.commitUpdate(recorder);
```

# Async Schematics

I also faced another decision in determining how to set the latest Jest dependency versions. We didn’t want to hard code a value that required maintenance, so we decided to make an HTTP request to the npm registry and fetch the latest version. We created a method that accepts a package name and returns the latest package version. Mike Brocchi from the Angular CLI team was helpful in guiding our decision on how to implement this functionality. Fortunately, the input of a Schematic is synchronous, but the output can be asynchronous, and the schematics library will wait for everything to be done before starting the next step. Up to this point, our `Rule`’s have been synchronous, returning a `Tree`. For this `Rule`, we were able to return an `Observable<Tree>` and wait for the HTTP call.

```js
of('jest', 'jest-preset-angular').pipe(
    concatMap((packageName: string) => getLatestNodeVersion(packageName)),
    map((packageFromRegistry: NodePackage) => {
        const { name, version } = packageFromRegistry;

        addPackageJsonDependency(tree, {
            type: NodeDependencyType.Dev,
            name,
            version,
        });

        return tree;
    })
)
```

The source code for `getLatestNodeVersion` can be found here and we have a PR open to the Angular CLI that will hopefully make this functionality available to everyone.

# Template files

Another thing I needed to accomplish was adding new files to the host and that process is fairly straightforward. In the repo, I create a folder with the files in their respective locations (1 in the directory root and 2 in the /src folder). These files can be generated with dynamic values in the file and filename if necessary. File contents use a templating syntax, and have methods available for dasherizing or classifying a value.

```js
export class <%= classify(name) %> Component implements OnInit { }
```

Our Jest schematic didn’t require any dynamic values, so I was able to keep things simple and simply move the files into the host.

```js
apply(
    url('./files'),
    [move('./`)]
)
```

Here `apply()` accepts a `Source` and `Rule[]`. For this schematic, I want to copy my “template” files to the host. I pass that path to `url()` and apply a single `Rule` to move the files. Simply put, I’m copying the files to the host relative to the root.

# Resources

A few resources were key to developing this schematic. First was this excellent article in understanding the key concepts and getting started with a simple but working schematic. The others were the Angular CLI, Angular Material, and NgRx schematic source code. If you’re unsure how to achieve something in a schematic, chances are one of those schematic collections has figured it out. Scanning through the different examples is a valuable exercise that will pay off once you start coding.


We’re excited to see this project open-sourced and hope that the community helps us continue to improve and maintain it. Give it a try and let us know what you think. Github stars are welcomed and if you see any issues or ways to improve the schematic, please file an issue. You can use the schematic in you Angular CLI applications by running:

```bash
ng add @briebug/jest
```

Or install globally:

```bash
npm install -g @briebug/jest
```

Then in any Angular project directory:

```bash
ng g @briebug/jest:jest
```

The source code can be found at: https://github.com/briebug/jest-schematic
