Idyll attempts to adhere to the [open open source](http://openopensource.org/) philosophy as much as reasonably possible. Pull requests are very welcome!

## Dev Dependencies

To work with Idyll's codebase, you must have [Lerna](https://github.com/lerna/lerna) and [yarn](https://yarnpkg.com/en/docs/install) installed.

## Making Changes

To submit a PR do the following:

* [Fork the repo](https://help.github.com/articles/fork-a-repo/) and [clone it](https://help.github.com/articles/cloning-a-repository/) onto to your computer.
* Run `lerna bootstrap` from inside the `idyll` folder to install the dependencies and link all of the packages together.
* Make your changes.
* Test your changes:
  * Make sure the tests pass by running `npm test`. If you add a feature, add a test for it.
  * If you'd like to test these changes in a local Idyll project, first navigate to the `idyll-cli` package locally and run `yarn link`, then you can run `yarn link idyll` inside of your project, and your local dev version of idyll will be used.
* Submit the PR!

If you have any questions, feel free to open an issue or inquire on https://gitter.im/idyll-lang/Lobby.
