(function () {
  const CALENDLY_URL = 'https://calendly.com/ascendbenefitscg';

  const SYSTEM_PROMPT = `You are Avery, a friendly and knowledgeable benefits specialist with Ascend Benefits Consulting Group. You help business owners understand their employee benefits options.

KEY FACTS ABOUT ASCEND BENEFITS:
- Specializes in employer group health insurance for companies with 2-250 employees
- Serves TN, AL, GA, FL, TX, SC, NC, MS, LA and all 50 states
- Offers level-funded, self-funded, and fully-insured group health plans
- Also offers the Employee Health Program (EHP) — a preventive care supplemental benefit
- EHP requires employer to have at least 10 full-time W-2 employees
- Independent and unbiased — not tied to any single carrier
- Phone: (615) 559-9387
- Website: ascendbenefitscg.com

YOUR PERSONALITY:
- Warm, professional, and easy to talk to
- Use plain language — avoid jargon unless you explain it
- Be genuinely helpful, not salesy
- Keep responses concise (2-4 sentences max unless they ask for detail)

YOUR GOAL:
- Answer their benefits questions
- Help them understand their options
- When they seem ready or ask about next steps, offer to get them booked with a team member for a free analysis
- When offering to book, say something like: "I can get you set up with a team member for a free analysis — want me to send you the booking link?"
- When they say yes, respond with: "SHOW_CALENDLY_BUTTON" (exactly that — the system will display the button)

IMPORTANT: Never make up specific numbers, savings amounts, or plan details that aren't in the facts above. If unsure, say a team member can walk them through specifics on a call.`;

  const QUICK_REPLIES = [
    'What plans do you offer?',
    'How much could I save?',
    'What is level-funded?',
    'Do you serve my state?',
    'Book a free analysis'
  ];

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

    #acwHeader {
      background: linear-gradient(135deg, #0D1F3C 0%, #1e3d72 100%);
      padding: 16px 20px; display: flex; align-items: center; gap: 12px;
    }
    #acwAvatar {
      width: 42px; height: 42px; border-radius: 50%;
      background: linear-gradient(135deg, #C9A84C, #e8c96a);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 700; color: #0D1F3C; flex-shrink: 0;
    }
    #acwHeaderInfo { flex: 1; }
    #acwHeaderName { color: #fff; font-size: 15px; font-weight: 600; }
    #acwHeaderStatus { color: rgba(255,255,255,0.7); font-size: 12px; display: flex; align-items: center; gap: 5px; margin-top: 2px; }
    #acwHeaderStatus::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #4ade80; display: inline-block; }
    #acwClose { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.7); padding: 4px; border-radius: 4px; }
    #acwClose:hover { color: #fff; background: rgba(255,255,255,0.1); }

    #acwMessages {
      flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;
      background: #f8f9fc;
    }
    #acwMessages::-webkit-scrollbar { width: 4px; }
    #acwMessages::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }

    .acw-msg { display: flex; flex-direction: column; max-width: 85%; }
    .acw-msg.bot { align-self: flex-start; }
    .acw-msg.user { align-self: flex-end; }
    .acw-bubble {
      padding: 10px 14px; border-radius: 14px; font-size: 14px; line-height: 1.5;
    }
    .acw-msg.bot .acw-bubble { background: #fff; color: #1a202c; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .acw-msg.user .acw-bubble { background: linear-gradient(135deg, #0D1F3C, #1e3d72); color: #fff; border-bottom-right-radius: 4px; }
    .acw-msg-time { font-size: 11px; color: #9ca3af; margin-top: 4px; }
    .acw-msg.user .acw-msg-time { text-align: right; }

    #acwTyping { align-self: flex-start; }
    #acwTyping .acw-bubble { display: flex; gap: 5px; align-items: center; padding: 12px 16px; }
    .acw-dot { width: 7px; height: 7px; border-radius: 50%; background: #9ca3af; animation: acw-bounce 1.2s infinite; }
    .acw-dot:nth-child(2) { animation-delay: 0.2s; }
    .acw-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes acw-bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

    #acwQuickReplies { padding: 8px 12px; display: flex; flex-wrap: wrap; gap: 6px; background: #f8f9fc; border-top: 1px solid #e5e7eb; }
    .acw-qr {
      background: #fff; border: 1.5px solid #C9A84C; color: #0D1F3C;
      border-radius: 20px; padding: 5px 12px; font-size: 12px; font-weight: 500;
      cursor: pointer; transition: all 0.15s;
    }
    .acw-qr:hover { background: #C9A84C; color: #0D1F3C; }

    #acwInputRow {
      display: flex; align-items: center; gap: 8px; padding: 12px 16px;
      border-top: 1px solid #e5e7eb; background: #fff;
    }
    #acwInput {
      flex: 1; border: 1.5px solid #e5e7eb; border-radius: 24px;
      padding: 9px 16px; font-size: 14px; outline: none;
      transition: border-color 0.2s; color: #1a202c;
    }
    #acwInput:focus { border-color: #C9A84C; }
    #acwSend {
      width: 38px; height: 38px; border-radius: 50%; border: none;
      background: linear-gradient(135deg, #0D1F3C, #1e3d72); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 2px 8px rgba(13,31,60,0.3);
    }
    #acwSend:hover { transform: scale(1.08); box-shadow: 0 4px 12px rgba(13,31,60,0.4); }
    #acwSend svg { width: 16px; height: 16px; color: #C9A84C; }

    .acw-calendly-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: linear-gradient(135deg, #C9A84C, #e8c96a);
      color: #0D1F3C; font-weight: 600; font-size: 13px;
      padding: 9px 16px; border-radius: 10px; text-decoration: none;
      margin-top: 10px; transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 2px 8px rgba(201,168,76,0.4);
    }
    .acw-calendly-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(201,168,76,0.5); }
    .acw-calendly-btn svg { width: 15px; height: 15px; flex-shrink: 0; }

    #ascend-chat-bubble {
      position: fixed; bottom: 104px; right: 28px; z-index: 9997;
      background: #0D1F3C; color: #fff; font-size: 13px; font-weight: 500;
      padding: 10px 16px; border-radius: 12px; max-width: 220px;
      box-shadow: 0 4px 16px rgba(13,31,60,0.25); cursor: pointer;
      animation: acw-fadein 0.5s ease;
    }
    #ascend-chat-bubble::after {
      content: ''; position: absolute; bottom: -8px; right: 22px;
      border: 8px solid transparent; border-top-color: #0D1F3C; border-bottom: none;
    }
    @keyframes acw-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 440px) {
      #ascend-chat-window { width: calc(100vw - 16px); right: 8px; bottom: 96px; }
      #ascend-chat-toggle { bottom: 20px; right: 16px; }
    }
  `;

  let messages = [];
  let quickRepliesShown = true;

  function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function init() {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);

    const widget = document.createElement('div');
    widget.id = 'ascend-chat-widget';
    widget.innerHTML = `
      <div id="ascend-chat-pulse"></div>
      <div id="ascend-chat-bubble" onclick="toggleChat()">
        💬 Chat with a Specialist —<br>ask us anything about your benefits options!
      </div>
      <button id="ascend-chat-toggle" onclick="toggleChat()" aria-label="Open chat">
        <svg class="icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div id="ascend-chat-window">
        <div id="acwHeader">
          <div id="acwAvatar">A</div>
          <div id="acwHeaderInfo">
            <div id="acwHeaderName">Avery</div>
            <div id="acwHeaderStatus">Benefits Specialist · Online</div>
          </div>
          <button id="acwClose" onclick="toggleChat()" aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div id="acwMessages"></div>
        <div id="acwQuickReplies"></div>
        <div id="acwInputRow">
          <input id="acwInput" type="text" placeholder="Ask about your benefits options..." autocomplete="off" />
          <button id="acwSend">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(widget);

    document.getElementById('acwSend').addEventListener('click', handleSend);
    document.getElementById('acwInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });

    setTimeout(() => {
      addBotMessage("👋 I'm Avery, a benefits specialist with Ascend Benefits Consulting Group. I can help answer questions about your coverage options, see how much you might save, or get you booked with a team member for a free analysis. What can I help you with today?");
      renderQuickReplies();
    }, 800);

    setTimeout(() => {
      const bubble = document.getElementById('ascend-chat-bubble');
      if (bubble) bubble.style.display = 'block';
    }, 2000);
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

  window._acwSendQuick = function (text) {
    quickRepliesShown = false;
    renderQuickReplies();
    processUserMessage(text);
  };

  function addBotMessage(text) {
    const msgList = document.getElementById('acwMessages');
    const typing = document.getElementById('acwTyping');
    if (typing) typing.remove();

    const showCalendly = text.includes('SHOW_CALENDLY_BUTTON');
    const cleanText = text.replace('SHOW_CALENDLY_BUTTON', '').trim();

    const msg = document.createElement('div');
    msg.className = 'acw-msg bot';
    msg.innerHTML = `
      <div class="acw-bubble">${cleanText}${showCalendly ? `
        <br/>
        <a href="${CALENDLY_URL}" target="_blank" class="acw-calendly-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Book Free Analysis with Our Team
        </a>` : ''}
      </div>
      <div class="acw-msg-time">${getTime()}</div>
    `;
    msgList.appendChild(msg);
    msgList.scrollTop = msgList.scrollHeight;
    messages.push({ role: 'assistant', content: cleanText });
  }

  function addUserMessage(text) {
    const msgList = document.getElementById('acwMessages');
    const msg = document.createElement('div');
    msg.className = 'acw-msg user';
    msg.innerHTML = `<div class="acw-bubble">${text}</div><div class="acw-msg-time">${getTime()}</div>`;
    msgList.appendChild(msg);
    msgList.scrollTop = msgList.scrollHeight;
    messages.push({ role: 'user', content: text });
  }

  function showTyping() {
    const msgList = document.getElementById('acwMessages');
    const typing = document.createElement('div');
    typing.className = 'acw-msg bot';
    typing.id = 'acwTyping';
    typing.innerHTML = `<div class="acw-bubble"><span class="acw-dot"></span><span class="acw-dot"></span><span class="acw-dot"></span></div>`;
    msgList.appendChild(typing);
    msgList.scrollTop = msgList.scrollHeight;
  }

  function handleSend() {
    const input = document.getElementById('acwInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    quickRepliesShown = false;
    renderQuickReplies();
    processUserMessage(text);
  }

  async function processUserMessage(text) {
    addUserMessage(text);
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
      const reply = data.content && data.content[0] ? data.content[0].text : "I'm having trouble connecting right now. Please call us at (615) 559-9387.";
      addBotMessage(reply);
    } catch (err) {
      addBotMessage("I'm having trouble connecting right now. Please call us at (615) 559-9387 or use the contact form.");
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
