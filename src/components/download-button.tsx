'use client'
import { Button, Link } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { ConversionStatus, Prisma } from '@prisma/client'


type Props = {
    resultId: string
}


export const DownloadButton = ({ resultId }: Props) => {
    const [status, setStatus] = useState<ConversionStatus>(ConversionStatus.PENDING)

    async function refresh() {
        try {
            const res = await fetch(`/api/status/` + resultId)
            const { status } = await res.json()
            setStatus(status)
        } catch (err: any) { }
    }

    useEffect(() => {
        const tick = setInterval(refresh, 1000)
        return () => clearInterval(tick)
    }, [])

    return (
        <Button
            as={Link}
            color='success'
            isDisabled={status != ConversionStatus.DONE}
            href={`/api/download/${resultId}`}
        >
            Download
        </Button>
    )
}

