import { File, FileImageIcon, XIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Combobox } from "./ui/combobox"
import { bytesToSize } from "@/lib/file"
import Link from "next/link"
import { DownloadButton } from "./download-button"

export type FileConversion = {
    file?: File
    to?: string
    resultId?: string
    type?: string
}

type FileManagerProps = {
    conversions: FileConversion[]
    setConversions: (conversions: FileConversion[]) => void
    onConvert: (conversion: FileConversion) => void
}

export const FileManager = ({ conversions, setConversions, onConvert }: FileManagerProps) => {
    return (
        <div className="">
            <ul className='border rounded-md p-2 max-w-7xl '>
                {
                    conversions.map((conversion, key) => (
                        <li key={key} className='grid place-content-between grid-flow-col items-center py-2 gap-2'>

                            <div>
                                <FileImageIcon className='w-4 h-4 md:w-8 md:h-8' />
                            </div>
                            <div className="md:col-span-1 col-span-3">
                                <span className="font-mono bg-neutral-100 rounded p-2 max-md:text-xs text-center">
                                    {conversion.file?.name}
                                </span>
                            </div>
                            <span className="px-2 max-md:text-xs">
                                {bytesToSize(conversion.file?.size || 0)}
                            </span>
                            <span className="px-2 max-md:text-xs flex max-md:hidden">
                                from<span className="font-mono mx-2">&apos;{conversion.file?.type.split('/')[1].toUpperCase()}&apos;</span> to
                            </span>
                            {!conversion.resultId && (
                                <>
                                    <Combobox value={conversion.to || ''}
                                        setValue={(v) =>
                                            setConversions(
                                                [...conversions].map((c, i) =>
                                                    i === key ? { ...c, to: v } : c
                                                )
                                            )
                                        }
                                    />
                                    <Button
                                        className="w-fit"
                                        variant='outline' onClick={() => {
                                            setConversions({ ...conversions }.filter((c, i) => i !== key))
                                        }}>
                                        <XIcon className="w-4 h-4" />
                                    </Button>
                                </>
                            )}
                            {conversion.resultId && (
                                <DownloadButton resultId={conversion.resultId} />
                            )}
                        </li>
                    ))}
            </ul>
            <div className="flex justify-end py-2">
                <Button variant='default' onClick={() => onConvert(conversions[0])}>
                    Convert
                </Button>
            </div>
        </div>
    )
}