import { useEffect, useRef } from 'react'

export function GlobalAudioManager() {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const resume = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      if (audioContextRef.current.state === 'suspended') {
        void audioContextRef.current.resume()
      }
    }

    document.addEventListener('click', resume, { once: true })
    document.addEventListener('keydown', resume, { once: true })

    return () => {
      document.removeEventListener('click', resume)
      document.removeEventListener('keydown', resume)
      void audioContextRef.current?.close()
    }
  }, [])

  return null
}
