// Ascend Benefits eBook Pop-up
// Add <script src="/ebook-popup.js"></script> to any page you want the popup on

(function() {
  // Don't show on the ebook page itself
  if (window.location.pathname === '/ebook' || window.location.pathname === '/ebook.html') return;

  // Don't show if already dismissed in this session
  if (sessionStorage.getItem('ebookPopupDismissed')) return;

  // Wait 8 seconds before showing
  setTimeout(showPopup, 8000);

  function showPopup() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      #ebook-popup-overlay {
        position: fixed;
        inset: 0;
        background: rgba(13,31,60,0.6);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        animation: fadeInOverlay 0.3s ease;
      }
      @keyframes fadeInOverlay {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      #ebook-popup {
        background: #fff;
        border-radius: 16px;
        max-width: 580px;
        width: 100%;
        overflow: hidden;
        box-shadow: 0 24px 80px rgba(13,31,60,0.35);
        animation: slideUp 0.35s ease;
        position: relative;
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(32px); }
        to { opacity: 1; transform: translateY(0); }
      }
      #ebook-popup-close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(13,31,60,0.08);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #3a4a63;
        transition: background 0.2s;
        z-index: 1;
      }
      #ebook-popup-close:hover { background: rgba(13,31,60,0.15); }
      .ep-top {
        background: linear-gradient(135deg, #0D1F3C 0%, #162d56 100%);
        padding: 36px 36px 28px;
        text-align: center;
        position: relative;
      }
      .ep-top::after {
        content: '';
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 4px;
        background: #C9A84C;
      }
      .ep-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(201,168,76,0.15);
        border: 1px solid rgba(201,168,76,0.35);
        border-radius: 100px;
        padding: 5px 12px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: #C9A84C;
        text-transform: uppercase;
        margin-bottom: 14px;
        font-family: 'DM Sans', sans-serif;
      }
      .ep-title {
        font-family: 'Playfair Display', serif;
        font-size: 1.6rem;
        font-weight: 800;
        color: #fff;
        line-height: 1.2;
        margin-bottom: 8px;
      }
      .ep-title span { color: #C9A84C; }
      .ep-subtitle {
        font-size: 0.88rem;
        color: rgba(255,255,255,0.65);
        font-family: 'DM Sans', sans-serif;
        line-height: 1.6;
      }
      .ep-body { padding: 28px 36px 32px; }
      .ep-bullets {
        list-style: none;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .ep-bullets li {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 0.88rem;
        color: #3a4a63;
        font-family: 'DM Sans', sans-serif;
        line-height: 1.5;
      }
      .ep-check {
        width: 18px;
        height: 18px;
        background: rgba(201,168,76,0.15);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 1px;
        font-size: 10px;
        color: #C9A84C;
        font-weight: 700;
      }
      .ep-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 15px;
        background: #C9A84C;
        color: #0D1F3C;
        font-family: 'DM Sans', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.2s, transform 0.2s;
        margin-bottom: 10px;
      }
      .ep-btn:hover { background: #e2c06a; transform: translateY(-1px); }
      .ep-skip {
        display: block;
        text-align: center;
        font-size: 0.78rem;
        color: #6b7c99;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        background: none;
        border: none;
        width: 100%;
        padding: 4px;
      }
      .ep-skip:hover { color: #0D1F3C; }
      @media (max-width: 480px) {
        .ep-top { padding: 28px 24px 22px; }
        .ep-body { padding: 22px 24px 26px; }
        .ep-title { font-size: 1.3rem; }
      }
    `;
    document.head.appendChild(style);

    // Create popup HTML
    const overlay = document.createElement('div');
    overlay.id = 'ebook-popup-overlay';
    overlay.innerHTML = `
      <div id="ebook-popup">
        <button id="ebook-popup-close" onclick="dismissEbookPopup()" aria-label="Close">✕</button>
        <div class="ep-top">
          <div class="ep-badge">★ Free eBook</div>
          <div class="ep-title">The Complete<br><span>Benefits Strategy</span></div>
          <div class="ep-subtitle">How smart employers are cutting costs up to 30% — free guide, instant download.</div>
        </div>
        <div class="ep-body">
          <ul class="ep-bullets">
            <li><span class="ep-check">✓</span>Why traditional insurance keeps costing more — and what to do instead</li>
            <li><span class="ep-check">✓</span>The 4-step Ascend strategy for smarter, lower-cost benefits</li>
            <li><span class="ep-check">✓</span>How to fund dental, vision & disability using tax savings</li>
            <li><span class="ep-check">✓</span>Real examples: what employees owe with & without Gap coverage</li>
          </ul>
          <a href="/ebook" class="ep-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Get My Free eBook
          </a>
          <button class="ep-skip" onclick="dismissEbookPopup()">No thanks, I'll pass</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) dismissEbookPopup();
    });
  }

  window.dismissEbookPopup = function() {
    const overlay = document.getElementById('ebook-popup-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.2s';
      setTimeout(() => overlay.remove(), 200);
    }
    sessionStorage.setItem('ebookPopupDismissed', 'true');
  };
})();
