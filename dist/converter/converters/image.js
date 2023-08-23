"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.converters = void 0;
const promises_1 = require("fs/promises");
const crypto_1 = require("crypto");
const promises_2 = require("fs/promises");
const child_process_1 = require("child_process");
const util_1 = require("util");
const mime_types_1 = require("mime-types");
const exec = (0, util_1.promisify)(child_process_1.exec);
const formats = [
    {
        format: 'image/jpeg',
        params: undefined
    },
    {
        format: 'image/png',
        params: undefined
    }, {
        format: 'image/gif',
        params: undefined
    }, {
        format: 'image/webp',
        params: undefined
    },
    {
        format: 'image/tiff',
        params: undefined
    },
    {
        format: 'image/bmp',
        params: undefined
    }, {
        format: 'image/heic',
        params: undefined
    },
    {
        format: 'image/heif',
        params: undefined
    },
    {
        format: 'image/x-icon',
        params: '-resize 256x256'
    },
];
const buildConverter = (from, to, params) => {
    const converter = async (buf) => {
        const file = (0, crypto_1.randomUUID)();
        await (0, promises_1.writeFile)(`/tmp/${file}.${(0, mime_types_1.extension)(from)}`, buf);
        await exec(`convert /tmp/${file}.${(0, mime_types_1.extension)(from)} ${params !== null && params !== void 0 ? params : ''} /tmp/${file}.${(0, mime_types_1.extension)(to)}`);
        return (0, promises_2.readFile)(`/tmp/${file}.${(0, mime_types_1.extension)(to)}`);
    };
    converter.from = from;
    converter.to = to;
    return converter;
};
const _converters = [];
for (const from of formats) {
    for (const to of formats) {
        if (from.format === to.format) {
            continue;
        }
        _converters.push(buildConverter(from.format, to.format, to.params));
    }
}
exports.converters = _converters;
