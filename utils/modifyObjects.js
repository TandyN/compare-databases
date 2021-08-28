const convertArrayToObjectWithKeys = (array, colToKey) => {
  let objectWithKeys = {};

  array.map((objectRow) => {
    let id = objectRow[colToKey];
    delete objectRow[colToKey];

    objectWithKeys[`${id}`] = { ...objectRow };
  });

  return objectWithKeys;
}

module.exports = {
  convertArrayToObjectWithKeys,
};
