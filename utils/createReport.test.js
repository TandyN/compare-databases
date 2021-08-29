const { addToCorrupt } = require('./createReport');

describe('Report Creating Functions', () => {
  describe('addToCorrupt', () => {
    it(`should add a key to 'corrupt' key in objReport argument with the value of an object`, () => {
      const reportObject = {
        corrupt: {},
      };
      const objCorruptValues1 = { name: 'John' };
      const objActualValues1 = { name: 'Sam' };
      const primaryKey1 = '1';

      addToCorrupt(reportObject, objCorruptValues1, objActualValues1, primaryKey1)

      expect(Object.keys(reportObject.corrupt)).toEqual(expect.arrayContaining(['1']));
      expect(Object.keys(reportObject.corrupt).length).toBe(1);
      expect(typeof reportObject.corrupt['1']).toBe('object');
      expect(Array.isArray(reportObject.corrupt['1'])).toBe(false);

      const objCorrupt2 = { name: 'Mary' };
      const objActualValues2 = { name: 'Tom' };
      const primaryKey2 = '2';

      addToCorrupt(reportObject, objCorrupt2, objActualValues2, primaryKey2)

      expect(Object.keys(reportObject.corrupt)).toEqual(expect.arrayContaining(['1', '2']));
      expect(Object.keys(reportObject.corrupt).length).toBe(2);
    });

    it(`should add an object with a corrupt and actual key for each primary key added to 'corrupt' key`, () => {
      const reportObject = {
        corrupt: {},
      };
      const objCorruptValues1 = { name: 'John', email: '123' };
      const objActualValues1 = { name: 'Sam', email: '456' };
      const primaryKey1 = '1';

      addToCorrupt(reportObject, objCorruptValues1, objActualValues1, primaryKey1)

      const objCorrupt2 = { name: 'Mary' };
      const objActualValues2 = { name: 'Tom' };
      const primaryKey2 = '2';

      addToCorrupt(reportObject, objCorrupt2, objActualValues2, primaryKey2)

      const expectedResult = {
        corrupt: {
          '1': {
            corruptValues: { name: 'John', email: '123' },
            actualValues: { name: 'Sam', email: '456' },
          },
          '2': {
            corruptValues: { name: 'Mary' },
            actualValues: { name: 'Tom' },
          },
        },
      }

      expect(reportObject.corrupt['1'].corruptValues).toMatchObject(expectedResult.corrupt['1'].corruptValues);
      expect(reportObject.corrupt['1'].actualValues).toMatchObject(expectedResult.corrupt['1'].actualValues);
      expect(reportObject.corrupt['2'].corruptValues).toMatchObject(expectedResult.corrupt['2'].corruptValues);
      expect(reportObject.corrupt['2'].actualValues).toMatchObject(expectedResult.corrupt['2'].actualValues);
    });
  });
});
