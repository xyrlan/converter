import { Converter } from "../def"
import { randomUUID } from "crypto"
import { readFile, writeFile  } from "fs/promises"
import { exec as execAsync } from "child_process"
import { promisify } from "util"
import { extension } from "mime-types"
import { formats } from "./formats"
const exec = promisify(execAsync)

const buildConverter = (from: string, to: string, params?: string): Converter => {
    const converter: Converter = async (buf) => {
        const file = randomUUID()
        await writeFile(`/tmp/${file}.${extension(from)}`, buf)
        await exec(`magick /tmp/${file}.${extension(from)} ${params ?? ''} /tmp/${file}.${extension(to)}`)
        return readFile(`/tmp/${file}.${extension(to)}`)
    }
    converter.from = from
    converter.to = to
    return converter
}

const _converters: Array<Converter> = []

for (const from of formats) {
    for (const to of formats) {
        if (from.mime === to.mime) {
            continue
        }
        _converters.push(buildConverter(from.mime, to.mime, to.params))
    }
}

export const converters = _converters   