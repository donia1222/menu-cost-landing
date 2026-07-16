// ===== Menu Cost · Landing =====
// Idiomas (ES/DE/EN/FR/IT, como la app) + animaciones: nav al hacer scroll,
// reveals, donut de food cost, barras y contadores.
// Sin dependencias.

(function () {
  'use strict';

  /* ================== IDIOMAS ================== */
  const LANGS = ['es', 'de', 'en', 'fr', 'it'];

  function idiomaInicial() {
    // 1) idioma elegido antes por el visitante (guardado)
    const guardado = localStorage.getItem('mc-lang');
    if (guardado && LANGS.includes(guardado)) return guardado;
    // 2) idioma del navegador, si es uno de los 5 de la landing
    const nav = (navigator.language || '').slice(0, 2).toLowerCase();
    if (LANGS.includes(nav)) return nav;
    // 3) si no, español por defecto
    return 'es';
  }

  // en móvil el hero usa el reel vertical subtitulado; en pantallas grandes el horizontal
  const heroVertical = window.matchMedia('(max-width: 720px)');
  function heroSrc(lang) {
    return heroVertical.matches
      ? 'assets/videospromo/reel-' + lang + '.mp4'
      : 'assets/hero-' + lang + '.mp4';
  }

  let langActual = null;

  function aplicarIdioma(lang) {
    const d = I18N[lang];
    if (!d) return;
    langActual = lang;
    document.documentElement.lang = lang;
    document.title = d.meta_title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', d.meta_desc);

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = d[el.dataset.i18n];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const v = d[el.dataset.i18nHtml];
      if (v != null) el.innerHTML = v;
    });

    // vídeo del hero con subtítulos en el idioma elegido
    const hero = document.getElementById('heroVideo');
    if (hero) {
      const src = heroSrc(lang);
      if (!hero.src.endsWith(src)) {
        hero.src = src;
        hero.load();
        hero.play().catch(() => {});
      }
    }

    const code = document.getElementById('langCode');
    if (code) code.textContent = lang.toUpperCase();
    document.querySelectorAll('#langMenu li').forEach((li) => {
      li.classList.toggle('on', li.dataset.lang === lang);
    });
    localStorage.setItem('mc-lang', lang);
  }

  /* selector desplegable */
  const langWrap = document.getElementById('lang');
  const langBtn = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');

  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const abierto = langWrap.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', String(abierto));
  });
  langMenu.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-lang]');
    if (!li) return;
    aplicarIdioma(li.dataset.lang);
    langWrap.classList.remove('open');
    langBtn.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', () => {
    langWrap.classList.remove('open');
    langBtn.setAttribute('aria-expanded', 'false');
  });

  /* ================== NAV: sombra al hacer scroll ================== */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  aplicarIdioma(idiomaInicial());

  /* ================== CONTADORES ================== */
  function animarContador(el) {
    const fin = Number(el.dataset.count || 0);
    const sufijo = el.dataset.suffix || '';
    const dur = 900;
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(fin * eased) + sufijo;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ================== DONUT de food cost ================== */
  function animarDonut() {
    const arc = document.getElementById('donutArc');
    const num = document.getElementById('donutNum');
    if (!arc || !num) return;
    const objetivo = 28;                       // % mostrado
    const CIRC = 301.6;                        // 2πr con r=48
    arc.style.strokeDashoffset = String(CIRC * (1 - objetivo / 100));
    const dur = 1400;
    const t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      num.textContent = Math.round(objetivo * eased);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ================== REVEALS + disparadores ================== */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');

        if (e.target.closest('#chart') || e.target.id === 'chart') {
          document.getElementById('chart').classList.add('chart-on');
        }
        if (e.target.querySelector?.('#donut')) animarDonut();
        e.target.querySelectorAll?.('[data-count]').forEach(animarContador);
        if (e.target.matches?.('[data-count]')) animarContador(e.target);

        const lazyVideo = e.target.querySelector?.('video.lazy-video');
        if (lazyVideo) lazyVideo.play().catch(() => {});

        io.unobserve(e.target);
      }
    },
    { threshold: 0.25 }
  );

  document.querySelectorAll('.reveal, #chart').forEach((el) => io.observe(el));

  /* ================== AVISO de cookies (primera visita) ================== */
  const cookies = document.getElementById('cookies');
  if (cookies && !localStorage.getItem('mc-cookies')) {
    setTimeout(() => { cookies.hidden = false; }, 1200);
  }
  document.getElementById('cookiesOk')?.addEventListener('click', () => {
    localStorage.setItem('mc-cookies', '1');
    cookies.hidden = true;
  });

  /* si se gira el móvil / cambia el ancho, cambiar entre vertical y horizontal */
  heroVertical.addEventListener('change', () => {
    if (langActual) aplicarIdioma(langActual);
  });

  /* el reel vertical existe en los 5 idiomas; el fallback a alemán queda como
     red de seguridad por si algún archivo faltara en el servidor */
  const heroVid = document.getElementById('heroVideo');
  heroVid?.addEventListener('error', () => {
    if (heroVid.src.includes('/reel-') && !heroVid.src.endsWith('reel-de.mp4')) {
      heroVid.src = 'assets/videospromo/reel-de.mp4';
      heroVid.load();
      heroVid.play().catch(() => {});
    }
  });

  /* ================== VÍDEOS: asegurar autoplay ================== */
  document.querySelectorAll('video:not(.lazy-video)').forEach((v) => {
    v.play().catch(() => {
      /* si el navegador lo bloquea, se queda el primer frame */
    });
  });
})();
