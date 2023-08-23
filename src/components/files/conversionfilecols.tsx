'use client'

import React, { useEffect, useState } from 'react'
import { FileImageIcon, XIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Combobox } from "../ui/combobox"
import { bytesToSize } from "@/lib/file"
import { DownloadButton } from "../download-button"
import { Conversion, UXConversionStatus, useConversions } from './provider'
import useSWR from 'swr'
import { ConversionStatus } from '@prisma/client'
import { Format } from '@/lib/types'

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res => res.json()))

type ConversionFileColsProps = {
    conversion: Conversion;
    onRemove: () => void;
    onConverTo: (format: Format) => void;
    onUpdate: (conversion: Partial<Conversion>) => void

};

const ConversionFiLeCols = ({ onRemove, conversion, onConverTo, onUpdate }: ConversionFileColsProps) => {
    const { data } = useSWR(
        () =>
            conversion.id && conversion.status != UXConversionStatus.Complete
                ? `/api/status/${conversion.id}`
                : 'null',
        fetcher,
        { refreshInterval: 1000 }
    )

    useEffect(() => {
        if (data?.status === ConversionStatus.DONE) {
            onUpdate({
                status: UXConversionStatus.Complete
            })
        }
    }, [data?.status])

    const [open, setOpen] = useState(false)
    const { file, to } = conversion
    
    return (
        <li className='grid place-content-between grid-flow-col items-center py-2 gap-2'>

            <div>
                <FileImageIcon className='w-4 h-4 md:w-8 md:h-8' />
            </div>
            <div className="md:col-span-1 col-span-3">
                <span className="font-mono bg-neutral-100 rounded p-2 max-md:text-xs text-center">
                    {file.name}
                </span>
            </div>
            <span className="px-2 max-md:text-xs font-mono">
                {bytesToSize(file.size || 0)}
            </span>
            <span className="px-2 max-md:text-xs flex max-md:hidden">
                {conversion.status === UXConversionStatus.Pending && <div>Pending</div>}
                {conversion.status === UXConversionStatus.Uploading && <div>Uploading: {(conversion.upload || 0) * 100}%</div>}
                {conversion.status === UXConversionStatus.Processing && <div>Converting</div>}
                {conversion.status === UXConversionStatus.Error && <div>Error!</div>}
                {conversion.status === UXConversionStatus.Complete && <div>Done</div>}
            </span>

            <>
                <Combobox
                    value={conversion.to?.ext || ''}
                    setValue={onConverTo}
                />
                <Button
                    className="w-fit"
                    variant='outline' onClick={onRemove}>
                    <XIcon className="w-4 h-4" />
                </Button>
            </>
            {conversion.status === UXConversionStatus.Complete && (
                <DownloadButton resultId={conversion.id} />
            )}
        </li>
    )
}

export default ConversionFiLeCols