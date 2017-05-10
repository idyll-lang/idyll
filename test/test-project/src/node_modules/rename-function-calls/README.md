# rename-function-calls [![build status](https://secure.travis-ci.org/thlorenz/rename-function-calls.png)](http://travis-ci.org/thlorenz/rename-function-calls)

Renames functions calls, but leaves function definitions unchanged.

```js
var code = [ 
    'function log(s)   { console.error(s); }'
  , 'function print(s) { console.log(s); }'
  , 'print(\'hello\');'
  , 'log(\'world\');'
].join('\n')

var rename = require('rename-function-call');
var renamed = rename('log', 'print', code)
console.log(renamed);
```

```
function log(s)   { console.error(s); }
function print(s) { console.log(s); }
print('hello');
print('world');
```
## Installation

    npm install rename-function-calls

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
<h4 class="name" id="rename"><span class="type-signature"></span>rename<span class="signature">(origSrc, fromName, toName)</span><span class="type-signature"> &rarr; {string}</span></h4>
</dt>
<dd>
<div class="description">
<p>Replaces every function call named <code>from</code> with another one that is named <code>to</code>.</p>
<h4>Example</h4>
<p>   rename(src, 'log', 'print');
// =&gt; log(x) becomes print(x)</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>origSrc</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>the original source</p></td>
</tr>
<tr>
<td class="name"><code>fromName</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>name under which function is currently called</p></td>
</tr>
<tr>
<td class="name"><code>toName</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>name to which the function calls should be renamed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/rename-function-calls/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/rename-function-calls/blob/master/index.js#L23">lineno 23</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>source with function calls renamed</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">string</span>
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
