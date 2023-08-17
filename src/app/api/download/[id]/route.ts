import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import * as AWS from 'aws-sdk'
import { Readable } from "stream";
import { ConversionStatus } from "@prisma/client";

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
})

const bucket = process.env.S3_BUCKET_NAME!

type RouteParams = {
    params: {
        id: string
    }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    const conversion = await prisma.conversion.findUnique({
        where: {
            id: params.id,
        },
    })
    if (!conversion) {
        return new NextResponse(JSON.stringify({ error: 'Not found' }), {
            status: 404,
        })
    }

    if (conversion.status !== ConversionStatus.DONE) {
        return new NextResponse(JSON.stringify({ error: 'File has not finished being converted' }), {
            status:400,
        })
    }

    const s3 = new AWS.S3()
    const downloadParams = {
        Bucket: bucket,
        Key: conversion.fileLocation.replace(`s3://${bucket}/`, ''),
    }

    const stream = Readable.toWeb(s3.getObject(downloadParams).createReadStream())
    return new NextResponse(stream as any, {
        headers: {
            'Content-Type': `image/${conversion.to}`,
            'Content-Disposition': `attachment; filename=download.${conversion.to}`
        }
    })

}