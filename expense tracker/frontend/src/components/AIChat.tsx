import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { MessageCircle, Send, Bot, User, Sparkles, Cpu } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

type AIModel = 'gemini' | 'ollama'

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini')
  const { token } = useAuth()

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Choose endpoint based on selected model
      const endpoint = selectedModel === 'gemini' 
        ? `http://localhost:8000/chat?chat=${encodeURIComponent(input)}`
        : `http://localhost:8000/olama?chat=${encodeURIComponent(input)}`

      const response = await axios.post(
        endpoint,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: error.response?.data?.detail || 'Sorry, I encountered an error. Please try again.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-2xl w-96 h-[500px] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6" />
                <h3 className="font-semibold">AI Financial Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-800 rounded-lg p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Model Switcher */}
            <div className="flex items-center space-x-2 bg-blue-800 bg-opacity-50 rounded-lg p-1">
              <button
                onClick={() => setSelectedModel('gemini')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all duration-200 ${
                  selectedModel === 'gemini'
                    ? 'bg-white text-blue-700 font-semibold shadow-md'
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Gemini</span>
              </button>
              <button
                onClick={() => setSelectedModel('ollama')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all duration-200 ${
                  selectedModel === 'ollama'
                    ? 'bg-white text-blue-700 font-semibold shadow-md'
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span className="text-sm">Ollama</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="font-medium mb-2">Ask me anything about your expenses!</p>
                <p className="text-xs text-gray-400">
                  Using: {selectedModel === 'gemini' ? '✨ Gemini AI' : '🖥️ Ollama Local'}
                </p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && <Bot className="w-4 h-4 mt-1" />}
                    <p className="text-sm">{message.content}</p>
                    {message.role === 'user' && <User className="w-4 h-4 mt-1" />}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Ask about your expenses..."
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIChat
