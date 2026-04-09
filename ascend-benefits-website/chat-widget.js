(function() {
  'use strict';

  // ── CONFIG ── swap these when you go live ──────────────────────────
  const CALENDLY_URL = 'https://calendly.com/chase-insurancepro/30min'; // ← replace
  // ──────────────────────────────────────────────────────────────────

  const SYSTEM_PROMPT = `You are an expert benefits consultant assistant for Ascend Benefits Consulting Group. Your name is Avery. You work directly with Chase Webb, President of Ascend Benefits, who has 15 years of experience in health insurance.

Your job is to:
1. Answer questions about employee benefits, health insurance, level-funded plans, self-funded/ERISA plans, stop-loss insurance, and the Ascend Preventive Care Program (SIMERP).
2. Qualify leads by naturally learning about their business during the conversation.
3. Guide interested visitors toward booking a free benefits analysis with Chase.

KEY FACTS TO KNOW:
- Ascend specializes in level-funded and self-funded ERISA plans for employers with 2–250 employees
- Employers can save up to 30% vs traditional fully-insured group plans
- With level-funded/self-funded plans, employers pay only for actual claims — not estimated premiums
- Surplus is returned to the employer if claims come in under budget
- Stop-loss insurance protects against catastrophic claims — no billing above the stop-loss threshold
- PPO networks available: UnitedHealth, Cigna, BCBS, Aetna, PHCS (same access, smarter pricing)
- Ascend also offers a Preventive Care Program (SIMERP) that saves employers ~$640/employee/year in FICA taxes at $0 net cost
- The SIMERP program is administered by EHP and Revive Health, with 85–90% employee participation
- Traditional fully-insured plans: premiums rise every year, zero claims transparency, carrier keeps surplus
- Self-funded: employee claims paid from company budget, full claims transparency, keep surplus, backed by stop-loss
- Level-funded: fixed monthly payments split into claims fund + stop-loss + admin fees, potential refund at year end
- No cash advance required (unlike many other TPAs)
- Ascend is 100% independent — not tied to any carrier, works with top-rated TPAs
- Phone: (615) 559-9387 | Virtual & nationwide

QUALIFYING QUESTIONS TO NATURALLY ASK (don't ask all at once):
- How many employees do they have?
- Do they currently offer health benefits?
- What type of plan are they on (traditional, level-funded, self-funded)?
- What's their biggest pain point (cost, talent retention, lack of transparency)?

PERSONALITY & TONE:
- Warm, knowledgeable, consultative — not salesy
- Educate first, then guide toward a call
- Keep responses concise — 2–4 sentences max unless they ask for detail
- Use plain language, not insurance jargon
- If someone asks a question outside your expertise, say you'll have Chase follow up personally

BOOKING APPOINTMENTS:
- When someone expresses interest in a free analysis, savings estimate, or wants to talk to Chase, offer to book them via Calendly
- Say something like: "I'd love to get you on Chase's calendar for a free 15-minute benefits analysis — no obligation at all. Want me to send you the booking link?"
- When they say yes, respond with: "SHOW_CALENDLY_BUTTON" (exactly that — the system will display the button)

IMPORTANT: Never make up specific numbers, savings amounts, or plan details that aren't in the facts above. If unsure, say Chase can walk them through specifics on a call.`;

  const STYLES = `
    #ascend-chat-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
    #ascend-chat-toggle {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #0D1F3C 0%, #1e3d72 100%);
      border: 3px solid #C9A84C; cursor: pointer;
      box-shadow: 0 8px 32px rgba(13,31,60,0.35);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #ascend-chat-toggle:hover { transform: scale(1.08); box-shadow: 0 12px 40px rgba(13,31,60,0.45); }
    #ascend-chat-toggle svg { width: 28px; height: 28px; color: #C9A84C; transition: opacity 0.2s; }
    #ascend-chat-toggle .icon-close { display: none; }
    #ascend-chat-toggle.open .icon-chat { display: none; }
    #ascend-chat-toggle.open .icon-close { display: block; }

    #ascend-chat-pulse {
      position: fixed; bottom: 24px; right: 24px; z-index: 9998;
      width: 72px; height: 72px; border-radius: 50%;
      background: rgba(201,168,76,0.25);
      animation: ascend-pulse 2.5s ease-out infinite;
      pointer-events: none;
    }
    @keyframes ascend-pulse {
      0% { transform: scale(1); opacity: 1; }
      70% { transform: scale(1.6); opacity: 0; }
      100% { transform: scale(1.6); opacity: 0; }
    }

    #ascend-chat-window {
      position: fixed; bottom: 104px; right: 28px; z-index: 9998;
      width: 380px; height: 560px;
      background: #fff; border-radius: 16px;
      box-shadow: 0 20px 60px rgba(13,31,60,0.2), 0 4px 20px rgba(13,31,60,0.1);
      display: flex; flex-direction: column; overflow: hidden;
      transform: scale(0.9) translateY(20px); opacity: 0; pointer-events: none;
      transition: transform 0.25s ease, opacity 0.25s ease;
      border: 1px solid rgba(13,31,60,0.08);
    }
    #ascend-chat-window.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

    .acw-header {
      background: linear-gradient(135deg, #0D1F3C 0%, #162d56 100%);
      padding: 18px 20px; display: flex; align-items: center; gap: 12px;
      border-bottom: 2px solid #C9A84C;
    }
    .acw-avatar {
      width: 42px; height: 42px; border-radius: 50%;
      background: rgba(201,168,76,0.15); border: 2px solid #C9A84C;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .acw-avatar svg { width: 22px; height: 22px; color: #C9A84C; }
    .acw-header-text { flex: 1; }
    .acw-header-name { font-size: 0.95rem; font-weight: 600; color: #fff; line-height: 1.2; }
    .acw-header-status { font-size: 0.72rem; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
    .acw-status-dot { width: 7px; height: 7px; background: #22c55e; border-radius: 50%; flex-shrink: 0; }
    .acw-header-sub { font-size: 0.7rem; color: rgba(201,168,76,0.8); margin-top: 1px; }

    .acw-messages {
      flex: 1; overflow-y: auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 12px;
      background: #F8F6F1;
    }
    .acw-messages::-webkit-scrollbar { width: 4px; }
    .acw-messages::-webkit-scrollbar-track { background: transparent; }
    .acw-messages::-webkit-scrollbar-thumb { background: rgba(13,31,60,0.15); border-radius: 4px; }

    .acw-msg { display: flex; flex-direction: column; max-width: 88%; }
    .acw-msg.bot { align-self: flex-start; }
    .acw-msg.user { align-self: flex-end; }
    .acw-bubble {
      padding: 10px 14px; border-radius: 12px; font-size: 0.875rem; line-height: 1.55;
    }
    .acw-msg.bot .acw-bubble {
      background: #fff; color: #0D1F3C;
      border-radius: 4px 12px 12px 12px;
      box-shadow: 0 1px 4px rgba(13,31,60,0.08);
      border: 1px solid rgba(13,31,60,0.06);
    }
    .acw-msg.user .acw-bubble {
      background: #0D1F3C; color: #fff;
      border-radius: 12px 4px 12px 12px;
    }
    .acw-msg-time { font-size: 0.65rem; color: #9aabbd; margin-top: 4px; padding: 0 4px; }
    .acw-msg.user .acw-msg-time { text-align: right; }

    .acw-typing {
      display: flex; align-items: center; gap: 4px; padding: 10px 14px;
      background: #fff; border-radius: 4px 12px 12px 12px;
      box-shadow: 0 1px 4px rgba(13,31,60,0.08);
      border: 1px solid rgba(13,31,60,0.06);
      width: fit-content;
    }
    .acw-typing span {
      width: 7px; height: 7px; background: #C9A84C; border-radius: 50%;
      animation: acw-bounce 1.2s ease-in-out infinite;
    }
    .acw-typing span:nth-child(2) { animation-delay: 0.2s; }
    .acw-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes acw-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    .acw-calendly-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: #C9A84C; color: #0D1F3C;
      font-size: 0.82rem; font-weight: 700;
      padding: 10px 16px; border-radius: 8px;
      text-decoration: none; margin-top: 8px;
      transition: background 0.2s; border: none; cursor: pointer;
      letter-spacing: 0.02em;
    }
    .acw-calendly-btn:hover { background: #e2c06a; }
    .acw-calendly-btn svg { width: 14px; height: 14px; }

    .acw-quick-replies {
      display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px;
      background: #F8F6F1;
    }
    .acw-qr {
      background: #fff; border: 1.5px solid rgba(13,31,60,0.15);
      color: #0D1F3C; font-size: 0.75rem; font-weight: 500;
      padding: 6px 12px; border-radius: 100px; cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      white-space: nowrap;
    }
    .acw-qr:hover { border-color: #C9A84C; background: #f5e9c8; }

    .acw-input-area {
      padding: 12px 14px; background: #fff;
      border-top: 1px solid rgba(13,31,60,0.08);
      display: flex; gap: 8px; align-items: flex-end;
    }
    .acw-input {
      flex: 1; background: #F8F6F1; border: 1.5px solid rgba(13,31,60,0.1);
      border-radius: 10px; padding: 10px 14px;
      font-size: 0.875rem; color: #0D1F3C; outline: none; resize: none;
      max-height: 100px; min-height: 40px; line-height: 1.4;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    .acw-input:focus { border-color: #C9A84C; }
    .acw-input::placeholder { color: #9aabbd; }
    .acw-send {
      width: 40px; height: 40px; border-radius: 10px;
      background: #0D1F3C; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s; flex-shrink: 0;
    }
    .acw-send:hover { background: #C9A84C; }
    .acw-send:disabled { background: #ccc; cursor: not-allowed; }
    .acw-send svg { width: 17px; height: 17px; color: #fff; }

    .acw-footer {
      text-align: center; padding: 6px 0 8px;
      font-size: 0.62rem; color: #b0bec5; background: #fff;
      border-top: 1px solid rgba(13,31,60,0.05);
    }

    #ascend-chat-bubble {
      position: fixed; bottom: 100px; right: 28px; z-index: 9997;
      background: #0D1F3C; color: #fff;
      padding: 10px 16px; border-radius: 12px 12px 4px 12px;
      font-size: 0.82rem; font-weight: 500; max-width: 220px;
      box-shadow: 0 4px 20px rgba(13,31,60,0.2);
      animation: acw-fadein 0.4s ease 2s both;
      cursor: pointer;
    }
    #ascend-chat-bubble span { color: #C9A84C; font-weight: 700; }
    @keyframes acw-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 480px) {
      #ascend-chat-window { width: calc(100vw - 24px); right: 12px; bottom: 96px; height: 70vh; }
      #ascend-chat-toggle { bottom: 20px; right: 16px; }
      #ascend-chat-pulse { bottom: 16px; right: 12px; }
      #ascend-chat-bubble { right: 16px; bottom: 96px; }
    }
  `;

  const QUICK_REPLIES = [
    'How does level-funding work?',
    'How much could I save?',
    'What is stop-loss insurance?',
    'Tell me about the Preventive Care Program',
    'Book a free analysis'
  ];

  let messages = [];
  let isTyping = false;
  let quickRepliesShown = true;

  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function buildWidget() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.id = 'ascend-chat-widget';
    wrap.innerHTML = `
      <div id="ascend-chat-pulse"></div>

      <div id="ascend-chat-bubble" onclick="document.getElementById('ascend-chat-toggle').click(); this.style.display='none';">
        👋 <span>Chat with a Specialist</span> — ask us anything about your benefits options!
      </div>

      <button id="ascend-chat-toggle" aria-label="Open chat">
        <svg class="icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div id="ascend-chat-window">
        <div class="acw-header">
          <div class="acw-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div class="acw-header-text">
            <div class="acw-header-name">Avery — Benefits Specialist</div>
            <div class="acw-header-status"><div class="acw-status-dot"></div>Online now</div>
            <div class="acw-header-sub">Ascend Benefits Consulting Group</div>
          </div>
        </div>
        <div class="acw-messages" id="acwMessages"></div>
        <div class="acw-quick-replies" id="acwQuickReplies"></div>
        <div class="acw-input-area">
          <textarea class="acw-input" id="acwInput" placeholder="Ask about your benefits options..." rows="1"></textarea>
          <button class="acw-send" id="acwSend" aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <div class="acw-footer">Powered by Ascend Benefits AI · (615) 559-9387</div>
      </div>
    `;
    document.body.appendChild(wrap);

    // Events
    document.getElementById('ascend-chat-toggle').addEventListener('click', toggleChat);
    document.getElementById('acwSend').addEventListener('click', sendMessage);
    document.getElementById('acwInput').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    document.getElementById('acwInput').addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    renderQuickReplies();
    addBotMessage("Hi there! 👋 I'm Avery, a benefits specialist with Ascend Benefits Consulting Group. I can help answer questions about your coverage options, see how much you might save, or get you booked with Chase for a free analysis. What can I help you with today?");
  }

  function toggleChat() {
    const toggle = document.getElementById('ascend-chat-toggle');
    const window_ = document.getElementById('ascend-chat-window');
    const bubble = document.getElementById('ascend-chat-bubble');
    const pulse = document.getElementById('ascend-chat-pulse');
    toggle.classList.toggle('open');
    window_.classList.toggle('open');
    if (bubble) bubble.style.display = 'none';
    if (pulse) pulse.style.display = 'none';
    if (window_.classList.contains('open')) {
      setTimeout(() => document.getElementById('acwInput').focus(), 300);
    }
  }

  function renderQuickReplies() {
    const qrContainer = document.getElementById('acwQuickReplies');
    if (!quickRepliesShown) { qrContainer.innerHTML = ''; return; }
    qrContainer.innerHTML = QUICK_REPLIES.map(q =>
      `<button class="acw-qr" onclick="window._acwSendQuick('${q.replace(/'/g, "\\'")}')">${q}</button>`
    ).join('');
  }

  window._acwSendQuick = function(text) {
    quickRepliesShown = false;
    renderQuickReplies();
    processUserMessage(text);
  };

  function addBotMessage(text) {
    const msgList = document.getElementById('acwMessages');

    // Remove typing indicator if present
    const typing = document.getElementById('acwTyping');
    if (typing) typing.remove();

    // Check if we need to show Calendly button
    const showCalendly = text.includes('SHOW_CALENDLY_BUTTON');
    const cleanText = text.replace('SHOW_CALENDLY_BUTTON', '').trim();

    const msg = document.createElement('div');
    msg.className = 'acw-msg bot';
    msg.innerHTML = `
      <div class="acw-bubble">${cleanText}${showCalendly ? `
        <br/>
        <a href="${CALENDLY_URL}" target="_blank" class="acw-calendly-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Book Free Analysis with Chase
        </a>` : ''}
      </div>
      <div class="acw-msg-time">${getTime()}</div>
    `;
    msgList.appendChild(msg);
    msgList.scrollTop = msgList.scrollHeight;
    messages.push({ role: 'assistant', content: cleanText + (showCalendly ? ' [Calendly booking link shown]' : '') });
  }

  function addUserMessage(text) {
    const msgList = document.getElementById('acwMessages');
    const msg = document.createElement('div');
    msg.className = 'acw-msg user';
    msg.innerHTML = `<div class="acw-bubble">${escapeHtml(text)}</div><div class="acw-msg-time">${getTime()}</div>`;
    msgList.appendChild(msg);
    msgList.scrollTop = msgList.scrollHeight;
  }

  function showTyping() {
    const msgList = document.getElementById('acwMessages');
    const el = document.createElement('div');
    el.className = 'acw-msg bot';
    el.id = 'acwTyping';
    el.innerHTML = `<div class="acw-typing"><span></span><span></span><span></span></div>`;
    msgList.appendChild(el);
    msgList.scrollTop = msgList.scrollHeight;
  }

  function escapeHtml(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
  }

  function sendMessage() {
    const input = document.getElementById('acwInput');
    const text = input.value.trim();
    if (!text || isTyping) return;
    input.value = '';
    input.style.height = 'auto';
    quickRepliesShown = false;
    renderQuickReplies();
    processUserMessage(text);
  }

  async function processUserMessage(text) {
    if (isTyping) return;
    isTyping = true;
    document.getElementById('acwSend').disabled = true;

    addUserMessage(text);
    messages.push({ role: 'user', content: text });
    showTyping();

    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: messages.filter(m => m.role !== 'system')
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm sorry, I had trouble with that. Please call us directly at (615) 559-9387 and we'll be happy to help!";
      addBotMessage(reply);

    } catch (err) {
      addBotMessage("I'm having a little trouble connecting right now. Please call us at <strong>(615) 559-9387</strong> or email us and we'll get right back to you!");
    }

    isTyping = false;
    document.getElementById('acwSend').disabled = false;
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
