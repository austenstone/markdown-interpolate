"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownInterpolateRead = exports.markdownInterpolateWriteFileRegex = exports.markdownInterpolateFileWrite = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const markdownInterpolateFileWrite = (fileName, values) => {
    if (!values)
        throw Error('Missing paramter \'values\' for markdownInterpolateFileWrite');
    let content = fs.readFileSync(fileName).toString();
    for (const [key, value] of Object.entries(values)) {
        const regex = new RegExp(`(?<=<!-- ?${key} ?-->)(.*?)(?=<!-- ?END ${key} ?-->)`, 'gs');
        content = content.replace(regex, String(value));
    }
    fs.writeFileSync(fileName, content);
};
exports.markdownInterpolateFileWrite = markdownInterpolateFileWrite;
const markdownInterpolateWriteFileRegex = (regex, values) => {
    const files = fs.readdirSync('./')
        .filter((file) => file.match(regex))
        .map((file) => path_1.default.resolve('./', file));
    files.forEach((file) => (0, exports.markdownInterpolateFileWrite)(file, values));
};
exports.markdownInterpolateWriteFileRegex = markdownInterpolateWriteFileRegex;
const markdownInterpolateRead = (fileName) => {
    const results = [];
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
exports.markdownInterpolateRead = markdownInterpolateRead;
