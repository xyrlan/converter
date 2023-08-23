'use client'
import React from 'react'
import { Button } from './ui/button'
import { useConversions } from './files/provider'


const OpenButton = () => {
    const { dropzone } = useConversions()
    const { open } = dropzone

    return (
        <Button variant='default' onClick={open}>
            Click to Upload
        </Button>
    )
}

export default OpenButton