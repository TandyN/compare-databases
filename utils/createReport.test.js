const { expect } = require('@jest/globals');
const {
  addToCorrupt,
  addToMissing,
  createReportObject,
} = require('./createReport');

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
      };

      expect(reportObject.corrupt['1'].corruptValues).toMatchObject(expectedResult.corrupt['1'].corruptValues);
      expect(reportObject.corrupt['1'].actualValues).toMatchObject(expectedResult.corrupt['1'].actualValues);
      expect(reportObject.corrupt['2'].corruptValues).toMatchObject(expectedResult.corrupt['2'].corruptValues);
      expect(reportObject.corrupt['2'].actualValues).toMatchObject(expectedResult.corrupt['2'].actualValues);
    });
  });

  describe('addToMissing', () => {
    it(`should set a key from one object to the objReport 'missing' key`, () => {
      const reportObject = {
        missing: {},
      };
      const objMain = {
        '1': { name: 'John' },
        '2': { name: 'Sam' },
      };

      addToMissing(reportObject, objMain, '1');
      expect(reportObject.missing['1']).toMatchObject({ name: 'John' });
      expect(Object.keys(reportObject.missing).length).toBe(1);

      addToMissing(reportObject, objMain, '2');

      expect(reportObject.missing['2']).toMatchObject({ name: 'Sam' });
      expect(Object.keys(reportObject.missing).length).toBe(2);

    });
  });

  describe('createReportObject', () => {
    it(`should put missing keys that the new DB does not have into the 'missing' key in the report object`, () => {
      const testOldDB = {
        '1': { name: '1' },
        '2': { name: '2' },
        '3': { name: '3' },
        '4': { name: '4' },
      };
      const testNewDB = {
        '3': { name: '3' },
        '4': { name: '4' },
      };

      const testReport = createReportObject(testOldDB, testNewDB);

      const expectedReportObject = {
        corrupt: {},
        missing: {
          '1': { name: '1' },
          '2': { name: '2' },
        },
        new: {},
      }
      expect(testReport).toEqual(expectedReportObject);
    });

    it(`should put keys that are found in the new DB and not in the old into the new key of the report object`, () => {
      const testOldDB = {
        '1': { name: '1' },
        '2': { name: '2' },
        '3': { name: '3' },
      };
      const testNewDB = {
        '1': { name: '1' },
        '2': { name: '2' },
        '3': { name: '3' },
        '4': { name: '4' },
      };

      const testReport = createReportObject(testOldDB, testNewDB);

      const expectedReportObject = {
        corrupt: {},
        missing: {},
        new: {
          '4': { name: '4' },
        },
      }
      expect(testReport).toEqual(expectedReportObject);
    });

    it(`should put corrupt values into the corrupt key in the report object`, () => {
      const testOldDB = {
        '1': { name: '1', email: '1' },
        '2': { name: '2', email: '2' },
        '3': { name: '3', email: '3' },
      };
      const testNewDB = {
        '1': { name: '1', email: '2' },
        '2': { name: '1', email: '2' },
        '3': { name: '4', email: '4' },
      };

      const testReport = createReportObject(testOldDB, testNewDB);

      const expectedReportObject = {
        corrupt: {
          '1': { corruptValues: { email: '2' }, actualValues: { email: '1' } },
          '2': { corruptValues: { name: '1' }, actualValues: { name: '2' } },
          '3': { corruptValues: { name: '4', email: '4' }, actualValues: { name: '3', email: '3' } },
        },
        missing: {},
        new: {},
      }
      expect(testReport).toEqual(expectedReportObject);
    });

    it(`should be possible to have all 3 keys not empty`, () => {
      const testOldDB = {
        '1': { name: '1', email: '1' },
        '2': { name: '2', email: '2' },
        '3': { name: '3', email: '3' },
        '4': { name: '4', email: '4' },
      };
      const testNewDB = {
        '1': { name: '1', email: '2' },
        '2': { name: '1', email: '2' },
        '3': { name: '4', email: '4' },
        '5': { name: '5', email: '5' },
        '6': { name: '6', email: '6' },
      };

      const testReport = createReportObject(testOldDB, testNewDB);

      const expectedReportObject = {
        corrupt: {
          '1': { corruptValues: { email: '2' }, actualValues: { email: '1' } },
          '2': { corruptValues: { name: '1' }, actualValues: { name: '2' } },
          '3': { corruptValues: { name: '4', email: '4' }, actualValues: { name: '3', email: '3' } },
        },
        missing: {
          '4': { name: '4', email: '4' },
        },
        new: {
          '5': { name: '5', email: '5' },
          '6': { name: '6', email: '6' },
        },
      }
      expect(testReport).toEqual(expectedReportObject);
    });

    it(`should be able to handle an extra field in the new DB`, () => {
      const testOldDB = {
        '1': { name: '1', email: '1' },
        '2': { name: '2', email: '2' },
        '3': { name: '3', email: '3' },
        '4': { name: '4', email: '4' },
      };
      const testNewDB = {
        '1': { name: '1', email: '2', extra: '1' },
        '2': { name: '1', email: '2', extra: '2' },
        '3': { name: '4', email: '4', extra: '3' },
        '5': { name: '5', email: '5', extra: '4' },
        '6': { name: '6', email: '6', extra: '5' },
      };

      const testReport = createReportObject(testOldDB, testNewDB);

      const expectedReportObject = {
        corrupt: {
          '1': { corruptValues: { email: '2' }, actualValues: { email: '1' } },
          '2': { corruptValues: { name: '1' }, actualValues: { name: '2' } },
          '3': { corruptValues: { name: '4', email: '4' }, actualValues: { name: '3', email: '3' } },
        },
        missing: {
          '4': { name: '4', email: '4' },
        },
        new: {
          '5': { name: '5', email: '5', extra: '4' },
          '6': { name: '6', email: '6', extra: '5' },
        },
      }
      expect(testReport).toEqual(expectedReportObject);
    });
  });
});
