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
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

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
