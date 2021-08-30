/**
* This function assumes the array (first argument) is an array of 
* objects and each object has the same keys. You will have to specifiy
* which key to use (second argument) amongst these objects
* as the function will return a single object with each key
* being the specified key's value, and each value for that key an object
* containing the reamining keys.
*
* const example = [{id: 1, name: 'Tom'}, {id: 2, name: 'Jerry'}]
*
* const result = convertArrayToObjectWithKeys(example, 'id')
*
* result === { '1': { name: 'Tom' }, '2': { name: 'Jerry' } }
*/
const convertArrayToObjectWithKeys = (arrayOfObjects, objectRowKey) => {
  let objectWithKeys = {};

  arrayOfObjects.forEach((objectRow) => {
    let id = objectRow[objectRowKey];
    delete objectRow[objectRowKey];

    objectWithKeys[`${id}`] = { ...objectRow };
  });

  return objectWithKeys;
}

/**
 * This function assumes the object (first argument) is an object
 * with each key having a value of another object. The function will
 * push each of these values into an array while additionally
 * taking they key for each object and adding it as a key having the
 * name of that key be specified by the second argment.
 * 
 * const example = { '1': { name: 'Tom' }, '2': { name: 'Jerry' } }
 * 
 * const result = convertObjectToArrayOfObjects(example, 'test')
 * 
 * result === [{test: 1, name: 'Tom'}, {test: 2, name: 'Jerry'}]
 */
const convertObjectToArrayOfObjects = (objectWithKeys, nameOfKey) => {
  let arrayOfObjects = [];

  for (let primaryKey in objectWithKeys) {
    const newObject = { ...objectWithKeys[primaryKey] };
    newObject[nameOfKey] = primaryKey;
    arrayOfObjects.push(newObject);
  }

  return arrayOfObjects;
}

module.exports = {
  convertArrayToObjectWithKeys,
  convertObjectToArrayOfObjects,
};
