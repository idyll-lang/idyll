## v5.4.0

Features: 
- Added support for multiple configurations in package.json [#701](https://github.com/idyll-lang/idyll/pull/701)

Bugfixes:
- Fix bug where an undefined expression could crash the runtime [#704](https://github.com/idyll-lang/idyll/pull/704)
- Make CSV parsing more flexible [#703](https://github.com/idyll-lang/idyll/pull/703)
- Add min heights to components that fetch resources over the network
- Small improvements to theme CSS

### v5.2.1

Bugfix: fix publish command on windows [#695](https://github.com/idyll-lang/idyll/pull/695)

## v5.2.0

Add experimental [project create API](https://github.com/idyll-lang/idyll/pull/690).

## v5.1.0

Features:

- Adds `insertFullWidth` option to markup serializer ([#686](https://github.com/idyll-lang/idyll/pull/686))
- Adds `inlineAuthorView` option to `idyll-document` ([#681](https://github.com/idyll-lang/idyll/pull/681))

Bugfixes:

- General improvements to markup serialization ([#685](https://github.com/idyll-lang/idyll/pull/685), [#684](https://github.com/idyll-lang/idyll/pull/684), [#676](https://github.com/idyll-lang/idyll/pull/676))

### v5.0.1

Bugfixes:

- Improves output of `AST.toMarkup(ast)` function so that extra whitespace is not inserted on repeated calls.

# v5.0

Features:

- Adds `fullWidthSteps` option to the scroller, to make it easier for scroller components steps to take on wider designs

Bugfixes:

- Component resolver is initialized at the start of compile process and when a compiler postprocessor plugin creates a new component in components directory, it won't be available till the next build and the current build fails with component not found error. (See: https://github.com/idyll-lang/idyll/pull/610)

Breaking changes:

- Update header component default behavior to use styles (background color and text color) provided by themes
- Fix the `package.json` options logic so any idyll option can be provided via package.json and

## v4.10

- Add `progress` parameter to the scroller component to make continuos scroll-based animations. ([#601](https://github.com/idyll-lang/idyll/pull/601))
- Support for JSX file extension of components ([#603](https://github.com/idyll-lang/idyll/pull/603))
- new template for slideshows ([#608](https://github.com/idyll-lang/idyll/pull/608))
- new `byline` options for header component ([#599](https://github.com/idyll-lang/idyll/pull/599))

Bugfixes:

- Fix compiler bug with exclamation points ([#604](https://github.com/idyll-lang/idyll/pull/604))
- Fix integration with Vega-Lite

## v4.8

New features:

- Replace uglify with terser ([#591](https://github.com/idyll-lang/idyll/pull/591))

Bugfixes:

- Fix security issue with `csv-parse` ([#594](https://github.com/idyll-lang/idyll/pull/594))

## v4.7

New features:

- Adds support for citations and references ([#575](https://github.com/idyll-lang/idyll/pull/575))

Bugfixes:

- Fix case sensativity in AST modifyNodesByName method ([#574](https://github.com/idyll-lang/idyll/pull/574))
- Fix equation rendering issues ([#579](https://github.com/idyll-lang/idyll/pull/579))
- Fix comment spacing issue ([#578](https://github.com/idyll-lang/idyll/pull/578))

## v4.6

- Adds a [Desmos]() component. ([#547](https://github.com/idyll-lang/idyll/pull/547))
- Fix bug with incorrect components being inserted when using `Asides` & server-side rendering.

## v4.5

- Improves `article-header` style for the blog layout. ([#544](https://github.com/idyll-lang/idyll/pull/544))
- Add `idyll clean` command. This command removes elements from the `.idyll` folder, which is used as a build cache and to store tokens for idyll.pub. ([#540](https://github.com/idyll-lang/idyll/pull/540))
- Add `--no-install` option to `idyll create` so you can generate new posts without running `npm install` (good for use in blogs that share dependencies). ([#539](https://github.com/idyll-lang/idyll/pull/539))
- Make header components autogenerate `id` tags. ([#538](https://github.com/idyll-lang/idyll/pull/538))
- Add a `multipage` template for making blogs and such things. ([#549](https://github.com/idyll-lang/idyll/pull/549))

## v4.4

- Adds loop and switch components (https://github.com/idyll-lang/idyll/pull/524, https://github.com/idyll-lang/idyll/pull/528)
- Adds `[slug]` parameter to template options

## v4.3

- Adds a Tweet component (https://github.com/idyll-lang/idyll/pull/515)
- Fix bug with properties named `text` (https://github.com/idyll-lang/idyll/pull/518)
- Fix positioning of `Aside` component on centered layout (https://github.com/idyll-lang/idyll/pull/520)
- Adds a new "Tutorials" page to the docs (https://github.com/idyll-lang/idyll/pull/521)
- fixes a syntax highlighting bug for custom code blocks (https://github.com/idyll-lang/idyll/pull/523)
- add support for numbers with leading decimal places (https://github.com/idyll-lang/idyll/pull/514)

## v4.2

- Adds `build` option to `idyll publish`
- Adds `template` option to `idyll create`
- Fixes a bug in compiler where spaces were being incorrectly inserted after numbers in text (`12three` would be rendered as `12 three`)
- fix re-rendering issues with `idyll-document`

## v4.1

- Fixes bug in multiline codeblocks where leading spaces would be removed
- Adds the `injectThemeCSS` and `injectLayoutCSS` options to `idyll-document`
- Fixes a bug where syntax highlighting with an unknown language would cause a hard crash.

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
