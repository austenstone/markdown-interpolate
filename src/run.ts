/* eslint-disable max-len */
import * as fs from 'fs';
import path from 'path';

const run = async (): Promise<void> => {
  const values = {
    VALUE: 44,
  };
  const directoryContents = fs.readdirSync('./');
  const files = directoryContents
      .filter((file) => file.endsWith('.md'))
      .map((file) => path.resolve('./', file));

  files.forEach((file) => {
    let contents = fs.readFileSync(file).toString();
    for (const [key, value] of Object.entries(values)) {
      const regex = new RegExp(
          `(<!-- ?${key} ?-->\r?\n?)(.*?)(\r?\n?<!-- ?END ${key} ?-->)`, 'gs');
      const result = contents.matchAll(regex);
      for (const match of result) {
        if (match.index !== undefined) {
          console.log('m', [match[0], match[1], match[2], match[3]]);
          contents = contents.substring(0, match.index) + match[1] + value + match[3] + contents.substring(match.index + match[1].length + value.toString().length + match[3].length);
        }
      }
      fs.writeFileSync(file.replace('README', 'README_EDITED'), contents);
    }
  });
};

export default run;
