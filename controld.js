/* ============================================================
   TeamDominant — Control D layer interactions
   Depends on app.js (palette, i18n) being loaded first.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- hero direction (variant) ---------- */
  window.cdSetDir = function (dir) {
    document.body.setAttribute("data-dir", dir || "split");
    if (window.cdMap) window.cdMap.setActive(dir === "map");
  };

  /* ---------- live dashboard panel ---------- */
  function initPanel() {
    var panel = document.querySelector(".cd-panel");
    if (!panel) return;

    /* spark bars */
    var spark = panel.querySelector(".cd-spark");
    if (spark) {
      for (var i = 0; i < 28; i++) {
        var b = document.createElement("i");
        b.style.height = (20 + Math.random() * 70) + "%";
        spark.appendChild(b);
      }
    }
    var bars = spark ? [].slice.call(spark.children) : [];
    var speedEl = panel.querySelector("[data-speed]");
    var rows = [].slice.call(panel.querySelectorAll(".cd-row"));
    var connFlag = panel.querySelector(".cd-conn .flag");
    var connCity = panel.querySelector(".cd-conn .city");
    var connSub = panel.querySelector(".cd-conn .sub");
    var active = rows.findIndex(function (r) { return r.classList.contains("active"); });
    if (active < 0) active = 0;

    function tick() {
      if (document.body.classList.contains("no-anim")) return;
      // shift spark bars left, push a new value
      if (bars.length) {
        for (var k = 0; k < bars.length - 1; k++) {
          bars[k].style.height = bars[k + 1].style.height;
        }
        bars[bars.length - 1].style.height = (18 + Math.random() * 78) + "%";
      }
      // jitter speed
      if (speedEl) {
        var base = parseFloat(speedEl.dataset.base || "9.4");
        var v = (base + (Math.random() - 0.5) * 1.6).toFixed(1);
        speedEl.textContent = v;
      }
    }
    var timer = null;
    function start() { if (!timer && !reduce) timer = setInterval(tick, 900); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    // only animate when visible
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.15 });
    io.observe(panel);

    // server selection cycling + click
    function select(idx) {
      if (idx === active || !rows[idx]) return;
      rows[active].classList.remove("active");
      rows[idx].classList.add("active");
      active = idx;
      var r = rows[idx];
      if (connFlag) connFlag.textContent = r.dataset.flag || connFlag.textContent;
      if (connCity) connCity.textContent = r.dataset.city || connCity.textContent;
      if (connSub && r.dataset.host) connSub.textContent = r.dataset.host;
      if (speedEl && r.dataset.base) speedEl.dataset.base = r.dataset.base;
    }
    rows.forEach(function (r, idx) {
      r.addEventListener("click", function () { select(idx); autoIdx = idx; });
    });
    var autoIdx = active;
    if (!reduce) {
      setInterval(function () {
        autoIdx = (autoIdx + 1) % rows.length;
        select(autoIdx);
      }, 4200);
    }
  }

  /* ---------- network map canvas ---------- */
  function initMap() {
    var canvas = document.getElementById("cd-map");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, active = false, raf = null;

    // normalized node positions (rough global spread)
    var pts = [
      [0.12, 0.34], [0.18, 0.52], [0.27, 0.30], [0.30, 0.62],
      [0.46, 0.28], [0.49, 0.46], [0.52, 0.66], [0.58, 0.38],
      [0.66, 0.30], [0.70, 0.55], [0.78, 0.42], [0.84, 0.60],
      [0.88, 0.34], [0.40, 0.74], [0.62, 0.74], [0.36, 0.40]
    ];
    var hub = 8; // index of "home" hub
    var pulses = [];

    function rgba(a) { return "rgba(240,240,240," + a + ")"; }

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function P(i) { return [pts[i][0] * W, pts[i][1] * H]; }

    function spawn() {
      var to = Math.floor(Math.random() * pts.length);
      if (to === hub) return;
      pulses.push({ to: to, t: 0, sp: 0.006 + Math.random() * 0.006 });
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      var h = P(hub);
      // arcs from hub
      ctx.lineWidth = 1;
      for (var i = 0; i < pts.length; i++) {
        if (i === hub) continue;
        var p = P(i);
        ctx.strokeStyle = rgba(0.06);
        ctx.beginPath();
        var mx = (h[0] + p[0]) / 2, my = (h[1] + p[1]) / 2 - Math.abs(p[0] - h[0]) * 0.18;
        ctx.moveTo(h[0], h[1]); ctx.quadraticCurveTo(mx, my, p[0], p[1]); ctx.stroke();
      }
      // nodes
      for (var j = 0; j < pts.length; j++) {
        var q = P(j);
        var isHub = j === hub;
        ctx.fillStyle = rgba(isHub ? 0.9 : 0.4);
        ctx.beginPath(); ctx.arc(q[0], q[1], isHub ? 4 : 2.2, 0, 6.2832); ctx.fill();
        if (isHub) {
          ctx.strokeStyle = rgba(0.25); ctx.lineWidth = 1;
          var pr = 4 + ((Date.now() % 2000) / 2000) * 16;
          ctx.globalAlpha = 1 - ((Date.now() % 2000) / 2000);
          ctx.beginPath(); ctx.arc(q[0], q[1], pr, 0, 6.2832); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      // pulses
      for (var k = pulses.length - 1; k >= 0; k--) {
        var pl = pulses[k]; pl.t += pl.sp;
        if (pl.t >= 1) { pulses.splice(k, 1); continue; }
        var d = P(pl.to);
        var mx2 = (h[0] + d[0]) / 2, my2 = (h[1] + d[1]) / 2 - Math.abs(d[0] - h[0]) * 0.18;
        var t = pl.t, it = 1 - t;
        var x = it * it * h[0] + 2 * it * t * mx2 + t * t * d[0];
        var y = it * it * h[1] + 2 * it * t * my2 + t * t * d[1];
        ctx.fillStyle = rgba(0.9);
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 6.2832); ctx.fill();
        ctx.fillStyle = rgba(0.18);
        ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.2832); ctx.fill();
      }
      if (Math.random() < 0.06) spawn();
      raf = requestAnimationFrame(frame);
    }

    var ro = new ResizeObserver(resize); ro.observe(canvas); resize();

    window.cdMap = {
      setActive: function (on) {
        active = on;
        var off = reduce || document.body.classList.contains("no-anim");
        if (on && !raf && !off) { raf = requestAnimationFrame(frame); }
        else if (!on && raf) { cancelAnimationFrame(raf); raf = null; ctx.clearRect(0, 0, W, H); }
        if (on && off) { frame(); if (raf) { cancelAnimationFrame(raf); raf = null; } } // static frame
      }
    };
  }

  /* ---------- comparison accordion ---------- */
  function initCompare() {
    var rows = document.querySelectorAll("#compare .cmp-row");
    if (!rows.length) return;
    rows.forEach(function (row) {
      var head = row.querySelector(".cmp-rowhead");
      if (!head) return;
      head.addEventListener("click", function () {
        row.classList.toggle("open");
      });
    });
  }

  function boot() {
    initPanel();
    initMap();
    initCompare();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
