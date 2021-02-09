# What is idyll-ast?

idyll-ast is a library that defines the Abstract Syntax Tree used for Idyll. It is a JSON based AST,
and the structure is defined by this <a href="src/ast.schema.json">schema</a>.

# Getting Started

You can install idyll-ast by both `npm` and `yarn`.

```
//using npm
npm install --save idyll-ast

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

```js
{ id: 0,
  type: 'component',
  name: 'div',
  children:
   [ { id: 2,
       type: 'component',
       name: 'TextContainer',
       children:
        [ { id: 3,
            type: 'component',
            name: 'h2',
            children: [ { id: 4, type: 'textnode', value: 'This is a header' } ] },
          { id: 5,
            type: 'component',
            name: 'p',
            children:
             [ { id: 6,
                 type: 'textnode',
                 value: 'And this is a normal paragraph. This is # not a header.' } ] } ] } ] }
```

All the data in the tree is encapsulated by the node called `root`. All the top-level components in the document are considered the children of the root.

## Type of Nodes

There can be 5 different types of nodes in the AST.

1. **component** : Represents an Idyll component.
2. **textnode**: Represents an Idyll textnode.
3. **var**: Represents a variable declaration in Idyll.
4. **derive**: Represents a derived variable. In Idyll, it represents a variable whose value is derived from other variables.
5. **data**: Represents a dataset in Idyll. In Idyll, datasets act like variables, but instead of `value`, they have a `source` field.

## Properties

The properties field for each component represent, its attributes or value. The general structure for a properties field is as following:

```json
"properties" : {
    "prop1": {
        "type": "type1",
        "value": "value1"
    },
    "prop2": {
        "type": "type2",
        "value" : "value2"
    }
}

```

The type field can take 3 different values.

1. **value**: This `type` field will evaluate the `value` field as the given property's value.
2. **variable**: This `type` field will evaluate the `value` field as the given property's variables declaration.
3. **expression**: This `type` field will evaluate the `value` field as the given property's expression syntax.

Also, the property key should match the pattern: `` /[^+\-0-9:\s\/\]"'`\.][^:\s\/\]"'`\.]*/ ``

## Children

The children field is an array that contains all the child nodes of a node.
Only **component** nodes can have any children. **textnodes**, **var**, **derive** and **data** nodes should not have any children.

# API

