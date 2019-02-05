
## v3.13

- Add additional methods to exported `idyll` object, including `getComponents` and `getDatasets` to facilitate programatic interaction with Idyll projects.

## v3.12 

- Add `onMount` event to the context used by `idyll-document`

## v3.11

- Use prettier for code formatting
- Add `update-notifier` to CLI tool
- Fix bug in handling conflicts between options specified on the command line and in `package.json`

## v3.10

- Fix bug in runtime context initialization
- Add missing component metadata

## v3.9

- Fix bug in idyll text-container styles.

## v3.8

- Add `YouTube` component.

#### 3.8.1

- Bugfix for crash when a non-existent styles or theme/layout is attempted to be used.
- Improvements to the radio button component

## v3.7

- Adds option to specify idyll output filenames. Changes default output to not have leading underscores, so they work better on GitHub.

## v3.6

- Adds `alias` option

## v3.5

- Adds "autolinkification" logic to compilers (things which look like links will automatically be treated as such).
- Adds new `Conditional` component to standard lib

## v3.4

- Add options for `googleFonts` and `favicon`.

## v3.3

- Small updates to the default project templates

## v3.2

- Updates idyll runtime to use Object proxies rather than directly calling `setState`, this fixes a handleful of bugs related to asynchronous updates in Idyll expressions.

# V3

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
