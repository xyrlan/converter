import { Conversion, ConversionStatus } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import * as AWS from 'aws-sdk';
import { randomUUID } from "crypto";
import { extension } from "mime-types";
import { createGraph, shortestPath } from "./graph";
import * as rawConverters from './converters';
import { Converter } from "./converters/def";

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
});

const bucket = process.env.S3_BUCKET_NAME!;
const converters = rawConverters as Record<string, Converter>;

const graph = createGraph(converters);

const convert = async (c: Conversion) => {
    try {
        const s3 = new AWS.S3();
        const downloadParams = {
            Bucket: bucket,
            Key: c.s3Key,
        };
        console.log(`Downloading File`, downloadParams);
        const res = await s3.getObject(downloadParams).promise();

        const edges = shortestPath(graph, c.fromMime, c.toMime);
        if (!edges) {
            await prisma.conversion.update({
                where: {
                    id: c.id,
                },
                data: {
                    error: `Could not convert from ${c.fromMime} to ${c.toMime}`,
                    status: ConversionStatus.ERROR,
                },
            });
            return;
        }

        let converted = res.Body as Buffer;
        for (const edge of edges) {
            converted = await edge(converted); // Chame o conversor da aresta com o buffer atualizado
        }

        const mime = extension(edges[edges.length - 1].to) as string;

        const key = (randomUUID() + randomUUID()).replace(/-/g, '');
        console.log(`Uploading to`, key);
        const uploadParams = {
            Bucket: bucket,
            Key: key,
            Body: converted,
        };
        await s3.upload(uploadParams).promise();
        await prisma.conversion.update({
            where: {
                id: c.id,
            },
            data: {
                status: ConversionStatus.DONE,
                s3Key: key,
                currentMime: mime,
            },
        });
    } catch (err: any) {
        await prisma.conversion.update({
            where: {
                id: c.id,
            },
            data: {
                status: ConversionStatus.ERROR,
                error: `Could not convert: ${err?.message}`,
            },
        });
    }
};

const main = async () => {
    const conversions = await prisma.conversion.findMany({
        where: {
            status: ConversionStatus.PENDING,
        },
    });
    console.log(`Found ${conversions.length} conversions`);
    for (const conversion of conversions) {
        await convert(conversion);
    }
};

const loop = async () => {
    while (true) {
        await main();
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
};

loop();