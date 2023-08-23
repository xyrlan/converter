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

const Hero = () => (
  <section className="py-32 flex flex-col items-center gap-16">
    <h1 className="text-4xl font-bold text-center [text-wrap-balance]">
      Convert any file to anything
    </h1>
    <OpenButton />
  </section>
)

export default function Home() {

  const { setConversions, conversions, dropzone } = useConversions()

  //   const onDrop = useCallback((files: File[]) => {
  //     setConversions(files.map((file) => ({ file })))
  // }, [])

  return (
    <>
      <header>
        {/* <Image src='' /> */}
      </header>
      <Dropzone>
        <>
          <main className="container mx-auto border-opacity-0 outline-black h-screen">
            <Hero />
            <FileManager
            />
          </main>
        </>
      </Dropzone>
    </>
  )
}
