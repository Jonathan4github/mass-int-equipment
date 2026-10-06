/* Mass Int'l & Equipment — premium interactions */
(function () {
  'use strict';

  /* Sticky navbar */
  var nav = document.querySelector('.nav-p');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.classList.remove('open');
        links.classList.remove('open');
      }
    });
  }

  /* Hero slideshow */
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dots button');
  if (slides.length) {
    var idx = 0, timer;
    function go(n) {
      slides[idx].classList.remove('active');
      if (dots[idx]) dots[idx].classList.remove('active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('active');
      if (dots[idx]) dots[idx].classList.add('active');
    }
    function next() { go(idx + 1); }
    function start() { timer = setInterval(next, 5500); }
    function reset() { clearInterval(timer); start(); }
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { go(i); reset(); });
    });
    start();
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Animated counters */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var dur = 1600, startT = null;
        function step(ts) {
          if (!startT) startT = ts;
          var p = Math.min((ts - startT) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* Gallery filter + pagination */
  var filterBtns = document.querySelectorAll('.gallery-filters button');
  var items = Array.prototype.slice.call(document.querySelectorAll('.masonry .g-item'));
  var pager = document.querySelector('.gallery-pager');
  var PER_PAGE = 12;
  var filter = 'all', page = 1;

  function matches() {
    return items.filter(function (it) {
      return filter === 'all' || it.getAttribute('data-cat') === filter;
    });
  }

  /* Page numbers to show: first, last, current ±1, with gaps as null */
  function pageList(total) {
    var out = [];
    for (var p = 1; p <= total; p++) {
      if (p === 1 || p === total || Math.abs(p - page) <= 1) out.push(p);
      else if (out[out.length - 1] !== null) out.push(null);
    }
    return out;
  }

  function pagerBtn(label, target, opts) {
    var b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = label;
    if (opts.aria) b.setAttribute('aria-label', opts.aria);
    if (opts.current) { b.className = 'active'; b.setAttribute('aria-current', 'page'); }
    if (opts.disabled) b.disabled = true;
    else b.addEventListener('click', function () { showPage(target, true); });
    return b;
  }

  function renderPager(total) {
    if (!pager) return;
    pager.innerHTML = '';
    if (total <= 1) return;
    pager.appendChild(pagerBtn('<i class="fas fa-chevron-left"></i>', page - 1,
      { aria: 'Previous page', disabled: page === 1 }));
    pageList(total).forEach(function (p) {
      if (p === null) {
        var gap = document.createElement('span');
        gap.className = 'gap';
        gap.textContent = '…';
        pager.appendChild(gap);
      } else {
        pager.appendChild(pagerBtn(String(p), p, { aria: 'Page ' + p, current: p === page }));
      }
    });
    pager.appendChild(pagerBtn('<i class="fas fa-chevron-right"></i>', page + 1,
      { aria: 'Next page', disabled: page === total }));
  }

  function showPage(n, scroll) {
    var list = matches();
    var total = Math.max(1, Math.ceil(list.length / PER_PAGE));
    page = Math.min(Math.max(1, n), total);
    var start = (page - 1) * PER_PAGE, end = start + PER_PAGE;
    items.forEach(function (it) { it.classList.add('is-hidden'); });
    list.slice(start, end).forEach(function (it) { it.classList.remove('is-hidden'); });
    renderPager(total);
    if (scroll) {
      var top = document.querySelector('.gallery-filters') || pager;
      window.scrollTo({ top: top.getBoundingClientRect().top + window.scrollY - 110, behavior: 'smooth' });
    }
  }

  if (items.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filter = btn.getAttribute('data-filter');
        showPage(1, false);
      });
    });
    showPage(1, false);
  }
})();
