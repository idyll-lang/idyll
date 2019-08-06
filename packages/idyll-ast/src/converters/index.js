/*
THIS FILE CONTAINS THE CONVERTER FUNCTIONS FOR THE TWO DIFFERENT TYPES OF AST STRUCTURE.
*/

/**
 * This function converts the JSON structured AST (ASTV2) to the array structured
 * AST (OLD AST)
 * @param {*} jsonAst
 * @return Array structred AST
 */
const convertV2ToV1 = jsonAst => {
  let arrayAst = [];
  if (jsonAst.children) {
    jsonAst.children.forEach(element => {
      arrayAst.push(convertHelper(element));
    });
  }
  return arrayAst;
};

/**
 * Helper function for convert
 * @param {*} jsonElement
 * @return array representation of the corresponding jsonElement
 */
function convertHelper(jsonElement) {
  let elementArray = [];
  if (jsonElement.type === 'textnode') {
    return jsonElement.value;
  } else if (jsonElement.type === 'var' || jsonElement.type === 'derived') {
    elementArray = [jsonElement.type];
    elementArray.push([
      ['name', ['value', jsonElement.name]],
      ['value', ['value', jsonElement.value]]
    ]);
    elementArray.push([]);
  } else if (jsonElement.type === 'data') {
    elementArray = ['data'];
    elementArray.push([
      ['name', ['value', jsonElement.name]],
      ['source', ['value', jsonElement.source]],
      ['async', ['value', jsonElement.async]],
      ['initialValue', ['expression', jsonElement.initialValue]]
    ]);
    elementArray.push([]);
  } else {
    elementArray.push(jsonElement.name);
    let propertiesArray = [];
    if ('properties' in jsonElement) {
      Object.keys(jsonElement.properties).forEach(key => {
        let propertyArray = [key];
        propertyArray.push([
          jsonElement.properties[key].type,
          jsonElement.properties[key].value
        ]);
        propertiesArray.push(propertyArray);
      });
    }
    elementArray.push(propertiesArray);
    if ('children' in jsonElement) {
      let childArray = [];
      jsonElement.children.forEach(children => {
        childArray.push(convertHelper(children));
      });
      elementArray.push(childArray);
    }
  }
  return elementArray;
}

/**
 * This function converts the array structred AST (OLD AST) to the new
 * JSON structured ast(ASTV2)
 * @param {*} arrayAst
 * @return Json structred ast correspoding to the arrayAst.
 */
const convertV1ToV2 = arrayAst => {
  let jsonAst = new Object();
  jsonAst.id = 0;
  jsonAst.type = 'component';
  jsonAst.name = 'div';
  jsonAst.children = [];
  let id = 1;
  arrayAst.forEach(element => {
    let childData = inverseConvertHelper(element, id);
    id = childData.id;
    jsonAst.children.push(childData.data);
  });
  return jsonAst;
};

/**
 * Helper function for inverseConvert
 * @param {*} arrayElement
 * @return JSON representation of the corresponding arrayElement
 */
function inverseConvertHelper(arrayElement, id) {
  let elementJson = new Object();
  elementJson.id = ++id;

  if (typeof arrayElement === 'string') {
    elementJson.type = 'textnode';
    elementJson.value = arrayElement;
  } else if (['var', 'derived', 'data', 'meta'].indexOf(arrayElement[0]) > -1) {
    elementJson.type = arrayElement[0];
    elementJson.properties = {};
    arrayElement[1].forEach(property => {
      elementJson.properties[property[0]] = {
        type: property[1][0],
        value: property[1][1]
      };
    });
  } else {
    elementJson.type = 'component';
    elementJson.name = arrayElement[0];
    if (arrayElement[1].length !== 0) {
      elementJson.properties = {};
      arrayElement[1].forEach(property => {
        elementJson.properties[property[0]] = {
          type: property[1][0],
          value: property[1][1]
        };
      });
    }
    if (arrayElement[2]) {
      let children = [];
      arrayElement[2].forEach(element => {
        let childData = inverseConvertHelper(element, id);
        id = childData.id;
        children.push(childData.data);
      });
      elementJson.children = children;
    }
  }
  let result = new Object();
  result.id = id;
  result.data = elementJson;
  return result;
}

module.exports = {
  convertV1ToV2,
  convertV2ToV1
};
