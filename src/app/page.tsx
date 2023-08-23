
import { Button } from "@/components/ui/button";
import { FileManager } from "@/components/files/file-manager";
import { Dropzone } from "@/components/files/dropzone";
import OpenButton from "@/components/open-button";
import { useCallback } from "react";
import { useConversions } from "@/components/files/provider";
import Image from "next/image";

type HeroProps = {
  open: () => void
}

const Hero = () => (
  <section className="sm:py-32 py-24 flex flex-col items-center gap-16">
    <h1 className="text-4xl font-bold text-center [text-wrap-balance]">
      Convert any file to anything
    </h1>
    <OpenButton />
    <span className="hidden md:block">or</span>
    <p className="hidden md:block text-center text-xl font-semibold [text-wrap-balance]">Drag the file anywhere on the page <span className="text-neutral-400 font-normal text-sm"><br/>
      for now I can only convert images...</span></p>
  </section>
)

export default function Home() {

  return (
    <>
      <header className="container p-2">
        <div className="flex items-center gap-4">
          <Image className="" src='/images/magichatgrande2.png' width={32} height={32} alt="magicHat" />
          <h1 className="text-xl font-bold">Wizard File</h1>
        </div>
      </header>
      <Dropzone>
        <>
          <main className="sm:container mx-auto border-opacity-0 outline-black h-screen">
            <Hero />
            <FileManager
            />
          </main>
        </>
      </Dropzone>
    </>
  )
}
