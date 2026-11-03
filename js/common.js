/* Shared runtime: i18n, navigation, reveal animations, media, lightbox */
(function () {
  const S = window.SITE;
  const listeners = [];

  /* ---------------- Language ---------------- */
  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }
  function detectLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "tr" || q === "en") return q;
    const saved = store("lang");
    if (saved === "tr" || saved === "en") return saved;
    return (navigator.language || "en").toLowerCase().startsWith("tr") ? "tr" : "en";
  }
  let lang = detectLang();

  const t = (key) => (S.ui[lang] && S.ui[lang][key]) || S.ui.en[key] || key;
  const L = (v) => (v == null ? "" : typeof v === "string" ? v : v[lang] || v.en || "");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function applyStatic() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.querySelectorAll(".lang-switch").forEach((sw) => {
      sw.dataset.active = lang;
      sw.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    });
  }
  function setLang(l) {
    if (l === lang) return;
    lang = l;
    store("lang", l);
    const url = new URL(location.href);
    if (url.searchParams.has("lang")) { url.searchParams.set("lang", l); history.replaceState(null, "", url); }
    applyStatic();
    listeners.forEach((fn) => fn(lang));
  }
  function onLang(fn) { listeners.push(fn); }

  /* ---------------- Icons ---------------- */
  const ICON = {
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.8"/><path d="m21 15-5-5L5 21"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
    wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12h1M7 8v8M11 4v16M15 7v10M19 10v4M22 12h-1"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></svg>',
    cube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M21 7l-9 5-9-5"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4l-4 16"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.5c2.4.2 4 1.8 4.5 4.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>'
  };

  /* ---------------- Media helpers ---------------- */
  const PH_GRADS = [
    "linear-gradient(135deg,#ff3d8b,#ff8a3d 55%,#ffd23f)",
    "linear-gradient(135deg,#7c5cff,#22d3ee)",
    "linear-gradient(135deg,#22d3ee,#b8f35b)",
    "linear-gradient(135deg,#ff8a3d,#ff3d8b 50%,#7c5cff)",
    "linear-gradient(135deg,#ffd23f,#ff3d8b)",
    "linear-gradient(135deg,#7c5cff,#ff3d8b)"
  ];
  function placeholder(work, i) {
    const d = document.createElement("div");
    d.className = "ph";
    d.style.background = PH_GRADS[i % PH_GRADS.length];
    d.innerHTML = `<span class="ph-icon">${work.type === "video" ? ICON.play : ICON.image}</span><span class="ph-label">${esc(t(work.type === "video" ? "media.video" : "media.image"))}</span>`;
    return d;
  }
  const vio = "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? new IntersectionObserver((ents) => ents.forEach((e) => {
        if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause();
      }), { threshold: 0.4 })
    : null;
  /* Thumbnail: <img> or muted <video>; falls back to a gradient placeholder if the file is missing */
  function thumb(work, i) {
    const wrap = document.createElement("div");
    wrap.className = "thumb";
    const fail = () => { wrap.innerHTML = ""; wrap.appendChild(placeholder(work, i)); wrap.classList.add("is-ph"); };
    if (!work.src) { fail(); return wrap; }
    if (work.type === "video") {
      /* Muted preview that plays while visible on screen */
      const v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true;
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      v.preload = work.poster ? "none" : "metadata";
      if (work.poster) v.poster = work.poster;
      v.src = work.poster ? work.src : work.src + "#t=0.1";
      v.addEventListener("error", fail);
      wrap.appendChild(v);
      if (vio) vio.observe(v);
    } else {
      const img = new Image(); img.loading = "lazy"; img.alt = L(work.title); img.src = work.src; img.onerror = fail;
      wrap.appendChild(img);
    }
    return wrap;
  }

  /* ---------------- Lightbox ---------------- */
  let lbItems = [], lbIndex = 0, lbEl = null, lastFocus = null;
  function buildLightbox() {
    lbEl = document.createElement("div");
    lbEl.className = "lightbox";
    lbEl.setAttribute("role", "dialog");
    lbEl.setAttribute("aria-modal", "true");
    lbEl.hidden = true;
    lbEl.innerHTML = `
      <div class="lb-backdrop" data-close></div>
      <div class="lb-panel">
        <button class="lb-btn lb-close" data-close data-i18n-aria="lb.close">${ICON.close}</button>
        <div class="lb-stage"></div>
        <aside class="lb-info">
          <span class="lb-count"></span>
          <h3 class="lb-title"></h3>
          <p class="lb-desc"></p>
          <div class="lb-meta"></div>
        </aside>
        <button class="lb-btn lb-prev" data-i18n-aria="lb.prev">${ICON.left}</button>
        <button class="lb-btn lb-next" data-i18n-aria="lb.next">${ICON.right}</button>
      </div>`;
    document.body.appendChild(lbEl);
    lbEl.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeLightbox(); });
    lbEl.querySelector(".lb-prev").addEventListener("click", () => stepLightbox(-1));
    lbEl.querySelector(".lb-next").addEventListener("click", () => stepLightbox(1));
    document.addEventListener("keydown", (e) => {
      if (lbEl.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });
    let sx = null;
    lbEl.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lbEl.addEventListener("touchend", (e) => {
      if (sx == null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) stepLightbox(dx < 0 ? 1 : -1);
      sx = null;
    });
    applyStatic();
  }
  function renderLightbox() {
    const w = lbItems[lbIndex];
    const stage = lbEl.querySelector(".lb-stage");
    stage.innerHTML = "";
    const idx = S.works.indexOf(w);
    const fail = () => { stage.innerHTML = ""; stage.appendChild(placeholder(w, idx < 0 ? lbIndex : idx)); };
    if (!w.src) fail();
    else if (w.type === "video") {
      const v = document.createElement("video");
      v.controls = true; v.autoplay = true; v.playsInline = true; v.src = w.src;
      if (w.poster) v.poster = w.poster;
      v.addEventListener("error", fail);
      stage.appendChild(v);
    } else {
      const img = new Image(); img.alt = L(w.title); img.src = w.src; img.onerror = fail;
      stage.appendChild(img);
    }
    lbEl.querySelector(".lb-count").textContent = `${String(lbIndex + 1).padStart(2, "0")} / ${String(lbItems.length).padStart(2, "0")}`;
    lbEl.querySelector(".lb-title").textContent = L(w.title);
    lbEl.querySelector(".lb-desc").textContent = L(w.desc);
    const meta = [];
    if (w.workflow) meta.push(`<div><span class="lb-label">${esc(t("works.flow"))}</span><span class="chip chip-flow">${esc(w.workflow)}</span></div>`);
    if (w.format) meta.push(`<div><span class="lb-label">${esc(t("works.format"))}</span><span class="chip">${esc(w.format)}</span></div>`);
    if (w.models && w.models.length) meta.push(`<div><span class="lb-label">${esc(t("works.models"))}</span>${w.models.map((m) => `<span class="chip">${esc(m)}</span>`).join("")}</div>`);
    lbEl.querySelector(".lb-meta").innerHTML = meta.join("");
    const multi = lbItems.length > 1;
    lbEl.querySelector(".lb-prev").hidden = !multi;
    lbEl.querySelector(".lb-next").hidden = !multi;
  }
  function openLightbox(items, index) {
    if (!lbEl) buildLightbox();
    lbItems = items; lbIndex = index;
    lastFocus = document.activeElement;
    lbEl.hidden = false;
    document.body.classList.add("no-scroll");
    renderLightbox();
    requestAnimationFrame(() => lbEl.classList.add("open"));
    lbEl.querySelector(".lb-close").focus();
  }
  function closeLightbox() {
    lbEl.classList.remove("open");
    const v = lbEl.querySelector("video"); if (v) v.pause();
    document.body.classList.remove("no-scroll");
    setTimeout(() => { lbEl.hidden = true; lbEl.querySelector(".lb-stage").innerHTML = ""; }, 250);
    if (lastFocus) lastFocus.focus();
  }
  function stepLightbox(d) {
    lbIndex = (lbIndex + d + lbItems.length) % lbItems.length;
    renderLightbox();
  }
  onLang(() => { if (lbEl && !lbEl.hidden) renderLightbox(); });

  /* ---------------- Works grid (used on home + Brandifier page) ---------------- */
  function renderWorksGrid(container, works) {
    container.innerHTML = "";
    works.forEach((w, i) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `work ${w.size || ""} reveal`;
      card.dataset.type = w.type;
      card.style.setProperty("--d", (i % 4) * 70 + "ms");
      const gi = S.works.indexOf(w);
      card.appendChild(thumb(w, gi < 0 ? i : gi));
      const ov = document.createElement("div");
      ov.className = "work-ov";
      ov.innerHTML = `
        <span class="work-type">${w.type === "video" ? ICON.play : ICON.image}</span>
        <div class="work-txt">
          <strong>${esc(L(w.title))}</strong>
          <span class="work-models">${(w.models || []).map(esc).join(" · ")}${w.workflow ? ` <em>${esc(w.workflow)}</em>` : ""}${w.format ? ` <em>${esc(w.format)}</em>` : ""}</span>
        </div>
        <span class="work-open">${ICON.expand}</span>`;
      card.appendChild(ov);
      card.setAttribute("aria-label", `${t(w.type === "video" ? "works.play" : "works.view")}: ${L(w.title)}`);
      card.addEventListener("click", () => openLightbox(works, i));
      container.appendChild(card);
    });
    observeReveal(container);
  }

  /* ---------------- Reveal on scroll ---------------- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = "IntersectionObserver" in window && !reduce
    ? new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
    : null;
  function observeReveal(root) {
    (root || document).querySelectorAll(".reveal:not(.in)").forEach((el) => { io ? io.observe(el) : el.classList.add("in"); });
  }

  /* ---------------- Nav ---------------- */
  function initNav() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = header.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("no-scroll", open);
      });
      header.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => {
        header.classList.remove("menu-open"); toggle.setAttribute("aria-expanded", "false"); document.body.classList.remove("no-scroll");
      }));
    }
    document.querySelectorAll(".lang-switch button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
    document.querySelectorAll("[data-cv]").forEach((a) => { a.href = S.person.cv; a.setAttribute("download", ""); });
    /* CV dosyası yayında yoksa "CV İndir" butonlarını gizle (bozuk link göstermemek için) */
    if (/^https?:$/.test(location.protocol)) {
      fetch(S.person.cv, { method: "HEAD" })
        .then((r) => { if (!r.ok) document.documentElement.classList.add("no-cv"); })
        .catch(() => {});
    }
    document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

    /* active section highlight */
    const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    if (links.length && "IntersectionObserver" in window) {
      const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
      const so = new IntersectionObserver((ents) => ents.forEach((e) => {
        if (e.isIntersecting) { links.forEach((l) => l.classList.remove("active")); const a = map.get(e.target.id); if (a) a.classList.add("active"); }
      }), { rootMargin: "-45% 0px -50% 0px" });
      map.forEach((_, id) => { const s = document.getElementById(id); if (s) so.observe(s); });
    }
  }

  /* ---------------- Cursor glow ---------------- */
  function initGlow() {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const g = document.createElement("div"); g.className = "cursor-glow"; document.body.appendChild(g);
    let x = 0, y = 0, raf = null;
    window.addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => { g.style.transform = `translate(${x}px, ${y}px)`; raf = null; });
    }, { passive: true });
  }

  window.APP = { t, L, esc, ICON, getLang: () => lang, onLang, applyStatic, observeReveal, thumb, placeholder, openLightbox, renderWorksGrid };

  document.addEventListener("DOMContentLoaded", () => {
    applyStatic();
    initNav();
    initGlow();
  });
})();
