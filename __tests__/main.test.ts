import { test, beforeAll, expect } from '@jest/globals';
import { writeFileSync } from 'fs';
import { mdFileRead, mdFileReadRegex, mdIFileWrite, mdIRead, mdIWrite } from '../src/markdown';

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

test('file write', () => {
  mdIFileWrite('TEST.md', values);
});

test('file write missing values', () => {
  try {
    mdIFileWrite('TEST.md', null as any);
  } catch (err) {
    expect(String(err)).toContain(`Missing paramter 'values'`);
  }
});

test('file write bad file path', () => {
  try {
    mdIFileWrite('TEST33.md', values);
  } catch (err) {
    expect(String(err).includes('ENOENT')).toBeTruthy();
  }
});

test('file write regex', () => {
  mdIFileWrite(/TEST.md/, values);
});

test('read', () => {
  const results = mdFileRead('TEST.md');
  expect(results).toBeTruthy();
  expect(results.length).toEqual(Object.keys(values).length);
});

test('file write/read', () => {
  mdIFileWrite('TEST.md', values);
  const results = mdFileRead('TEST.md');
  for (const result of results) {
    expect(String(values[result.key]) === result.value).toBe(true);
  }
});

test('file write regex/read', () => {
  const regex = new RegExp('.*.md', 'gi');
  mdIFileWrite(regex, values);
  const results = mdFileRead('TEST.md');
  for (const result of results) {
    expect(result.value).toBe(String(values[result.key]));
  }
  const results2 = mdFileRead('TEST2.md');
  for (const result of results2) {
    expect(result.value).toBe(String(values[result.key]));
  }
});

test('file write/read empty string', () => {
  const valuesEmpty = {
    VALUE1: '',
  };
  mdIFileWrite('TEST.md', valuesEmpty);
  const results = mdFileRead('TEST.md');
  const resultsExists = results.filter((result) => Object.keys(valuesEmpty).includes(result.key));
  for (const result of resultsExists) {
    expect(result.value).toBe(String(valuesEmpty['VALUE1']));
  }
});


test('file write/read undefined and null', () => {
  const valuesEmpty = {
    VALUE1: undefined,
    VALUE2: null,
  };
  mdIFileWrite('TEST.md', valuesEmpty);
  const results = mdFileRead('TEST.md');
  const resultsExists = results.filter((result) => Object.keys(valuesEmpty).includes(result.key));
  for (const result of resultsExists) {
    expect(result.value).toBe(String(valuesEmpty[result.key]));
  }
});

test('file write regex/read regex', () => {
  const regex = /^(?!README).*.md/gi;
  mdIFileWrite(regex, values);
  const results = mdFileReadRegex(regex);
  for (const result of results) {
    expect(result.value).toBe(String(values[result.key]));
  }
});

test('write', () => {
  const result = mdIWrite(testReadMe, values);
  for (const value of Object.values(values)) {
    expect(result).toContain(String(value));
  }
});

test('read', () => {
  const result = mdIRead(testReadMe);
  for (const value of Object.keys(values)) {
    expect(Object.keys(result)).toContain(value);
  }
});

test('write/read', () => {
  const written = mdIWrite(testReadMe, values);
  const result = mdIRead(written);
  for (const [key, value] of Object.entries(values)) {
    expect(Object.keys(result)).toContain(key);
    expect(Object.values(result)).toContain(String(value));
  }
});
