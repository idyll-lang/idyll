# mothership [![build status](https://secure.travis-ci.org/thlorenz/mothership.png)](http://travis-ci.org/thlorenz/mothership)

Helps a module find its `package.json` mothership.

```js
var findShip = require('mothership')
  , path = require('path');

findShip(
    path.join(__dirname, 'uno', 'dos', 'tres')
  , function ismothership (pack) {
      return !!(pack.dependencies && pack.dependencies.unodep);
    }
  , function (err, res) {
      if (err) return console.error(err);
      console.log('first mothership', res.path);  // => [..]/example/uno/package.json
  }
)
```

## Installation

    npm install mothership

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
<h4 class="name" id="mothership"><span class="type-signature"></span>mothership<span class="signature">(start, ismothership, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Searches upwards from start for package.json files, asking for each if it is the mothership.
If a mothership is found it calls back with that.
If it reaches the top of the univers it calls back with nothing.</p>
<h5>mothership result</h5>
<ul>
<li><code>path</code>: full path to the <code>package.json</code> that is the mother ship</li>
<li><code>pack</code>: the <code>package.json</code> object, same that was passed to ismothership</li>
</ul>
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
<td class="name"><code>start</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>full path at which to start looking for the mothership</p></td>
</tr>
<tr>
<td class="name"><code>ismothership</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>invoked with the package object, needs to return true if it is the mothership</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with either an error or full path to package.json that is the mothership</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/mothership/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/mothership/blob/master/index.js#L8">lineno 8</a>
</li>
</ul></dd>
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
