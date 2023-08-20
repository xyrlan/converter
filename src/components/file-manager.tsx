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
}

type FileManagerProps = {
    conversions: FileConversion[]
    setConversions: (conversions: FileConversion[]) => void
    onConvert: (conversion: FileConversion) => void
}

export const FileManager = ({ conversions, setConversions, onConvert }: FileManagerProps) => {
    return (
        <div>
            <ul className='border rounded-md p-2'>
                {
                    conversions.map((conversion, key) => (
                        <li key={key} className='grid grid-cols-[48px_minmax(400px,_1fr)_100px_200px_50px]  items-center py-2'>

                            <div>
                                <FileImageIcon className='w-8 h-8' />
                            </div>
                            <div>
                                <span className="font-mono bg-neutral-100 rounded p-2">
                                    {conversion.file?.name}
                                </span>
                            </div>
                            <span className="px-2">
                                {bytesToSize(conversion.file?.size || 0)}
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
                                        className=""
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