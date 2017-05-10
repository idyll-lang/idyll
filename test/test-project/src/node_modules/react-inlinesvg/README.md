react-inlinesvg
===============
<a href="https://www.npmjs.com/package/react-inlinesvg" target="_blank">![](https://badge.fury.io/js/react-inlinesvg.svg)</a>

One of the reasons SVGs are awesome is because you can style them with CSS.
Unfortunately, this winds up not being too useful in practice because the style
element has to be in the same document. This leaves you with three bad options:

1. Embed the CSS in the SVG document
    * Can't use your CSS preprocessors (LESS, SASS)
    * Can't target parent elements (button hover, etc.)
    * Makes maintenance difficult
2. Link to a CSS file in your SVG document
    * Sharing styles with your HTML means duplicating paths across your project,
      making maintenance a pain
    * Not sharing styles with your HTML means extra HTTP requests (and likely
      duplicating paths between different SVGs)
    * Still can't target parent elements
    * Your SVG becomes coupled to your external stylesheet, complicating reuse.
3. Embed the SVG in your HTML
    * Bloats your HTML
    * SVGs can't be cached by browsers between pages.
    * A maintenance nightmare

But there's an alternative that sidesteps these issues: load the SVG with an XHR
request and then embed it in the document. That's what this component does.


### Note

The SVG [`<use>`][svg-use-external-source] element can be used to achieve
something similar to this component. See [this article][use-article] for more
information and [this table][use-support] for browser support and caveats.


Usage
-----

```
var Isvg = require('react-inlinesvg');

<Isvg src="/path/to/myfile.svg">
  Here's some optional content for browsers that don't support XHR or inline
  SVGs. You can use other React components here too. Here, I'll show you.
  <img src="/path/to/myfile.png" />
</Isvg>
```


Props
-----

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>src</code></td>
    <td>string</td>
    <td>
      The URL of the SVG file you want to load.
    </td>
  </tr>
  <tr>
    <td><code>wrapper</code></td>
    <td>function</td>
    <td>
      A React class or other function that returns a component instance to be
      used as the wrapper component. Defaults to <code>React.DOM.span</code>.
    </td>
  </tr>
  <tr>
    <td><code>preloader</code></td>
    <td>function</td>
    <td>
      A React class or other function that returns a component instance to be
      shown while the SVG is loaded.
    </td>
  </tr>
  <tr>
    <td><code>onLoad</code></td>
    <td>function</td>
    <td>
      A callback to be invoked upon successful load.
    </td>
  </tr>
  <tr>
    <td><code>onError</code></td>
    <td>function</td>
    <td>
      A callback to be invoked if loading the SVG fails. This will receive a
      single argument: an instance of <code>InlineSVGError</code>, which has
      the following properties:

      <ul>
        <li><code>isHttpError</code></li>
        <li><code>isSupportedBrowser</code></li>
        <li><code>isConfigurationError</code></li>
        <li><code>statusCode</code> (present only if <code>isHttpError</code> is true)</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>uniquifyIDs</code></td>
    <td>boolean</td>
    <td>
      A boolean that tells Isvg to create unique IDs for each icon by hashing it. Default is <code>true</code> but you can alter the behaviour by setting the boolean to <code>false</code>.

      <code>&lt;Isvg uniquifyIDs={false}&gt;&lt;/Isvg&gt;</code>
    </td>
  </tr>
  <tr>
    <td><code>cacheGetRequests</code></td>
    <td>boolean</td>
    <td>
      A boolean that tells Isvg to only request svgs once. Default is <code>false</code> but you can alter the behaviour by setting the boolean to <code>true</code>.

      <code>&lt;Isvg cacheGetRequests={true}&gt;&lt;/Isvg&gt;</code>
    </td>
  </tr>
</table>


Browser Support
---------------

Any browsers that support inlining SVGs and XHR will work. The component goes out of its way to handle IE9's weird XHR support so, IE9 and up get your SVG;
lesser browsers get the fallback.  
We use [httpplease](https://github.com/matthewwithanm/httpplease.js) for XHR requests.

CORS
----

If loading SVGs from another domain, you'll need to make sure it allows [CORS].


XSS Warning
-----------

This component places the loaded file into your DOM, so you need to be careful
about XSS attacks. Only load trusted content, and don't use unsanitized user
input to generate the `src`!


[CORS]: https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS
[svg-use-external-source]: http://css-tricks.com/svg-use-external-source
[use-article]: http://taye.me/blog/svg/a-guide-to-svg-use-elements/
[use-support]: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use#Browser_compatibility