- [idyll-ast](#module_idyll-ast)
  - [~appendNode](#module_idyll-ast..appendNode) ⇒ <code>object</code>
  - [~appendNodes](#module_idyll-ast..appendNodes) ⇒ <code>object</code>
  - [~createNode](#module_idyll-ast..createNode) ⇒ <code>object</code>
  - [~createTextNode](#module_idyll-ast..createTextNode) ⇒
  - [~getChildren](#module_idyll-ast..getChildren) ⇒ <code>Array.&lt;object&gt;</code>
  - [~getNodesByName](#module_idyll-ast..getNodesByName) ⇒ <code>Array.&lt;object&gt;</code>
  - [~getNodesByType](#module_idyll-ast..getNodesByType) ⇒ <code>Array.&lt;object&gt;</code>
  - [~getText](#module_idyll-ast..getText) ⇒ <code>string</code>
  - [~filterNodes](#module_idyll-ast..filterNodes) ⇒ <code>Array.&lt;object&gt;</code>
  - [~modifyChildren](#module_idyll-ast..modifyChildren) ⇒ <code>object</code>
  - [~filterChildren](#module_idyll-ast..filterChildren) ⇒ <code>object</code>
  - [~pruneNodes](#module_idyll-ast..pruneNodes) ⇒ <code>Array.&lt;object&gt;</code>
  - [~modifyNodesByName](#module_idyll-ast..modifyNodesByName) ⇒ <code>object</code>
  - [~handleNodeByName](#module_idyll-ast..handleNodeByName) ⇒ <code>object</code>
  - [~getNodeName](#module_idyll-ast..getNodeName) ⇒ <code>string</code>
  - [~getProperty](#module_idyll-ast..getProperty) ⇒
  - [~getProperties](#module_idyll-ast..getProperties) ⇒ <code>object</code>
  - [~getPropertiesByType](#module_idyll-ast..getPropertiesByType) ⇒ <code>Array.&lt;object&gt;</code>
  - [~prependNode](#module_idyll-ast..prependNode) ⇒ <code>object</code>
  - [~prependNodes](#module_idyll-ast..prependNodes) ⇒ <code>object</code>
  - [~removeNodesByName](#module_idyll-ast..removeNodesByName)
  - [~removeProperties](#module_idyll-ast..removeProperties) ⇒ <code>object</code>
  - [~setProperty](#module_idyll-ast..setProperty) ⇒ <code>object</code>
  - [~setProperties](#module_idyll-ast..setProperties) ⇒ <code>object</code>
  - [~toMarkup](#module_idyll-ast..toMarkup) ⇒ <code>string</code>
  - [~walkNodes](#module_idyll-ast..walkNodes) : <code>function</code>
  - [~walkNodeBreadthFirst](#module_idyll-ast..walkNodeBreadthFirst)

<a name="module_idyll-ast..appendNode"></a>

### idyll-ast~appendNode ⇒ <code>object</code>

Function to append a top-level child to the root element.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - Modifed ast node

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| ast   | <code>object</code> | JSON-object |
| node  | <code>object</code> | JSON-object |

<a name="module_idyll-ast..appendNodes"></a>

### idyll-ast~appendNodes ⇒ <code>object</code>

Function to append multiple top-level children to the root element.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - modified ast

| Param | Type                              | Description              |
| ----- | --------------------------------- | ------------------------ |
| ast   | <code>oject</code>                | JSON-object              |
| node  | <code>Array.&lt;object&gt;</code> | an array of JSON-objects |

<a name="module_idyll-ast..createNode"></a>

### idyll-ast~createNode ⇒ <code>object</code>

Function to create a new AST node following the schema.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - New component node.

| Param    | Type                              | Description                  |
| -------- | --------------------------------- | ---------------------------- |
| id       | <code>integer</code>              | Id of the node               |
| name     | <code>string</code>               | Name of the node.            |
| type     | <code>string</code>               | Type of the node.            |
| value    | <code>string</code>               | Value evaluation of the node |
| props    | <code>Array.&lt;object&gt;</code> | Properties of the node.      |
| children | <code>Array.&lt;object&gt;</code> | Children of the node.        |

<a name="module_idyll-ast..createTextNode"></a>

### idyll-ast~createTextNode ⇒

Function to create a new textnode

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: New textnode

| Param | Type            |
| ----- | --------------- |
| id    | <code>\*</code> |
| value | <code>\*</code> |

<a name="module_idyll-ast..getChildren"></a>

### idyll-ast~getChildren ⇒ <code>Array.&lt;object&gt;</code>

Function to return the children of the passed node.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>Array.&lt;object&gt;</code> - children of the node

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| node  | <code>object</code> | AST node    |

<a name="module_idyll-ast..setChildren"></a>

### idyll-ast~setChildren ⇒ <code>object</code>

Function to set children of the passed node.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - modified node

| Param    | Type                |
| -------- | ------------------- |
| node     | <code>object</code> |
| children | <code>object</code> |

<a name="module_idyll-ast..getNodesByName"></a>

### idyll-ast~getNodesByName ⇒ <code>Array.&lt;object&gt;</code>

Function to get all the nodes with the passed name in the passed AST.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>Array.&lt;object&gt;</code> - Array of nodes matching the name

| Param | Type                | Description       |
| ----- | ------------------- | ----------------- |
| ast   | <code>object</code> | AST object        |
| name  | <code>string</code> | name of the nodes |

<a name="module_idyll-ast..getNodesByName"></a>

### idyll-ast~getNodesByType ⇒ <code>Array.&lt;object&gt;</code>

Function to get all the nodes with the passed type in the passed AST.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>Array.&lt;object&gt;</code> - Array of nodes matching the type

| Param | Type                | Description       |
| ----- | ------------------- | ----------------- |
| ast   | <code>object</code> | AST object        |
| type  | <code>string</code> | type of the nodes |

<a name="module_idyll-ast..hasType"></a>

### idyll-ast~hasType ⇒ <code>boolean</code>

Function to check if a node has type attribute or not

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>boolean</code> - true if type exists, false otherwise

| Param | Type                |
| ----- | ------------------- |
| node  | <code>object</code> |

<a name="module_idyll-ast..getType"></a>

### idyll-ast~getType ⇒ <code>string</code>

Function to get the type information of a node

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>string</code> - type of the node

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| ast   | <code>object</code> | AST object  |

<a name="module_idyll-ast..getText"></a>

### idyll-ast~getText ⇒ <code>string</code>

Function to get all the text from textnodes from the passed AST node

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| ast   | <code>object</code> | AST node    |

<a name="module_idyll-ast..filterNodes"></a>

### idyll-ast~filterNodes ⇒ <code>Array.&lt;object&gt;</code>

Function to find certain nodes based on a filter passed.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>Array.&lt;object&gt;</code> - Array of all the nodes found

| Param  | Type                  | Description                   |
| ------ | --------------------- | ----------------------------- |
| ast    | <code>object</code>   | AST node                      |
| filter | <code>function</code> | Filter function to find nodes |

<a name="module_idyll-ast..modifyChildren"></a>

### idyll-ast~modifyChildren ⇒ <code>object</code>

Function to modify children of a passed AST node using a passed modifier.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - node with modified children.

| Param    | Type                  |
| -------- | --------------------- |
| node     | <code>object</code>   |
| modifier | <code>function</code> |

<a name="module_idyll-ast..filterChildren"></a>

### idyll-ast~filterChildren ⇒ <code>object</code>

Function to pass in a filter function to the children.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - node with modified children

| Param  | Type                  | Description     |
| ------ | --------------------- | --------------- |
| node   | <code>object</code>   | AST node        |
| filter | <code>function</code> | Filter function |

<a name="module_idyll-ast..modifyNodesByName"></a>

### idyll-ast~modifyNodesByName ⇒ <code>object</code>

Function to modify nodes based on the name property.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - ast

| Param    | Type                  |
| -------- | --------------------- |
| ast      | <code>object</code>   |
| name     | <code>string</code>   |
| modifier | <code>function</code> |

<a name="module_idyll-ast..handleNodeByName"></a>

### idyll-ast~handleNodeByName ⇒ <code>object</code>

Function to modify a single node using a modifier and name property.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - if node.name = name then modifier(node), else node.

| Param    | Type                  |
| -------- | --------------------- |
| node     | <code>Object</code>   |
| name     | <code>string</code>   |
| modifier | <code>function</code> |

<a name="module_idyll-ast..getNodeName"></a>

### idyll-ast~getNodeName ⇒ <code>string</code>

Function to get the name of a component

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>string</code> - name of the passed node

| Param | Type                |
| ----- | ------------------- |
| node  | <code>object</code> |

<a name="module_idyll-ast..getPropertyKeys"></a>

### idyll-ast~getPropertyKeys ⇒ <code>Array.&lt;string&gt;</code>

Function to return a the list of property keys of a node

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>Array.&lt;string&gt;</code> - keys

| Param | Type                |
| ----- | ------------------- |
| node  | <code>object</code> |

<a name="module_idyll-ast..getProperty"></a>

### idyll-ast~getProperty ⇒

Getter function to a return a specific property of a node based on a key.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: null, if the property does not exist, else property.data.

| Param | Type                |
| ----- | ------------------- |
| node  | <code>object</code> |
| key   | <code>string</code> |

<a name="module_idyll-ast..getProperties"></a>

### idyll-ast~getProperties ⇒ <code>object</code>

Function to return all the properties of a given node.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - properties of the node, or null if none exists,

| Param | Type            |
| ----- | --------------- |
| node  | <code>\*</code> |

<a name="module_idyll-ast..getPropertiesByType"></a>

### idyll-ast~getPropertiesByType ⇒ <code>Array.&lt;object&gt;</code>

Function to get properties of a particular type of a given node.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>Array.&lt;object&gt;</code> - Array of properties if they exists, or an empty array of no properties of the given type exists.

| Param | Type                |
| ----- | ------------------- |
| node  | <code>object</code> |
| type  | <code>string</code> |

<a name="module_idyll-ast..prependNode"></a>

### idyll-ast~prependNode ⇒ <code>object</code>

Function to prepend a node in the children array of root.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - modfied ast.

| Param | Type                |
| ----- | ------------------- |
| ast   | <code>object</code> |
| node  | <code>object</code> |

<a name="module_idyll-ast..prependNodes"></a>

### idyll-ast~prependNodes ⇒ <code>object</code>

Function to prepend multiple nodes in the children array of root.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - modfied ast.

| Param | Type                              |
| ----- | --------------------------------- |
| ast   | <code>object</code>               |
| nodes | <code>Array.&lt;object&gt;</code> |

<a name="module_idyll-ast..removeNodesByName"></a>

### idyll-ast~removeNodesByName

Function remove node with a particular name from the ast

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)

| Param | Type            |
| ----- | --------------- |
| ast   | <code>\*</code> |
| name  | <code>\*</code> |

<a name="module_idyll-ast..removeProperties"></a>

### idyll-ast~removeProperties ⇒ <code>object</code>

Function to remove a property from a node

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - Modified node

| Param | Type                |
| ----- | ------------------- |
| node  | <code>object</code> |
| key   | <code>string</code> |

<a name="module_idyll-ast..setProperty"></a>

### idyll-ast~setProperty ⇒ <code>object</code>

Function to add a property to a node or change the value if the property already exists.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - Modfied Node

| Param | Type            |
| ----- | --------------- |
| node  | <code>\*</code> |
| name  | <code>\*</code> |
| data  | <code>\*</code> |

<a name="module_idyll-ast..setProperties"></a>

### idyll-ast~setProperties ⇒ <code>object</code>

Function to add multiple properties to a node

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>object</code> - Modified node

| Param      | Type                |
| ---------- | ------------------- |
| node       | <code>object</code> |
| properties | <code>object</code> |

<a name="module_idyll-ast..walkNodes"></a>

### idyll-ast~toMarkup ⇒ <code>string</code>

Function to convert an AST back into idyll markup

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)
**Returns**: <code>string</code> - markup string

| Param | Type                |
| ----- | ------------------- |
| node  | <code>object</code> |

<a name="module_idyll-ast..walkNodes"></a>

### idyll-ast~walkNodes

Function to do a depth-first traversal of the AST.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)

| Param | Type                  | Description                      |
| ----- | --------------------- | -------------------------------- |
| ast   | <code>object</code>   | AST node                         |
| f     | <code>function</code> | callback function for each node. |

<a name="module_idyll-ast..walkNodeBreadthFirst"></a>

### idyll-ast~walkNodeBreadthFirst

Function to breadth-first traversal on the AST.

**Kind**: inner property of [<code>idyll-ast</code>](#module_idyll-ast)

| Param | Type                  |
| ----- | --------------------- |
| ast   | <code>object</code>   |
| f     | <code>function</code> |
