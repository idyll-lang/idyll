# react-vega

## v2.3.0
- Add props `updateOptions`

## v2.2.0
- Support props `className` and `style`

## v2.1.2
- Makes `createClassFromSpec(name, spec)` works when name is omitted (`createClassFromSpec(spec)`). This is for backward compatibility.

## v2.1.1
- Fix eslint complaints

## v2.1.0
- Implement `shouldComponentUpdate` to check if anything was changed.
- Add static functions `isSamePadding` and `isSameViewport` to `Vega` class.

## v2.0.0
**Very likely to work fine if you are upgrading from 1.x.x.**  There are breaking changes (of the features nobody seems to use) and I almost rewrite the whole thing so I think it is worth being considered a major version. Here are the list of changes:

- Rewrite using preferred method recommended by React. `Vega` component now extends `React.Component` and use `ref` as a function instead of string.
- Add check for props/data changes and only update when necessary.
- Refactor code for clarity
- Remove support for spec as a function
- Add static functions `isSameData`, `isSameSpec` and `listenerName` to `Vega` class.

## v1.1.1
- Fix bug to call `vis.update()` before setting new data

## v1.1.0
- Support function as data and add static `getSpec()`

## v1.0.1
- Avoid clearing data when that field is not set in the input.

## v1.0.0
- Change global export name to `ReactVega` instead of `reactVega`

## v0.1.2
- Fix bug with umd export when using global

## v0.1.1
- Fix bug with umd export when using global

## v0.1.0
- Add support for dynamic spec via `<Vega>` component.

## v0.0.2
- Fix external lib bug

## v0.0.1
- First release