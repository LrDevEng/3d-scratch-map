import { expect, test } from '@jest/globals';
import { validateUrlParam } from '../validation';

test('Unit: validateUrlParam, Testsuit: valid inputs', () => {
  expect(validateUrlParam('country', 'can')).toBe(true);
  expect(validateUrlParam('userId', '123')).toBe(true);
  expect(validateUrlParam('journey', '123')).toBe(true);
});

test('Unit: validateUrlParam, Testsuit: invalid inputs', () => {
  expect(validateUrlParam('country', 'cana')).toBe(false);
  expect(validateUrlParam('country', 'cn')).toBe(false);
  expect(validateUrlParam('country', '')).toBe(false);
  expect(validateUrlParam('country', '   ')).toBe(false);
  expect(validateUrlParam('userId', 'abc')).toBe(false);
  expect(validateUrlParam('userId', '12c45')).toBe(false);
  expect(validateUrlParam('userId', '')).toBe(false);
  expect(validateUrlParam('userId', '    ')).toBe(false);
  expect(validateUrlParam('journey', 'abc')).toBe(false);
  expect(validateUrlParam('journey', '12c45')).toBe(false);
  expect(validateUrlParam('journey', '')).toBe(false);
  expect(validateUrlParam('journey', '    ')).toBe(false);
});
