export declare const mdIWrite: (content: string, values: {
    [key: string]: any;
}) => string;
export declare const mdIRead: (content: string) => {
    [key: string]: any;
};
export declare const mdIReadEntries: (content: string) => {
    key: string;
    value: string;
}[];
export declare const mdIFileWrite: (pattern: string | RegExp, values: {
    [key: string]: any;
}) => void;
export declare const mdFileRead: (fileName: string) => {
    key: string;
    value: string;
}[];
export declare const mdFileReadRegex: (regex: RegExp) => {
    key: string;
    value: string;
}[];
