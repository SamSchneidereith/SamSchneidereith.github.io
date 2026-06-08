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

    const mediaHTML = (() => {
      if (!p.media || !p.media.length) return '';
      
      let html = '';
      let i = 0;
      
      while (i < p.media.length) {
        const m = p.media[i];
        
        if (m.layout === 'half' && p.media[i + 1]?.layout === 'half') {
          // Pair them in a row
          const m2 = p.media[i + 1];
          html += `<div class="project-media-row">
            <div class="project-media half">
              <img src="${m.src}" alt="${m.alt || ''}">
              ${m.alt ? `<p class="project-media-caption">${m.alt}</p>` : ''}
            </div>
            <div class="project-media half">
              <img src="${m2.src}" alt="${m2.alt || ''}">
              ${m2.alt ? `<p class="project-media-caption">${m2.alt}</p>` : ''}
            </div>
          </div>`;
          i += 2;
        } else {
          // Full width
          html += m.type === 'video'
            ? `<div class="project-media">
                <video controls src="${m.src}"></video>
                ${m.alt ? `<p class="project-media-caption">${m.alt}</p>` : ''}
              </div>`
            : `<div class="project-media">
                <img src="${m.src}" alt="${m.alt || ''}">
                ${m.alt ? `<p class="project-media-caption">${m.alt}</p>` : ''}
              </div>`;
          i++;
        }
      }
      return html;
    })();

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
        <div class="project-page-body">${writeupHTML}</div>
        ${mediaHTML}
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

/* ── Init ── */
buildProjects();
buildSkills();
initReveal();