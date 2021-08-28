const { expect } = require('@jest/globals');
const { convertArrayToObjectWithKeys } = require('./modifyObjects');

describe('Modify Object Functions', () => {
  describe('convertArrayToObjectWithKeys', () => {
    it('should map an array of objects to a single object', () => {
      const testArray = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      const result = convertArrayToObjectWithKeys(testArray, 'id');

      expect(typeof result).toBe('object');
      expect(Array.isArray(result)).toBe(false);
    });

    it('should create keys for that single object based on second parameter', () => {
      const testArray = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      const result = convertArrayToObjectWithKeys(testArray, 'id');
      const resultKeys = Object.keys(result);

      expect(resultKeys).toEqual(expect.arrayContaining(['a', 'b', 'c']));
      expect(resultKeys.length).toEqual(3);
    });

    it('each created key\'s value should be an object containing the remaining keys of each object', () => {
      const testArray = [
        {
          id: 'a',
          name: 'John',
          email: '123',
        },
        {
          id: 'b',
          name: 'Mary',
          email: '456',
        },
        {
          id: 'c',
          name: 'Sam',
          email: '789',
        },
      ];

      const result = convertArrayToObjectWithKeys(testArray, 'id');

      expect(result['a']).toMatchObject({ name: 'John', email: '123' });
      expect(result['b']).toMatchObject({ name: 'Mary', email: '456' });
      expect(result['c']).toMatchObject({ name: 'Sam', email: '789' });
    });
  });
});
