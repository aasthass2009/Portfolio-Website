/* =============================================================
   Aastha Chaturvedi — Portfolio · "COSMOS" interactions
   - Animated starfield (twinkle, parallax, shooting stars)
   - Comet cursor (desktop)
   - 3D tilt + glow-follow on cards
   - Magnetic buttons
   - Scroll-progress comet + sticky navbar
   - Mobile nav, reveal-on-scroll, scrollspy, footer year
   All motion respects prefers-reduced-motion & touch devices.
   ============================================================= */

document.documentElement.classList.add("js");

(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Elements ---------------- */
  var navbar = document.getElementById("navbar");
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav__link")
  );
  var progress = document.getElementById("scrollProgress");

  /* ---------------- Mobile nav ---------------- */
  function closeMenu() {
    if (!navMenu) return;
    navMenu.classList.remove("is-open");
    navToggle.classList.remove("is-active");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", open);
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });
    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        if (window.innerWidth > 820) closeMenu();
      }, 150);
    });
  }

  /* ---------------- Scroll: navbar state + progress comet ---------------- */
  function onScroll() {
    var st = window.scrollY || document.documentElement.scrollTop || 0;
    if (navbar) navbar.classList.toggle("is-scrolled", st > 20);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? st / max : 0;
      progress.style.width = (pct * 100).toFixed(2) + "%";
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---------------- Reveal on scroll ---------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) {
      revealObs.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------- Scrollspy (active nav link) ---------------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );
  var linkByHash = {};
  navLinks.forEach(function (l) {
    linkByHash[l.getAttribute("href")] = l;
  });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (l) {
            l.classList.remove("is-active");
          });
          var active = linkByHash["#" + entry.target.id];
          if (active) active.classList.add("is-active");
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      spy.observe(s);
    });
  }

  /* ---------------- Starfield canvas ---------------- */
  (function initStarfield() {
    var canvas = document.getElementById("starfield");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var w = 0,
      h = 0,
      dpr = 1,
      stars = [],
      shooting = [],
      raf = null,
      last = 0,
      shootTimer = 200,
      mouseX = 0,
      mouseY = 0,
      scrollY = window.scrollY || 0;

    function tint(kind, a) {
      if (kind === "c") return "rgba(120,230,255," + a + ")";
      if (kind === "v") return "rgba(185,165,255," + a + ")";
      return "rgba(255,255,255," + a + ")";
    }

    function makeStars() {
      var count = Math.min(260, Math.max(70, Math.floor((w * h) * 0.00016)));
      stars = [];
      for (var i = 0; i < count; i++) {
        var z = Math.random();
        var k = Math.random();
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: z * 1.5 + 0.3,
          z: z,
          tw: Math.random() * Math.PI * 2,
          tws: 0.6 + Math.random() * 1.6,
          base: 0.35 + Math.random() * 0.5,
          kind: k < 0.45 ? "c" : k < 0.7 ? "v" : "w",
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeStars();
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = tint(s.kind, s.base);
        ctx.fill();
      }
    }

    function spawnShooting() {
      var angle = Math.PI * 0.78; // down-left streak
      var speed = 9 + Math.random() * 6;
      shooting.push({
        x: w * (0.35 + Math.random() * 0.65),
        y: Math.random() * h * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        len: 80 + Math.random() * 70,
      });
    }

    function frame(t) {
      raf = requestAnimationFrame(frame);
      var dt = last ? Math.min(2.5, (t - last) / 16.67) : 1;
      last = t;
      ctx.clearRect(0, 0, w, h);

      var mx = mouseX - w / 2;
      var my = mouseY - h / 2;

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.tw += 0.02 * s.tws * dt;
        var a = Math.max(0, s.base + Math.sin(s.tw) * 0.35);
        var px = s.x + mx * s.z * 0.02;
        var py = s.y + my * s.z * 0.02 + scrollY * s.z * 0.06;
        py = ((py % h) + h) % h;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = tint(s.kind, a);
        ctx.fill();
        if (s.r > 1.25) {
          ctx.beginPath();
          ctx.arc(px, py, s.r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = tint(s.kind, a * 0.1);
          ctx.fill();
        }
      }

      shootTimer -= dt;
      if (shootTimer <= 0) {
        shootTimer = 200 + Math.random() * 320;
        if (shooting.length < 2) spawnShooting();
      }
      for (var j = shooting.length - 1; j >= 0; j--) {
        var sh = shooting[j];
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;
        sh.life -= 0.012 * dt;
        if (sh.life <= 0 || sh.x < -120 || sh.y > h + 120) {
          shooting.splice(j, 1);
          continue;
        }
        var norm = sh.len / Math.hypot(sh.vx, sh.vy);
        var tailX = sh.x - sh.vx * norm;
        var tailY = sh.y - sh.vy * norm;
        var grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY);
        grad.addColorStop(0, "rgba(220,245,255," + 0.9 * sh.life + ")");
        grad.addColorStop(1, "rgba(220,245,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(190,235,255," + sh.life + ")";
        ctx.fill();
      }
    }

    function start() {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    }
    function stop() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    }

    var rt2;
    function onResize() {
      clearTimeout(rt2);
      rt2 = setTimeout(function () {
        resize();
        if (reduceMotion) drawStatic();
      }, 150);
    }

    resize();

    if (reduceMotion) {
      drawStatic();
      window.addEventListener("resize", onResize);
      return;
    }

    window.addEventListener("resize", onResize);
    window.addEventListener(
      "mousemove",
      function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      },
      { passive: true }
    );
    window.addEventListener(
      "scroll",
      function () {
        scrollY = window.scrollY || 0;
      },
      { passive: true }
    );
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });
    start();
  })();

  /* ---------------- Comet cursor (desktop, motion on) ---------------- */
  if (finePointer && !reduceMotion) {
    (function initCursor() {
      var dot = document.getElementById("cursorDot");
      var ring = document.getElementById("cursorRing");
      if (!dot || !ring) return;
      document.body.classList.add("has-cursor");

      var mx = window.innerWidth / 2,
        my = window.innerHeight / 2,
        rx = mx,
        ry = my;

      window.addEventListener(
        "mousemove",
        function (e) {
          mx = e.clientX;
          my = e.clientY;
          dot.style.transform = "translate(" + mx + "px," + my + "px)";
        },
        { passive: true }
      );
      document.addEventListener("mouseleave", function () {
        document.body.classList.add("cursor-out");
      });
      document.addEventListener("mouseenter", function () {
        document.body.classList.remove("cursor-out");
      });

      var hoverSel =
        "a, button, [data-tilt], .pill, .social, .hero__scroll, .nav__toggle";
      document.addEventListener("mouseover", function (e) {
        if (e.target.closest && e.target.closest(hoverSel)) {
          ring.classList.add("is-hover");
          dot.classList.add("is-hover");
        }
      });
      document.addEventListener("mouseout", function (e) {
        if (!e.target.closest || !e.target.closest(hoverSel)) return;
        var to = e.relatedTarget;
        if (to && to.closest && to.closest(hoverSel)) return;
        ring.classList.remove("is-hover");
        dot.classList.remove("is-hover");
      });

      (function loop() {
        requestAnimationFrame(loop);
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      })();
    })();
  }

  /* ---------------- 3D tilt + glow-follow ---------------- */
  if (finePointer && !reduceMotion) {
    (function initTilt() {
      var cards = document.querySelectorAll("[data-tilt]");
      Array.prototype.forEach.call(cards, function (card) {
        var rafId = null,
          rotX = 0,
          rotY = 0;
        function apply() {
          rafId = null;
          card.style.transform =
            "perspective(900px) rotateX(" +
            rotX +
            "deg) rotateY(" +
            rotY +
            "deg)";
        }
        card.addEventListener("mousemove", function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          rotY = (px - 0.5) * 16;
          rotX = (0.5 - py) * 16;
          card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
          if (!rafId) rafId = requestAnimationFrame(apply);
        });
        card.addEventListener("mouseleave", function () {
          card.style.transform = "";
        });
      });
    })();
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (finePointer && !reduceMotion) {
    (function initMagnetic() {
      var els = Array.prototype.slice
        .call(document.querySelectorAll(".btn"))
        .filter(function (b) {
          return !b.closest("[data-tilt]");
        });
      Array.prototype.forEach.call(
        document.querySelectorAll(".social"),
        function (s) {
          els.push(s);
        }
      );
      els.forEach(function (el) {
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - (r.left + r.width / 2)) * 0.3;
          var y = (e.clientY - (r.top + r.height / 2)) * 0.3;
          el.style.transform = "translate(" + x + "px," + y + "px)";
        });
        el.addEventListener("mouseleave", function () {
          el.style.transform = "";
        });
      });
    })();
  }
})();
