/* אנה גורן — סקריפט משותף. אין תלויות. */
(function () {
  'use strict';
  var doc = document;
  doc.documentElement.classList.add('js');
  if (/[?&]dev=1/.test(location.search)) doc.body.setAttribute('data-dev','1');

  /* ---------------------------------------------------- חשיפה בגלילה --- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isStatic = /[?&]static=1/.test(location.search);
  var revs = doc.querySelectorAll('.rev');

  if (reduced || isStatic || !('IntersectionObserver' in window)) {
    for (var i = 0; i < revs.length; i++) revs[i].classList.add('in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    for (var j = 0; j < revs.length; j++) io.observe(revs[j]);
  }

  /* ---------------------------------------------------- תפריט מובייל --- */
  var burger = doc.querySelector('.nav__burger');
  var sheet  = doc.querySelector('.sheet');
  if (burger && sheet) {
    var closeBtn = sheet.querySelector('.sheet__x');
    var setOpen = function (open) {
      sheet.setAttribute('data-open', open ? 'true' : 'false');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      doc.body.style.overflow = open ? 'hidden' : '';
      if (open) { var f = sheet.querySelector('a,button'); if (f) f.focus(); }
      else burger.focus();
    };
    burger.addEventListener('click', function () { setOpen(true); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
    sheet.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet.getAttribute('data-open') === 'true') setOpen(false);
    });
  }

  /* ---------------------------------------------------- קו תחת הניווט -- */
  var nav = doc.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.setAttribute('data-stuck', window.scrollY > 8 ? 'true' : 'false');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------- אקורדיון יחיד -- */
  var days = doc.querySelectorAll('[data-accordion] details');
  for (var k = 0; k < days.length; k++) {
    days[k].addEventListener('toggle', function () {
      if (!this.open) return;
      var self = this;
      for (var m = 0; m < days.length; m++) if (days[m] !== self) days[m].open = false;
    });
  }
}());
