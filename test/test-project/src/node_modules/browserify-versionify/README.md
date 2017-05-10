# browserify-versionify

Browserify transform to replace placeholder with package version.

By default, it replaces `__VERSION__` with the version from `package.json` in your source code. E.g. before:

```js
var version = '__VERSION__';
```

after:

```js
var version = '1.0.0';
```

## Usage

From command line:

    browserify -t browserify-versionify

From Node.js:

    browserify().transform('browserify-versionify');

    // Configure (default values shown)
    browserify().transform('browserify-versionify', {
        placeholder: '__VERSION__',
        version: pkg.version
    });

You can also provide a `filter` property to whitelist files to apply the transform to (e.g. `filter: /\.js$/`).

You can also add the transform to your `package.json`:

```json
{
    "browserify": {
        "transform": [
            "browserify-versionify"
        ]
    }
}
```
