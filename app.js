/* ============================================================
   TeamDominant — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- accent presets (shared CSS + canvas) ---------- */
  var ACCENTS = {
    mono:  { l: 0.96, c: 0,     h: 0,   rgb: [240, 240, 240] },
    steel: { l: 0.80, c: 0.018, h: 250, rgb: [174, 182, 194] },
    gold:  { l: 0.82, c: 0.135, h: 84,  rgb: [232, 184, 75]  }
  };
  var canvasRGB = ACCENTS.mono.rgb;

  window.applyTweaks = function (t) {
    t = t || {};
    if (t.accent && ACCENTS[t.accent]) {
      var a = ACCENTS[t.accent];
      var r = document.documentElement.style;
      var base = a.l + " " + a.c + " " + a.h;
      var ink = a.c < 0.04 ? "oklch(0.18 0 0)" : "oklch(0.20 0.05 " + a.h + ")";
      r.setProperty("--accent", "oklch(" + base + ")");
      r.setProperty("--accent-soft", "oklch(" + base + " / 0.12)");
      r.setProperty("--accent-line", "oklch(" + base + " / 0.32)");
      r.setProperty("--accent-glow", "oklch(" + base + " / 0.20)");
      r.setProperty("--accent-ink", ink);
      canvasRGB = a.rgb;
    }
    if (t.hero) { window.heroMode = t.hero; }
  };

  /* ---------- i18n (RU default in markup, EN via data-en) ---------- */
  var lang = localStorage.getItem("td-lang") || "ru";

  function setLang(l) {
    lang = l;
    localStorage.setItem("td-lang", l);
    document.documentElement.lang = l;
    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (!el.hasAttribute("data-ru")) el.setAttribute("data-ru", el.textContent);
      el.textContent = l === "en" ? el.getAttribute("data-en") : el.getAttribute("data-ru");
    });
    document.querySelectorAll("[data-en-html]").forEach(function (el) {
      if (!el.hasAttribute("data-ru-html")) el.setAttribute("data-ru-html", el.innerHTML);
      el.innerHTML = l === "en" ? el.getAttribute("data-en-html") : el.getAttribute("data-ru-html");
    });
    document.querySelectorAll("[data-en-ph]").forEach(function (el) {
      if (!el.hasAttribute("data-ru-ph")) el.setAttribute("data-ru-ph", el.getAttribute("placeholder") || "");
      el.setAttribute("placeholder", l === "en" ? el.getAttribute("data-en-ph") : el.getAttribute("data-ru-ph"));
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("on", b.dataset.lang === l);
    });
    if (window.renderPricing) window.renderPricing();
  }

  window.setLang = setLang;

  /* ---------- nav ---------- */
  function initNav() {
    var nav = document.querySelector(".nav");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 12); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    var burger = document.querySelector(".burger");
    var collapse = document.querySelector(".nav-collapse");
    if (burger && collapse) {
      var setOpen = function (open) {
        collapse.classList.toggle("open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      };
      burger.addEventListener("click", function () {
        setOpen(!collapse.classList.contains("open"));
      });
      collapse.querySelectorAll(".nav-links a").forEach(function (a) {
        a.addEventListener("click", function () { setOpen(false); });
      });
      // close when resizing back up to desktop
      window.addEventListener("resize", function () {
        if (window.innerWidth > 980) setOpen(false);
      });
    }
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.dataset.lang); });
    });
  }

  /* ---------- reveal + counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.decimals || "0", 10);
    var dur = 1500, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = target * eased;
      el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString(lang === "en" ? "en-US" : "ru-RU");
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = dec ? target.toFixed(dec) : Math.round(target).toLocaleString(lang === "en" ? "en-US" : "ru-RU");
    }
    requestAnimationFrame(step);
  }

  function initReveal() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        e.target.querySelectorAll("[data-count]").forEach(animateCount);
        if (e.target.hasAttribute("data-count")) animateCount(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---------- pricing ---------- */
  var PRICES = {
    start: { 1: 250, 3: 670,  6: 1240, 12: 2250 },
    plus:  { 1: 400, 3: 1070, 6: 1980, 12: 3600 },
    max:   { 1: 600, 3: 1600, 6: 2970, 12: 5400 }
  };
  var SAVE = { 1: 0, 3: 11, 6: 17, 12: 25 };
  var period = 1;

  function fmt(n) { return n.toLocaleString(lang === "en" ? "en-US" : "ru-RU"); }

  function flashEl(el) {
    if (!el) return;
    el.classList.remove("flash");
    void el.offsetWidth; // force reflow so the animation re-triggers
    el.classList.add("flash");
  }

  window.renderPricing = function () {
    document.querySelectorAll(".price-card").forEach(function (card) {
      var tier = card.dataset.tier;
      var total = PRICES[tier][period];
      var per = Math.round(total / period);
      var valEl = card.querySelector(".val");
      var oldEl = card.querySelector(".old");
      valEl.textContent = fmt(total);
      flashEl(valEl);
      if (oldEl) {
        var base = PRICES[tier][1] * period;
        oldEl.textContent = (period > 1 && base > total) ? fmt(base) + " ₽" : "";
        flashEl(oldEl);
      }
      var pm = card.querySelector(".price-permonth");
      pm.textContent = "≈ " + fmt(per) + (lang === "en" ? " ₽ / mo" : " ₽ / мес");
    });
    document.querySelectorAll(".period button").forEach(function (b) {
      b.classList.toggle("on", +b.dataset.period === period);
    });
  };

  function initPricing() {
    document.querySelectorAll(".period button").forEach(function (b) {
      b.addEventListener("click", function () { period = +b.dataset.period; window.renderPricing(); });
    });
    if (document.querySelector(".price-card")) window.renderPricing();
  }

  /* ---------- glow cards mouse tracking ---------- */
  function initGlow() {
    document.querySelectorAll(".glow-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- hero canvas ---------- */
  function initHero() {
    var canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { window.heroMode = "glow"; }
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, nodes = [];
    var mouse = { x: -9999, y: -9999 };
    window.heroMode = window.heroMode || "network";

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(Math.floor((W * H) / 16000), 90);
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.4 + 0.6
        });
      }
    }

    function rgba(a) { return "rgba(" + canvasRGB[0] + "," + canvasRGB[1] + "," + canvasRGB[2] + "," + a + ")"; }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      var mode = window.heroMode;

      if (mode === "grid") {
        var gap = 46, t = Date.now() * 0.0004;
        ctx.lineWidth = 1;
        for (var gx = (-(t * 30) % gap); gx < W; gx += gap) {
          ctx.strokeStyle = rgba(0.06);
          ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
        }
        for (var gy = 0; gy < H; gy += gap) {
          var fade = 0.04 + 0.05 * Math.sin(t * 6 + gy * 0.02);
          ctx.strokeStyle = rgba(Math.max(0.015, fade));
          ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
        }
      } else if (mode !== "glow") {
        // network
        for (var i = 0; i < nodes.length; i++) {
          var n = nodes[i];
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
          for (var j = i + 1; j < nodes.length; j++) {
            var m = nodes[j];
            var dx = n.x - m.x, dy = n.y - m.y;
            var d = dx * dx + dy * dy;
            if (d < 18000) {
              ctx.strokeStyle = rgba((1 - d / 18000) * 0.16);
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
            }
          }
          var mdx = n.x - mouse.x, mdy = n.y - mouse.y, md = mdx * mdx + mdy * mdy;
          if (md < 26000) {
            ctx.strokeStyle = rgba((1 - md / 26000) * 0.4);
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
          ctx.fillStyle = rgba(0.5);
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }

    var ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    canvas.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener("pointerleave", function () { mouse.x = -9999; mouse.y = -9999; });
    requestAnimationFrame(frame);
  }

  /* ---------- handwriting / signature reveal ---------- */
  function initHandwrite() {
    var els = document.querySelectorAll(".handwrite");
    if (!els.length) return;
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      // hero elements are visible at load — trigger on a short delay
      if (r.top < window.innerHeight) {
        setTimeout(function () { el.classList.add("in"); }, 350);
      } else {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); }
          });
        }, { threshold: 0.4 });
        io.observe(el);
      }
    });
  }

  /* ---------- hero: flowing background paths (kokonut-style) ---------- */
  function initHeroPaths() {
    var host = document.querySelector(".hero-paths");
    if (!host) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var svgNS = "http://www.w3.org/2000/svg";

    function layer(dir) {
      var svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 696 316");
      svg.setAttribute("fill", "none");
      svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
      for (var i = 0; i < 36; i++) {
        var p = document.createElementNS(svgNS, "path");
        var d =
          "M" + (-380 - i * 5 * dir) + " " + (-189 + i * 6 * dir) +
          "C" + (-380 - i * 5 * dir) + " " + (-189 + i * 6 * dir) +
          " " + (-312 - i * 5 * dir) + " " + (216 - i * 6 * dir) +
          " " + (152 - i * 5 * dir) + " " + (343 - i * 6 * dir) +
          "C" + (616 - i * 5 * dir) + " " + (470 - i * 6 * dir) +
          " " + (684 - i * 5 * dir) + " " + (875 - i * 6 * dir) +
          " " + (684 - i * 5 * dir) + " " + (875 - i * 6 * dir);
        p.setAttribute("d", d);
        p.setAttribute("pathLength", "1");
        p.style.setProperty("--sw", (0.5 + i * 0.035).toFixed(2) + "px");
        p.style.setProperty("--op", (0.10 + i * 0.012).toFixed(3));
        p.style.setProperty("--dur", (16 + Math.random() * 14).toFixed(1) + "s");
        p.style.setProperty("--delay", (-Math.random() * 16).toFixed(1) + "s");
        svg.appendChild(p);
      }
      return svg;
    }
    host.appendChild(layer(1));
    host.appendChild(layer(-1));
  }

  /* ---------- hero: split name into animated letters ---------- */
  function initHeroName() {
    var name = document.querySelector(".hero-name");
    if (!name || name.dataset.split) return;
    name.dataset.split = "1";
    var idx = { i: 0 };
    function wrap(container) {
      [].slice.call(container.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split("").forEach(function (ch) {
            var s = document.createElement("span");
            s.className = "ltr";
            s.textContent = ch;
            s.style.setProperty("--d", (idx.i * 0.045).toFixed(3) + "s");
            idx.i++;
            frag.appendChild(s);
          });
          container.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          wrap(n);
        }
      });
    }
    wrap(name);
  }

  /* ---------- hero: scroll-reactive background + content parallax ---------- */
  function initHeroScroll() {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    var paths = hero.querySelector(".hero-paths");
    var content = hero.querySelector(".hero-center");
    var glow = hero.querySelector(".hero-glow");
    if (paths) requestAnimationFrame(function () { paths.classList.add("in"); });
    var ticking = false;
    function update() {
      ticking = false;
      var h = hero.offsetHeight || 1;
      var p = Math.min(Math.max(window.scrollY / h, 0), 1);
      if (paths) paths.style.transform =
        "translateY(" + (p * -14) + "%) scale(" + (1 + p * 0.18) + ") rotate(" + (p * 5) + "deg)";
      if (content) {
        content.style.transform = "translateY(" + (p * 60) + "px)";
        content.style.opacity = String(Math.max(0, 1 - p * 1.25));
      }
      if (glow) glow.style.transform = "translate(-50%,-50%) scale(" + (1 + p * 0.5) + ")";
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ---------- footer year ---------- */
  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- legal scrollspy ---------- */
  function initLegalNav() {
    var navLinks = document.querySelectorAll(".legal-nav a");
    if (!navLinks.length) return;
    var sections = [].map.call(navLinks, function (a) { return document.querySelector(a.getAttribute("href")); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = "#" + e.target.id;
          navLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === id); });
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(function (s) { if (s) io.observe(s); });
  }

  /* ---------- boot ---------- */
  function boot() {
    initNav();
    initReveal();
    initPricing();
    initGlow();
    initHero();
    initHeroPaths();
    initHeroScroll();
    initHandwrite();
    initYear();
    initLegalNav();
    if (lang !== "ru") setLang(lang); else setLang("ru");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
