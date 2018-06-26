module.exports = `
# Welcome!

## This application helps you compose Idyll documents.

Type in the textbox on the left, and the output on the right will update. If you want to save your changes, hit the "Save" button that appears in the lower right corner, and a unique URL will be generated. To view your post, click "Fullscreen."

To include components, use the notation \`[Name prop:value /]\`. See the docs for [a list of available components](https://idyll-lang.org/docs/components).

[var name:"count" value:0 /]

[button onClick:\`count++\` style:\`{padding: 10, background: '#ddd', margin: '0 auto', display: 'block', cursor: 'pointer'}\`]
Increment counter
[/button]

You've clicked the button [display var:count format:"d" /] time[display value:\`count === 1 ? '' : 's' \` /].

\`\`\`
[var name:"count" value:0 /]

[button onClick:\`count++\` style:\`/* JS object of styles */\`]
Increment counter
[/button]

You've clicked the button [display var:count format:"d" /] time.
\`\`\`

Use standard markdown syntax for *italics*, **bold**, \`codeblocks\`, and

* lists

Share what you make [on gitter](https://gitter.im/idyll-lang/Lobby).
`
