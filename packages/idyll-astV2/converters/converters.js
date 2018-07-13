/*
THIS FILE CONTAINS THE CONVERTER FUNCTIONS FOR THE TWO DIFFERENT TYPES OF AST STRUCTURE. 
*/

/**
 * This function converts the JSON structured AST (ASTV2) to the array structured 
 * AST (OLD AST)
 * @param {*} jsonAst 
 * @return Array structred AST 
 */
const convert = function(jsonAst) {
    let arrayAst = []; 
    jsonAst.children.forEach(element => {
            arrayAst.push(convertHelper(element)); 
    });
    return arrayAst; 
};

/**
 * Helper function for convert 
 * @param {*} jsonElement 
 * @return array representation of the corresponding jsonElement
 */
function convertHelper(jsonElement) {
    let elementArray = [];
    if(jsonElement.type === 'textnode') {
        return jsonElement.value; 
    } else {
        elementArray.push(jsonElement.name); 
        let propertiesArray = []; 
        if('properties' in jsonElement) {
            jsonElement.properties.forEach(element => {
                let propertyArray = [element.name];
                propertyArray.push([jsonElement.value, element.value]); 
                propertiesArray.push(propertyArray);
            })
        }
        elementArray.push(propertiesArray); 
        if('children' in jsonElement) {
            let childArray = [];
            jsonElement.children.forEach((children) => { 
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
const inverseConvert = function(arrayAst) {
    let jsonAst = new Object(); 
    jsonAst.id = 1;
    jsonAst.type = "component"; 
    jsonAst.name = "root"; 
    jsonAst.value = "value"; 
    jsonAst.children = [];
    let id = 1; 
    arrayAst.forEach((element) => {
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
    elementJson.id = id + 1; 
    id++; 
    if(typeof arrayElement === 'string') {
        elementJson.type = "textnode"; 
        elementJson.name = "textnode"; 
        elementJson.value = arrayElement; 
    } else {
        elementJson.type = "component"; 
        elementJson.name = arrayElement[0];
        if(arrayElement[1].length === 0) {
            elementJson.value = "value"; 
        } else {
            console.log("right here:" + arrayElement);
            elementJson.value = arrayElement[1][0][1][0]; 
            let properties = []; 
            arrayElement[1].forEach((element) => {
                let property = new Object(); 
                property.name = element[0]; 
                property.value = element[1][1]; 
                properties.push(property); 
            }); 
            elementJson.properties = properties; 
        }
        if(arrayElement[2]) {
            let children = []; 
            arrayElement[2].forEach((element) => {
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
    convert, 
    inverseConvert
}