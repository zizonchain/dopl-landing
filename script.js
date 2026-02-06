/**
 * CoPilot Landing Page v2
 * Scroll animations, waitlist form, smooth scroll, nav behavior
 */

// ============================================
// Scroll Animations
// ============================================

function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// Smooth Scroll
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offset = 100;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ============================================
// Nav Shadow on Scroll
// ============================================

function initNavScroll() {
  const pill = document.querySelector('.nav-pill');
  if (!pill) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      pill.style.boxShadow = '0 8px 32px rgba(13, 38, 31, 0.12)';
    } else {
      pill.style.boxShadow = '0 8px 32px rgba(13, 38, 31, 0.05)';
    }
  });
}

// ============================================
// Waitlist Form
// ============================================

function initWaitlistForm() {
  const form = document.querySelector('.waitlist-form');
  if (!form) return;

  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyN3_7QDNtB20LxD1oUP9onnND27Wk3jvcgtqcq8JZuO5uaJPWOHwAiIK1Y0facxv4R9w/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const input = form.querySelector('.waitlist-input');
    const button = form.querySelector('button');
    const email = input.value.trim();

    // Reset states
    form.classList.remove('success', 'error');

    // Validate
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      form.classList.add('error');
      return;
    }

    // Disable form while submitting
    button.disabled = true;
    button.textContent = 'Joining...';

    try {
      // Send to Google Sheet
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      // Show success
      form.classList.add('success');
      input.value = '';
      button.textContent = 'You\'re in!';
    } catch (error) {
      form.classList.add('error');
      button.textContent = 'Try again';
      button.disabled = false;
    }
  });
}

// ============================================
// Hero Card Rotation
// ============================================

function initHeroCardRotation() {
  const investors = [
    {
      name: 'Warren Buffett',
      tag: 'Berkshire Hathaway',
      avatar: 'images/buffett.jpg',
      copiers: '2783 copiers',
      return: '+89.8%',
      holdings: [
        { ticker: 'AAPL', return: '+24.8%' },
        { ticker: 'NVDA', return: '+18.3%' },
        { ticker: 'SNDK', return: '+12.1%' }
      ]
    },
    {
      name: 'Nancy Pelosi',
      tag: 'U.S. Congress',
      avatar: 'images/Nancy.webp',
      copiers: '4399 copiers',
      return: '+132%',
      holdings: [
        { ticker: 'MRVL', return: '+67.2%' },
        { ticker: 'AMKR', return: '+41.5%' },
        { ticker: 'TSLA', return: '+23.3%' }
      ]
    },
    {
      name: 'StockTalk',
      tag: 'Top Analyst',
      avatar: 'images/stocktalk.jpg',
      copiers: '804 copiers',
      return: '+727%',
      holdings: [
        { ticker: 'AVGO', return: '+156%' },
        { ticker: 'KTOS', return: '+312%' },
        { ticker: 'VIAVI', return: '+259%' }
      ]
    },
    {
      name: 'Michael Burry',
      tag: 'Scion Asset Management',
      avatar: 'images/Burry.webp',
      copiers: '1298 copiers',
      return: '+344%',
      holdings: [
        { ticker: 'PLTR', return: '+89.4%' },
        { ticker: 'GME', return: '+127%' },
        { ticker: 'ASTS', return: '+128%' }
      ]
    }
  ];

  let currentIndex = 0;
  const card = document.getElementById('hero-card');
  const avatar = document.getElementById('card-avatar');
  const name = document.getElementById('card-name');
  const tag = document.getElementById('card-tag');
  const copiers = document.getElementById('card-copiers');
  const returnBadge = document.getElementById('card-return');
  const holdings = document.getElementById('card-holdings');

  if (!card) return;

  // Preload all images so they're ready for transitions
  investors.forEach(investor => {
    const img = new Image();
    img.src = investor.avatar;
  });

  function updateCard(index) {
    const investor = investors[index];

    // Trigger glitch
    card.classList.add('card-transitioning');

    // Update content instantly during glitch (at 75ms - middle of 150ms animation)
    setTimeout(() => {
      avatar.src = investor.avatar;
      avatar.alt = investor.name;
      name.textContent = investor.name;
      tag.textContent = investor.tag;
      copiers.textContent = investor.copiers;
      returnBadge.textContent = investor.return;

      // Update holdings
      holdings.innerHTML = investor.holdings.map(h => `
        <div class="dp-holding">
          <span class="dp-ticker">${h.ticker}</span>
          <span class="dp-holding-return positive">${h.return}</span>
        </div>
      `).join('');
    }, 75);

    // Remove glitch class after animation completes
    setTimeout(() => {
      card.classList.remove('card-transitioning');
    }, 150);
  }

  // Rotate every 4 seconds
  setInterval(() => {
    currentIndex = (currentIndex + 1) % investors.length;
    updateCard(currentIndex);
  }, 4000);
}

// ============================================
// Hero CTA Expand
// ============================================

function initHeroCTA() {
  const wrap = document.querySelector('.hero-cta-wrap');
  const trigger = document.querySelector('.hero-cta-trigger');
  const form = document.querySelector('.hero-cta-form');
  const input = document.querySelector('.hero-cta-input');

  if (!wrap || !trigger || !form) return;

  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyN3_7QDNtB20LxD1oUP9onnND27Wk3jvcgtqcq8JZuO5uaJPWOHwAiIK1Y0facxv4R9w/exec';

  // Click trigger to expand
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    wrap.classList.add('expanded');
    setTimeout(() => input.focus(), 400);
  });

  // Click outside to collapse (if empty)
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target) && wrap.classList.contains('expanded') && !input.value.trim()) {
      wrap.classList.remove('expanded');
    }
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    const submitBtn = form.querySelector('.hero-cta-submit');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = 'var(--negative)';
      return;
    }

    submitBtn.disabled = true;

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      wrap.classList.add('success');
      input.value = 'You\'re in!';
      input.disabled = true;
    } catch (error) {
      input.style.borderColor = 'var(--negative)';
      submitBtn.disabled = false;
    }
  });
}

// ============================================
// Init
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initSmoothScroll();
  initNavScroll();
  initWaitlistForm();
  initHeroCardRotation();
  initHeroCTA();
});
