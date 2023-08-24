"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.converters = void 0;
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const child_process_1 = require("child_process");
const util_1 = require("util");
const mime_types_1 = require("mime-types");
const formats_1 = require("./formats");
const exec = (0, util_1.promisify)(child_process_1.exec);
const buildConverter = (from, to, params) => {
    const converter = async (buf) => {
        const file = (0, crypto_1.randomUUID)();
        await (0, promises_1.writeFile)(`/tmp/${file}.${(0, mime_types_1.extension)(from)}`, buf);
        await exec(`convert /tmp/${file}.${(0, mime_types_1.extension)(from)} ${params !== null && params !== void 0 ? params : ''} /tmp/${file}.${(0, mime_types_1.extension)(to)}`);
        return (0, promises_1.readFile)(`/tmp/${file}.${(0, mime_types_1.extension)(to)}`);
    };
    converter.from = from;
    converter.to = to;
    return converter;
};
const _converters = [];
for (const from of formats_1.formats) {
    for (const to of formats_1.formats) {
        if (from.mime === to.mime) {
            continue;
        }
        _converters.push(buildConverter(from.mime, to.mime, to.params));
    }
}
exports.converters = _converters;
