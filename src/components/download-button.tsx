'use client'
import { Button, Link } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { ConversionStatus, Prisma } from '@prisma/client'


type Props = {
    resultId: string | undefined
}

export const DownloadButton = ({resultId}: Props) => {


    return (
        <Button
            as={Link}
            color='success'
            href={`/api/download/${resultId}`}
        >
            Download
        </Button>
    )
}

