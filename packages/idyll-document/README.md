# idyll-document

The Idyll runtime, implemented as a React component.

## Install

```sh
npm install --save idyll-document
```

## Usage

```js
import * as components from 'idyll-components'
<IdyllDocument markup={`# Hello World`} components={components} />
```

## Options

```js
<IdyllDocument
  ast={
    ast
  } /* optional, if you want to pass in a precompiled abstract syntax tree instead of markup */
  components={
    components
  } /* Map of components that may be referenced in markup */
  context={
    context
  } /* Add custom context hooks (see https://idyll-lang.org/docs/advanced-configuration) for more info */
  datasets={datasets} /* Map of datasets that may be referenced in markup */
  layout={layout} /* Which layout to use? e.g. "blog", "centered" */
  markup={markup} /* String of Idyll markup. Must provide either this OR ast */
  theme={theme} /* Which theme to use? e.g. "github" */
/>
```
