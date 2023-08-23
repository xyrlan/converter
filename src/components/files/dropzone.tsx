'use client'
import { DropEvent, DropzoneState, FileRejection, useDropzone } from "react-dropzone"
import { ButtonProps } from "../ui/button"
import React, {useCallback} from 'react'
import { useConversions } from "./provider"

type Props = {
    onDrop?: <T extends File>(
        acceptedFiles: T[],
        fileRejections: FileRejection[],
        event: DropEvent
    ) => void
    children?: React.ReactNode | (({ open }: { open: () => void }) => React.ReactNode)
    dropzone: DropzoneState
}

export const Dropzone = ({ children }: any) => {

    const {setConversions, conversions, dropzone} = useConversions()

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragActive,
        isDragAccept,
        isDragReject } = dropzone

    const className = [isDragActive ? 'blur-sm' : '']
        .filter(Boolean)
        .join(' ')


    return (
        <div {...getRootProps({})} className="outline-none">
            {isDragActive && <DragActive/>}
            <input {...getInputProps()} />
            {children}
        </div >
    )
}

function DragActive() {
    return (
        <div className="backdrop-blur-md bg-white/20 fixed inset-0 flex justify-center items-center">
            <h2 className="text-center font-light text-3xl">Drop Files Anywhere Here</h2>
        </div>
    )
}