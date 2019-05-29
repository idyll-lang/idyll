import React, { createElement } from 'react';
import DOM from 'react-dom-factories';
import { paramCase, pascalCase } from 'change-case';

const _componentMap = new WeakMap();

class ReactJsonSchema {
  constructor(componentMap) {
    if (componentMap) this.setComponentMap(componentMap);
  }

  parseSchema(schema) {
    let element = null;
    let elements = null;
    if (Array.isArray(schema)) {
      elements = this.parseSubSchemas(schema);
    } else {
      element = this.createComponent(schema);
    }
    return element || elements;
  }

  parseSubSchemas(subSchemas = []) {
    const Components = [];
    let index = 0;
    for (const subSchema of subSchemas) {
      if (typeof subSchema === 'string') {
        Components.push(subSchema);
      } else {
        subSchema.key =
          typeof subSchema.key !== 'undefined' ? subSchema.key : index;
        Components.push(this.parseSchema(subSchema));
        index++;
      }
    }
    return Components;
  }

  createComponent(schema) {
    if (schema.type) {
      if (schema.type === 'textnode') return schema.value;
    }
    const { component, children, ...rest } = schema;
    const Component = this.resolveComponent(schema);
    const Children = this.resolveComponentChildren(schema);
    return createElement(Component, rest, Children);
  }

  resolveComponent(schema) {
    const componentMap = this.getComponentMap();
    let Component;
    // bail early if there is no component name
    if (!schema.hasOwnProperty('component')) {
      throw new Error(
        'ReactJsonSchema could not resolve a component due to a missing component attribute in the schema.'
      );
    }

    // if it's already a ref bail early
    if (schema.component === Object(schema.component)) {
      return schema.component;
    }

    const [name, ...subs] = schema.component.split('.');

    // find the def in the provided map
    if (componentMap) {
      Component = componentMap[name];
      if (!Component) Component = componentMap[paramCase(name)];
      if (!Component) Component = componentMap[pascalCase(name)];

      for (let i = 0; i < subs.length; i++) {
        Component = Component[subs[i]];
      }
    }

    // if still nothing found it's a native DOM component or an error
    if (!Component) {
      if (DOM.hasOwnProperty(name)) {
        Component = schema.component;
      } else {
        console.warn(
          `Could not find an implementation for: ${schema.component}`
        );
        return () => (
          <div style={{ color: 'black', border: 'solid 1px red' }}>
            <pre>Could not find an implementation for: {schema.component}</pre>
          </div>
        );
      }
    }

    // if there is a default prop (CommonJS) return that
    return Component.default || Component;
  }

  resolveComponentChildren(schema) {
    const children = schema.hasOwnProperty('children')
      ? this.parseSchema(schema.children)
      : [];
    return children.length ? children : undefined;
  }

  getComponentMap() {
    return _componentMap.get(this);
  }

  setComponentMap(componentMap) {
    _componentMap.set(this, componentMap);
  }
}

export default ReactJsonSchema;
