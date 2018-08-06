# What is idyll-ast?

idyll-ast is a library that defines the Abstract Syntax Tree used for Idyll. It is a JSON based AST,
and the structure is defined by this <a href="src/ast.schema.json">schema</a>.

# Getting Started

You can install idyll-ast by both `npm` and `yarn`.

```
//using npm
npm instal --save idyll-ast

//using yarn
yarn add idyll-ast
```

We recommend using --save to add all the dependencies required for idyll-ast to your package.json file.

# Structure

The ast structure used, is defined by <a href="http://json-schema.org/"> JSON schema (Draft-6)</a>, and the current schema is at `src/ast.schema.json`.

Let's take a look at an example:

```
## This is a header
And this is a normal paragraph. This is # not a header.

```

The above Idyll syntax would look like the following when in ast form:

```
{
    "id": 0,
    "type": "component",
    "name": "root",
    "children": [
        {
            "id": 1,
            "type": "component",
            "name": "h2",
            "children": [
                {
                    "id": 2,
                    "type": "textnode",
                    "value": "This is a header"
                }
            ]
        },
        {
            "id": 3,
            "type": "component",
            "name": "p",
            "children": [
                {
                    "id": 4,
                    "type": "textnode",
                    "value": "And this is a normal paragraph. This is # not a header."
                }
            ]
        }
    ]
}

```

All the data in the tree is encapsulated by the node called `root`. All the top-level components in the document are considered the children of the root.

## Type

There can be 5 different types of nodes in the AST.

  1. **component** : Represents an Idyll component.
  2. **textnode**: Represents an Idyll textnode.
  3. **var**: Represents a variable declaration in Idyll.
  4. **derive**: Represents  
  5. **data**: Represents a data field in Idyll.
