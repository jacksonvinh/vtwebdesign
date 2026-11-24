/**
 * Team VT — Interactive Behaviors & Dual Form Backend (FormSubmit / Web3Forms)
 */

(function () {
  'use strict';

  /* ========================================================================
     CẤU HÌNH NHẬN FORM QUA EMAIL (Rất dễ đổi)
     ------------------------------------------------------------------------
     Cách 1 (MẶC ĐỊNH — Khuyên dùng, không cần tạo tài khoản hay API key):
       - Để nguyên FORM_PROVIDER = 'formsubmit'
       - Khi đưa website lên hosting thật (Netlify / Vercel / Cloudflare / cPanel),
         hãy gửi thử 1 lần rồi mở hộp thư vtwebdesign8@gmail.com (kiểm tra cả Spam)
         và bấm nút "Activate Form" 1 lần duy nhất là hoạt động vĩnh viễn.

     Cách 2 (Dùng Web3Forms — nếu bạn đã có Access Key):
       - Đổi FORM_PROVIDER thành 'web3forms'
       - Dán Access Key vào WEB3FORMS_ACCESS_KEY bên dưới.
     ======================================================================== */
  const FORM_CONFIG = {
    FORM_PROVIDER: 'formsubmit', // 'formsubmit' hoặc 'web3forms'
    FORMSUBMIT_EMAIL: 'vtwebdesign8@gmail.com',
    WEB3FORMS_ACCESS_KEY: '' // Dán key Web3Forms vào đây nếu chọn 'web3forms'
  };

  /* ------------------------------------------------------------------------
     1. Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.classList.toggle('is-open', !expanded);
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
        navToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. Shared Sample Data (Real Web Images + Layout Details)
     ------------------------------------------------------------------------ */
  const SAMPLE_DATA = {
    'little-sprout': {
      title: 'Little Sprout',
      category: 'Trung Tâm Anh Ngữ — Mẫu minh họa',
      caption: 'Mẫu minh họa: Little Sprout — Trung Tâm Anh Ngữ',
      url: 'littlesprout.demo.teamvt.vn',
      image: 'assets/demo-little-sprout.jpg',
      alt: 'Hình ảnh bố cục website mẫu minh họa cho trung tâm Anh ngữ Little Sprout',
      blocks: [
        { title: 'Lớp Mầm Non (4–6 tuổi)', desc: 'Làm quen phát âm qua trò chơi, bài hát và hình ảnh trực quan.' },
        { title: 'Lớp Tiểu Học (7–10 tuổi)', desc: 'Xây dựng phản xạ nghe nói tự tin và nền tảng ngữ pháp cơ bản.' },
        { title: 'Lịch học & Học phí', desc: 'Linh hoạt cuối tuần hoặc buổi tối, phụ huynh dễ theo dõi.' }
      ],
      footerNote: 'Tích hợp nút gọi điện trực tiếp, nhắn Zalo và form để lại số điện thoại nhận lịch khai giảng.'
    },
    'moc-va-pho': {
      title: 'Mộc và Phố',
      category: 'Thiết Kế Nội Thất — Mẫu minh họa',
      caption: 'Mẫu minh họa: Mộc và Phố — Thiết Kế Nội Thất',
      url: 'mocvapho.demo.teamvt.vn',
      image: 'assets/demo-moc-va-pho.jpg',
      alt: 'Hình ảnh bố cục website mẫu minh họa cho đơn vị thiết kế nội thất Mộc và Phố',
      blocks: [
        { title: 'Phòng khách & Bếp', desc: 'Bố trí ánh sáng tự nhiên, tủ bếp gỗ sồi gọn gàng và dễ vệ sinh.' },
        { title: 'Phòng ngủ tối giản', desc: 'Tận dụng hệ tủ âm tường giúp không gian thoáng và ấm cúng.' },
        { title: 'Quy trình 4 bước', desc: 'Khảo sát thực tế — lên phối cảnh — báo giá chi tiết — thi công.' }
      ],
      footerNote: 'Tập trung trưng bày ảnh không gian theo khu vực và form gửi diện tích căn hộ cần tư vấn.'
    },
    'sola-studio': {
      title: 'Sola Studio',
      category: 'Chăm Sóc Sắc Đẹp — Mẫu minh họa',
      caption: 'Mẫu minh họa: Sola Studio — Chăm Sóc Sắc Đẹp',
      url: 'solastudio.demo.teamvt.vn',
      image: 'assets/demo-sola-studio.jpg',
      alt: 'Hình ảnh bố cục website mẫu minh họa cho dịch vụ chăm sóc sắc đẹp Sola Studio',
      blocks: [
        { title: 'Làm sạch & Phục hồi (60p)', desc: 'Phù hợp da nhạy cảm, da thiếu ẩm cần làm dịu hàng tuần.' },
        { title: 'Chăm sóc chuyên sâu (75p)', desc: 'Kết hợp massage thư giãn vùng cổ vai gáy và dưỡng chất dịu nhẹ.' },
        { title: 'Bảng giá niêm yết', desc: 'Hiển thị rõ thời lượng và chi phí từng dịch vụ trước khi hẹn.' }
      ],
      footerNote: 'Ưu tiên nút nhắn Zalo / gọi hotline nhanh trên màn hình điện thoại kèm địa chỉ và giờ mở cửa.'
    }
  };

  /* ------------------------------------------------------------------------
     3. Hero Real Web Image Switcher
     ------------------------------------------------------------------------ */
  const heroTabs = document.querySelectorAll('[data-hero-sample]');
  const heroImg = document.getElementById('hero-stage-img');
  const heroCaption = document.getElementById('hero-stage-caption');
  const heroZoomBtn = document.getElementById('hero-zoom-btn');

  function setHeroSample(key) {
    const sample = SAMPLE_DATA[key];
    if (!sample || !heroImg) return;
    heroImg.src = sample.image;
    heroImg.alt = sample.alt;
    if (heroCaption) {
      const span = heroCaption.querySelector('span');
      if (span) span.textContent = sample.caption;
    }
    if (heroZoomBtn) {
      heroZoomBtn.setAttribute('data-sample', key);
    }
  }

  if (heroTabs.length > 0) {
    heroTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const key = tab.getAttribute('data-hero-sample');
        heroTabs.forEach(function (t) {
          t.setAttribute('aria-selected', String(t === tab));
        });
        setHeroSample(key);
      });
    });
  }

  /* ------------------------------------------------------------------------
     4. FAQ Accordion
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.faq-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  });

  /* ------------------------------------------------------------------------
     5. Pricing CTAs -> Pre-select Goal in Form
     ------------------------------------------------------------------------ */
  const pricingFreeBtn = document.getElementById('pricing-free-btn');
  const pricingCtaBtn = document.getElementById('pricing-cta-btn');
  const goalSelect = document.getElementById('lead-goal');

  if (pricingFreeBtn && goalSelect) {
    pricingFreeBtn.addEventListener('click', function () {
      goalSelect.value = 'Nhận website mẫu miễn phí (gửi trong 48h)';
    });
  }

  if (pricingCtaBtn && goalSelect) {
    pricingCtaBtn.addEventListener('click', function () {
      goalSelect.value = 'Đăng ký Gói Landing Page Cơ Bản (1.250.000đ)';
    });
  }

  /* ------------------------------------------------------------------------
     6. Interactive Sample Website Modal
     ------------------------------------------------------------------------ */
  const modal = document.getElementById('sample-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalClose = document.getElementById('modal-close');
  const previewStage = document.getElementById('preview-stage');
  const previewUrl = document.getElementById('preview-url');
  const previewContent = document.getElementById('preview-content');
  const viewportBtns = document.querySelectorAll('.viewport-btn');
  let lastTriggerBtn = null;

  function renderSampleModal(key) {
    const sample = SAMPLE_DATA[key];
    if (!sample || !modal) return;

    modalTitle.textContent = sample.title;
    modalCategory.textContent = sample.category;
    previewUrl.textContent = sample.url;

    const blocksHtml = sample.blocks
      .map(function (b) {
        return (
          '<div class="preview-block">' +
          '<strong>' + b.title + '</strong>' +
          '<span>' + b.desc + '</span>' +
          '</div>'
        );
      })
      .join('');

    previewContent.innerHTML =
      '<div class="preview-image-box">' +
      '<img src="' + sample.image + '" alt="' + sample.alt + '" />' +
      '</div>' +
      '<div class="preview-blocks">' + blocksHtml + '</div>' +
      '<div class="preview-footer-bar">' +
      '<span>' + sample.footerNote + '</span>' +
      '<strong>Bố cục minh họa bởi Team VT</strong>' +
      '</div>';
  }

  function openSampleModal(key, triggerEl) {
    lastTriggerBtn = triggerEl;
    renderSampleModal(key);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeSampleModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastTriggerBtn) {
      lastTriggerBtn.focus();
      lastTriggerBtn = null;
    }
  }

  document.querySelectorAll('.sample-preview-btn, #hero-zoom-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openSampleModal(btn.getAttribute('data-sample'), btn);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeSampleModal);
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeSampleModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) closeSampleModal();
  });

  viewportBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const view = btn.getAttribute('data-view');
      viewportBtns.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      previewStage.classList.toggle('is-mobile', view === 'mobile');
    });
  });

  /* ------------------------------------------------------------------------
     7. Form Validation & Live Submission (FormSubmit / Web3Forms)
     ------------------------------------------------------------------------ */
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.getElementById('form-status');

  const FIELDS = [
    {
      id: 'lead-name',
      errId: 'err-name',
      validate: function (val) {
        return val.trim() ? '' : 'Vui lòng nhập tên của bạn.';
      }
    },
    {
      id: 'lead-phone',
      errId: 'err-phone',
      validate: function (val) {
        const cleaned = val.replace(/[\s.-]/g, '');
        if (!cleaned) return 'Vui lòng nhập số điện thoại hoặc số Zalo.';
        if (!/^[0-9+]{8,15}$/.test(cleaned)) return 'Số điện thoại chưa đúng định dạng (8–15 chữ số).';
        return '';
      }
    },
    {
      id: 'lead-email',
      errId: 'err-email',
      validate: function (val) {
        if (!val.trim()) return 'Vui lòng nhập địa chỉ email.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Email chưa đúng định dạng.';
        return '';
      }
    },
    {
      id: 'lead-industry',
      errId: 'err-industry',
      validate: function (val) {
        return val.trim() ? '' : 'Vui lòng cho biết lĩnh vực kinh doanh của bạn.';
      }
    },
    {
      id: 'lead-goal',
      errId: 'err-goal',
      validate: function (val) {
        return val.trim() ? '' : 'Vui lòng chọn mục đích sử dụng website.';
      }
    }
  ];

  function setFieldError(fieldObj, message) {
    const input = document.getElementById(fieldObj.id);
    const errEl = document.getElementById(fieldObj.errId);
    if (!input || !errEl) return;
    const wrapper = input.closest('.field');
    if (wrapper) wrapper.classList.toggle('field--error', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    errEl.textContent = message;
  }

  FIELDS.forEach(function (fieldObj) {
    const input = document.getElementById(fieldObj.id);
    if (!input) return;
    ['input', 'change'].forEach(function (evt) {
      input.addEventListener(evt, function () {
        if (!fieldObj.validate(input.value)) setFieldError(fieldObj, '');
      });
    });
  });

  function buildMailtoHref(data) {
    const subject = encodeURIComponent('[Team VT] Yêu cầu website mẫu / tư vấn — ' + data.name);
    const body = encodeURIComponent(
      'Tên: ' + data.name + '\n' +
      'Điện thoại / Zalo: ' + data.phone + '\n' +
      'Email: ' + data.email + '\n' +
      'Lĩnh vực: ' + data.industry + '\n' +
      'Thương hiệu / Link Fanpage: ' + (data.brand || 'Chưa cung cấp') + '\n' +
      'Nhu cầu: ' + data.goal + '\n' +
      'Mô tả thêm: ' + (data.notes || 'Không có')
    );
    return 'mailto:vtwebdesign8@gmail.com?subject=' + subject + '&body=' + body;
  }

  function showStatus(type, html) {
    if (!formStatus) return;
    formStatus.className = 'form-status form-status--' + type;
    formStatus.innerHTML = html;
    formStatus.hidden = false;
  }

  async function sendToProvider(payload, honeypotValue) {
    if (FORM_CONFIG.FORM_PROVIDER === 'web3forms') {
      if (!FORM_CONFIG.WEB3FORMS_ACCESS_KEY) {
        throw new Error('WEB3FORMS_MISSING_KEY');
      }
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: FORM_CONFIG.WEB3FORMS_ACCESS_KEY,
          subject: '[Team VT] Yêu cầu mới từ ' + payload.name + ' (' + payload.industry + ')',
          from_name: payload.name,
          replyto: payload.email,
          botcheck: honeypotValue || '',
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          industry: payload.industry,
          brand: payload.brand || 'Không có',
          goal: payload.goal,
          notes: payload.notes || 'Không có'
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'WEB3FORMS_ERROR');
      }
      return json;
    }

    // Default: FormSubmit (https://formsubmit.co/ajax/<email>)
    const endpoint = 'https://formsubmit.co/ajax/' + encodeURIComponent(FORM_CONFIG.FORMSUBMIT_EMAIL);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: '[Team VT] Yêu cầu mới từ ' + payload.name + ' (' + payload.industry + ')',
        _template: 'table',
        _replyto: payload.email,
        _honey: honeypotValue || '',
        'Tên khách hàng': payload.name,
        'Số điện thoại / Zalo': payload.phone,
        'Email': payload.email,
        'Lĩnh vực': payload.industry,
        'Thương hiệu / Fanpage': payload.brand || 'Không có',
        'Mục đích': payload.goal,
        'Mô tả thêm': payload.notes || 'Không có'
      })
    });
    const json = await res.json();
    if (!res.ok || json.success === 'false' || json.success === false) {
      throw new Error(json.message || 'FORMSUBMIT_ERROR');
    }
    return json;
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (formStatus) formStatus.hidden = true;

      let firstInvalid = null;
      FIELDS.forEach(function (fieldObj) {
        const input = document.getElementById(fieldObj.id);
        if (!input) return;
        const msg = fieldObj.validate(input.value);
        setFieldError(fieldObj, msg);
        if (msg && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const payload = {
        name: document.getElementById('lead-name').value.trim(),
        phone: document.getElementById('lead-phone').value.trim(),
        email: document.getElementById('lead-email').value.trim(),
        industry: document.getElementById('lead-industry').value.trim(),
        brand: document.getElementById('lead-brand').value.trim(),
        goal: document.getElementById('lead-goal').value.trim(),
        notes: document.getElementById('lead-notes').value.trim()
      };
      const honeypot = form.querySelector('input[name="_honey"]');
      const honeypotVal = honeypot ? honeypot.value : '';
      const mailtoHref = buildMailtoHref(payload);

      if (window.location.protocol === 'file:') {
        showStatus(
          'success',
          '<h4>Đã kiểm tra thông tin của bạn!</h4>' +
          '<p>Trang đang mở trực tiếp từ tệp trên máy (<code>file://</code>) nên trình duyệt chưa gửi API email tự động. Khi đưa lên hosting (<code>https://</code>), form sẽ gửi thẳng về <strong>' + FORM_CONFIG.FORMSUBMIT_EMAIL + '</strong>. Ngay lúc này bạn có thể gửi nhanh bằng nút bên dưới:</p>' +
          '<div class="form-status-actions">' +
          '<a href="' + mailtoHref + '" class="btn btn--primary btn--sm">Gửi ngay qua Email</a>' +
          '<a href="https://zalo.me/0364065610" target="_blank" rel="noopener noreferrer" class="btn btn--secondary btn--sm">Nhắn Zalo 0364 065 610</a>' +
          '</div>'
        );
        return;
      }

      submitBtn.disabled = true;
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Đang gửi yêu cầu...';

      try {
        await sendToProvider(payload, honeypotVal);
        showStatus(
          'success',
          '<h4>Cảm ơn bạn đã liên hệ Team VT!</h4>' +
          '<p>Thông tin của bạn đã được gửi thành công. Chúng mình sẽ xem xét và phản hồi trong giờ làm việc (8:30 – 18:30, Thứ 2 – Thứ 7). Nếu bạn đăng ký mẫu thử miễn phí, bản xem trước sẽ được gửi trong vòng 48 giờ làm việc.</p>'
        );
        form.reset();
      } catch (err) {
        showStatus(
          'error',
          '<h4>Chưa gửi được tự động lúc này</h4>' +
          '<p>Kết nối dịch vụ nhận form tạm gián đoạn hoặc chưa kích hoạt trên tên miền mới. Thông tin bạn đã nhập vẫn được giữ nguyên — hãy nhấn nút bên dưới để gửi ngay qua Email hoặc Zalo:</p>' +
          '<div class="form-status-actions">' +
          '<a href="' + mailtoHref + '" class="btn btn--primary btn--sm">Mở ứng dụng Email để gửi</a>' +
          '<a href="https://zalo.me/0364065610" target="_blank" rel="noopener noreferrer" class="btn btn--secondary btn--sm">Nhắn Zalo 0364 065 610</a>' +
          '</div>'
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }
})();
