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
const runImageMagick = async (inputPath, outputPath) => {
    await exec(`magick ${inputPath} ${outputPath}`);
};
const buildConverter = (fromMime, toMime) => {
    const converter = async (buf) => {
        const file = (0, crypto_1.randomUUID)();
        const fromExt = (0, mime_types_1.extension)(fromMime);
        const toExt = (0, mime_types_1.extension)(toMime);
        const inputPath = `/tmp/${file}.${fromExt}`;
        const outputPath = `/tmp/${file}.${toExt}`;
        await (0, promises_1.writeFile)(inputPath, buf);
        await runImageMagick(inputPath, outputPath);
        return (0, promises_2.readFile)(outputPath);
    };
    converter.from = fromMime;
    converter.to = toMime;
    return converter;
};
for (const from of formats) {
    for (const to of formats) {
        const fromMime = (0, mime_types_1.lookup)(from);
        const toMime = (0, mime_types_1.lookup)(to);
        if (!fromMime || !toMime) {
            throw new Error(`Could not find mime type for ${from} or ${to}`);
        }
        if (from === to) {
            continue;
        }
        const converterName = `${from.toUpperCase()}_TO_${to.toUpperCase()}`;
        exports[converterName] = buildConverter(fromMime, toMime);
    }
}
