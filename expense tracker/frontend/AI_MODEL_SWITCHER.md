# AI Model Switcher Feature ✨

## Overview

The AI chat now supports switching between two AI models:
- **✨ Gemini** - Google's cloud-based AI (fast, powerful)
- **🖥️ Ollama** - Local AI running on your machine (private, offline)

## How It Works

### Frontend (AIChat.tsx)
The chat interface now includes a toggle switch in the header that lets users choose their preferred AI model.

```typescript
// State management
const [selectedModel, setSelectedModel] = useState<AIModel>('gemini')

// Dynamic endpoint selection
const endpoint = selectedModel === 'gemini' 
  ? 'http://localhost:8000/chat'      // Gemini endpoint
  : 'http://localhost:8000/olama'     // Ollama endpoint
```

### Backend Endpoints

#### 1. `/chat` - Gemini AI (Google)
- Uses Google's Gemini API
- Requires API key in `.env` file
- Cloud-based, fast responses
- Best for production use

#### 2. `/olama` - Ollama (Local)
- Uses locally running Ollama
- No API key needed
- Runs on your machine
- Best for privacy/offline use

## Visual Design

### Model Switcher UI
```
┌─────────────────────────────────────┐
│ 🤖 AI Financial Assistant      [×] │
├─────────────────────────────────────┤
│ ┌─────────────┬─────────────┐      │
│ │ ✨ Gemini   │  🖥️ Ollama  │      │
│ └─────────────┴─────────────┘      │
└─────────────────────────────────────┘
```

- **Active button**: White background, blue text, shadow
- **Inactive button**: Transparent, white text
- **Smooth transitions**: 200ms animation
- **Icons**: Sparkles for Gemini, CPU for Ollama

## Features

### ✅ Seamless Switching
- Switch models anytime during conversation
- No need to refresh or restart chat
- Instant model change

### ✅ Visual Feedback
- Active model highlighted in white
- Model name shown in empty state
- Clear visual distinction

### ✅ Error Handling
- Graceful error messages if model fails
- Shows specific error from backend
- Doesn't crash the chat

### ✅ Persistent State
- Selected model stays active during session
- Defaults to Gemini on first load
- Can be changed to remember preference (localStorage)

## Usage

### For Users
1. Click the chat button (bottom-right)
2. See the model switcher at the top
3. Click "Gemini" or "Ollama" to switch
4. Start chatting with your chosen model

### For Developers

#### To Add Model Persistence
```typescript
// Save to localStorage
const [selectedModel, setSelectedModel] = useState<AIModel>(
  (localStorage.getItem('aiModel') as AIModel) || 'gemini'
)

// Update when changed
const handleModelChange = (model: AIModel) => {
  setSelectedModel(model)
  localStorage.setItem('aiModel', model)
}
```

#### To Add More Models
1. Update the type:
```typescript
type AIModel = 'gemini' | 'ollama' | 'gpt4'
```

2. Add endpoint mapping:
```typescript
const endpoints = {
  gemini: 'http://localhost:8000/chat',
  ollama: 'http://localhost:8000/olama',
  gpt4: 'http://localhost:8000/gpt4'
}
```

3. Add button in UI:
```tsx
<button onClick={() => setSelectedModel('gpt4')}>
  <Zap className="w-4 h-4" />
  <span>GPT-4</span>
</button>
```

## Backend Requirements

### Gemini Setup
1. Get API key from Google AI Studio
2. Add to `.env`:
```env
GEMINI_API_KEY=your_api_key_here
```

### Ollama Setup
1. Install Ollama: https://ollama.ai
2. Pull a model:
```bash
ollama pull llama2
```
3. Ensure Ollama is running (it runs automatically after install)

## Benefits

### Why Two Models?

**Gemini (Cloud)**
- ✅ No local setup required
- ✅ Always up-to-date
- ✅ Powerful and fast
- ✅ No hardware requirements
- ❌ Requires internet
- ❌ Costs API credits

**Ollama (Local)**
- ✅ Complete privacy
- ✅ Works offline
- ✅ No API costs
- ✅ Full control
- ❌ Requires local setup
- ❌ Needs decent hardware

## Troubleshooting

### Gemini Not Working
- Check API key in `.env`
- Verify API key is valid
- Check internet connection
- Look at browser console for errors

### Ollama Not Working
- Ensure Ollama is installed
- Check if Ollama is running: `ollama list`
- Verify model is pulled: `ollama pull llama2`
- Check backend logs for connection errors

### Switch Not Appearing
- Clear browser cache
- Restart dev server: `npm run dev`
- Check console for TypeScript errors

## Future Enhancements

Possible improvements:
- [ ] Add model status indicators (online/offline)
- [ ] Show response time for each model
- [ ] Add model-specific settings
- [ ] Support custom Ollama models
- [ ] Add GPT-4 or Claude support
- [ ] Model comparison mode (side-by-side)

Enjoy your flexible AI assistant! 🚀
