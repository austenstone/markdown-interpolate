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
  writeFileSync('TEST.md', testReadMe);
  writeFileSync('TEST2.md', testReadMe);
});

test('write', () => {
  markdownInterpolateFileWrite('TEST.md', values);
});

test('write missing values', () => {
  try {
    markdownInterpolateFileWrite('TEST.md', null as any);
  } catch (err) {
    expect(String(err).includes('Missing paramter \'values\' for markdownInterpolateFileWrite')).toBeTruthy();
  }
});

test('write bad file path', () => {
  try {
    markdownInterpolateFileWrite('TEST33.md', values);
  } catch (err) {
    expect(String(err).includes('ENOENT')).toBeTruthy();
  }
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

test('write regex/read', () => {
  const regex = new RegExp('.*.md', 'gi');
  markdownInterpolateWriteFileRegex(regex, values);
  const results = markdownInterpolateRead('TEST.md');
  for (const result of results) {
    expect(result.value).toBe(String(values[result.key]));
  }
  const results2 = markdownInterpolateRead('TEST2.md');
  for (const result of results2) {
    expect(result.value).toBe(String(values[result.key]));
  }
});

test('write/read empty string', () => {
  const valuesEmpty = {
    VALUE1: '',
  };
  markdownInterpolateFileWrite('TEST.md', valuesEmpty);
  const results = markdownInterpolateRead('TEST.md');
  const resultsExists = results.filter((result) => Object.keys(valuesEmpty).includes(result.key));
  for (const result of resultsExists) {
    expect(result.value).toBe(String(valuesEmpty['VALUE1']));
  }
});


test('write/read undefined and null', () => {
  const valuesEmpty = {
    VALUE1: undefined,
    VALUE2: null,
  };
  markdownInterpolateFileWrite('TEST.md', valuesEmpty);
  const results = markdownInterpolateRead('TEST.md');
  const resultsExists = results.filter((result) => Object.keys(valuesEmpty).includes(result.key));
  for (const result of resultsExists) {
    expect(result.value).toBe(String(valuesEmpty[result.key]));
  }
});
