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


const formats = [
    { value: 'jpg', label: 'JPG' },
    { value: 'png', label: 'PNG' },
    { value: 'gif', label: 'GIF' },
    { value: 'webp', label: 'WEBP' },
    { value: 'tiff', label: 'TIFF' },
    { value: 'bmp', label: 'BMP' },
    { value: 'heic', label: 'HEIC' },
    { value: 'heif', label: 'HEIF' },
    { value: 'ico', label: 'ICO' }
];

type Props = {
    value: string
    setValue: (value: string) => void
}

export function Combobox({ value, setValue }: Props) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? formats.find((format) => format.value === value)?.label
                        : "Select format..."}
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
                                key={format.value}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === format.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {format.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}