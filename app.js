/* ==========================================================================
   VT WEB DESIGN — CONVERSION ENGINE INTERACTION LOGIC
   Handles:
   - Smart Auto-Hide Header on Scroll (Mobile & Desktop)
   - Bilingual Language Switcher (VI Primary / EN Secondary)
   - Live Saigon Timezone Indicator (Asia/Ho_Chi_Minh, GMT+7)
   - Interactive ROI & Revenue Leak Calculator (VNĐ)
   - Accessible FAQ Accordion
   - Live Audit Form (Real Email via FormSubmit/Formspree + Zalo Direct Chat)
   - Floating Conversion Bar & Mobile Drawer Menu
   ========================================================================== */

(function() {
  function runAllInits() {
    initSmartHeaderScroll();
    initSaigonClock();
    initLanguageSwitcher();
    initRoiCalculator();
    initFaqAccordion();
    initAuditForm();
    initFloatingBar();
    initMobileMenu();
    initCustomButtonLinks();
  }

  window.VTAppInit = runAllInits;
  document.addEventListener('DOMContentLoaded', runAllInits);

  /* ------------------------------------------------------------------------
     0. Smart Auto-Hide Header on Scroll Down (Mobile & Desktop)
     ------------------------------------------------------------------------ */
  function initSmartHeaderScroll() {
    if (window._vtSmartHeaderBound) return;
    window._vtSmartHeaderBound = true;

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const header = document.getElementById('site-header');
        if (!header) {
          ticking = false;
          return;
        }

        // Keep header visible while editing
        if (document.body.classList.contains('vt-editing-mode')) {
          header.classList.remove('header-hidden');
          ticking = false;
          return;
        }

        const currentScrollY = Math.max(0, window.pageYOffset || document.documentElement.scrollTop);
        const delta = currentScrollY - lastScrollY;

        if (currentScrollY <= 50) {
          header.classList.remove('header-hidden');
        } else if (delta > 6 && currentScrollY > 64) {
          // Scrolling down: hide menu bar & close mobile dropdown if open
          header.classList.add('header-hidden');
          const navLinks = header.querySelector('.nav-links');
          if (navLinks) navLinks.classList.remove('mobile-open');
        } else if (delta < -6) {
          // Scrolling up: reveal menu bar
          header.classList.remove('header-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     0A. Live Saigon Timezone Indicator (Asia/Ho_Chi_Minh)
     ------------------------------------------------------------------------ */
  function initSaigonClock() {
    const updateClock = () => {
      const badge = document.querySelector('.saigon-time-badge');
      if (!badge) return;
      try {
        const now = new Date();
        const vnTime = new Intl.DateTimeFormat('vi-VN', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(now);
        badge.title = `Giờ Sài Gòn hiện tại: ${vnTime} (GMT+7 • 8:30 - 18:30 T2-T7)`;
      } catch (e) {}
    };
    updateClock();
    if (!window._vtClockInterval) {
      window._vtClockInterval = setInterval(updateClock, 30000);
    }
  }

  /* ------------------------------------------------------------------------
     0B. Bilingual Switcher (VI Primary / EN Secondary)
     ------------------------------------------------------------------------ */
  function initLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');
    if (!langBtns.length) return;

    function setLanguage(lang) {
      document.documentElement.lang = lang;
      langBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
      });

      document.querySelectorAll('[data-vi]').forEach(el => {
        const val = lang === 'en' ? el.dataset.en : el.dataset.vi;
        if (!val) return;

        // If element has a dedicated .btn-label span, update that span; otherwise textContent
        const labelSpan = el.querySelector(':scope > .btn-label');
        if (labelSpan) {
          labelSpan.textContent = val;
        } else if (el.children.length === 0) {
          el.textContent = val;
        } else {
          // Preserve child SVG icons if any
          const firstChild = el.firstChild;
          if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
            firstChild.nodeValue = val + ' ';
          } else {
            el.textContent = val;
          }
        }
      });

      try {
        localStorage.setItem('vt_preferred_lang', lang);
      } catch (e) {}
    }

    langBtns.forEach(btn => {
      if (btn._vtLangBound) return;
      btn._vtLangBound = true;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage(btn.dataset.lang);
      });
    });

    try {
      const saved = localStorage.getItem('vt_preferred_lang');
      if (saved === 'en' || saved === 'vi') {
        setLanguage(saved);
      }
    } catch (e) {}
  }

  /* ------------------------------------------------------------------------
     1. Interactive ROI & Website Leak Calculator (VNĐ)
     ------------------------------------------------------------------------ */
  function initRoiCalculator() {
    const trafficInput = document.getElementById('monthly-traffic');
    const crInput = document.getElementById('current-cr');
    const valInput = document.getElementById('client-val');

    const displayTraffic = document.getElementById('display-traffic');
    const displayCr = document.getElementById('display-cr');
    const displayVal = document.getElementById('display-val');
    const displayLift = document.getElementById('display-lift');

    const calcAnnualLeak = document.getElementById('calc-annual-leak');
    const calcCurrentLeads = document.getElementById('calc-current-leads');
    const calcProjectedLeads = document.getElementById('calc-projected-leads');
    const calcCurrentRev = document.getElementById('calc-current-rev');
    const calcProjectedRev = document.getElementById('calc-projected-rev');

    const liftButtons = document.querySelectorAll('.lift-btn');
    let currentLift = 1.5;

    if (!trafficInput || !crInput || !valInput) return;

    function formatCurrency(num) {
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1') + ' tỷ VNĐ';
      } else if (num >= 1000000) {
        return Math.round(num / 1000000).toLocaleString('vi-VN') + ' triệu VNĐ';
      }
      return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + 'đ';
    }

    function calculate() {
      const traffic = parseFloat(trafficInput.value);
      const cr = parseFloat(crInput.value) / 100;
      const dealVal = parseFloat(valInput.value);
      const lift = currentLift / 100;

      displayTraffic.textContent = traffic.toLocaleString('vi-VN');
      displayCr.textContent = (cr * 100).toFixed(1) + '%';
      displayVal.textContent = formatCurrency(dealVal);
      displayLift.textContent = '+' + currentLift.toFixed(1) + '%';

      const currentMonthlyLeads = Math.round(traffic * cr);
      const newCr = cr + lift;
      const projectedMonthlyLeads = Math.round(traffic * newCr);
      const additionalMonthlyLeads = projectedMonthlyLeads - currentMonthlyLeads;

      const currentMonthlyRevenue = currentMonthlyLeads * dealVal;
      const projectedAdditionalMonthly = additionalMonthlyLeads * dealVal;
      const annualLeak = projectedAdditionalMonthly * 12;

      calcAnnualLeak.textContent = formatCurrency(annualLeak);
      calcCurrentLeads.textContent = currentMonthlyLeads.toLocaleString('vi-VN') + ' khách';
      calcProjectedLeads.textContent = `${projectedMonthlyLeads.toLocaleString('vi-VN')} (+${additionalMonthlyLeads} khách)`;
      calcCurrentRev.textContent = formatCurrency(currentMonthlyRevenue) + '/tháng';
      calcProjectedRev.textContent = '+' + formatCurrency(projectedAdditionalMonthly) + '/tháng';
    }

    [trafficInput, crInput, valInput].forEach(input => {
      if (input._vtCalcBound) return;
      input._vtCalcBound = true;
      input.addEventListener('input', calculate);
    });

    liftButtons.forEach(btn => {
      if (btn._vtLiftBound) return;
      btn._vtLiftBound = true;
      btn.addEventListener('click', () => {
        if (document.body.classList.contains('vt-editing-mode')) return;
        liftButtons.forEach(b => {
          b.classList.remove('btn-primary', 'active');
          b.classList.add('btn-secondary');
        });
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary', 'active');
        currentLift = parseFloat(btn.dataset.lift);
        calculate();
      });
    });

    calculate();
  }

  /* ------------------------------------------------------------------------
     2. Accessible FAQ Accordion
     ------------------------------------------------------------------------ */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger || trigger._vtFaqBound) return;
      trigger._vtFaqBound = true;

      trigger.addEventListener('click', () => {
        if (document.body.classList.contains('vt-editing-mode')) return;
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        });

        if (!isExpanded) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. Live Frictionless Audit Request Form (Real Zalo + Real Email)
     ------------------------------------------------------------------------ */
  function initAuditForm() {
    const form = document.getElementById('conversion-audit-form');
    const successContainer = document.getElementById('form-success-container');
    const userNameSpan = document.getElementById('success-user-name');
    const userSiteSpan = document.getElementById('success-user-site');

    if (!form || !successContainer || form._vtFormBound) return;
    form._vtFormBound = true;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (document.body.classList.contains('vt-editing-mode')) return;

      const siteInput = document.getElementById('form-website');
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const goalSelect = document.getElementById('form-goal');

      const siteVal = siteInput.value.trim();
      const nameVal = nameInput.value.trim();
      const contactVal = emailInput.value.trim();

      if (!siteVal || !nameVal || !contactVal) {
        alert('Vui lòng điền link website, tên của bạn và số Zalo/Email liên hệ.');
        return;
      }

      const submitBtn = document.getElementById('btn-submit-audit');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang gửi thông tin cho Team VT...';

      const formMode = form.getAttribute('data-mode') || localStorage.getItem('vt_form_mode') || 'zalo';
      const formZalo = form.getAttribute('data-zalo') || localStorage.getItem('vt_form_zalo') || '0908123456';
      const formEmail = form.getAttribute('data-email') || localStorage.getItem('vt_form_email') || 'hello@vtconversion.com';
      const customEndpoint = form.getAttribute('data-endpoint') || localStorage.getItem('vt_form_endpoint') || '';

      const goalText = goalSelect ? goalSelect.options[goalSelect.selectedIndex].text : '';
      const messageText =
        `Chào Team VT, tôi là ${nameVal}.\n` +
        `Nhãn hàng / Web cần thiết kế mẫu: ${siteVal}\n` +
        `Zalo/Email liên hệ: ${contactVal}\n` +
        `Nhu cầu hiện tại: ${goalText}`;

      const cleanPhone = formZalo.replace(/[^0-9]/g, '');
      const zaloDirectUrl = cleanPhone ? `https://zalo.me/${cleanPhone}` : '';

      // Helper to show confirmation state & Zalo/Mailto direct action button
      const mailtoUrl = formEmail
        ? `mailto:${encodeURIComponent(formEmail)}?subject=${encodeURIComponent('[Team VT] Yêu cầu Giao diện Mẫu mới từ ' + nameVal)}&body=${encodeURIComponent(messageText)}`
        : '';

      const showSuccessUI = (statusNote) => {
        userNameSpan.textContent = nameVal;
        userSiteSpan.textContent = siteVal;

        const oldZaloBox = document.getElementById('vt-zalo-fallback-box');
        if (oldZaloBox) oldZaloBox.remove();

        if (((formMode === 'zalo' || formMode === 'both') && cleanPhone) || (formMode === 'mailto' && mailtoUrl)) {
          const actionBox = document.createElement('div');
          actionBox.id = 'vt-zalo-fallback-box';
          actionBox.style.cssText = 'margin-top:16px; padding:14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; text-align:center; display:flex; flex-direction:column; gap:8px;';

          let htmlBtns = `<p style="font-size:13px; color:#1e3a8a; font-weight:600; margin:0;">Nội dung đã được copy sẵn. Bấm nút bên dưới nếu ứng dụng chưa tự mở:</p>`;
          if ((formMode === 'zalo' || formMode === 'both') && cleanPhone) {
            htmlBtns += `<a href="${zaloDirectUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width:100%;">💬 Mở Zalo Chat Ngay (${formZalo})</a>`;
          }
          if (formMode === 'mailto' && mailtoUrl) {
            htmlBtns += `<a href="${mailtoUrl}" class="btn btn-secondary" style="width:100%;">✉️ Mở Ứng Dụng Email Để Gửi</a>`;
          }
          actionBox.innerHTML = htmlBtns;
          successContainer.appendChild(actionBox);
        }

        if (statusNote) {
          let noteEl = document.getElementById('vt-email-status-note');
          if (!noteEl) {
            noteEl = document.createElement('p');
            noteEl.id = 'vt-email-status-note';
            noteEl.style.cssText = 'margin-top:12px; font-size:12px; color:#047857; font-weight:600;';
            successContainer.appendChild(noteEl);
          }
          noteEl.textContent = statusNote;
        }

        form.style.display = 'none';
        successContainer.style.display = 'block';
        successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };

      // Copy message to clipboard so user can paste straight into Zalo if needed
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(messageText).catch(() => {});
      }

      // Synchronous Zalo or Mailto open inside user click event
      if ((formMode === 'zalo' || formMode === 'both') && zaloDirectUrl) {
        window.open(zaloDirectUrl, '_blank', 'noopener,noreferrer');
      } else if (formMode === 'mailto' && mailtoUrl) {
        window.location.href = mailtoUrl;
      }

      // Real Email delivery via FormSubmit.co (or custom Formspree/Web3Forms endpoint)
      if ((formMode === 'email' || formMode === 'both') && (formEmail || customEndpoint)) {
        const endpoint = customEndpoint
          ? customEndpoint
          : `https://formsubmit.co/ajax/${encodeURIComponent(formEmail)}`;

        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `[Team VT] Yêu cầu Giao diện Mẫu mới từ ${nameVal}`,
            _template: 'table',
            name: nameVal,
            contact: contactVal,
            website: siteVal,
            concern: goalText,
            message: messageText
          })
        })
          .then(res => res.json().catch(() => ({})))
          .then(() => {
            showSuccessUI(`✓ Đã gửi thông tin đến hộp thư ${formEmail}.`);
          })
          .catch(() => {
            showSuccessUI('✓ Đã ghi nhận yêu cầu. (Lưu ý: gửi Email tự động chỉ chạy khi web đã được up lên tên miền HTTPS).');
          });
      } else {
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          showSuccessUI('');
        }, 300);
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. Floating Sticky Conversion Bar on Scroll
     ------------------------------------------------------------------------ */
  function initFloatingBar() {
    if (window._vtFloatingBarBound) return;
    window._vtFloatingBarBound = true;

    window.addEventListener('scroll', () => {
      const bar = document.getElementById('floating-bar');
      const heroSection = document.getElementById('hero');
      if (!bar || !heroSection) return;

      if (document.body.classList.contains('vt-editing-mode')) {
        bar.classList.remove('visible');
        return;
      }

      const heroBottom = heroSection.getBoundingClientRect().bottom;
      if (heroBottom < 0) {
        bar.classList.add('visible');
      } else {
        bar.classList.remove('visible');
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     5. Mobile Navigation Menu Toggle (CSS Class Based)
     ------------------------------------------------------------------------ */
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggleBtn || !navLinks || toggleBtn._vtMenuBound) return;
    toggleBtn._vtMenuBound = true;

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('mobile-open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.classList.contains('mobile-open')) return;
      if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. Custom [data-href] handler for edited non-<a> buttons
     ------------------------------------------------------------------------ */
  function initCustomButtonLinks() {
    document.querySelectorAll('[data-href]').forEach(el => {
      if (el._vtHrefBound) return;
      el._vtHrefBound = true;
      el.addEventListener('click', (e) => {
        if (document.body.classList.contains('vt-editing-mode')) return;
        const href = el.getAttribute('data-href');
        if (!href) return;
        if (href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else if (el.getAttribute('data-target') === '_blank') {
          window.open(href, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = href;
        }
      });
    });
  }
})();
