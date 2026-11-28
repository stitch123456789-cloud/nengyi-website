/* 能溢官網共用動態：區塊進場、數字滾動、曲線繪製。prefers-reduced-motion 時直接顯示完成狀態。 */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (reduce || !('IntersectionObserver' in window)) { root.classList.add('motion-off'); return; }
  root.classList.add('motion-on');

  // 進場：.reveal 或 [data-stagger] 的子元素
  document.querySelectorAll('[data-stagger]').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) {
      c.classList.add('reveal');
      c.style.transitionDelay = (i * 70 + (i % 2) * 10) + 'ms';
    });
  });
  var G = window.gsap, ST = window.ScrollTrigger;
  if (G && ST) {
    // 有 GSAP：上下捲動都會播放。往下捲由下往上浮出；往回捲由上往下落回。
    G.registerPlugin(ST);
    root.classList.add('gsap-on');
    var items = G.utils.toArray('.reveal');
    items.forEach(function (el) { el.style.transitionDelay = ''; });
    G.set(items, { autoAlpha: 0, y: 28 });
    var show = function (b, fromY) {
      b.forEach(function (e) { e.classList.add('in'); });
      G.fromTo(b, { autoAlpha: 0, y: fromY }, { autoAlpha: 1, y: 0, duration: .7, ease: 'expo.out', stagger: .07, overwrite: 'auto' });
    };
    var hide = function (b, toY) { G.to(b, { autoAlpha: 0, y: toY, duration: .25, ease: 'power1.in', overwrite: 'auto' }); };
    ST.batch(items, {
      start: 'top 90%', end: 'bottom 8%',
      onEnter: function (b) { show(b, 28); },
      onLeave: function (b) { hide(b, -28); },
      onEnterBack: function (b) { show(b, -28); },
      onLeaveBack: function (b) { hide(b, 28); }
    });
    // 頂端閱讀進度條
    var bar = document.querySelector('.scroll-progress');
    if (bar) G.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });
    // 首屏文字隨捲動微微上移、淡出
    var hc = document.querySelector('.hero-copy');
    if (hc) G.to(hc, { y: -60, autoAlpha: .25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    // 區塊大標：捲進來時從稍微縮小放大到正常
    G.utils.toArray('section h2').forEach(function (h) {
      G.fromTo(h, { scale: .96, transformOrigin: 'left center' }, { scale: 1, ease: 'none', scrollTrigger: { trigger: h, start: 'top 95%', end: 'top 55%', scrub: .4 } });
    });
    window.addEventListener('load', function () { ST.refresh(); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }

  // 數字滾動：data-countup="1200"，可加 data-suffix、data-decimals
  var fmt = function (x, d) { return Number(x).toLocaleString('zh-TW', { minimumFractionDigits: d, maximumFractionDigits: d }); };
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; cio.unobserve(e.target);
      var el = e.target, end = parseFloat(el.dataset.countup), d = +(el.dataset.decimals || 0), suf = el.dataset.suffix || '';
      var t0 = null;
      function step(ts) { if (!t0) t0 = ts; var k = Math.min((ts - t0) / 1200, 1), v = end * (1 - Math.pow(1 - k, 3)); el.textContent = fmt(v, d) + suf; if (k < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-countup]').forEach(function (el) { cio.observe(el); });

  // 曲線繪製：svg 內 .draw 路徑
  var dio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('drawn'); dio.unobserve(e.target); } });
  }, { threshold: 0.4 });
  document.querySelectorAll('svg .draw').forEach(function (p) {
    try { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; } catch (err) {}
    dio.observe(p);
  });
})();
