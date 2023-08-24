'use client'
import { Button } from "../ui/button"
import { Conversion, ConversionProvider, UXConversionStatus, useConversions } from "./provider"
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
                    <ul className='sm:border rounded-md mx-auto w-fit'>
                        {conversions.map((conversion, key) => (
                            <ConversionFiLeCols
                                conversion={conversion}
                                key={key}
                                onUpdate={(c) => updateConversion(key, c)}
                                onRemove={() => removeConversion(key)}
                                onConverTo={(to) => {
                                    updateConversion(key, { to })
                                }} />
                        ))}
                    </ul>
                    <div className="flex justify-center mt-5 py-2">
                        <Button
                            variant='default'
                            disabled={conversions.some(
                                (conversion) => conversion.status === UXConversionStatus.Processing ||
                                    conversion.status === UXConversionStatus.Uploading || conversion.status === UXConversionStatus.Complete
                            )}
                            onClick={convert}
                        >
                            Convert Files
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}