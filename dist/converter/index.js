"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_1 = require("../src/lib/prisma");
const AWS = __importStar(require("aws-sdk"));
const crypto_1 = require("crypto");
const mime_types_1 = require("mime-types");
const graph_1 = require("./graph");
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
});
const bucket = process.env.S3_BUCKET_NAME;
const convert = async (c) => {
    try {
        const s3 = new AWS.S3();
        const downloadParams = {
            Bucket: bucket,
            Key: c.s3Key,
        };
        console.log(`Downloading File`, downloadParams);
        const res = await s3.getObject(downloadParams).promise();
        const converters = (0, graph_1.findPath)(c.fromMime, c.toMime);
        if (!converters) {
            await prisma_1.prisma.conversion.update({
                where: {
                    id: c.id,
                },
                data: {
                    error: `Could not convert from ${c.fromMime} to ${c.toMime}`,
                    status: client_1.ConversionStatus.ERROR,
                }
            });
            return;
        }
        let converted = res.Body;
        for (const edge of converters) {
            converted = await edge.converter(res.Body);
        }
        const mime = (0, mime_types_1.extension)(converters[converters.length - 1].to.type);
        const key = ((0, crypto_1.randomUUID)() + (0, crypto_1.randomUUID)()).replace(/-/g, '');
        console.log(`Uploading to`, key);
        const uploadParams = {
            Bucket: bucket,
            Key: key,
            Body: converted,
        };
        await s3.upload(uploadParams).promise();
        await prisma_1.prisma.conversion.update({
            where: {
                id: c.id
            },
            data: {
                status: client_1.ConversionStatus.DONE,
                s3Key: key,
                currentMime: mime,
            },
        });
    }
    catch (err) {
        await prisma_1.prisma.conversion.update({
            where: {
                id: c.id
            },
            data: {
                status: client_1.ConversionStatus.ERROR,
                error: `Could not conver: ${err === null || err === void 0 ? void 0 : err.message}`,
            },
        });
    }
};
const main = async () => {
    const conversions = await prisma_1.prisma.conversion.findMany({
        where: {
            status: client_1.ConversionStatus.PENDING,
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
