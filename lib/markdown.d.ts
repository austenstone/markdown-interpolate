export declare const mdFileWrite: (fileName: string, values: {
    [key: string]: any;
}) => void;
export declare const mdFileWriteRegex: (regex: RegExp, values: {
    [key: string]: any;
}) => void;
export declare const mdFileReadRegex: (regex: RegExp) => {
    key: string;
    value: string;
}[];
export declare const mdFileRead: (fileName: string) => {
    key: string;
    value: string;
}[];
