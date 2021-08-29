const convertArrayToObjectWithKeys = (array, colToKey) => {
  let objectWithKeys = {};

  array.map((objectRow) => {
    let id = objectRow[colToKey];
    delete objectRow[colToKey];

    objectWithKeys[`${id}`] = { ...objectRow };
  });

  return objectWithKeys;
}

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
