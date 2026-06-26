'use client'

import React from 'react'

export function MeshGradient() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple2/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-neon/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
    </div>
  )
}
