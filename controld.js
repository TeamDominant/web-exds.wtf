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

  /* ---------- rotating wireframe globe (hero background) ---------- */
  function initMap() {
    var canvas = document.getElementById("cd-map");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, cx, cy, R, raf = null, ang = 0;

    // graticule samples (lon/lat in radians) — built once, rotated per frame
    var dots = [];
    var DEG = Math.PI / 180;
    // meridians (lines of longitude)
    for (var lon = 0; lon < 360; lon += 24) {
      for (var lat = -78; lat <= 78; lat += 7) {
        dots.push([lon * DEG, lat * DEG, 0.9]);
      }
    }
    // parallels (lines of latitude)
    var rings = [-60, -30, 0, 30, 60];
    for (var ri = 0; ri < rings.length; ri++) {
      for (var lo = 0; lo < 360; lo += 7) {
        dots.push([lo * DEG, rings[ri] * DEG, rings[ri] === 0 ? 1.15 : 0.9]);
      }
    }
    // a few "location" hubs that softly pulse
    var hubs = [
      [4, 52], [13, 50], [-74, 40], [139, 35],
      [37, 55], [-0.1, 51], [103, 1], [151, -33]
    ].map(function (p) { return [p[0] * DEG, p[1] * DEG]; });

    function project(lon, lat) {
      var clat = Math.cos(lat);
      var x = clat * Math.cos(lon);
      var y = Math.sin(lat);
      var z = clat * Math.sin(lon);
      // rotate around vertical (Y) axis
      var ca = Math.cos(ang), sa = Math.sin(ang);
      var rx = x * ca + z * sa;
      var rz = -x * sa + z * ca;
      return { sx: cx + rx * R, sy: cy - y * R, depth: rz };
    }

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W * 0.5;
      cy = H * 0.5;
      R = Math.min(W * 0.46, H * 0.52);
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);

      // faint silhouette ring
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 6.2832);
      ctx.strokeStyle = "rgba(240,240,240,0.10)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // soft inner glow
      var g = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R);
      g.addColorStop(0, "rgba(240,240,240,0.035)");
      g.addColorStop(1, "rgba(240,240,240,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();

      // graticule dots
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var p = project(d[0], d[1]);
        var front = p.depth > 0;
        // front dots brighter; back dots faint (transparent globe)
        var a = (front ? 0.34 : 0.09) * d[2];
        var rr = front ? 1.25 : 0.9;
        ctx.fillStyle = "rgba(240,240,240," + a.toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(p.sx, p.sy, rr, 0, 6.2832); ctx.fill();
      }

      // pulsing location hubs
      var tphase = Date.now() * 0.001;
      for (var h = 0; h < hubs.length; h++) {
        var hp = project(hubs[h][0], hubs[h][1]);
        if (hp.depth <= 0) continue; // only on the near face
        var pulse = (Math.sin(tphase * 1.6 + h) + 1) / 2;
        ctx.fillStyle = "rgba(240,240,240,0.9)";
        ctx.beginPath(); ctx.arc(hp.sx, hp.sy, 1.8, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "rgba(240,240,240," + (0.32 * (1 - pulse)).toFixed(3) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(hp.sx, hp.sy, 2 + pulse * 13, 0, 6.2832); ctx.stroke();
      }

      var off = reduce || document.body.classList.contains("no-anim");
      if (!off) ang += 0.0016;
      if (!off) raf = requestAnimationFrame(frame);
      else raf = null;
    }

    var ro = new ResizeObserver(function () { resize(); if (!raf) frame(); });
    ro.observe(canvas);
    resize();

    window.cdMap = {
      setActive: function (on) {
        if (on && !raf) { frame(); }   // frame() self-schedules unless reduced/no-anim
        else if (!on && raf) { cancelAnimationFrame(raf); raf = null; ctx.clearRect(0, 0, W, H); }
      }
    };
    // globe is the permanent hero background — start immediately
    window.cdMap.setActive(true);
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
