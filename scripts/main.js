(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const revealTargets = document.querySelectorAll(
    ".about, .works, .contact, .section-head, .work-item, .about-grid, .contact-form, .hero-caption"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  const form = document.getElementById("contact-form");
  if (form) {
    const statusEl = form.querySelector(".form-status");
    const btn = form.querySelector(".submit-btn");
    const action = form.getAttribute("action") || "";
    const isConfigured = action && !action.includes("YOUR_FORM_ID");

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if (form.querySelector('input[name="_gotcha"]').value) return;

      if (!isConfigured) {
        statusEl.textContent =
          "送信先が未設定です。フォームのaction属性にFormspree等のURLを設定してください。";
        statusEl.className = "form-status is-error";
        return;
      }

      btn.disabled = true;
      statusEl.textContent = "送信中…";
      statusEl.className = "form-status";

      try {
        const res = await fetch(action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (res.ok) {
          form.reset();
          statusEl.textContent = "送信しました。お返事まで、しばしお待ちください。";
          statusEl.className = "form-status is-ok";
        } else {
          throw new Error("bad response");
        }
      } catch (_) {
        statusEl.textContent =
          "送信に失敗しました。時間を置いて再度お試しください。";
        statusEl.className = "form-status is-error";
      } finally {
        btn.disabled = false;
      }
    });
  }
})();
