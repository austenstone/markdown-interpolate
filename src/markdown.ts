import * as fs from 'fs';
import path from 'path';

export const mdIWrite = (content: string, values: { [key: string]: any }) => {
  if (!values) throw Error('Missing paramter \'values\' for mdIFileWrite');
  for (const [key, value] of Object.entries(values)) {
    const regex = new RegExp(`(?<=<!-- ?${key} ?-->)(.*?)(?=<!-- ?END ${key} ?-->)`, 'gs');
    content = content.replace(regex, String(value));
  }
  return content;
};

export const mdIRead = (content: string): { [key: string]: any } => {
  const results: { [key: string]: any } = {};
  const regex = new RegExp(`(<!-- ?\\w+ ?-->)(.*?)(<!-- ?END \\w+ ?-->)`, 'gs');
  const matches = content.matchAll(regex);
  for (const match of matches) {
    const key = match[1].replace('<!--', '').replace('-->', '').trim();
    const value = match[2];
    results[key] = value;
  }
  return results;
};

export const mdIReadEntries = (content: string): { key: string, value: string }[] => {
  const results: { key: string, value: string }[] = [];
  const regex = new RegExp(`(<!-- ?\\w+ ?-->)(.*?)(<!-- ?END \\w+ ?-->)`, 'gs');
  const matches = content.matchAll(regex);
  for (const match of matches) {
    const key = match[1].replace('<!--', '').replace('-->', '').trim();
    const value = match[2];
    results.push({ key, value });
  }
  return results;
};

const getFileNames = (regex: RegExp): string[] => {
  return fs.readdirSync('./')
      .filter((file) => file.match(regex))
      .map((file) => path.resolve('./', file));
};

const _mdIFileWrite = (fileName: string, values: { [key: string]: any }): void => {
  let content: string = fs.readFileSync(fileName).toString();
  if (content) {
    content = mdIWrite(content, values);
  }
  fs.writeFileSync(fileName, content);
};

const _mdFileWriteRegex = (regex: RegExp, values: { [key: string]: any }): void => {
  getFileNames(regex)?.forEach((file) => _mdIFileWrite(file, values));
};

export const mdIFileWrite = (pattern: string | RegExp, values: { [key: string]: any }): void => {
  if (!values) throw Error('Missing paramter \'values\' for mdIFileWrite');
  if (typeof pattern === 'string') {
    _mdIFileWrite(pattern, values);
  } else if (typeof pattern === 'object') {
    _mdFileWriteRegex(pattern, values);
  } else {
    throw Error('Missing paramter \'pattern\' for mdIFileWrite');
  }
};

export const mdFileRead = (fileName: string): { key: string, value: string }[] => {
  const content = fs.readFileSync(fileName).toString();
  return mdIReadEntries(content);
};

export const mdFileReadRegex = (regex: RegExp): { key: string, value: string }[] => {
  const files = getFileNames(regex);
  const results: { key: string, value: string }[] = [];
  return files.reduce((results, file) => results.concat(mdFileRead(file)), results);
};
