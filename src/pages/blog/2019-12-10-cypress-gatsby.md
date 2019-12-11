---
templateKey: blog-post
title: Configure Cypress with Gatsby
date: 2019-12-10T00:00:00.000Z
description: Configure Cypress to test a Gatsby application with CI/CD.
tags:
  - cypress
  - gatsby
  - ci/cd
---

## install dependencies

```bash
yarn add -D cypress start-server-and-test
```

Once we’re ready to run our tests in a CI/CD environment we’ll need a way to execute our tests but not until the app is available. Ideally this exists in a single script that a build environment like [Netlify](https://www.netlify.com/) can execute in a single script. That’s what [bahmutov/start-server-and-test](https://github.com/bahmutov/start-server-and-test) will allow us to do. There are several ways to use this library but we’ll use the shorthand `start-test` in the following manner.

```bash
start-test serve 8000 cy:run
```

Which does the following:

- `start-test`: runs the library `start-server-and-test`
- `serve`: package.json script that does a prod build then serves the application on port `8000`
- `8000`: tells `start-server-and-test` to run the next script once port `8000` is responding
- `cy:run`: package.json script that runs Cypress in headless mode for CI/CD

## Update package.json scripts

Your scripts will likely vary somewhat but will follow the pattern below. A few key scripts are:

- `develop`: your CI/CD provider will call this on new builds or you can locally if you deploy that way followed by any other deployment scripts
- `test:e2e:open`: run in interactive mode when writing new tests or debugging broken tests
- `test:e2e:run`: run in headless mode as part of your pre-deploy process.

```json
"scripts": {
  "clean": "rimraf .cache public",

  # serve local development build
  "start": "gatsby develop",

  # production build
  "build": "yarn clean && gatsby build",

  # serve local production build (change to port 8000 so Cypress works with prod & none prod builds)
  "serve": "yarn build && gatsby serve -p=8000",

  # run Cypress in headless mode for CI/CD
  "cy:run": "cypress run",

  # run Cypress in an interactive mode
  "cy:open": "cypress open",

  # serve prod app and when port 8000 ready, run Cypress in headless mode
  "test:e2e:run": "start-test serve 8000 cy:run",

  # serve non-prod app and when port 8000 ready, run Cypress in interactive mode
  "test:e2e:open": "start-test start 8000 cy:open",

  # helper for deploying with CI/CD provider
  "deploy": "yarn test:e2e:run && yarn build",
},
```

`cy:run` and `cy:open` are declared in the event that the application is already running. In that case you could run either to execute the Cypress tests.

## Update .gitignore

If you don’t want to track the screenshots and videos produced by Cypress in your git repository you can ignore those files by adding this to your `.gitignore` file.

```text
# cypress
cypress/screenshots
cypress/videos
```

## Add Cypress files

Cypress needs a few folders and files to contain your specs, commands, plugins, etc. The easiest way to add those is to run `cypress open`. The first time you run this command it will create a `cypress` folder with all the necessary files and open the interactive test runner. If you’re new to Cypress take a look and even execute some of the examples located `cypress/integration/examples`. There are some great examples of common tests for a variety of scenarios. If you’d like you can safely delete the `/examples` folder.

You should end up with the following additions to your root directory:

```text
.
├── cypress
│   ├── fixtures
│   │   └── example.json
│   ├── integration
│   │   └── home.js
│   ├── plugins
│   │   └── index.js
│   └── support
│       ├── commands.js
│       └── index.js
├── cypress.json
```

Next, update your `cypress.json` which contains the configuration for your Cypress tests. We’ll use the `baseUrl` property to set our URL base which will make visiting routes much cleaner.

```json
{
  "baseUrl": "http://localhost:8000",
  "viewportHeight": 780
}
```

## Writing your first test

At this point, you should be able to run the tests locally with `yarn test:e2e:open`. Let’s add a test file at `cypress/integration/home.js`. To get you started the following should pass:

```js
describe("Home Page", () => {
  it("should load the site", () => {
    // "baseUrl" set in "cypress.json"
    cy.visit("/");
  });
});
```

`cy.visit("/")` will make a few [assertions](https://docs.cypress.io/api/commands/visit.html#Requirements) one of which is that:

> `cy.visit()` requires the response code to be `2xx` after following redirects.

Assuming your test passes you can begin testing your application with Cypress!
