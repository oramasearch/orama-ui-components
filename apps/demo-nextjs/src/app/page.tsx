'use client'
import dynamic from 'next/dynamic'

const Orama = dynamic(() => import('./Orama'), {
  ssr: false,
})

export default function Home() {
  return (
    <div>
      <Orama />
    </div>
  )
}
