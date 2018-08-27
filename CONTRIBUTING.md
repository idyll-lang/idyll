Thank you for your interest in contributing to Idyll. Pull requests are very welcome!

## What to develop

If you are just getting started with the project, it can be daunting to figure out where to start. We keep a list of open issues with the tags ["help wanted"](https://github.com/idyll-lang/idyll/issues?q=is%3Aissue+is%3Aopen+label%3A%22Help+Wanted%22) and ["good first PR"](https://github.com/idyll-lang/idyll/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+First+PR%22). If you would like to work on a specific issue, feel free to post questions about it on Github or our [chatroom on Gitter](https://gitter.im/idyll-lang/Lobby). Documentation improvements are also highly valued.

## How to develop

### Dev Dependencies

To work with Idyll's codebase, you must have [Lerna](https://github.com/lerna/lerna) and [yarn](https://yarnpkg.com/en/docs/install) installed.

### Repository Overview

This repository is structured as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md), which means it contains several independent modules in one git repository. Each folder in the `packages` directory acts as an independent JavaScript module, and is published and versioned independently on npm. 

### Making Changes

To submit a PR do the following:

* [Fork the repo](https://help.github.com/articles/fork-a-repo/) and [clone it](https://help.github.com/articles/cloning-a-repository/) onto to your computer.
* Run `lerna bootstrap` from inside the `idyll` folder to install the dependencies and link all of the packages together.
* Make your changes.
* Test your changes:
  * Make sure the tests pass by running `lerna run test` from the top level. If you add a feature, add a test for it.
    * This runs all the tests; if you just want to run tests in a single package, run `yarn test` inside of the specific `packages/idyll-<package-name>` folder.
  * If you'd like to test these changes in a local Idyll project, follow these steps:
    * For each individual package you'd like to test: 
      * Make the changes. Run `yarn run build` within the package that you changed to generate compiled output.
      * Run `yarn link` from within the root of that package. For example, to test the command line tool, run `cd packages/idyll-cli && yarn link`. *Note you only ever have to run this command once in each package.* 
    * Create a new idyll project using `idyll create`
    * Enter that project's folder, e.g. `cd <idyll-project-name>` 
    * For each of the packages you are testing, link by running `yarn link <package name>` (e.g. `yarn link idyll`, `yarn link idyll-components`).
    * Then run `idyll` to open the project in a browser. 
* Submit the PR!

### How Do I...

#### ...install a new dependency?

Run `yarn add <dependency-name>` from within the package that you want to add the dependency to. Don't run this from the root of the project.

#### ...reset my `node_modules`?

If your dependencies seem to have gotten messed up or out of sync, run `lerna clean && lerna bootstrap` from the root of this repo.

If you have any questions, feel free to open an issue or inquire on https://gitter.im/idyll-lang/Lobby.
