import { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiCpu, FiArrowRight, FiZap, FiUser } from 'react-icons/fi';
import API from '../services/api';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../lib/ticker';

// ─── Suggested quick prompts ────────────────────────────────────────
const QUICK_PROMPTS = [
  { text: 'Best running shoes under $150', icon: '🏃' },
  { text: 'Most comfortable sneakers', icon: '☁️' },
  { text: 'Top Nike shoes available', icon: '✨' },
  { text: 'Budget-friendly options', icon: '💰' },
];

// ─── Lightweight Markdown → HTML Parser ─────────────────────────────
function parseMarkdown(md) {
  if (!md) return '';
  const escaped = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const lines = escaped.split('\n');
  const html = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Headings
    if (line.startsWith('#### ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h4 class="ai-md-h4">${line.slice(5)}</h4>`);
      continue;
    }
    if (line.startsWith('### ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h3 class="ai-md-h3">${line.slice(4)}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h2 class="ai-md-h2">${line.slice(3)}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h1 class="ai-md-h1">${line.slice(2)}</h1>`);
      continue;
    }

    // Horizontal rule
    if (/^-{3,}$/.test(line.trim()) || /^\*{3,}$/.test(line.trim())) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<hr class="ai-md-hr" />');
      continue;
    }

    // Bullet list items: * item or - item
    const bulletMatch = line.match(/^\s*[\*\-]\s+(.+)/);
    if (bulletMatch) {
      if (!inList) { html.push('<ul class="ai-md-ul">'); inList = true; }
      html.push(`<li class="ai-md-li">${inlineMd(bulletMatch[1])}</li>`);
      continue;
    }

    // Close list if non-list line
    if (inList) { html.push('</ul>'); inList = false; }

    // Empty line → spacer
    if (line.trim() === '') {
      html.push('<div class="ai-md-spacer"></div>');
      continue;
    }

    // Normal paragraph
    html.push(`<p class="ai-md-p">${inlineMd(line)}</p>`);
  }
  if (inList) html.push('</ul>');
  return html.join('');
}

// Inline markdown: **bold**, *italic*, `code`
function inlineMd(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="ai-md-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="ai-md-italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="ai-md-code">$1</code>');
}

// ─── Typewriter Hook ────────────────────────────────────────────────
function useTypewriter(text, speed = 12) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayed('');
    setIsDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setIsDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, isDone };
}

