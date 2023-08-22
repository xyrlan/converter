'use client'
import { Button } from "@/components/ui/button";
import { FileManager } from "@/components/files/file-manager";
import { Dropzone } from "@/components/files/dropzone";
import OpenButton from "@/components/open-button";
import { useCallback } from "react";
import { useConversions } from "@/components/files/provider";

type HeroProps = {
  open: () => void
}

const Hero = ({ open }: HeroProps) => (
  <section className="py-32 flex flex-col items-center gap-16">
    <h1 className="text-4xl font-bold text-center [text-wrap-balance]">
      Convert any file to anything
    </h1>
    <OpenButton open={open}/>
  </section>
)

export default function Home() {

 const {setConversions, conversions} = useConversions()

  const onDrop = useCallback((files: File[]) => {
    setConversions(files.map((file) => ({ file })))
}, [])

  return (
    <>
      <header>
        {/* <Image src='' /> */}
      </header>
      <Dropzone onDrop={onDrop}>
        {({ open }) => (
          <main className="container mx-auto border-opacity-0 outline-black h-screen">
            <Hero open={open} />
            <FileManager
            />
          </main>
        )}
      </Dropzone>
    </>
  )
}
