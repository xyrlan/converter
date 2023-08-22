"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const crypto_1 = require("crypto");
const promises_2 = require("fs/promises");
const child_process_1 = require("child_process");
const util_1 = require("util");
const mime_types_1 = require("mime-types");
const exec = (0, util_1.promisify)(child_process_1.exec);
const formats = ['jpg', 'png', 'gif', 'webp', 'tiff', 'bmp', 'heic', 'heif', 'ico'];
const buildConverter = (from, to) => {
    const converter = async (buf) => {
        const file = (0, crypto_1.randomUUID)();
        await (0, promises_1.writeFile)(`/tmp/${file}.${(0, mime_types_1.extension)(from)}`, buf);
        await exec(`magick /tmp/${file}.${(0, mime_types_1.extension)(from)} /tmp/${file}.${(0, mime_types_1.extension)(to)}`);
        return (0, promises_2.readFile)(`/tmp/${file}.${(0, mime_types_1.extension)(to)}`);
    };
    converter.from = from;
    converter.to = to;
    return converter;
};
for (const from of formats) {
    for (const to of formats) {
        const fromMime = (0, mime_types_1.lookup)(from);
        const toMime = (0, mime_types_1.lookup)(to);
        if (!fromMime || !toMime) {
            throw new Error(`Could not finde mime type for ${from} or ${to}`);
        }
        if (from === to) {
            continue;
        }
        exports[`${from.toUpperCase()}_TO_${to.toUpperCase()}`] = buildConverter(fromMime, toMime);
    }
}
// const formatsxx = [magick identify -list format magick identify -list format]