// ─── Single AI message bubble ───────────────────────────────────────
function AiMessage({ message, products }) {
  const { displayed, isDone } = useTypewriter(message.text, message.role === 'ai' ? 10 : 0);
  const isAi = message.role === 'ai';

  // Try to match product names mentioned in the AI response
  const matchedProducts = useMemo(() => {
    if (!isAi || !products?.length) return [];
    const lower = message.text.toLowerCase();
    return products.filter(
      (p) => lower.includes((p.title || p.name || '').toLowerCase())
    ).slice(0, 3);
  }, [isAi, message.text, products]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-2.5 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
          isAi
            ? 'bg-gradient-to-br from-brand-accent to-purple-500 text-white shadow-[0_0_16px_rgba(10,132,255,0.35)]'
            : 'bg-white/10 text-neutral-300 border border-white/10'
        }`}
      >
        {isAi ? <FiCpu className="w-4 h-4" /> : <FiUser className="w-3.5 h-3.5" />}
      </div>

      {/* Message body */}
      <div className={`max-w-[85%] flex flex-col gap-2 ${isAi ? '' : 'items-end'}`}>
        {isAi ? (
          <div
            className="px-4 py-3 text-[13px] leading-relaxed rounded-2xl bg-white/[0.04] border border-white/[0.08] text-neutral-200 rounded-tl-md ai-md-container"
          >
            {isDone ? (
              <div dangerouslySetInnerHTML={{ __html: parseMarkdown(message.text) }} />
            ) : (
              <>
                <div dangerouslySetInnerHTML={{ __html: parseMarkdown(displayed) }} />
                <span className="inline-block w-[2px] h-4 bg-brand-accent ml-0.5 animate-ai-cursor" />
              </>
            )}
          </div>
        ) : (
          <div className="px-4 py-3 text-[13px] leading-relaxed rounded-2xl whitespace-pre-wrap bg-brand-accent/20 border border-brand-accent/30 text-white rounded-tr-md">
            {message.text}
          </div>
        )}

        {/* Matched product cards — only after typewriter completes */}
        {isAi && isDone && matchedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-2 w-full mt-1"
          >
            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest px-1">
              Recommended Products
            </span>
            {matchedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-accent/40 hover:bg-brand-accent/[0.06] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/30 flex-shrink-0">
                  <img
                    src={product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'}
                    alt={product.title || product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate group-hover:text-brand-accent transition-colors">
                    {product.title || product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-brand-accent font-black">
                      {formatPrice(typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0)}
                    </span>
                    <span className="text-[9px] text-neutral-500 uppercase tracking-wider">
                      {product.brand}
                    </span>
                  </div>
                </div>
                <FiArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Budget presets ─────────────────────────────────────────────────
const BUDGET_PRESETS = [
  { label: 'Under $50', value: 50 },
  { label: 'Under $100', value: 100 },
  { label: 'Under $150', value: 150 },
  { label: 'Under $200', value: 200 },
  { label: 'Under $300', value: 300 },
  { label: 'Under $500', value: 500 },
];

// ─── Suggested quick prompts ────────────────────────────────────────
const CHAT_PROMPTS = [
  { text: 'Best shoes for running', icon: '🏃' },
  { text: 'Most comfortable pair', icon: '☁️' },
  { text: 'Best value for money', icon: '💎' },
  { text: 'Good for daily wear', icon: '👟' },
];

// ─── Steps: 'budget' → 'brand' → 'chat' ────────────────────────────
const STEPS = { BUDGET: 'budget', BRAND: 'brand', CHAT: 'chat' };

// ─── Main AI Agent Component ────────────────────────────────────────
export default function AiAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(STEPS.BUDGET);
  const [budget, setBudget] = useState(null);
  const [customBudget, setCustomBudget] = useState('');
  const [brand, setBrand] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { products, brands } = useProducts();

  // Filter out 'All' from brand list
  const availableBrands = useMemo(
    () => brands.filter((b) => b !== 'All'),
    [brands]
  );

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat step is active
  useEffect(() => {
    if (isOpen && step === STEPS.CHAT) inputRef.current?.focus();
  }, [isOpen, step]);

  // ── Budget selection ────────────────────────────────────────────
  const handleBudgetSelect = (val) => {
    setBudget(val);
    setStep(STEPS.BRAND);
  };

  const handleCustomBudget = (e) => {
    e.preventDefault();
    const val = parseFloat(customBudget);
    if (val > 0) {
      setBudget(val);
      setCustomBudget('');
      setStep(STEPS.BRAND);
    }
  };

  // ── Brand selection ─────────────────────────────────────────────
  const handleBrandSelect = (b) => {
    setBrand(b);
    setStep(STEPS.CHAT);
  };

  // ── Send message (JSON body) ────────────────────────────────────
  const sendMessage = async (text) => {
    if (!text.trim() || !budget || !brand) return;
    const userMsg = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await API.post('/ai', {
        budget: budget,
        brand: brand,
        text: text.trim(),
      });
      const aiText = res.data?.response || 'Sorry, I could not generate a recommendation right now.';
      setMessages((prev) => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMsg = typeof detail === 'string' ? detail : 'Oops! Something went wrong. Please make sure you are logged in and try again.';
      setMessages((prev) => [...prev, { role: 'ai', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  // ── Reset session ───────────────────────────────────────────────
  const handleReset = () => {
    setStep(STEPS.BUDGET);
    setBudget(null);
    setBrand(null);
    setMessages([]);
    setInput('');
  };

  return (
    <>
      {/* ─── Floating Trigger Button ──────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-brand-accent to-purple-600 text-white flex items-center justify-center shadow-[0_0_40px_rgba(10,132,255,0.4),0_8px_32px_rgba(0,0,0,0.3)] cursor-pointer group"
            id="ai-agent-trigger"
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-brand-accent/30 animate-ai-pulse" />
            <FiMessageCircle className="w-7 h-7 relative z-10 group-hover:rotate-12 transition-transform duration-200" />
            {/* AI badge */}
            <span className="absolute -top-1 -right-1 bg-purple-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full shadow-lg border border-purple-400/50">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Chat Panel ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[30vw] min-w-[380px] max-w-[500px] flex flex-col overflow-hidden border-l border-white/[0.08] shadow-[-8px_0_60px_rgba(0,0,0,0.5),0_0_60px_rgba(10,132,255,0.08)]"
            style={{ backdropFilter: 'blur(40px) saturate(180%)', backgroundColor: 'rgba(10,10,10,0.92)' }}
            id="ai-agent-panel"
          >
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="relative px-5 py-4 flex items-center justify-between border-b border-white/[0.06] flex-shrink-0">
              {/* Gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-accent via-purple-500 to-pink-500" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-accent to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(10,132,255,0.3)]">
                  <FiZap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-tight">KICKS AI</h3>
                  <p className="text-[10px] text-emerald-400 font-bold tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    {step === STEPS.CHAT
                      ? `${brand} · Under $${budget}`
                      : 'Online — Ready to help'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Reset button — only visible after budget is set */}
                {step !== STEPS.BUDGET && (
                  <button
                    onClick={handleReset}
                    className="text-[10px] font-bold text-neutral-500 hover:text-brand-accent uppercase tracking-wider px-2 py-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                    title="Start over"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Step Progress Bar ──────────────────────────────── */}
            <div className="px-5 py-3 border-b border-white/[0.04] flex items-center gap-3 flex-shrink-0">
              {['Budget', 'Brand', 'Chat'].map((label, idx) => {
                const stepKeys = [STEPS.BUDGET, STEPS.BRAND, STEPS.CHAT];
                const currentIdx = stepKeys.indexOf(step);
                const isActive = idx === currentIdx;
                const isDone = idx < currentIdx;
                return (
                  <div key={label} className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                        isDone
                          ? 'bg-brand-accent text-black'
                          : isActive
                            ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/50'
                            : 'bg-white/5 text-neutral-600 border border-white/10'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        isActive ? 'text-white' : isDone ? 'text-brand-accent' : 'text-neutral-600'
                      }`}
                    >
                      {label}
                    </span>
                    {idx < 2 && (
                      <div className={`flex-1 h-[1px] ${isDone ? 'bg-brand-accent/40' : 'bg-white/5'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Content Area ────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 ai-scrollbar">

              {/* ═══════ STEP 1: Budget Selection ═══════ */}
              {step === STEPS.BUDGET && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center pt-4 pb-2 gap-5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-accent/20 to-purple-500/20 border border-brand-accent/20 flex items-center justify-center">
                    <span className="text-3xl">💰</span>
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white tracking-tight">
                      Set Your Budget
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1.5 max-w-[280px] leading-relaxed">
                      How much are you looking to spend? We'll find the best shoes within your range.
                    </p>
                  </div>

                  {/* Preset budget chips */}
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {BUDGET_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => handleBudgetSelect(preset.value)}
                        className="group flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-accent/40 hover:bg-brand-accent/[0.06] transition-all duration-300 cursor-pointer"
                      >
                        <span className="text-sm font-bold text-neutral-300 group-hover:text-white transition-colors">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Custom budget input */}
                  <form onSubmit={handleCustomBudget} className="flex items-center gap-2 w-full">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm font-bold">$</span>
                      <input
                        type="number"
                        value={customBudget}
                        onChange={(e) => setCustomBudget(e.target.value)}
                        placeholder="Custom amount"
                        min="1"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-7 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!customBudget || parseFloat(customBudget) <= 0}
                      className="px-4 py-3 rounded-xl bg-brand-accent/20 border border-brand-accent/30 text-brand-accent font-bold text-xs uppercase tracking-wider hover:bg-brand-accent/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Set
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ═══════ STEP 2: Brand Selection ═══════ */}
              {step === STEPS.BRAND && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center pt-4 pb-2 gap-5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-accent/20 to-purple-500/20 border border-brand-accent/20 flex items-center justify-center">
                    <span className="text-3xl">👟</span>
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white tracking-tight">
                      Pick a Brand
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1.5 max-w-[280px] leading-relaxed">
                      Budget set to <span className="text-brand-accent font-bold">${budget}</span>. Now choose your preferred brand.
                    </p>
                  </div>

                  {/* Brand chips */}
                  {availableBrands.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-2 w-full">
                      {availableBrands.map((b) => (
                        <button
                          key={b}
                          onClick={() => handleBrandSelect(b)}
                          className="group px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-accent/40 hover:bg-brand-accent/[0.06] transition-all duration-300 cursor-pointer"
                        >
                          <span className="text-xs font-bold text-neutral-300 group-hover:text-white uppercase tracking-wider transition-colors">
                            {b}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500">Loading brands...</p>
                  )}

                  {/* Back button */}
                  <button
                    onClick={() => setStep(STEPS.BUDGET)}
                    className="text-xs text-neutral-500 hover:text-white transition-colors cursor-pointer mt-2"
                  >
                    ← Change budget
                  </button>
                </motion.div>
              )}

              {/* ═══════ STEP 3: Chat ═══════ */}
              {step === STEPS.CHAT && (
                <>
                  {/* Welcome + quick prompts if no messages yet */}
                  {messages.length === 0 && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center text-center pt-4 pb-2 gap-4"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-accent/20 to-purple-500/20 border border-brand-accent/20 flex items-center justify-center">
                        <FiCpu className="w-7 h-7 text-brand-accent" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white tracking-tight">
                          You're All Set!
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1.5 max-w-[280px] leading-relaxed">
                          Looking for <span className="text-brand-accent font-bold">{brand}</span> shoes under{' '}
                          <span className="text-brand-accent font-bold">${budget}</span>. Ask me anything!
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 w-full mt-1">
                        {CHAT_PROMPTS.map((prompt) => (
                          <button
                            key={prompt.text}
                            onClick={() => sendMessage(prompt.text)}
                            className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-brand-accent/40 hover:bg-brand-accent/[0.05] transition-all duration-300 text-left cursor-pointer"
                          >
                            <span className="text-lg">{prompt.icon}</span>
                            <span className="text-xs text-neutral-300 group-hover:text-white transition-colors flex-1">
                              {prompt.text}
                            </span>
                            <FiArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-brand-accent group-hover:translate-x-0.5 transition-all" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Chat messages */}
                  {messages.map((msg, idx) => (
                    <AiMessage key={idx} message={msg} products={products} />
                  ))}

                  {/* Typing indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-purple-500 flex items-center justify-center shadow-[0_0_12px_rgba(10,132,255,0.25)]">
                        <FiCpu className="w-4 h-4 text-white" />
                      </div>
                      <div className="px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl rounded-tl-md">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-brand-accent/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-brand-accent/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-brand-accent/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* ── Input Bar — Only visible on Chat step ──────────── */}
            {step === STEPS.CHAT && (
              <form
                onSubmit={handleSubmit}
                className="px-4 py-3 border-t border-white/[0.06] flex items-center gap-2 flex-shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask about ${brand} shoes...`}
                  disabled={isLoading}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-all disabled:opacity-50"
                  id="ai-agent-input"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-accent to-purple-500 text-white flex items-center justify-center hover:shadow-[0_0_20px_rgba(10,132,255,0.4)] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                  id="ai-agent-send"
                >
                  <FiSend className="w-4.5 h-4.5" />
                </button>
              </form>
            )}

            {/* ── Footer ─────────────────────────────────────────── */}
            <div className="px-4 py-2 text-center border-t border-white/[0.04] flex-shrink-0">
              <p className="text-[9px] text-neutral-600 tracking-wider uppercase">
                Powered by Gemini AI · KICKS Expert Engine
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
