import React from 'react';
import Link from 'next/link';
import markdown from 'markdown-in-js';
import Layout from '../../components/layout';

const Content = () => markdown`
# Using HTML Tags in Idyll

Idyll supports a variety of HTML tags, although the syntax for using these tags in Idyll differs a bit from plain HTML.

#### Contents

- [General Syntax Changes](#General)
  - [Tag Syntax](#Tags)
    - [Singular Tags](#Singular)
  - [Attribute Assignment](#Attributes)
    - [Hyphenated Attributes & Properties](#Hyphenated)
    - [Attributes Allowing Multiple Properties](#Multiple)
    - [Calling Classes](#Calling)
- [Creating and Calling Classes](#Classes)
  - [Where to Define Classes](#Where)
  - [CSS Syntax](#CSS)
    - [Useful Properties](#Properties)
- [Inline Styles](#Inline)
- [Other Tags](#Other)
  - [Text Formatting](#Text)
  - [Lists](#Lists)
  - [Other Formatting](#Misc)

## <a name="General">General Syntax Changes</a>

For those familiar with HTML, below is a summary of changes from normal HTML syntax.

### <a name="Tags">Tag Syntax</a>

Enclose tags in square brackets instead of angular ones:

~~~
[i]This text will be italicized using HTML italicization.[/i]
~~~

Renders: _This text will be italicized using HTML italicization._

#### <a name="Singular">Singular Tags</a>

If you are using a tag that does not have separate opening and a closing tags &mdash;
for instance, the \`\<br\>\` tag to force a line break &mdash;
put a slash at the end, as in \`\[br /\]\`.

### <a name="Attributes">Attribute Assignment</a>

Replace any \`=\` you might normally use when assigning attributes with a \`:\`, as below:

~~~
[a href:'http://google.com']Google[/a]
~~~

Renders: <a href='http://google.com'>Google</a>

#### <a name="Hyphenated">Hyphenated Attributes & Properties</a>

Any attribute or property that would be hyphenated in HTML &mdash;
\`background-color\`, for example &mdash;
now has the second word capitalized and the hyphen removed (\`backgroundColor\`).

#### <a name="Multiple">Attributes Allowing Multiple Properties</a>

Attributes which allow multiple properties have several differences.
First, instead of using "quotes," surround the list of properties with backticks, then, within that, list them inside curly braces.
Separate properties with commas instead of semicolons,
and pass in all individual values as strings (with single or double quotes).

For instance, use:

~~~
[div style:\\\`{backgroundColor: 'green', padding: '20px'}\\\`]Some text[/div]
~~~

to generate a div with a green background and 20 pixels of padding on each side:

<div style={{backgroundColor:'green',padding:'20px'}}>Some text</div>

#### <a name="Calling">Calling Classes</a>

If calling a class in, for example, a div, Idyll prefers calling a \`className\` over simply using \`class\`:

~~~shell
[p className:'myclass']Some other text[/p]
~~~

## <a name="Classes">Creating and Calling Classes</a>

While Idyll supports inline styles,
it is often both easier to read and write the source for a page by defining a class.
A class, in HTML or CSS,
is essentially a collection of style attributes that will be used in multiple divs, spans, or paragraph blocks.
The class is assigned a name so that it can easily be called multiple times.

### <a name="Where">Where to Define Classes</a>

Idyll posts are pre-configured to read an editable \`styles.css\` file,
and this file can be found in the top level of the idyll post (the same location as \`index.idyll\`).
You can also use a style section, enclosed in the \`[style]...[/style]\` tags,
which comes after the \`[Header /]\` and before the page's contents.

### <a name="CSS">CSS Syntax</a>

Where the use of inline styles in Idyll differs from HTML,
the syntax for defining classes is the same as it is in CSS.

Define a class by preceding its name with a period,
listing property-value pairs in curly braces,
assigning properties with a colon,
and delimiting property-value pairs with a semicolon:

~~~shell
.myclass {
    property: value;
    property: value;
}
~~~

The above will apply the properties it was given to all elements whose class name is \`myclass\`.
You can assign the class to an object using the \`className\` property, treating the value as a string.
The \`className\` property can be assigned when using \`[div]\`, \`[span]\`, or \`[p]\`.

For example, say you want a style that contrasts with your black text on a white background
and puts some extra space around your text.
You could call that class "contrast" and define it like so:

~~~shell
.contrast {
    background-color: black;
    color: white;
    margin: 20px;
    padding: 20px;
}
~~~

Then you could make a div that uses that class by simply writing:

~~~shell
[div className:'contrast']Some text.[/div]
~~~

And you will see:

<div style={{backgroundColor:'black',color:'white',margin:'20px',padding:'20px'}}>Some text</div>

This can be done with a paragraph (\`[p]\`) or span (\`[span]\`) as well, using the same method.

#### <a name="Properties">Useful Properties</a>

**\`color\`** - Sets the color of the text. Values can be a name (example: \`green\`) or a hex code (example: \`#00ff00\` or \`#0f0\`)

**\`background-color\`** - Sets the background color of the box. Values can be a name (example: \`black\`) or a hex code (example: \`#000000\` or \`#000\`).

**\`margin\`** - Sets a margin between the outside of the box and the other contents. Values can be a number of pixels (example: \`20px\`) or a percentage of the element (example: \`5%\`).
Individual margins can be set using \`margin-top\`, \`margin-bottom\`, \`margin-right\`, and \`margin-left\`. These properties' values otherwise function the same as they do for \`margin\`.

**\`padding\`** - Sets padding between the outside of the box and the box's contents.

**\`font-size\`** - Sets the size of the font. Values can be in pixels (ex: \`14px\`), percentage of a parent element's size (example: \`150%\`), or size category (ex: \`xx-small\`).

**\`font-weight\`** - Sets the weight of the font. While you likely won't be using the values \`normal\` or \`bold\` often, because this can easily be handled through markdown syntax, values can be set to numbers, where the normal weight is 400 and the bold weight is 700.

## <a name="Inline">Inline Styles</a>

There may be cases where you only need to use a certain style once,
and it therefore ends up being easier to use that style "inline" in the tag itself without calling a style.
As in an example above, you can do so like this:

~~~
[div style:\\\`{property: 'value', property: 'value'}\\\`]Some text[/div]
~~~

For example,

~~~
[div style:\\\`{backgroundColor: 'green', padding: '20px'}\\\`]Some text[/div]
~~~

The properties available are the same as those listed [above](#Properties) for CSS,
although any hyphenated properties have the hyphen removed and the second word capitalized
(e.g. \`font-size\` becomes \`fontSize\` when used with inline styling).

## <a name="Other">Other Tags</a>

Below are some other tags that you may find useful.

### <a name="Text">Text Formatting</a>

In the rare case that markdown's asterisks are proving difficult to use,
the \`[i]\` tag can be used to <i>italicize</i> text
and the \`[b]\` tag can be used to <b>bold</b> text.

To <u>underline</u> text, use the \`[u]\` tag.

Use \`[sup]\` to create <sup>superscripts</sup> and \`[sub]\` to create <sub>subscripts</sub>.

The \`[del]\` tag can be used to <del>strikethrough</del>.

#### <a name="Lists">Lists</a>

Currently, markdown syntax in Idyll does not support multiple levels of lists.
HTML's list syntax, however, does allow sub-items in Idyll.
An HTML-style list can be made by:

1. Putting one of these tags at the front of the list:
   - \`[ol]\` to generate ordered lists, like the main one
   - \`[ul]\` to generate unordered lists, like this sub-list
   - (To nest lists, just put a new list where a list item would go!)
2. Putting the \`[li]\` tag before each list item (and \`[/li]\` after)
3. And putting closing the list with an \`[/ol]\` or \`[/ul]\` at the end.

To make the above example in Idyll (Indentation is optional):

~~~shell
An HTML-style list can be made by:
[ol]
  [li]Putting one of these tags at the front of the list:[/li]
  [ul]
    [li] \\\`[ol]\\\` to generate ordered lists, like the main one [/li]
    [li] \\\`[ul]\\\` to generate unordered lists, like this sub-list [/li]
    [li] (To nest lists, just put a new list where a list item would go!) [/li]
  [/ul]
  [li]Putting the \\\`[li]\\\` tag before each list item (and \\\`[/li]\\\` after) [/li]
  [li]And putting closing the list with an \\\`[/ol]\\\` (or \\\`[/ul]\\\`) at the end. [/li]
[/ol]
~~~

### <a name="Misc">Other Formatting</a>

You can force a line
break with \`[br /]\`.

Make horizontal lines with \`[hr /]\`.

---

Both of these tags have a \`/\` at the end of them, indicating that they do not need a closing tag &mdash; just write \`[br /]\`, not \`[br /][/br]\`!
`;

export default ({ url }) => (
  <Layout
    url={url}
    title={'Idyll Documentation | Installation and Getting Started'}
  >
    <Content />
  </Layout>
);
