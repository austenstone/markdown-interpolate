import * as fs from 'fs';
import path from 'path';

export const mdFileWrite = (fileName: string, values: { [key: string]: any }): void => {
  if (!values) throw Error('Missing paramter \'values\' for markdownInterpolateFileWrite');
  let content = fs.readFileSync(fileName).toString();
  for (const [key, value] of Object.entries(values)) {
    const regex = new RegExp(`(?<=<!-- ?${key} ?-->)(.*?)(?=<!-- ?END ${key} ?-->)`, 'gs');
    content = content.replace(regex, String(value));
  }
  fs.writeFileSync(fileName, content);
};

const regexFiles = (regex: RegExp): string[] => {
  return fs.readdirSync('./')
      .filter((file) => file.match(regex))
      .map((file) => path.resolve('./', file));
};

export const mdFileWriteRegex = (regex: RegExp, values: { [key: string]: any }): void => {
  const files = regexFiles(regex);
  files.forEach((file) => mdFileWrite(file, values));
};

export const mdFileReadRegex = (regex: RegExp): { key: string, value: string }[] => {
  const files = regexFiles(regex);
  const results: { key: string, value: string }[] = [];
  return files.reduce((results, file) => results.concat(mdFileRead(file)), results);
};

export const mdFileRead = (fileName: string): { key: string, value: string }[] => {
  const results: { key: string, value: string }[] = [];
  const content = fs.readFileSync(fileName).toString();
  const regex = new RegExp(`(<!-- ?\\w+ ?-->)(.*?)(<!-- ?END \\w+ ?-->)`, 'gs');
  const matches = content.matchAll(regex);
  for (const match of matches) {
    const key = match[1].replace('<!--', '').replace('-->', '').trim();
    const value = match[2];
    results.push({ key, value });
  }
  return results;
};

