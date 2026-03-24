'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface NavigationIntent {
  sectionId: string
  label: string
}

const QUICK_SUGGESTIONS = [
  "What do you do?",
  "View live projects",
  "How to hire Steve?",
  "Tech stack?"
]

const NAVIGATION_KEYWORDS: Array<{ intent: NavigationIntent; keywords: string[] }> = [
  { intent: { sectionId: 'hero', label: 'Home' }, keywords: ['home', 'top', 'hero', 'start'] },
  { intent: { sectionId: 'about', label: 'About' }, keywords: ['about', 'who are you', 'bio'] },
  { intent: { sectionId: 'skills', label: 'Skills' }, keywords: ['skills', 'tech stack', 'stack', 'technologies'] },
  { intent: { sectionId: 'projects', label: 'Projects' }, keywords: ['projects', 'work', 'portfolio projects'] },
  { intent: { sectionId: 'services', label: 'Services' }, keywords: ['services', 'offer', 'pricing'] },
  { intent: { sectionId: 'testimonials', label: 'Testimonials' }, keywords: ['testimonials', 'reviews', 'clients'] },
  { intent: { sectionId: 'gallery', label: 'Gallery' }, keywords: ['gallery', '3d', 'logos'] },
  { intent: { sectionId: 'contact', label: 'Contact' }, keywords: ['contact', 'hire', 'email', 'book'] }
]

const NAVIGATION_TRIGGERS = ['go to', 'take me to', 'navigate', 'scroll to', 'open section', 'show me']

function detectNavigationIntent(text: string): NavigationIntent | null {
  const normalized = text.toLowerCase().trim()
  const hasNavigationTrigger = NAVIGATION_TRIGGERS.some((trigger) => normalized.includes(trigger))

  for (const item of NAVIGATION_KEYWORDS) {
    const hasKeyword = item.keywords.some((keyword) => normalized.includes(keyword))
    if (hasKeyword && hasNavigationTrigger) {
      return item.intent
    }
  }

  return null
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hey! I'm Steve's AI assistant. Ask me anything about his work, services, or how to collaborate. 🚀"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, displayedText, scrollToBottom])

  // Typewriter effect for streaming response
  useEffect(() => {
    if (!currentStreamingId) return

    const currentMessage = messages.find(m => m.id === currentStreamingId)
    if (!currentMessage) return

    if (displayedText.length < currentMessage.content.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + currentMessage.content[prev.length])
      }, 15)
      return () => clearTimeout(timer)
    } else {
      setCurrentStreamingId(null)
    }
  }, [displayedText, messages, currentStreamingId])

  // Send message to API
  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    // Add user message
    const userMessageId = Date.now().toString()
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: text.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const navigationIntent = detectNavigationIntent(text)
    if (navigationIntent) {
      const section = document.getElementById(navigationIntent.sectionId)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        const navMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Done. I navigated to ${navigationIntent.label}.`
        }
        setMessages(prev => [...prev, navMessage])
      } else {
        const missingSectionMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I couldn't find the ${navigationIntent.label} section right now.`
        }
        setMessages(prev => [...prev, missingSectionMessage])
      }
      setIsLoading(false)
      inputRef.current?.focus()
      return
    }

    try {
      // Prepare messages for API, excluding streaming ones
      const apiMessages = messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.id === currentStreamingId ? displayedText : m.content
      }))
      apiMessages.push({
        role: 'user' as const,
        content: text.trim()
      })

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Connection error. Try again.')
      }

      if (!data?.success || !data?.message) {
        throw new Error(data?.error || 'Failed to get response')
      }

      // Add assistant message with streaming ID
      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: data.message
      }

      setMessages(prev => [...prev, assistantMessage])
      setDisplayedText('')
      setCurrentStreamingId(assistantMessageId)
      scrollToBottom()
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Connection error. Try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }, [messages, isLoading, currentStreamingId, displayedText, scrollToBottom])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      handleSendMessage(input)
    }
  }

  const handleQuickSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative w-14 h-14">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-purple-500 rounded-full opacity-30 blur-lg animate-pulse" />
          
          {/* Main button */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-purple-500 rounded-full opacity-10 backdrop-blur-md border border-green-500/30" />
          
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">
              {isOpen ? '✕' : '💬'}
            </span>
          </div>

          {/* Unread indicator (optional) */}
          {!isOpen && messages.length > 1 && (
            <motion.div
              className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] z-[9998] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(5, 5, 5, 0.8)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0, 255, 0, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.1)'
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-green-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <h3 className="text-sm font-mono text-white">Steve's AI Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-400 hover:text-green-500 transition-colors"
              >
                ─
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              <AnimatePresence initial={false}>
                {messages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-xs px-3 py-2 rounded-lg text-xs leading-relaxed font-mono"
                      style={{
                        background: message.role === 'user'
                          ? 'rgba(0, 255, 0, 0.15)'
                          : 'rgba(199, 125, 255, 0.1)',
                        border: message.role === 'user'
                          ? '1px solid rgba(0, 255, 0, 0.3)'
                          : '1px solid rgba(199, 125, 255, 0.2)',
                        color: message.role === 'user' ? '#00FF00' : '#E5E7EB'
                      }}
                    >
                      {/* Streaming text display */}
                      {currentStreamingId === message.id
                        ? displayedText
                        : message.content}
                      
                      {/* Blinking cursor for streaming */}
                      {currentStreamingId === message.id && (
                        <span className="inline-block w-1 h-3 ml-1 bg-green-500 animate-pulse" />
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isLoading && currentStreamingId === null && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="px-3 py-2 rounded-lg" style={{
                      background: 'rgba(199, 125, 255, 0.1)',
                      border: '1px solid rgba(199, 125, 255, 0.2)'
                    }}>
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: '#C77DFF' }}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions - Show only on first message or when empty */}
            {messages.length <= 1 && !isLoading && (
              <div className="px-4 py-3 border-t border-green-500/20 space-y-2">
                <p className="text-xs text-gray-500 font-mono mb-2">Try asking:</p>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_SUGGESTIONS.map((suggestion) => (
                    <motion.button
                      key={suggestion}
                      onClick={() => handleQuickSuggestion(suggestion)}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-xs px-2.5 py-2 rounded-lg font-mono transition-all text-left"
                      style={{
                        background: 'rgba(0, 255, 0, 0.08)',
                        border: '1px solid rgba(0, 255, 0, 0.2)',
                        color: '#00FF00'
                      }}
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-green-500/20 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Message..."
                className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-green-500/20 text-xs font-mono text-green-500 placeholder-gray-600 focus:outline-none focus:border-green-500/50 disabled:opacity-50 transition-colors"
              />
              <motion.button
                onClick={() => handleSendMessage(input)}
                disabled={isLoading || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(0, 255, 0, 0.2)',
                  color: '#00FF00',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                }}
              >
                →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
