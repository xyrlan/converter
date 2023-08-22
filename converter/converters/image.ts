import { Converter } from "./def";
import { writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import { readFile } from "fs/promises";
import { exec as execAsync } from "child_process";
import { promisify } from "util";
import { extension, lookup } from "mime-types";

const exec = promisify(execAsync);

const formats = ['jpg', 'png', 'gif', 'webp', 'tiff', 'bmp', 'heic', 'heif', 'ico'];

const runImageMagick = async (inputPath: string, outputPath: string) => {
    await exec(`magick ${inputPath} ${outputPath}`);
};

const buildConverter = (fromMime: string, toMime: string): Converter => {
    const converter: Converter = async (buf: Buffer) => {
        const file = randomUUID();
        const fromExt = extension(fromMime);
        const toExt = extension(toMime);
        const inputPath = `/tmp/${file}.${fromExt}`;
        const outputPath = `/tmp/${file}.${toExt}`;

        await writeFile(inputPath, buf);
        await runImageMagick(inputPath, outputPath);

        return readFile(outputPath);
    };
    converter.from = fromMime;
    converter.to = toMime;
    return converter;
};

for (const from of formats) {
    for (const to of formats) {
        const fromMime = lookup(from);
        const toMime = lookup(to);
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