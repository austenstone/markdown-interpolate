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
exports.mdFileReadRegex = exports.mdFileRead = exports.mdIFileWrite = exports.mdIReadEntries = exports.mdIRead = exports.mdIWrite = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const mdIWrite = (content, values) => {
    if (!values)
        throw Error('Missing paramter \'values\' for mdIFileWrite');
    for (const [key, value] of Object.entries(values)) {
        const regex = new RegExp(`(?<=<!-- ?${key} ?-->)(.*?)(?=<!-- ?END ${key} ?-->)`, 'gs');
        content = content.replace(regex, String(value));
    }
    return content;
};
exports.mdIWrite = mdIWrite;
const mdIRead = (content) => {
    const results = {};
    const regex = new RegExp(`(<!-- ?\\w+ ?-->)(.*?)(<!-- ?END \\w+ ?-->)`, 'gs');
    const matches = content.matchAll(regex);
    for (const match of matches) {
        const key = match[1].replace('<!--', '').replace('-->', '').trim();
        const value = match[2];
        results[key] = value;
    }
    return results;
};
exports.mdIRead = mdIRead;
const mdIReadEntries = (content) => {
    const results = [];
    const regex = new RegExp(`(<!-- ?\\w+ ?-->)(.*?)(<!-- ?END \\w+ ?-->)`, 'gs');
    const matches = content.matchAll(regex);
    for (const match of matches) {
        const key = match[1].replace('<!--', '').replace('-->', '').trim();
        const value = match[2];
        results.push({ key, value });
    }
    return results;
};
exports.mdIReadEntries = mdIReadEntries;
const getFileNames = (regex) => {
    return fs.readdirSync('./')
        .filter((file) => file.match(regex))
        .map((file) => path_1.default.resolve('./', file));
};
const _mdIFileWrite = (fileName, values) => {
    let content = fs.readFileSync(fileName).toString();
    if (content) {
        content = (0, exports.mdIWrite)(content, values);
    }
    fs.writeFileSync(fileName, content);
};
const _mdFileWriteRegex = (regex, values) => {
    var _a;
    (_a = getFileNames(regex)) === null || _a === void 0 ? void 0 : _a.forEach((file) => _mdIFileWrite(file, values));
};
const mdIFileWrite = (pattern, values) => {
    if (!values)
        throw Error('Missing paramter \'values\' for mdIFileWrite');
    if (typeof pattern === 'string') {
        _mdIFileWrite(pattern, values);
    }
    else if (typeof pattern === 'object') {
        _mdFileWriteRegex(pattern, values);
    }
    else {
        throw Error('Missing paramter \'pattern\' for mdIFileWrite');
    }
};
exports.mdIFileWrite = mdIFileWrite;
const mdFileRead = (fileName) => {
    const content = fs.readFileSync(fileName).toString();
    return (0, exports.mdIReadEntries)(content);
};
exports.mdFileRead = mdFileRead;
const mdFileReadRegex = (regex) => {
    const files = getFileNames(regex);
    const results = [];
    return files.reduce((results, file) => results.concat((0, exports.mdFileRead)(file)), results);
};
exports.mdFileReadRegex = mdFileReadRegex;
