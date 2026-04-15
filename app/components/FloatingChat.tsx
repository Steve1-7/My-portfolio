'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Steve Ronald's portfolio assistant. I can help you learn about Steve's skills, projects, and navigate his portfolio. What would you like to know?"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = 'Sorry, something went wrong. Please try again.'
        
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error?.message) {
            errorMessage = errorData.error.message
          }
        } catch (e) {
          // If parsing fails, use default message
        }
        
        setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }])
        setIsLoading(false)
        return
      }

      const data = await response.json()
      const assistantMessage: Message = { role: 'assistant', content: data.message }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReset = () => {
    setMessages([{ role: 'assistant', content: "Hello! I'm Steve Ronald's portfolio assistant. I can help you learn about Steve's skills, projects, and navigate his portfolio. What would you like to know?" }])
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 160,
          left: 24,
          zIndex: 501,
          width: 46,
          height: 46,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#00FF00',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 255, 0, 0.35)',
          cursor: 'pointer',
          fontSize: 20,
          textDecoration: 'none'
        }}
        data-hover="true"
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: 216,
              left: 24,
              zIndex: 501,
              width: 380,
              height: 500,
              maxHeight: 'calc(100vh - 220px)',
              backgroundColor: '#1a1a1a',
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid #333',
                backgroundColor: '#222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>AI Assistant</span>
              <button
                onClick={handleReset}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  fontSize: 12,
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                New Chat
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                minHeight: 0
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      minWidth: 0,
                      borderRadius: 12,
                      padding: 10,
                      backgroundColor: message.role === 'user' ? '#0066cc' : '#333',
                      color: '#fff',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  >
                    {message.role === 'assistant' ? (
                      <div style={{ fontSize: 13, lineHeight: 1.5 }}>
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
                            p: ({ children }) => <p style={{ margin: '0 0 8px 0' }}>{children}</p>,
                            ul: ({ children }) => <ul style={{ margin: '0 0 8px 0', paddingLeft: 20 }}>{children}</ul>,
                            ol: ({ children }) => <ol style={{ margin: '0 0 8px 0', paddingLeft: 20 }}>{children}</ol>,
                            li: ({ children }) => <li style={{ marginBottom: 4 }}>{children}</li>,
                            a: ({ children, href }) => (
                              <a href={href} style={{ color: '#66b3ff', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p style={{ margin: 0, fontSize: 13, whiteSpace: 'pre-wrap' }}>{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div
                    style={{
                      borderRadius: 12,
                      padding: 10,
                      backgroundColor: '#333',
                      color: '#fff'
                    }}
                  >
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#888', animation: 'bounce 0.5s infinite' }} />
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#888', animation: 'bounce 0.5s 0.1s infinite' }} />
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#888', animation: 'bounce 0.5s 0.2s infinite' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: 12,
                borderTop: '1px solid #333',
                backgroundColor: '#222',
                display: 'flex',
                gap: 8,
                flexShrink: 0
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 8,
                  border: '1px solid #444',
                  backgroundColor: '#333',
                  color: '#fff',
                  fontSize: 13,
                  resize: 'none',
                  minHeight: 36,
                  maxHeight: 100,
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: input.trim() && !isLoading ? '#0066cc' : '#444',
                  color: '#fff',
                  fontSize: 13,
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  whiteSpace: 'nowrap'
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}
