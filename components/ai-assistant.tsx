'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/animations/glass-card'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const knowledgeBase = {
  skills: 'I specialize in full-stack development with React, Next.js, TypeScript, Node.js, and cloud technologies. I also have expertise in UI/UX design, 3D modeling with Blender, and AI integration using OpenAI APIs.',
  experience: 'I have 5+ years of experience building digital products. I\'ve worked with 20+ clients across various industries, completed 50+ projects, and founded multiple businesses including Eva Tech Studio.',
  projects: 'My featured projects include Eva Tech Studio (comprehensive digital solutions platform), Omni-Commute (ride-sharing SaaS), Gold Coast Mining Review (news platform), and CleanSmith (service booking platform). Each has a detailed case study.',
  contact: 'You can reach me at stevezuluu@gmail.com or connect on LinkedIn (steve-ronald1710s) and GitHub (Steve1-7). I typically respond within 24 hours and am available globally.',
  availability: 'I\'m currently available for new projects! I work with businesses of all sizes - from startups to established companies. You can schedule a meeting directly through my contact section.',
  eva_tech: 'Eva Tech Studio is my comprehensive digital solutions platform. We provide end-to-end software services including website design, UI/UX, software architecture, full-stack development, cloud deployment, SEO optimization, and ongoing maintenance. Visit eva-tech-studio.com to learn more.',
  pricing: 'Project pricing varies based on scope and complexity. I offer competitive rates with transparent pricing. Contact me with your project details for a custom quote.',
  timeline: 'Project timelines depend on complexity. A simple website typically takes 2-4 weeks, while complex platforms can take 2-6 months. I provide detailed timelines during the initial consultation.',
  default: 'I can help you learn about my skills, experience, projects, or how to work with me. Try asking about my tech stack, featured projects, or availability!',
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m Steve\'s AI assistant. Ask me about his skills, projects, experience, or how to work together!',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('skill') || lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
      return knowledgeBase.skills
    } else if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('years')) {
      return knowledgeBase.experience
    } else if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio')) {
      return knowledgeBase.projects
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
      return knowledgeBase.contact
    } else if (lowerMessage.includes('available') || lowerMessage.includes('hire') || lowerMessage.includes('work together')) {
      return knowledgeBase.availability
    } else if (lowerMessage.includes('eva') || lowerMessage.includes('studio') || lowerMessage.includes('agency')) {
      return knowledgeBase.eva_tech
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      return knowledgeBase.pricing
    } else if (lowerMessage.includes('timeline') || lowerMessage.includes('long') || lowerMessage.includes('duration')) {
      return knowledgeBase.timeline
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! I\'m here to help you learn about Steve\'s work and expertise. What would you like to know?'
    } else if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Feel free to ask if you have any other questions about Steve or his work.'
    } else {
      return knowledgeBase.default
    }
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    'What are your skills?',
    'Tell me about your projects',
    'Are you available for work?',
    'How can I contact you?',
  ]

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-neon to-purple text-black shadow-[0_0_30px_rgba(0,255,0,0.4)] flex items-center justify-center transition-all ${
          isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md"
          >
            <GlassCard className="overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon to-purple flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="font-syne font-bold text-sm">Steve's AI Assistant</div>
                    <div className="text-xs text-white/60 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                      Online
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-purple/20 text-purple' 
                        : 'bg-neon/20 text-neon'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`max-w-[80%] ${
                      message.role === 'user' 
                        ? 'bg-purple/20 border border-purple/30' 
                        : 'bg-white/5 border border-white/10'
                    } rounded-2xl px-4 py-2`}>
                      <p className="text-sm text-white/90">{message.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-neon/20 text-neon flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => setInput(question)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-neon/50 transition-colors"
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="h-10 w-10 rounded-lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
