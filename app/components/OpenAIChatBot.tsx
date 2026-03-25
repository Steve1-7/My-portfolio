import { ChatBot } from './ChatBot'

export function OpenAIChatBot() {
  return (
    <ChatBot
      apiEndpoint="/api/chat-openai"
      assistantName="Steve's OpenAI Assistant"
    />
  )
}

