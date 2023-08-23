"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useConversions } from "../files/provider"
import { formats } from "../../../converter/converters/formats"
import { Format } from "@/lib/types"



type Props = {
    value: string
    setValue: (format: Format) => void
}

export function Combobox({ value, setValue }: Props) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    role="combobox"
                    aria-expanded={open}
                    className="max-md:text-xs justify-between "
                >
                    {value
                        ? formats.find((format) => format.ext === value)?.ext
                        : "To..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search formats..." />
                    <CommandEmpty>No format found.</CommandEmpty>
                    <CommandGroup>
                        {formats.map((format) => (
                            <CommandItem
                                key={format.mime}
                                onSelect={() => {
                                    setValue(format)
                                    setOpen(false)
                                }
                                }
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === format.mime ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {format.ext}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
