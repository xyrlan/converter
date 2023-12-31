import { Conversion, ConversionStatus } from "@prisma/client"
import { prisma } from "../src/lib/prisma"
import * as AWS from 'aws-sdk'
import { randomUUID } from "crypto"
import { extension, lookup } from "mime-types"
import { findPath } from "./graph"

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
})

const bucket = process.env.S3_BUCKET_NAME!

const convert = async (c: Conversion) => {
    try {
        const s3 = new AWS.S3()
        const downloadParams = {
            Bucket: bucket,
            Key: c.s3Key,
        }
        console.log(`Downloading File`, downloadParams)
        const res = await s3.getObject(downloadParams).promise()
        console.log('Converting File', (c.fromMime, c.toMime))

        const converters = findPath(c.fromMime, c.toMime)
        console.log('Converters', converters)
        if (!converters) {
            console.error(
                `Could not find converters for ${c.fromMime} to ${c.toMime}`
            )
            await prisma.conversion.update({
                where: {
                    id: c.id,
                },
                data: {
                    error: `Could not convert from ${c.fromMime} to ${c.toMime}`,
                    status: ConversionStatus.ERROR,
                }
            })
            return
        }

        let converted = res.Body as Buffer
        for (const edge of converters) {
            converted = await edge.converter(res.Body as Buffer)
        }

        const mime = extension(converters[converters.length - 1].to.type) as string

        const key = (randomUUID() + randomUUID()).replace(/-/g, '')
        console.log(`Uploading to`, key)
        const uploadParams = {
            Bucket: bucket,
            Key: key,
            Body: converted,
        }
        await s3.upload(uploadParams).promise()
        await prisma.conversion.update({
            where: {
                id: c.id
            },
            data: {
                status: ConversionStatus.DONE,
                s3Key: key,
                currentMime: mime,
            },
        })
    } catch (err: any) {
        await prisma.conversion.update({
            where: {
                id: c.id
            },
            data: {
                status: ConversionStatus.ERROR,
                error: `Could not conver: ${err?.message}`,
            },
        })
    }

}

const main = async () => {
    const conversions = await prisma.conversion.findMany({
        where: {
            status: ConversionStatus.PENDING,
        },
    })
    console.log(`Found ${conversions.length} conversions`)
    for (const conversion of conversions) {
        await convert(conversion)
    }
}

const loop = async () => {
    while (true) {
        await main()
        await new Promise((resolve) => setTimeout(resolve, 1000))
    }
}

loop()

