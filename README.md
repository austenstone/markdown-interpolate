# Markdown Interpolation
Find and replace the content between markdown comments.

This is intended for use in Node.js because it has some file operation logic for convenience.

## Writing
Let's say you have a file called `README.md` with this content.
```md
My name is Bob.
```

You can make the name "Bob" dynamic. 

Let's call our variable `NAME` by using the prefix `<!-- NAME -->` and suffix `<!-- END NAME -->`.
```md
My name is <!-- NAME -->Bob<!-- END NAME -->
```

### Write by file name
Now write some javascript to replace the content `Bob` with `John`.
```js
import { markdownInterpolateFileWrite } from 'markdown-interpolation';

markdownInterpolateFileWrite('README.md', {
    NAME: 'John'
});
```
This will result in the following file.
```md
My name is <!-- NAME -->John<!-- END NAME -->
```
When rendered in markdown it will appear as follows.

My name is <!-- NAME -->John<!-- END NAME -->

### Write by regex match on file names
You can use regular expressions to match multiple files in a single call.

For example match all files that end with `.md`.
```js
import { markdownInterpolateWriteFileRegex } from 'markdown-interpolation';

markdownInterpolateWriteFileRegex(/.*\.md/i, {
    NAME: 'John'
});
```

## Reading
You can read all the markdown variables back.

Let's continue using the example from the previous section.
```md
My name is <!-- NAME -->John<!-- END NAME -->
```
### Read content of all variables
Read all the variables from a file.
```js
import { markdownInterpolateRead } from 'markdown-interpolation';

const results = markdownInterpolateRead('TEST.md');
console.log(results);
```

The output will be a JSON array of objects describing each variable.
```json
[{
    "key": "NAME",
    "value": "John"
}]
```
