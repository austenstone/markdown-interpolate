export declare const markdownInterpolateFileWrite: (fileName: string, values: {
    [key: string]: any;
}) => void;
export declare const markdownInterpolateWriteFileRegex: (regex: RegExp, values: {
    [key: string]: any;
}) => void;
export declare const markdownInterpolateRead: (fileName: string) => {
    key: string;
    value: string;
}[];
