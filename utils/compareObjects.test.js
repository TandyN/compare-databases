const { expect } = require('@jest/globals');
const { ifObjectsContainSameContent } = require('./compareObjects');

describe('Compare Object Functions', () => {
  describe('ifObjectsContainSameContent', () => {
    it('should return true if object 2 contains the same content as object 1', () => {
      const testObj1 = { id: 'a', email: '123' };
      const testObj2 = { id: 'a', email: '123' };
      const testObj3 = { email: '123', id: 'a' };
      const testObj4 = { id: 'a', email: '123', extra: 'extra' };

      const result1 = ifObjectsContainSameContent(testObj1, testObj2);
      const result2 = ifObjectsContainSameContent(testObj1, testObj3);
      const result3 = ifObjectsContainSameContent(testObj1, testObj4)

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
    });

    it('should return false if object 2 contains does not have the same content as object 1', () => {
      const testObj1 = { id: 'a', email: '123' };
      const testObj2 = { id: 'a', email: '456' };
      const testObj3 = { id: 'a' };

      const result1 = ifObjectsContainSameContent(testObj1, testObj2);
      const result2 = ifObjectsContainSameContent(testObj1, testObj3);

      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });
  });
});
