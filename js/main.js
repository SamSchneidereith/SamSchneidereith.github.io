/* ── Build tiles and overlays from PROJECTS data ── */

function buildProjects() {
  const grid = document.querySelector('.tile-grid');
  const overlayContainer = document.getElementById('overlay-container');

  PROJECTS.forEach(p => {
    const progressClass = p.progress >= 80 ? 'complete' : 'in-progress';

    /* ── TILE ── */
    const tile = document.createElement('div');
    tile.className = 'tile reveal';
    tile.onclick = () => openProject(p.id);
    tile.innerHTML = `
      <div class="tile-img">
        <img src="${p.image}" alt="${p.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
        <span class="tile-img-placeholder" style="display:none">photo</span>
        <div class="progress-wrap">
          <div class="progress-fill ${progressClass}" style="width:${p.progress}%;"></div>
        </div>
      </div>
      <div class="tile-body">
        <div class="tile-title">${p.title}</div>
        <div class="tile-desc">${p.summary}</div>
        <div class="tile-date">${p.date}</div>
      </div>
    `;
    grid.appendChild(tile);

    /* ── OVERLAY ── */
    const writeupHTML = p.writeup.map(para => `<p>${para}</p>`).join('');

    const mediaHTML = (!p.media || !p.media.length) ? '' : `
      <div class="carousel" data-carousel>
        <div class="carousel-track" tabindex="0">
          ${p.media.map(m => `
            <figure class="carousel-slide">
              <div class="carousel-frame">
                ${m.type === 'video'
                  ? `<video controls playsinline src="${m.src}"></video>`
                  : m.type === 'youtube'
                  ? `<iframe src="${getYouTubeEmbedUrl(m.src)}" title="${m.alt || 'Project video'}" loading="lazy" allowfullscreen></iframe>`
                  : `<img src="${m.src}" alt="${m.alt || ''}" loading="lazy">`}
              </div>
              ${m.alt ? `<figcaption>${m.alt}</figcaption>` : ''}
            </figure>`).join('')}
        </div>
        ${p.media.length > 1 ? `
          <div class="carousel-controls">
            <div class="carousel-dots">
              ${p.media.map((_, i) => `<button class="carousel-dot${i === 0 ? ' active' : ''}" aria-label="Go to slide ${i + 1}"></button>`).join('')}
            </div>
            <div class="carousel-arrows">
              <button class="carousel-arrow prev" aria-label="Previous">‹</button>
              <button class="carousel-arrow next" aria-label="Next">›</button>
            </div>
          </div>` : ''}
      </div>`;

    const pdfHTML = p.pdf
      ? `<a href="${p.pdf}" target="_blank" class="project-pdf-placeholder project-pdf-active" style="text-decoration:none; display:block;">View PDF ↗︎︎︎</a>`
      : p.pdfLabel
      ? `<div class="project-pdf-placeholder project-pdf-soon">${p.pdfLabel}</div>`
      : '';

    const tagsHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');

    const overlay = document.createElement('div');
    overlay.className = 'project-page-overlay';
    overlay.id = `page-${p.id}`;
    overlay.innerHTML = `
      <button class="project-page-close" onclick="closeProject('${p.id}')">← Back</button>
      ${p.github ? `<a class="project-page-github" href="${p.github}" target="_blank">GitHub ↗︎︎</a>` : ''}
      <div class="project-hero-img">
      <img src="${p.heroImage ?? p.image}" alt="${p.fullTitle}" onerror="this.style.display='none'">        <span style="display:none">full-bleed project photo</span>
      </div>
      <div class="project-page-content">
        <h1 class="project-page-title">${p.fullTitle}</h1>
        <div class="project-tags">${tagsHTML}</div>
        ${mediaHTML}
        <div class="project-page-body">${writeupHTML}</div>
        <div class="project-page-divider"></div>
        ${pdfHTML}
      </div>
    `;
    overlayContainer.appendChild(overlay);
  });
}

/* ── Scroll reveal ── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Project page open/close ── */
function openProject(id) {
  const overlay = document.getElementById('page-' + id);
  if (!overlay) return;
  overlay.classList.add('open');
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
  overlay.scrollTop = 0;
  overlay.querySelectorAll('[data-carousel]').forEach(c => c._update?.());
}

function closeProject(id) {
  document.body.style.paddingRight = '';
  const overlay = document.getElementById('page-' + id);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* Close on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.project-page-overlay.open').forEach(el => {
      el.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

/* ── Build skills from SKILLS data ── */
function buildSkills() {
  const grid = document.querySelector('.skills-grid');

  SKILLS.forEach(s => {
    const projectsText = s.projects.join(' · ');
    const row = document.createElement('div');
    row.className = 'skill-row reveal';
    row.innerHTML = `
      <div class="skill-top">
        <span class="skill-name">${s.name}</span>
        <span class="skill-level">${s.level}</span>
      </div>
      <div class="skill-bar">
        <div class="skill-fill" style="width:${s.proficiency}%;"></div>
      </div>
      <div class="skill-projects">${projectsText}</div>
    `;
    grid.appendChild(row);
  });
}

/* ── Media rendering helpers ── */

/* Accepts a raw YouTube video ID or a full youtube.com/youtu.be URL and
   returns a privacy-friendly embed URL. Unlisted videos work fine here. */
function getYouTubeEmbedUrl(src) {
  let id = src;
  const watchMatch = src.match(/[?&]v=([^&]+)/);
  const shortMatch = src.match(/youtu\.be\/([^?&]+)/);
  const embedMatch = src.match(/youtube\.com\/embed\/([^?&]+)/);
  if (watchMatch) id = watchMatch[1];
  else if (shortMatch) id = shortMatch[1];
  else if (embedMatch) id = embedMatch[1];
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

/* Renders the inner element for a single media item — image, local video, or YouTube embed.*/
function renderMediaItem(m) {
  if (m.type === 'youtube') {
    const embedUrl = getYouTubeEmbedUrl(m.src);
    return `<div class="video-embed">
      <iframe src="${embedUrl}" title="${m.alt || ''}" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    </div>`;
  }
  if (m.type === 'video') {
    return `<video controls src="${m.src}"></video>`;
  }
  return `<img src="${m.src}" alt="${m.alt || ''}">`;
}

/* ── Media carousels ── */
function initCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(c => {
    const track  = c.querySelector('.carousel-track');
    const slides = [...track.children];
    const dots   = [...c.querySelectorAll('.carousel-dot')];
    const prev   = c.querySelector('.prev');
    const next   = c.querySelector('.next');
    let index = 0;

    const goTo = i => {
      i = Math.max(0, Math.min(i, slides.length - 1));
      const s = slides[i];
      const left = s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2;
      track.scrollTo({ left, behavior: 'smooth' });   // browser clamps at the ends
    };

    const update = () => {
      if (!track.clientWidth) return;   // overlay hidden, nothing to measure yet
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
      const mid = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0, best = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
        if (d < best) { best = d; nearest = i; }
      });
      index = atEnd ? slides.length - 1 : nearest;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
      slides.forEach((s, i) => { if (i !== index) s.querySelector('video')?.pause(); });
    };

    track.addEventListener('scroll', update, { passive: true });
    c._update = update;                 // so openProject can re-sync it
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));
    update();
  });
}

/* ── Init ── */
buildProjects();
initCarousels();
buildSkills();
initReveal();