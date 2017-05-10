# exposify [![build status](https://secure.travis-ci.org/thlorenz/exposify.png)](http://travis-ci.org/thlorenz/exposify)

browserify transform that exposes globals added via a script tag as modules so they can be required.

```html
<!-- index.html -->
<head>
  <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/three.js/r61/three.min.js"></script>
  <script type="text/javascript" src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
  [..]
```

```js
// main.js
var $ = require('jquery')
  , THREE = require('three')

console.log('THREE revision: ', THREE.REVISION);
console.log('jquery version: ', $().jquery);
```

#### Building via JavaScript

```js
var browserify = require('browserify');

// configure what we want to expose
var exposeConfig = { expose: { jquery: '$', three: 'THREE' } };

browserify()
  .require(require.resolve('./main'), { entry: true })
  .transform('exposify', exposeConfig)
  .bundle({ debug: true })
  .pipe(fs.createWriteStream(path.join(__dirname, 'bundle.js'), 'utf8'))
```

#### Building via Commandline

Using the `EXPOSIFY_CONFIG` environment variable:

```sh
EXPOSIFY_CONFIG='{ "jquery": "$", "three": "THREE" }' browserify --debug -t exposify main.js > bundle.js
```

Or using a Browserify transform option:

```sh
browserify --debug -t [ exposify --expose [ --jquery $ --three THREE ] ] main.js > bundle.js
```

Or use [browserify-shim](https://github.com/thlorenz/browserify-shim) which can [configure exposify in `package.json`](https://github.com/thlorenz/browserify-shim#a-expose-global-variables-via-global) among other features.

## Installation

    npm install exposify

## API

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="exposify::config"><span class="type-signature"></span>exposify::config<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>The config which is used by exposify to determine which require statemtents to replace and how.
You need to set this or provide it via the <code>EXPOSIFY_CONFIG</code> environment variable.</p>
<pre><code class="lang-js"> var b = browserify();
// setting via transform argument
b.transform('exposify', { expose: { jquery: '$', three: 'THREE' } });</code></pre>
<pre><code class="lang-js"> // setting from javascript
exposify.config = { jquery: '$', three: 'THREE' };</code></pre>
<pre><code class="lang-sh"> # setting from command line
EXPOSIFY_CONFIG='{ &quot;jquery&quot;: &quot;$&quot;, &quot;three&quot;: &quot;THREE&quot; }' browserify -t exposify ...</code></pre>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/exposify/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/exposify/blob/master/index.js#L33">lineno 33</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="exposify::expose"><span class="type-signature"></span>exposify::expose<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Exposes the expose function that operates on a string</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/exposify/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/exposify/blob/master/index.js#L78">lineno 78</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="exposify::filePattern"><span class="type-signature"></span>exposify::filePattern<span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Regex pattern of files whose content is exposified</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/exposify/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/exposify/blob/master/index.js#L71">lineno 71</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
<dl>
<dt>
<h4 class="name" id="exposify"><span class="type-signature"></span>exposify<span class="signature">(file, <span class="optional">opts</span>)</span><span class="type-signature"> &rarr; {TransformStream}</span></h4>
</dt>
<dd>
<div class="description">
<p>browserify transform which exposes globals as modules that can be required.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>file</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>file whose content is to be transformed</p></td>
</tr>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>(exposify config), defaults to exposify.config or $EXPOSIFY_CONFIG</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/exposify/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/exposify/blob/master/index.js#L9">lineno 9</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>transform that replaces require statements found in the code with global assigments</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">TransformStream</span>
</dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

MIT
