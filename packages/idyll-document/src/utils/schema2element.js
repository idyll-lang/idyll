import { createElement } from 'react';
import { paramCase } from 'change-case';
import DOM from 'react-dom-factories';

const _componentMap = new WeakMap();

export default class ReactJsonSchema {

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
        subSchema.key = typeof subSchema.key !== 'undefined' ? subSchema.key : index;
        Components.push(this.parseSchema(subSchema));
        index++;
      }
    }
    return Components;
  }

  createComponent(schema) {
    const { component, children, text, ...rest } = schema;
    const Component = this.resolveComponent(schema);
    const Children = typeof text !== 'undefined' ? text : this.resolveComponentChildren(schema);
    return createElement(Component, rest, Children);
  }

  resolveComponent(schema) {
    const componentMap = this.getComponentMap();
    let Component = null;
    if (schema.hasOwnProperty('component')) {
      if (schema.component === Object(schema.component)) {
        Component = schema.component;
      } else {
        const split = schema.component.split('.');
        const name = paramCase(split[0]);
        if (componentMap && componentMap[name]) {
          Component = componentMap[name];
          for (let i = 1; i < split.length; i++) {
            Component = Component[split[i]];
          }
          if (Component.hasOwnProperty('default')) {
            Component = Component.default;
          }
        } else if (DOM.hasOwnProperty(name)) {
          Component = schema.component;
        } else {
          throw new Error(`ReactJsonSchema could not find an implementation for: ${schema.component}`);
        }
      }
    } else {
      throw new Error('ReactJsonSchema could not resolve a component due to a missing component attribute in the schema.');
    }
    return Component;
  }

  resolveComponentChildren(schema) {
    return (schema.hasOwnProperty('children')) ?
      this.parseSchema(schema.children) : [];
  }

  getComponentMap() {
    return _componentMap.get(this);
  }

  setComponentMap(componentMap) {
    _componentMap.set(this, componentMap);
  }
}
