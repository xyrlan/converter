'use client'

import { FileConversion, PageDropzone, StagedFiles } from "../components/upload"
import { useCallback, useState } from "react";
import UploadForm from "./form";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { StringReference } from "aws-sdk/clients/connect";
import { fileExtensionToMime } from "@/lib/file";

type HeroProps = {
  open: () => void
}

const Hero = ({ open }: HeroProps) => (
  <section className="py-32 flex flex-col items-center gap-16">
    <h1 className="text-4xl font-bold text-center [text-wrap-balance]">
      Convert any file to anything
    </h1>
    <Button onClick={open} variant="default" >
      Click to Upload File
    </Button>
  </section>
)

export default function Home() {
  const [conversions, setConversions] = useState<FileConversion[]>([])

  const onDrop = useCallback((files: File[]) => {
    setConversions(files.map((file) => ({ file })))
  }, [])

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

  const onSubmit = async () => {
    if (!conversions.length) return

    try {
      const data = new FormData()
      data.set('file', conversions[0].file as File)
      data.set('to', fileExtensionToMime(conversions[0].to as string) as string)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })

      if (!res.ok) throw new Error(await res.text())

      const { id } = await res.json()
      setConversions([{ ...conversions[0], resultId: id}])
    } catch (e: any) {
      console.error(e)
    }

  }

  return (
    <div {...getRootProps({ className })}>
      <input {...getInputProps()} />
      <main className="container mx-auto">
        <Hero open={open} />
        <StagedFiles conversions={conversions} setConversions={setConversions} onConvert={() => onSubmit()}/>
      </main>
    </div>
  )
}
