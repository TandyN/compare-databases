const { expect } = require('@jest/globals');
const {
  addToCorrupt,
  addToMissing,
  createReportObject,
} = require('./createReport');

describe('Report Creating Functions', () => {
  describe('addToCorrupt', () => {
    it(`should add a key to 'corrupt' key and put in actual values that it should contain`, () => {
      const oldDBObject = { '1': { name: '1', email: '1' } }
      const newDBObject = { '1': { name: '1', email: '2', extra: '1' } }
      const differntColumns = ['extra'];

      const reportObject = {
        corrupt: {},
      };

      const expected = {
        corrupt: {
          '1': { name: '1', email: '1', extra: '1' }
        }
      };

      addToCorrupt(reportObject, oldDBObject, newDBObject, '1', differntColumns);
      expect(reportObject).toEqual(expected);
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
          '1': { name: '1', email: '1' },
          '2': { name: '2', email: '2' },
          '3': { name: '3', email: '3' },
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
          '1': { name: '1', email: '1' },
          '2': { name: '2', email: '2' },
          '3': { name: '3', email: '3' },
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

      const testReport = createReportObject(testOldDB, testNewDB, ['extra']);

      const expectedReportObject = {
        corrupt: {
          '1': { name: '1', email: '1', extra: '1' },
          '2': { name: '2', email: '2', extra: '2' },
          '3': { name: '3', email: '3', extra: '3' },
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
