import { DropEvent, FileRejection, useDropzone } from "react-dropzone"
import { ButtonProps } from "./ui/button"

type Props = {
    onDrop?: <T extends File>(
        acceptedFiles: T[],
        fileRejections: FileRejection[],
        event: DropEvent
    ) => void
    children?: React.ReactNode | (({ open }: { open: () => void }) => React.ReactNode)
}

export const Dropzone = ({ onDrop, children }: Props) => {

    const {
        open,
        getRootProps,
        getInputProps,
        isFocused,
        isDragActive,
        isDragAccept,
        isDragReject } = useDropzone({ onDrop, noClick: true })

    const className = [isDragActive && 'border border-blue-500']
        .filter(Boolean)
        .join(' ')


    return (
        <div {...getRootProps({ className })}>
            <input {...getInputProps()} />
            {typeof children === 'function' ? children({ open }) : children}
        </div >
    )
}