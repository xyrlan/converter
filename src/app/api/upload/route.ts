import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "buffer";
import { prisma } from "../../../lib/prisma";
import { ConversionStatus } from "@prisma/client";
import { extname } from "path";
import { v4 as uuid } from 'uuid'
import * as AWS from 'aws-sdk'
import { randomUUID } from "crypto";
import { fileExtensionToMime } from "@/lib/file";


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
})

const bucket = process.env.S3_BUCKET_NAME!

export async function POST(req: NextRequest) {
    const data = await req.formData()
    const file: File | null = data.get('file') as unknown as File
    const to = data.get('to') as string
    const from = fileExtensionToMime(file.name)
    const name = file.name.split('.')[0]

    if (!file) {
        return new NextResponse(JSON.stringify({ error: 'No file found' }), {
            status: 400,
        })
    }

    if (!to) {
        return new NextResponse(JSON.stringify({ error: 'No "to" found' }),
            {
                status: 400,
            })
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const key = `${randomUUID()}${randomUUID()}`.replace(/-/g, '')
    const s3 = new AWS.S3()

    const params = {
        Bucket: bucket,
        Key: key,
        Body: buffer,
    }

    const uploadResponse = await s3.upload(params).promise();
    console.log(`File uploaded sucessfully. ${uploadResponse.Location}`)


    const conversion = await prisma.conversion.create({
        data: {
            name: name,
            s3Key: key,
            fromMime: from,
            toMime: to,
            currentMime: from,
            status: ConversionStatus.PENDING,
        }
    })



    return NextResponse.json({ id: conversion.id })
}