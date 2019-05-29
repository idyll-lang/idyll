## v4.1

- Fixes bug in multiline codeblocks where leading spaces would be removed
- Adds the `injectThemeCSS` and `injectLayoutCSS` options to `idyll-document`
- Fixes a bug where syntax highlighting with an unknown language would cause a hard crash.
- Adds a Tweet component

# v4

- New, improved default template
- New, more friendly AST schema. It should be easier for developers to make custom compiler extensions and plugins.
- Fixes small bugs in the compiler and runtime.

### Breaking Changes

There are very few breaking changes between version 3 and version 4. The reason for the major version bump is that we completely revamped how the AST is represented internally. This change is only breaking for projects using Idyll plugins, any projects not using plugins should not require any changes to upgrade from v3 to v4. Projects using plugins should update to the latest version of those plugins for them to work with the new AST.

### Upgrading

To grab the latest version of the Idyll CLI tool, run `npm i -g idyll@latest`. Note that idyll stores a local snapshot in each project, so if you want a post created with idyll v3 to use the latest version, you'll have to update the local copy of idyll as well, by running `npm i idyll@latest --save` in the project directory. There shouldn't be any code changes required other than the plugin issue mentioned above.

If you see unexpected errors such as `tree.reduce is not a function` in the browser log, this is due to the v3 AST being cached locally. To fix this run `rm .idyll/browserify*` in your project to clear the cache.

## v3.15

- Adds an in-browser notification when the idyll compiler errors on the command line. This should help prevent some frustration during development.
- Fixes bugs relating to references in Idyll expressions

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

- The input file option shortcut `-f` has been changed to `-i`.
- Deprecated components have been removed, including:
  - `FullScreen`, `Waypoint`, `Feature`, `Panel`
  - these are superseded by `FullWidth`, `Scroller`, and `Stepper` components.
- The path of the static assets that Idyll generates has changed. This will only affect people using a custom HTML template, find the new default template [here](https://github.com/idyll-lang/idyll/blob/master/packages/idyll-cli/src/client/_index.html).

### New Features

- Project generator is now built into the `idyll` command line tool, no more `yo idyll`. Instead run `idyll create` to create a new idyll project.
- No more `npm` scripts (`npm start`, `npm build`, etc) instead do the following:
  - For dev, run `idyll` in the root of your project
  - To build out static files, run `idyll build`
  - To publish to the web, run `idyll publish`, this will give you a unique URL that can be used to share your project.

To see the old v2 docs, visit [https://v2.idyll-lang.org].
