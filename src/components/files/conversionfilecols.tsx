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
        <li className='grid grid-cols-5 items-center p-2 gap-2 border-spacing-2 border-separate border m-2 rounded'>

            <div className="md:col-span-2 flex items-center gap-1">
                <FileImageIcon className='w-4 h-4 bg-neutral-100' />
                <span className="font-mono rounded max-md:text-xs      truncate max-w-xs">
                    {file.name}
                </span>
            </div>

            <span className="md:col-span-1 max-md:text-xs font-mono">
                {bytesToSize(file.size || 0)}
            </span>

            <span className="md:col-span-1 max-md:text-xs">
                {conversion.status === UXConversionStatus.Pending && <div className='font-mono font-semibold flex items-center gap-2'>Pending...</div>}

                {conversion.status === UXConversionStatus.Uploading &&
                    <div className='font-mono font-semibold flex items-center gap-2'>
                        <div className="h-4 w-4 rounded-full border-4 border-t-transparent border-l-transparent animate-spin border-neutral-400" />
                        Uploading
                    </div>}
                {conversion.status === UXConversionStatus.Processing &&
                    <div className='font-mono flex items-center gap-2 font-semibold'>
                        <div className="h-4 w-4 rounded-full border-4 border-t-transparent border-l-transparent animate-spin border-neutral-400" />
                        Converting
                    </div>}
                {conversion.status === UXConversionStatus.Error && <div className='font-mono text-red-600 font-semibold'>Error!</div>}
                {conversion.status === UXConversionStatus.Complete && <div className='font-mono text-green-600 font-semibold'>Done</div>}
            </span>

            <div className="md:col-span-1 flex items-center gap-2">
                {conversion.status != UXConversionStatus.Complete && (
                    <Combobox
                        value={conversion.to?.ext || ''}
                        setValue={onConverTo}
                    />
                )}

                {conversion.status === UXConversionStatus.Complete && (
                    <DownloadButton resultId={conversion.id} />
                )}
                <Button
                    disabled={conversion.status === UXConversionStatus.Uploading || conversion.status === UXConversionStatus.Processing}
                    className="w-fit border-none"
                    variant='outline' onClick={onRemove}>
                    <XIcon className="w-4 h-4" />
                </Button>
            </div>
        </li>
    )
}

export default ConversionFiLeCols