(function () {
  'use strict';

  /* ---------- 建立網站：產生通行碼並跳轉 /antwOnline=<通行碼> ---------- */
  function goCreate() {
    var pass = ANTW_PASS.make();
    ANTW_PASS.save(pass);
    location.href = '/antwOnline=' + pass;
  }

  var createBtns = document.querySelectorAll("#create-site, [data-create]");
  for (var i = 0; i < createBtns.length; i++) createBtns[i].addEventListener('click', goCreate);

  /* ---------- 隱私權政策：讀取 privacy.json，在同一頁以彈窗顯示 ---------- */
  var sheet = document.getElementById('privacy');
  var body = document.getElementById('privacy-body');
  var titleEl = document.getElementById('privacy-title');
  var updatedEl = document.getElementById('privacy-updated');
  var closeBtn = document.getElementById('privacy-close');
  var page = document.getElementById('page');
  var lastFocus = null;
  var loaded = false;

  function el(tag, text, cls) {
    var n = document.createElement(tag);
    if (text) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  }

  function render(data) {
    body.textContent = '';
    if (data.title) titleEl.textContent = data.title;
    if (data.updated) updatedEl.textContent = '最後更新：' + data.updated;
    (data.sections || []).forEach(function (s) {
      var sec = el('section', '', 'block');
      sec.appendChild(el('h2', s.heading));
      (s.paragraphs || []).forEach(function (t) { sec.appendChild(el('p', t)); });
      if (s.list && s.list.length) {
        var ul = el('ul');
        s.list.forEach(function (t) { ul.appendChild(el('li', t)); });
        sec.appendChild(ul);
      }
      (s.after || []).forEach(function (t) { sec.appendChild(el('p', t)); });
      body.appendChild(sec);
    });
  }

  function load() {
    if (loaded) return;
    fetch('/antw/os/ui/privacy.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) { render(d); loaded = true; })
      .catch(function () { body.textContent = '隱私權政策載入失敗，請稍後再試。'; });
  }

  function openPrivacy(fromHash) {
    lastFocus = document.activeElement;
    load();
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    page.setAttribute('inert', '');
    document.body.classList.add('locked');
    body.scrollTop = 0;
    closeBtn.focus({ preventScroll: true });
    if (!fromHash && location.hash !== '#privacy') history.pushState(null, '', '#privacy');
  }

  function closePrivacy(fromHash) {
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    page.removeAttribute('inert');
    document.body.classList.remove('locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    if (!fromHash && location.hash === '#privacy') history.back();
  }

  var openers = document.querySelectorAll('[data-open-privacy]');
  for (var j = 0; j < openers.length; j++) {
    openers[j].addEventListener('click', function () { openPrivacy(false); });
  }
  closeBtn.addEventListener('click', function () { closePrivacy(false); });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) closePrivacy(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheet.classList.contains('open')) closePrivacy(false);
  });

  window.addEventListener('hashchange', function () {
    var isOpen = sheet.classList.contains('open');
    if (location.hash === '#privacy' && !isOpen) openPrivacy(true);
    else if (location.hash !== '#privacy' && isOpen) closePrivacy(true);
  });

  if (location.hash === '#privacy') openPrivacy(true);
})();
