'use client'
import React from 'react'
import { Button } from './ui/button'


const OpenButton = ({open}: any) => {
    return (
        <Button variant='default' onClick={open}>
            Click to Upload
        </Button>
    )
}

export default OpenButton