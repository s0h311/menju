'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'

export default function Home() {
  const updateColors = () => {
    ;['primary', 'secondary', 'accent', 'text', 'bg'].forEach((color) => {
      const key = color === 'bg' ? '--bg-color' : '--' + color
      document.documentElement.style.setProperty(key, palette[color]!)
    })
  }

  const getColor = (color: keyof Colors): string => {
    const variable = color === 'bg' ? '--bg-color' : '--' + color
    return document.documentElement.style.getPropertyValue(variable)
  }

  type Colors = {
    [x: string]: string
    primary: string
    secondary: string
    accent: string
    text: string
    bg: string
  }

  const [palette, setPalette] = useState<Colors>({
    primary: getColor('primary'),
    secondary: getColor('secondary'),
    accent: getColor('accent'),
    text: getColor('text'),
    bg: getColor('bg'),
  })

  return (
    <section className='grid place-items-center gap-10 mt-10'>
      <h1 className='text-2xl flex items-center gap-1'>
        <p>Welcome to</p>
        <p className='italic'>Menju</p>
      </h1>
      <Link
        className='rounded-xl border border-accent px-3 py-1 text-xl active:border-none active:bg-accent active:text-primary'
        href='/menu?r=1&t=15'
      >
        Go to Demo
      </Link>

      <Link
        className='rounded-xl border border-accent px-3 py-1 text-xl active:border-none active:bg-accent active:text-primary'
        href='/login'
      >
        Go to Login
      </Link>

      <Link
        className='rounded-xl border border-accent px-3 py-1 text-xl active:border-none active:bg-accent active:text-primary'
        href='/kitchen'
      >
        Go to Kitchen Dashboard
      </Link>

      <Link
        className='rounded-xl border border-accent px-3 py-1 text-xl active:border-none active:bg-accent active:text-primary'
        href='/admin'
      >
        Go to Admin Dashboard
      </Link>

      <h3 className='text-lg'>Primary</h3>
      <HexColorPicker
        color={palette.primary}
        onChange={(color) => {
          setPalette((palette) => ({ ...palette, primary: color }))
          updateColors()
        }}
      />

      <h3 className='text-lg'>Secondary</h3>
      <HexColorPicker
        color={palette.secondary}
        onChange={(color) => {
          setPalette((palette) => ({ ...palette, secondary: color }))
          updateColors()
        }}
      />

      <h3 className='text-lg'>Accent</h3>
      <HexColorPicker
        color={palette.accent}
        onChange={(color) => {
          setPalette((palette) => ({ ...palette, accent: color }))
          updateColors()
        }}
      />

      <h3 className='text-lg'>Background</h3>
      <HexColorPicker
        color={palette.bg}
        onChange={(color) => {
          setPalette((palette) => ({ ...palette, bg: color }))
          updateColors()
        }}
      />

      <h3 className='text-lg'>Text</h3>
      <HexColorPicker
        color={palette.text}
        onChange={(color) => {
          setPalette((palette) => ({ ...palette, text: color }))
          updateColors()
        }}
      />
    </section>
  )
}
