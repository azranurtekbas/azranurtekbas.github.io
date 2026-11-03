/* Case study page rendering: project.html?p=<slug> */
(function () {
  const S = window.SITE;
  const { t, L, esc, ICON, onLang, observeReveal, renderWorksGrid, openLightbox } = window.APP;
  const slug = new URLSearchParams(location.search).get("p");
  const idx = S.projects.findIndex((p) => p.slug === slug);

  const DOC_ICON = {
    pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 11v6m0 0-2.5-2.5M12 17l2.5-2.5"/></svg>',
    paper: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2.5zM6 21h12"/><path d="M8 7h6M8 11h6"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>'
  };
  const isExternal = (href) => /^https?:/i.test(href);
  const docAttrs = (d) => isExternal(d.href) ? 'target="_blank" rel="noopener"' : "download";

  function render() {
    const main = document.getElementById("case");
    if (idx < 0) {
      main.innerHTML = `<section class="case-hero"><div class="container"><a class="back" href="index.html#projects">${ICON.left}<span>${esc(t("p.back"))}</span></a><h1 class="case-title">${esc(t("p.notfound"))}</h1></div></section>`;
      return;
    }
    const p = S.projects[idx];
    const next = S.projects[(idx + 1) % S.projects.length];
    document.title = `${L(p.title)} — Azra Nur Tekbaş`;
    const docs = p.docs || [];

    /* hero buttons */
    const heroBtns = [
      ...docs.map((d, i) => `<a class="btn ${i === 0 ? "btn-grad" : "btn-glass"}" href="${esc(d.href)}" ${docAttrs(d)}>${DOC_ICON[d.kind] || ""}<span>${esc(L(d.label))}</span></a>`),
      p.github ? `<a class="btn btn-glass" href="${esc(p.github)}" target="_blank" rel="noopener">${DOC_ICON.github}<span>GitHub</span></a>` : "",
      p.demo ? `<a class="btn btn-glass" href="${esc(p.demo)}" target="_blank" rel="noopener">Demo ${ICON.arrow}</a>` : ""
    ].join("");

    const meta = p.meta && p.meta.length ? `
      <dl class="case-meta">${p.meta.map((m) => `<div><dt>${esc(L(m.l))}</dt><dd>${esc(L(m.v))}</dd></div>`).join("")}</dl>` : "";

    const stats = p.stats && p.stats.length ? `
      <section class="case-block reveal">
        <h2 class="case-h">${esc(t("p.results"))}</h2>
        <div class="case-stats">${p.stats.map((s) => `<div class="case-stat"><b>${esc(s.v)}</b><span>${esc(L(s.l))}</span></div>`).join("")}</div>
      </section>` : "";

    const steps = typeof p.pipeline === "string" ? S[p.pipeline] : p.pipeline;
    const detailed = steps && steps.some((s) => s.d);
    const pipeline = steps && steps.length ? `
      <section class="case-block reveal">
        <h2 class="case-h">${esc(t(p.pipeline === "brandifierFlow" ? "works.how" : "p.pipeline"))}</h2>
        <ol class="pipeline ${detailed ? "pipeline-detailed" : ""}">${steps.map((s, i) => `<li><span class="n">${String(i + 1).padStart(2, "0")}</span><span class="pl-t">${esc(L(s))}</span>${s.d ? `<p>${esc(L(s.d))}</p>` : ""}</li>`).join("")}</ol>
      </section>` : "";

    const modules = p.modules && p.modules.length ? `
      <section class="case-block reveal">
        <h2 class="case-h">${esc(t("p.modules"))}</h2>
        <div class="case-modules">${p.modules.map((m, i) => `<article class="case-module" style="--d:${i * 80}ms"><span class="cm-n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(L(m.t))}</h3><p>${esc(L(m.d))}</p></article>`).join("")}</div>
      </section>` : "";

    const audio = p.audio && p.audio.length ? `
      <section class="case-block reveal">
        <h2 class="case-h">${esc(t("p.audio"))}</h2>
        <div class="audio-list">${p.audio.map((a) => `<figure class="audio-item"><figcaption>${esc(L(a.label))}</figcaption><audio controls preload="none" src="${esc(a.src)}"></audio></figure>`).join("")}</div>
      </section>` : "";

    const future = p.future && p.future.length ? `
      <section class="case-block reveal">
        <h2 class="case-h">${esc(t("p.future"))}</h2>
        <ul class="case-future">${p.future.map((x) => `<li>${esc(L(x))}</li>`).join("")}</ul>
      </section>` : "";

    const docsBlock = docs.length ? `
      <section class="case-block reveal">
        <h2 class="case-h">${esc(t("p.docs"))}</h2>
        <div class="case-docs">${docs.map((d) => `
          <a class="doc-card" href="${esc(d.href)}" ${docAttrs(d)}>
            <span class="doc-icon">${DOC_ICON[d.kind] || ""}</span>
            <span class="doc-txt"><strong>${esc(L(d.label))}</strong>${d.note ? `<small>${esc(L(d.note))}</small>` : ""}</span>
            <span class="doc-go">${ICON.arrow}</span>
          </a>`).join("")}</div>
      </section>` : "";

    const galleryItems = p.showWorks ? S.works : (p.gallery || []);
    const wideItems = galleryItems.filter((g) => g.wide);
    const gridItems = galleryItems.filter((g) => !g.wide);
    const gallery = galleryItems.length ? `
      <div class="section-dark case-dark"><div class="container">
        <section class="case-block case-gallery">
          <h2 class="case-h">${esc(t("p.gallery"))}</h2>
          ${wideItems.map((g, i) => `
            <button type="button" class="case-figure reveal" data-wide="${i}">
              <span class="cf-img"><img src="${esc(g.src)}" alt="${esc(L(g.title))}" loading="lazy"></span>
              <span class="cf-cap"><strong>${esc(L(g.title))}</strong>${g.desc ? ` — ${esc(L(g.desc))}` : ""}</span>
            </button>`).join("")}
          ${gridItems.length ? `<div class="works-grid ${p.showWorks ? "" : "shots-grid"}" id="case-grid"></div>` : ""}
        </section>
      </div></div>` : "";

    main.innerHTML = `
      <section class="case-hero" style="--g1:${p.hue[0]};--g2:${p.hue[1]}">
        <div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="container">
          <a class="back" href="index.html#projects">${ICON.left}<span>${esc(t("p.back"))}</span></a>
          <span class="case-cat">${esc(L(S.categories[p.cat]))}${p.badge ? ` <em class="case-badge">${esc(L(p.badge))}</em>` : ""}</span>
          <h1 class="case-title">${esc(L(p.title))}</h1>
          <p class="case-summary">${esc(L(p.summary))}</p>
          <div class="case-tech">${p.tech.map((x) => `<span class="chip chip-glow">${esc(x)}</span>`).join("")}</div>
          ${heroBtns ? `<div class="case-links">${heroBtns}</div>` : ""}
          ${meta}
        </div>
      </section>

      <div class="case-body section-light">
        <div class="container">
          <div class="case-cols">
            <section class="case-block reveal">
              <h2 class="case-h">${esc(t("p.overview"))}</h2>
              <p class="case-p">${esc(L(p.overview))}</p>
            </section>
            <section class="case-block case-goal reveal" style="--g1:${p.hue[0]};--g2:${p.hue[1]}">
              <h2 class="case-h">${esc(t("p.goal"))}</h2>
              <p class="case-p">${esc(L(p.goal))}</p>
            </section>
          </div>
          ${pipeline}
          ${modules}
          <section class="case-block reveal">
            <h2 class="case-h">${esc(t(p.listType === "features" ? "p.features" : "p.did"))}</h2>
            <ul class="case-list">${p.list.map((x) => `<li>${esc(L(x))}</li>`).join("")}</ul>
          </section>
          ${stats}
          ${audio}
          ${future}
          ${docsBlock}
        </div>
      </div>

      ${gallery}

      <a class="next-project" href="project.html?p=${next.slug}" style="--g1:${next.hue[0]};--g2:${next.hue[1]}">
        <div class="container">
          <span>${esc(t("p.next"))}</span>
          <strong>${esc(L(next.title))} ${ICON.arrow}</strong>
        </div>
      </a>`;

    if (gridItems.length) renderWorksGrid(document.getElementById("case-grid"), gridItems);
    main.querySelectorAll("[data-wide]").forEach((b) => b.addEventListener("click", () => openLightbox(galleryItems, galleryItems.indexOf(wideItems[+b.dataset.wide]))));
    observeReveal(main);
  }

  document.addEventListener("DOMContentLoaded", render);
  onLang(render);
})();
