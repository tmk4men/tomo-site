(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Safety net: ensure the typewriter characters end up visible no matter
  // what (browser bugs, CSS edge cases, an extension forcing reduce-motion,
  // etc.). Last char's animation finishes at ~2.13s; we firm it up at 3s.
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    setTimeout(() => heroTitle.classList.add("has-typed"), 3000);
  }

  const docEl = document.documentElement;

  // ── header: scroll state + auto hide on scroll-down ─────────────
  const header = document.querySelector(".site-header");
  const progressBar = document.querySelector(".scroll-progress span");
  const bgMark = document.querySelector(".site-bg__mark");
  let lastY = window.scrollY;
  let ticking = false;

  const updateOnScroll = () => {
    const y = window.scrollY;
    const max = (docEl.scrollHeight - window.innerHeight) || 1;
    const ratio = Math.min(1, Math.max(0, y / max));

    if (header) {
      if (y > 12) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");

      // Hide only after a meaningful scroll-down gesture so the header
      // doesn't flash away on small touch deltas / momentum-scroll jitter.
      const dy = y - lastY;
      if (y > 240 && dy > 6) header.classList.add("is-hidden");
      else if (dy < -2 || y <= 240) header.classList.remove("is-hidden");
    }

    if (progressBar) progressBar.style.width = (ratio * 100).toFixed(2) + "%";

    if (bgMark) {
      const offset = -Math.round(y * 0.06);
      bgMark.style.setProperty("--mark-parallax", offset + "px");
    }

    lastY = y;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  };
  updateOnScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // ── reveal-on-scroll ────────────────────────────────────────────
  // Elements whose children own the staggered reveal (section-head,
  // about-grid, crew-card) are observed for `.is-visible` only — they
  // don't get the parent-level fade-in `.reveal` to avoid compound
  // opacity/transform with their children.
  const revealEls = document.querySelectorAll(
    ".about, .crew, .works, .work-item, .works-note"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  const observeEls = [
    ...revealEls,
    ...document.querySelectorAll(".section-head, .about-grid, .crew-card"),
  ];

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    observeEls.forEach((el) => io.observe(el));
  } else {
    observeEls.forEach((el) => el.classList.add("is-visible"));
  }

  // stagger reveal for work items
  document.querySelectorAll(".work-item").forEach((el, i) => {
    el.style.transitionDelay = `${i * 110}ms`;
  });

  // ── footer horizon: re-draw each time it enters viewport ────────
  const footerHorizon = document.querySelector(".footer-horizon path");
  if (footerHorizon && "IntersectionObserver" in window) {
    const horIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            footerHorizon.style.animation = "none";
            // restart by reflowing
            void footerHorizon.getBoundingClientRect();
            footerHorizon.style.animation = "";
          }
        });
      },
      { threshold: 0.4 }
    );
    horIO.observe(footerHorizon);
  }

})();
