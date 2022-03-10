import { test, beforeAll, expect } from '@jest/globals';
import { writeFileSync } from 'fs';
import { markdownInterpolateRead, markdownInterpolateFileWrite, markdownInterpolateWriteFileRegex } from '../src/markdown';

const testReadMe = `# Testing

VALUE1: <!-- VALUE1 --><!-- END VALUE1 -->
---
VALUE2: <!-- VALUE2 --><!-- END VALUE2 -->
---
VALUE3: <!-- VALUE3 --><!-- END VALUE3 -->
---
VALUE4: <!--VALUE4--><!--END VALUE4-->
---
VALUERANDOM: <!--VALUERANDOM--><!--END VALUERANDOM-->
---
STRING: <!--STRING--><!--END STRING-->
---
NEWLINES1: <!--NEWLINES1--><!--END NEWLINES1-->
---
NEWLINES2: <!--NEWLINES2--><!--END NEWLINES2-->
---
SPECIAL: <!--SPECIAL--><!--END SPECIAL-->
---
EMOJI: <!--EMOJI--><!--END EMOJI-->

# END Testing`;

const values = {
  VALUE1: Math.floor(Math.random() * 1000),
  VALUE2: Math.floor(Math.random() * 1000),
  VALUE3: Math.floor(Math.random() * 1000),
  VALUE4: Math.floor(Math.random() * 1000),
  VALUERANDOM: Math.floor(Math.random() * 1000),
  STRING: 'THIS IS A BASIC STRING',
  NEWLINES1: 'THIS string has\n\n new\n\n lines\nok\n\n',
  NEWLINES2: 'THIS string has\r\n\r\nnew\r\n\r\nlines\r\nok\r\n\r\n',
  SPECIAL: '!@#$%^&*()_+',
  EMOJI: '😁🤷🤖👨‍💻',
};

beforeAll(() => {
  return writeFileSync('TEST.md', testReadMe);
});

test('write', () => {
  markdownInterpolateFileWrite('TEST.md', values);
});

test('write regex', () => {
  markdownInterpolateWriteFileRegex(/TEST.md/, values);
});

test('read', () => {
  const results = markdownInterpolateRead('TEST.md');
  expect(results).toBeTruthy();
  expect(results.length).toEqual(Object.keys(values).length);
});

test('write/read', () => {
  markdownInterpolateFileWrite('TEST.md', values);
  const results = markdownInterpolateRead('TEST.md');
  for (const result of results) {
    expect(String(values[result.key]) === result.value).toBe(true);
  }
});
