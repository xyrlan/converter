'use client'

import React, { useState} from 'react'
import { FileImageIcon, XIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Combobox } from "../ui/combobox"
import { bytesToSize } from "@/lib/file"
import { DownloadButton } from "../download-button"
import { Conversion, useConversions } from './provider'

type ConversionFileColsProps = {
    conversion: Conversion;
    onRemove: () => void;
    onConverTo: (to: string) => void;
    key: number
  };

const ConversionFiLeCols = ({ onRemove, conversion, onConverTo, key }: ConversionFileColsProps) => {
    const [open, setOpen] = useState(false)
    const { file, to } = conversion
    return (
        <li key={key} className='grid place-content-between grid-flow-col items-center py-2 gap-2'>

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
                <span className="font-mono mx-2">&apos;{conversion.file?.type.split('/')[1].toUpperCase()}&apos;</span>
            </span>
            {!conversion.resultId && (
                <>
                    <Combobox 
                    value={conversion.to || ''}
                        setValue={onConverTo}
                    />
                    <Button
                        className="w-fit"
                        variant='outline' onClick={onRemove}>
                        <XIcon className="w-4 h-4" />
                    </Button>
                </>
            )}
            {conversion.resultId && (
                <DownloadButton resultId={conversion.resultId} />
            )}
        </li>
    )
}

export default ConversionFiLeCols