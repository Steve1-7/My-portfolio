'use client'

import { useState, useEffect } from 'react'

export function SkipToContent() {
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsFocused(true)
      }
    }

    const handleMouseDown = () => {
      setIsFocused(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  const handleClick = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className={`fixed top-0 left-0 z-[100] px-4 py-3 bg-neon text-black font-bold text-sm transition-transform ${
        isFocused ? 'translate-y-0' : '-translate-y-full'
      } focus:translate-y-0 focus:outline-none focus:ring-4 focus:ring-neon/50`}
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  )
}
