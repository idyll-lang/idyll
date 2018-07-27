Idyll attempts to adhere to the [open open source](http://openopensource.org/) philosophy as much as reasonably possible. Pull requests are very welcome!

## Dev Dependencies

To work with Idyll's codebase, you must have [Lerna](https://github.com/lerna/lerna) and [yarn](https://yarnpkg.com/en/docs/install) installed.

## Repository Overview

This repository is structured as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md), which means it contains several independent modules in one git repository. Each folder in the `packages` directory acts as an indipendent JavaScript module, and is published and versioned independently on npm. 

## Making Changes

To submit a PR do the following:

* [Fork the repo](https://help.github.com/articles/fork-a-repo/) and [clone it](https://help.github.com/articles/cloning-a-repository/) onto to your computer.
* Run `lerna bootstrap` from inside the `idyll` folder to install the dependencies and link all of the packages together.
* Make your changes.
* Test your changes:
  * Make sure the tests pass by running `lerna run test` from the top level. If you add a feature, add a test for it.
    * This runs all the tests; if you just want to run tests in a single package, run `yarn test` inside of the specific `packages/idyll-<package-name>` folder.
  * If you'd like to test these changes in a local Idyll project, first navigate to the `idyll-cli` package locally and run `yarn link`, then you can run `yarn link idyll` inside of your project, and your local dev version of idyll will be used.
* Submit the PR!

### How Do I...

#### ...install a new dependency?

Run `yarn add <dependency-name>` from within the package that you want to add the dependency to. Don't run this from the root of the project.

#### ...reset my `node_modules`?

If your dependencies seem to have gotten messed up or out of sync, run `lerna clean && lerna bootstrap` from the root of this repo.

If you have any questions, feel free to open an issue or inquire on https://gitter.im/idyll-lang/Lobby.
