import { expect, test } from '@jest/globals';
import { parseGenitive } from '../parsers';

test('Unit: parseGenitive, Testsuit: valid inputs', () => {
  expect(parseGenitive('Lukas')).toBe(`Lukas'`);
  expect(parseGenitive('Anna')).toBe(`Anna's`);
  expect(parseGenitive('John Doe')).toBe(`John Doe's`);
  expect(parseGenitive('John Doe   ')).toBe(`John Doe's`);
});
