
## V3

### Breaking Changes

* The input file option shortcut `-f` has been changed to `-i`.
* Deprecated components have been removed, including:
  * `FullScreen`, `Waypoint`, `Feature`, `Panel`
  * these are superseded by `FullWidth`, `Scroller`, and `Stepper` components.
* The path of the static assets that Idyll generates has changed. This will only affect people using a custom HTML template, find the new default template [here](https://github.com/idyll-lang/idyll/blob/master/packages/idyll-cli/src/client/_index.html).

### New Features

* Project generator is now built into the `idyll` command line tool, no more `yo idyll`. Instead run `idyll create` to create a new idyll project.
* No more `npm` scripts (`npm start`, `npm build`, etc) instead do the following:
  * For dev, run `idyll` in the root of your project
  * To build out static files, run `idyll build`
  * To publish to the web, run `idyll publish`, this will give you a unique URL that can be used to share your project.


To see the old v2 docs, visit [https://v2.idyll-lang.org].