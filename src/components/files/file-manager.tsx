'use client'
import { Button } from "../ui/button"
import { Conversion, ConversionProvider, useConversions } from "./provider"
import ConversionFiLeCols from "./conversionfilecols"


export type FileConversion = {
    file?: File
    to?: string
    resultId?: string
    type?: string
}

type FileManagerProps = {
    conversions: Conversion[]
    setConversions: (conversions: FileConversion[]) => void
    onConvert: (conversion: FileConversion) => void
}

export const FileManager = () => {

    const { conversions, updateConversion, removeConversion, convert } = useConversions()

    return (
        <>
            {conversions.length > 0 && (
                <div className="max-w-7xl mx-auto">
                    <ul className='border rounded-md p-2'>
                        {conversions.map((conversion, key) => (
                                <ConversionFiLeCols
                                    conversion={conversion}
                                    key={key}
                                    onRemove={() => removeConversion(key)}
                                    onConverTo={(to) => {
                                        updateConversion(key, { to })
                                    }} />
                            ))}
                    </ul>
                    <div className="flex justify-end py-2">
                        <Button variant='default' onClick={convert}>
                            Convert Files
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}