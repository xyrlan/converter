'use client'
import React, { useState } from 'react'

const UploadForm = () => {
    const [file, setFile] = useState<File>()
    const [to, setTo] = useState('')
    const [id, setId] = useState('')

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!file) return

        try {
            const data = new FormData()
            data.set('file', file)
            data.set('to', to)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: data,
            })

            if (!res.ok) throw new Error(await res.text())

            setId((await res.json()).id)
        } catch (e: any) {
            console.error(e)
        }

    }
    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    type='file'
                    name='file'
                    onChange={(e) => setFile(e.target.files?.[0])}
                />
                <div>
                    <label>To</label>
                    <input type="text" name="to" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
                <input type="submit" value="Upload" />
            </form>
        <a href='/api/download/${id}'>Download File</a>
        </>
    )
}

export default UploadForm