Thank you for your interest in contributing to Idyll. Pull requests are very welcome!

## What to develop

If you are just getting started with the project, it can be daunting to figure out where to start. We keep a list of open issues with the tags ["help wanted"](https://github.com/idyll-lang/idyll/issues?q=is%3Aissue+is%3Aopen+label%3A%22Help+Wanted%22) and ["good first PR"](https://github.com/idyll-lang/idyll/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+First+PR%22). If you would like to work on a specific issue, feel free to post questions about it on Github or our [chatroom on Gitter](https://gitter.im/idyll-lang/Lobby). Documentation improvements are also highly valued.

## How to develop

### Dev Dependencies

To work with Idyll's codebase, you must have [Lerna](https://github.com/lerna/lerna) and [yarn](https://yarnpkg.com/en/docs/install) installed.

### Repository Overview

This repository is structured as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md), which means it contains several independent modules in one git repository. Each folder in the `packages` directory acts as an independent JavaScript module, and is published and versioned independently on npm.

- [Idyll AST](./packages/idyll-ast/) - Schema definition and utilities for Idyll's abstract syntax tree (AST).
- [Idyll CLI](./packages/idyll-cli/) - The `idyll` command line tool. 
- [Idyll Compiler](./packages/idyll-compiler/) - The idyll compiler: markup goes in, AST comes out.
- [Idyll Components](./packages/idyll-components/) - Front-end component library.
- [Idyll Docs](./packages/idyll-docs/) - The idyll-lang.org website
- [Idyll Document](./packages/idyll-document/) - Idyll's React-based runtime for the browser. AST goes in, article comes out. 
- [Idyll Layouts](./packages/idyll-layouts/) - Choose your article layout.
- [Idyll Template Projects](./packages/idyll-template-projects/) - The template options for `idyll create`. 
- [Idyll Themes](./packages/idyll-themes/) - Choose your article theme.

### Making Changes

#### Installation

- [Fork the repo](https://help.github.com/articles/fork-a-repo/) and [clone it](https://help.github.com/articles/cloning-a-repository/) onto to your computer.
- Run `lerna bootstrap` from inside the `idyll` folder to install the dependencies and link all of the packages together.

#### Testing Changes

To run the test suite, run `yarn test` inside any of the individual packages, or run `lerna run test` at the top-level to run all tests. 
To test in a local Idyll project, follow these steps:
- For each individual package you'd like to test:
  - Make the changes. Run `yarn run build` within the package that you changed to generate compiled output. To rebuild the package on changes, use `yarn run dev`.  
  - Run `yarn link` from within the root of that package. For example, to test the command line tool, run `cd packages/idyll-cli && yarn link`. _Note you only ever have to run this command once in each package._
- Create a new idyll project using `idyll create`
- Enter that project's folder, e.g. `cd <idyll-project-name>`
- For each of the packages you are testing, link by running `yarn link <package name>` (e.g. `yarn link idyll`, `yarn link idyll-components`).
- Then run `idyll` to open the project in a browser.

#### Submitting a PR

- Make your changes.
- Make sure the tests pass by running `lerna run test` from the top level. If you add a feature, add a test for it.
- Push to your fork on GitHub and creating a [pull request](https://github.com/idyll-lang/idyll/pulls)!

### Code Style

We use [prettier](https://prettier.io/) for code formatting. Check out the prettier website for details
on integrations with specific text editors.

### How Do I...

#### ...install a new dependency?

Run `yarn add <dependency-name>` from within the package that you want to add the dependency to. Don't run this from the root of the project.

#### ...reset my `node_modules`?

If your dependencies seem to have gotten messed up or out of sync, run `lerna clean && lerna bootstrap` from the root of this repo.

If you have any questions, feel free to open an issue or inquire on https://gitter.im/idyll-lang/Lobby.
