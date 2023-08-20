'use client'

import { useCallback, useState } from "react";
import UploadForm from "./form";
import { useDropzone } from "react-dropzone";
import { Button, ButtonProps } from "@/components/ui/button";
import { StringReference } from "aws-sdk/clients/connect";
import { fileExtensionToMime } from "@/lib/file";
import { FileConversion, FileManager } from "@/components/file-manager";
import { Dropzone } from "@/components/dropzone";

type HeroProps = {
  open: () => void
}

const Hero = ({ open }: HeroProps) => (
  <section className="py-32 flex flex-col items-center gap-16">
    <h1 className="text-4xl font-bold text-center [text-wrap-balance]">
      Convert any file to anything
    </h1>
    <Button variant='default' onClick={open}>
      Click to Upload
    </Button>
  </section>
)

export default function Home() {
  const [conversions, setConversions] = useState<FileConversion[]>([])
  const onDrop = useCallback((files: File[]) => {
    setConversions(files.map((file) => ({ file })))
  }, [])

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
      setConversions([{ ...conversions[0], resultId: id }])
    } catch (e: any) {
      console.error(e)
    }

  }

  return (
    <Dropzone onDrop={onDrop}>
      {({ open }) => (
        <main className="container mx-auto">
          <Hero open={open} />
          {conversions.length > 0 && (
              <FileManager
                conversions={conversions}
                setConversions={setConversions}
                onConvert={() => onSubmit()}
              />
            )}
        </main>
      )}
    </Dropzone>
  )
}
