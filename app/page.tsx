'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  const [input, setInput] = useState('')
  const [image, setImage] = useState('')
  const [audio, setAudio] = useState('')
  const [video, setVideo] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  async function callApi() {
    try {
      if (!input) return
      setImage('')
      setAudio('')
      setVideo('')
      setText('')
      setLoading(true)
      const response = await fetch('/api/gpt', {
        method: "POST",
        body: JSON.stringify({
          query: input
        })
      })
      console.log('response:', response)
      const { data, type } = await response.json()
      console.log('data:', data)
      if (type === 'image') {
        setImage(data[0])
        setLoading(false)
      }
      if (type === 'video') {
        setVideo(data[0])
        setLoading(false)
      }
      if (type === 'audio') {
        setAudio(data)
        setLoading(false)
      }
      if (type == 'text') {
        setText(data)
        setLoading(false)
      }
    } catch (err) {
      console.log('error;', err)
    }
  }

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <Card className="">
        <CardHeader>
          <CardTitle>OpenAI natural language processing</CardTitle>
          <CardDescription>Create images, videos, audio, and text with natural language</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            id='prompt'
            className='w-[400px]'
            autoFocus
            placeholder='Enter a prompt'
            onChange={e => setInput(e.target.value)}
          />
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button
            onClick={callApi}
          >Create</Button>
          {loading && <p className='text-sm text-zinc-500 animate-pulse'>Loading...</p>}
        </CardFooter>
      </Card>
      <div className='flex flex-col items-center'>
        {
          image && <Image className='mt-10 pl-20' src={image} alt="An image" width={500} height={500} />
        }
        {
          video && <video className='mt-10' src={video} controls></video>
        }
        {
          text && <p className='mt-10 text-lg'>{text}</p>
        }
        {
          audio && (
            <audio className='mt-10' controls>
              <source src={audio} type="audio/wav"></source>
            </audio>
          )
        }
      </div>
    </main>
  )
}
