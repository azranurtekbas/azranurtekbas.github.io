/* Home page rendering */
(function () {
  const S = window.SITE;
  const { t, L, esc, ICON, onLang, observeReveal, thumb, renderWorksGrid } = window.APP;
  const $ = (id) => document.getElementById(id);

  let workFilter = "all";
  let projectFilter = "all";

  function renderExpertise() {
    $("expertise").innerHTML = S.expertise.map((e) => `<li>${esc(L(e))}</li>`).join("");
  }

  function renderWave() {
    const w = document.querySelector(".wave");
    if (!w || w.childElementCount) return;
    const n = 56;
    let html = "";
    for (let i = 0; i < n; i++) {
      const env = Math.sin((i / (n - 1)) * Math.PI);
      const h = 18 + env * 70 * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7)));
      html += `<i style="--h:${h.toFixed(0)}%;--i:${i}"></i>`;
    }
    w.innerHTML = html;
  }

  function renderCollage() {
    const c = $("collage");
    c.innerHTML = "";
    const heroes = S.works.filter((w) => w.hero);
    const picks = (heroes.length >= 3 ? heroes : S.works).slice(0, 3);
    picks.forEach((w, i) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = `collage-card c${i + 1}`;
      card.setAttribute("aria-label", L(w.title));
      card.appendChild(thumb(w, i));
      const label = (w.models || [])[0] || w.workflow || "";
      if (label) {
        const tag = document.createElement("span");
        tag.className = "collage-tag";
        tag.innerHTML = `${w.type === "video" ? ICON.play : ICON.image}<span>${esc(label)}</span>`;
        card.appendChild(tag);
      }
      card.addEventListener("click", () => window.APP.openLightbox(picks, i));
      c.appendChild(card);
    });
  }

  function renderMarquee() {
    const items = S.marquee.map((m) => `<span>${esc(m)}</span><i>✦</i>`).join("");
    $("marquee").innerHTML = items + items;
  }

  function renderFlow() {
    $("brand-flow").innerHTML = S.brandifierFlow.map((s, i) => `
      <li class="step reveal" style="--d:${(i % 3) * 80}ms">
        <span class="step-n">${String(i + 1).padStart(2, "0")}</span>
        <strong>${esc(L(s))}</strong>
        <p>${esc(L(s.d))}</p>
      </li>`).join("");
    $("brand-models").innerHTML = S.brandifierModels.map((m) => `<span class="chip chip-glow">${esc(m)}</span>`).join("");
    observeReveal($("brand-flow"));
  }

  function renderCompare() {
    const C = S.compare, box = $("compare");
    if (!C || !box) return;
    const items = C.items.map((id) => S.works.find((w) => w.id === id)).filter(Boolean);
    box.innerHTML = `
      <div class="compare-txt">
        <span class="compare-tag">A / B</span>
        <h3>${esc(L(C.title))}</h3>
        <p>${esc(L(C.desc))}</p>
      </div>
      <div class="compare-media"></div>`;
    const media = box.querySelector(".compare-media");
    items.forEach((w, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "compare-item";
      b.appendChild(thumb(w, i));
      const lab = document.createElement("span");
      lab.className = "compare-label";
      lab.textContent = (w.models || [])[0] || "";
      b.appendChild(lab);
      b.setAttribute("aria-label", `${L(w.title)} — ${lab.textContent}`);
      b.addEventListener("click", () => window.APP.openLightbox(items, i));
      media.appendChild(b);
    });
  }

  function renderWorks() {
    const list = S.works.filter((w) => workFilter === "all" || w.type === workFilter);
    renderWorksGrid($("works-grid"), list);
  }
  function initWorkFilters() {
    $("work-filters").addEventListener("click", (e) => {
      const b = e.target.closest(".filter"); if (!b) return;
      workFilter = b.dataset.filter;
      $("work-filters").querySelectorAll(".filter").forEach((x) => x.classList.toggle("active", x === b));
      renderWorks();
    });
  }

  function renderProjectFilters() {
    const cats = ["all", ...Object.keys(S.categories).filter((k) => S.projects.some((p) => p.cat === k))];
    $("project-filters").innerHTML = cats.map((c) =>
      `<button type="button" class="filter ${c === projectFilter ? "active" : ""}" data-filter="${c}">${esc(c === "all" ? t("projects.filter.all") : L(S.categories[c]))}</button>`).join("");
  }
  function renderProjects() {
    const list = S.projects.filter((p) => projectFilter === "all" || p.cat === projectFilter);
    $("projects-grid").innerHTML = list.map((p, i) => `
      <a class="project reveal" href="project.html?p=${p.slug}" style="--g1:${p.hue[0]};--g2:${p.hue[1]};--d:${(i % 3) * 80}ms">
        <div class="project-art" aria-hidden="true">
          <span class="project-num">${String(S.projects.indexOf(p) + 1).padStart(2, "0")}</span>
          <span class="project-name">${esc(L(p.short))}</span>
        </div>
        <div class="project-body">
          <span class="project-cat">${esc(L(S.categories[p.cat]))}</span>
          <h3>${esc(L(p.title))}</h3>
          <p>${esc(L(p.summary))}</p>
          <div class="project-tags">${p.tech.slice(0, 5).map((x) => `<span>${esc(x)}</span>`).join("")}</div>
          <span class="project-link">${esc(t("projects.read"))} ${ICON.arrow}</span>
        </div>
      </a>`).join("");
    observeReveal($("projects-grid"));
  }
  function initProjectFilters() {
    $("project-filters").addEventListener("click", (e) => {
      const b = e.target.closest(".filter"); if (!b) return;
      projectFilter = b.dataset.filter;
      renderProjectFilters();
      renderProjects();
    });
  }

  function renderAbout() {
    $("interests").innerHTML = S.interests.map((x) => `<li>${esc(L(x))}</li>`).join("");
    $("timeline").innerHTML = S.experience.map((e, i) => `
      <li class="tl-item reveal" style="--d:${i * 60}ms">
        <span class="tl-dot"></span>
        <div class="tl-card">
          <div class="tl-top">
            <div><h4>${esc(L(e.role))}</h4><span class="tl-org">${esc(L(e.org))} · ${esc(L(e.place))}</span></div>
            <span class="tl-date">${esc(e.date)}</span>
          </div>
          <p>${esc(L(e.desc))}</p>
          <div class="tl-tags">${(e.tags || []).map((x) => `<span>${esc(x)}</span>`).join("")}</div>
        </div>
      </li>`).join("");
    observeReveal($("timeline"));
  }

  function renderSkills() {
    $("skills-grid").innerHTML = S.skills.map((g, i) => `
      <article class="skill-card c-${g.color} reveal" style="--d:${(i % 3) * 80}ms">
        <span class="skill-icon">${ICON[g.icon] || ""}</span>
        <h3>${esc(L(g.title))}</h3>
        <ul>${g.items.map((x) => `<li>${esc(L(x))}</li>`).join("")}</ul>
      </article>`).join("");
    observeReveal($("skills-grid"));
  }

  function initContact() {
    const P = S.person;
    const em = $("email-link");
    em.href = "mailto:" + P.email; em.textContent = P.email;
    if (P.phone) {
      $("phone-link").href = "tel:" + P.phone.replace(/\s+/g, "");
      $("phone-text").textContent = P.phone;
    } else {
      $("phone-link").remove();
    }
    $("li-link").href = P.linkedin;
    $("gh-link").href = P.github;
    $("copy-email").addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      try { await navigator.clipboard.writeText(P.email); } catch (err) { return; }
      btn.textContent = t("contact.copied");
      setTimeout(() => { btn.textContent = t("contact.copy"); }, 1600);
    });
  }

  function renderAll() {
    renderExpertise();
    renderCollage();
    renderFlow();
    renderCompare();
    renderWorks();
    renderProjectFilters();
    renderProjects();
    renderAbout();
    renderSkills();
    document.title = t("meta.title");
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderWave();
    renderMarquee();
    renderAll();
    initWorkFilters();
    initProjectFilters();
    initContact();
    observeReveal(document);
  });
  onLang(renderAll);
})();
