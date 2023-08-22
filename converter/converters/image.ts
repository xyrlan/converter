import { writeFile } from "fs/promises"
import { Converter } from "./def"
import { randomUUID } from "crypto"
import { readFile } from "fs/promises"
import { exec as execAsync } from "child_process"
import { promisify } from "util"
import { extension, lookup } from "mime-types"
const exec = promisify(execAsync)


const formats = ['jpg', 'png', 'gif', 'webp', 'tiff', 'bmp', 'heic', 'heif', 'ico']

const buildConverter = (from: string, to: string): Converter => {
    const converter: Converter = async (buf) => {
        const file = randomUUID()
        await writeFile(`/tmp/${file}.${extension(from)}`, buf)
        await exec(`magick /tmp/${file}.${extension(from)} /tmp/${file}.${extension(to)}`)
        return readFile(`/tmp/${file}.${extension(to)}`)
    }
    converter.from = from
    converter.to = to
    return converter
}

for (const from of formats) {
    for (const to of formats) {
        const fromMime = lookup(from)
        const toMime = lookup(to)
        if(!fromMime || !toMime) {
            throw new Error(`Could not finde mime type for ${from} or ${to}`)
        }
        if (from === to) {
            continue
        }
        exports[`${from.toUpperCase()}_TO_${to.toUpperCase()}`] = buildConverter(
            fromMime,
            toMime
        )
    }
}
// const formatsxx = [magick identify -list format magick identify -list format]
