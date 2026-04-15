'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

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
  "Tech stack?",
  "Explain React hooks",
  "Help me with TypeScript"
]

const STORAGE_KEY = 'steve-portfolio-chat-history'

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

function buildClientFallbackReply(userMessage: string): string {
  const message = userMessage.toLowerCase()

  if (message.includes('hire') || message.includes('work') || message.includes('project')) {
    return 'Steve is available for freelance and contract work. You can reach him at stevezuluu@gmail.com with your scope, timeline, and budget.'
  }

  if (message.includes('stack') || message.includes('tech') || message.includes('technolog')) {
    return 'Steve works across React, Next.js, TypeScript, Node.js, Figma, and Blender, with a focus on premium UX and modern delivery.'
  }

  if (message.includes('where') || message.includes('location') || message.includes('based')) {
    return 'Steve is based in South Africa and works remotely with global clients on web, brand, and 3D experiences.'
  }

  return 'I can help with Steve’s services, tech stack, and availability. If you tell me which section you want (projects, about, skills, contact), I can take you there.'
}

interface ChatBotProps {
  apiEndpoint?: string
  assistantName?: string
}

export function ChatBot({
  apiEndpoint = '/api/chat-openai',
  assistantName = "Steve's AI Assistant",
}: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
          }
        }
      } catch (e) {
        // Ignore storage errors
      }
    }
    return [{
      id: '0',
      role: 'assistant',
      content: "Hey! I'm Steve's AI assistant. I can help with anything - from questions about Steve's work to general coding, technology, or creative topics. What's on your mind? 🚀"
    }]
  })
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, displayedText, scrollToBottom])

  // Save messages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch (e) {
        // Ignore storage errors
      }
    }
  }, [messages])

  // Reset chat
  const handleResetChat = useCallback(() => {
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: "Chat reset. I'm ready to help with anything - from questions about Steve's work to general coding, technology, or creative topics. What's on your mind? 🚀"
    }])
    setInput('')
    setDisplayedText('')
    setCurrentStreamingId(null)
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        // Ignore storage errors
      }
    }
  }, [])

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

  // Copy to clipboard
  const handleCopyToClipboard = useCallback((text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
  }, [])

  // Send message to API with streaming support
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
      // Prepare messages for API
      const apiMessages = messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.id === currentStreamingId ? displayedText : m.content
      }))
      apiMessages.push({
        role: 'user' as const,
        content: text.trim()
      })

      // Use non-streaming for now (streaming can be enabled later)
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages })
      })

      // Check response status
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error')
        console.error('API error response:', response.status, errorText)
        throw new Error(`Server error (${response.status}): ${errorText.slice(0, 200)}`)
      }

      // Check content type
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        const raw = await response.text().catch(() => '')
        console.error('Non-JSON response:', contentType, raw.slice(0, 200))
        throw new Error(`Server returned non-JSON response. Please try again.`)
      }

      // Parse JSON
      let data: any = null
      try {
        data = await response.json()
      } catch (error) {
        console.error('Failed to parse JSON response:', error)
        throw new Error('Invalid response from server. Please try again.')
      }

      // Validate response structure
      if (!data?.success) {
        throw new Error(data?.error || 'Request failed. Please try again.')
      }

      if (!data?.message) {
        throw new Error('No response from server. Please try again.')
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Chat error:', error)
        console.error('Error details:', error instanceof Error ? error.message : String(error))
      }
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
  }, [messages, isLoading, currentStreamingId, displayedText, scrollToBottom, apiEndpoint])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
                <h3 className="text-sm font-mono text-white">{assistantName}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetChat}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  title="Reset chat"
                >
                  ↻
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-gray-400 hover:text-green-500 transition-colors"
                >
                  ─
                </button>
              </div>
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
                      className="max-w-[85%] px-3 py-2 rounded-lg text-xs leading-relaxed"
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
                      {/* Markdown rendering for assistant messages */}
                      {message.role === 'assistant' ? (
                        <div className="prose prose-invert prose-xs max-w-none">
                          <ReactMarkdown
                            components={{
                              code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    className="rounded-md"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                )
                              },
                              p: ({ children }) => <p className="mb-1">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc list-inside mb-1">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-1">{children}</ol>,
                              li: ({ children }) => <li className="mb-0.5">{children}</li>,
                              a: ({ children, href }) => (
                                <a href={href} className="text-green-400 hover:text-green-300 underline" target="_blank" rel="noopener noreferrer">
                                  {children}
                                </a>
                              ),
                              strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                            }}
                          >
                            {currentStreamingId === message.id
                              ? displayedText
                              : message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        /* Plain text for user messages */
                        <span className="font-mono">
                          {currentStreamingId === message.id
                            ? displayedText
                            : message.content}
                        </span>
                      )}
                      
                      {/* Blinking cursor for streaming */}
                      {currentStreamingId === message.id && (
                        <span className="inline-block w-1 h-3 ml-1 bg-green-500 animate-pulse" />
                      )}

                      {/* Copy button for assistant messages */}
                      {message.role === 'assistant' && currentStreamingId !== message.id && (
                        <button
                          onClick={() => handleCopyToClipboard(message.content)}
                          className="ml-2 text-gray-500 hover:text-green-500 transition-colors text-xs"
                          title="Copy to clipboard"
                        >
                          📋
                        </button>
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
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Message... (Shift+Enter for new line)"
                rows={1}
                className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-green-500/20 text-xs font-mono text-green-500 placeholder-gray-600 focus:outline-none focus:border-green-500/50 disabled:opacity-50 transition-colors resize-none"
                style={{ minHeight: '40px', maxHeight: '120px' }}
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
