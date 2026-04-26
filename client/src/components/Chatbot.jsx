import { useState } from 'react'
import axios from 'axios'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! 👋 I am your learning assistant. Ask me anything!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await axios.post('/api/chat', { message: input })
      setMessages(prev => [...prev, { from: 'bot', text: res.data.reply }])
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, something went wrong!' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 56, height: 56, borderRadius: '50%',
          background: '#0d6efd', color: 'white',
          border: 'none', fontSize: 24, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}
      >
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24,
          width: 340, height: 450,
          background: 'white', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0d6efd', color: 'white',
            padding: '12px 16px', borderRadius: '12px 12px 0 0',
            fontWeight: 'bold'
          }}>
            🤖 Learning Assistant
          </div>

          <div style={{
            flex: 1, overflowY: 'auto',
            padding: 12, display: 'flex',
            flexDirection: 'column', gap: 8
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                background: msg.from === 'user' ? '#0d6efd' : '#f0f0f0',
                color: msg.from === 'user' ? 'white' : 'black',
                padding: '8px 12px', borderRadius: 12,
                maxWidth: '80%', fontSize: 13
              }}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                background: '#f0f0f0',
                padding: '8px 12px',
                borderRadius: 12,
                fontSize: 13
              }}>
                Typing...
              </div>
            )}
          </div>

          <div style={{
            padding: 10, borderTop: '1px solid #eee',
            display: 'flex', gap: 8
          }}>
            <input
              style={{
                flex: 1, padding: '8px 12px',
                borderRadius: 20, border: '1px solid #ddd',
                fontSize: 13, outline: 'none'
              }}
              placeholder='Ask a question...'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              onClick={sendMessage}
              style={{
                background: '#0d6efd', color: 'white',
                border: 'none', borderRadius: 20,
                padding: '8px 14px', cursor: 'pointer',
                fontSize: 13
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}