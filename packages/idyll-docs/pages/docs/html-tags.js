import Link from 'next/link';
import markdown from 'markdown-in-js';
import Layout from '../../components/layout';

const Content = () => markdown`
# Using HTML Tags in Idyll

Idyll supports a variety of HTML tags, although the syntax for using these tags in Idyll differs a bit from plain HTML.

## General Syntax Changes

For those familiar with HTML, below is a summary of changes in syntax for HTML tags.

Enclose tags in square brackets instead of angular ones:

\`\`\`
[i]This text will be italicized using html italicization.[/i]
\`\`\`

*This text will be italicized using html italicization.*

If you are using a tag that does not have separate opening and a closing tags &mdash; 
for instance, the \`\<br\>\` tag to force a line break &mdash; 
put a slash to the end, as in \`\[br /\]\`.

Replace any \`=\` you might find in an HTML tag with a \`:\`, as below:

\`\`\`
[a href:'http://google.com']Google[/a]
\`\`\`
<a href='http://google.com'>Google</a>

Attributes which allow multiple properties have multiple differences. 
First, surround the list of properties with backticks, then within that list them inside curly braces.
Separate properties with commas instead of semicolons,
and pass in all values as strings (with single or double quotes).

For instance, use

\`\`\`
[div style:\\\`{color: 'green', padding: '20px'}\\\`]Some text[/div]
\`\`\`

to generate a div with green text and 20 pixels of padding on each side.

## Creating and Calling Classes

While Idyll supports inline styles, 
it is often both easier to read and write the source for a page by defining a class. 
A class, in HTML or CSS, 
is essentially a collection of style attributes that will be used in multiple divs, spans, or paragraph blocks.
The class is assigned a name so that it can easily be called multiple times.

### Where to Define Classes

Idyll posts are pre-configured to read an editable \`styles.css\` file,
and this file can be found in the top level of the idyll post (the same location as \`index.idyll\`).
You can also use a style section, enclosed in the \`[style]...[/style]\` tags, 
which comes after the \`[Header]\` and before the page's contents.

### CSS Syntax

Where the use of inline styles in Idyll differs from HTML, 
the syntax for defining classes is the same as it is in CSS.

Define a style as follows:

~~~shell
.styleName {
    property: value;
    property: value;
}
~~~

And call it using the \`className\` property, treating the value as a string.
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

This can be done with a div or span as well.

#### Useful Properties
* \`color\` - Sets the color of the text. Values can be a name (example: \`green\`) or a hex code (example: \`#00ff00\` or \`#0f0\`)
* \`background-color\` - Sets the background color of the box. Values can be a name (example: \`black\`) or a hex code (example: \`#000000\` or \`#000\`)
* \`margin\` - Sets a margin between the outside of the box and the other contents. Values can be a number of pixels (example: \`20px\`) or a percentage of the element (example: \`5%\`)
    * Individual margins can be set using \`margin-top\`, \`margin-bottom\`, \`margin-right\`, and \`margin-left\`. Values can be a number of pixels (example: \`10px\`) or a percentage of the element (example: \`10%\`)
* \`padding\` - Sets padding between the outside of the box and the box's contents. 
* \`font-size\` - Sets the size of the font. Values can be in pixels (ex: \`14px\`), percentage of a parent element's size (example: \`150%\`), or size category (ex: \`xx-small\`).
* \`font-weight\` - Sets the weight of the font. While you likely won't be using \`normal\` or \`bold\` often, because this can easily be handled through markdown syntax, values can be set to numbers, where the normal weight is 400 and the bold weight is 700.

## Inline Styles

There may be cases where you only need to use a certain style once, 
and it therefore ends up being easier to use that style "inline" in the tag itself without calling a style.
As in an example above, you can do so like this:

\`\`\`
[div style:\\\`{property: 'value', property: 'value'}\\\`]Some text[/div]
\`\`\`

For example,

\`\`\`
[div style:\\\`{color: 'green', padding: '20px'}\\\`]Some text[/div]
\`\`\`

*Waiting on information from Matthew about whether all behavior is intentional/should be documented before I complete this portion of the writeup.*

## Other Tags

Below are some other miscellaneous tags that you may find useful.

### Text Formatting

For large chunks of text where asterisks can miss or erroneously contain text,
the \`[i]\` tag can be used to <i>italicize</i> text
and the \`[b]\` tag can be used to <b>bold</b> text.

To <u>underline</u> text, use the \`[u]\` tag.

Use \`[sup]\` to create <sup>superscripts</sup> and \`[sub]\` to create <sub>subscripts</sub>.

Use \`[del]\` to <del>strikethrough</del>.

### Other Formatting

You can force a line  
break with \`[br /]\`.

Make horizontal lines with \`[hr /]\`.

---

`;

export default ({ url }) => (
  <Layout
    url={url}
    title={'Idyll Documentation | Installation and Getting Started'}
  >
    <Content />
  </Layout>
);
