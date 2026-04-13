const HIGHLIGHT_NAME = 'Bongjun Kim';

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`Failed to load ${url}:`, e);
    return [];
  }
}

function formatAuthor(author) {
  const isObject = typeof author === 'object' && author !== null;
  const name = isObject ? author.name : author;
  const note = isObject ? author.note : null;
  const isHighlight = name === HIGHLIGHT_NAME;

  let html = isHighlight ? `<mark>${name}</mark>` : name;
  if (note) html += ` (${note})`;
  return html;
}

function formatAuthors(authors) {
  return authors.map(formatAuthor).join(', ');
}

function formatLinks(links) {
  const labelMap = {
    abstract: 'abstract',
    ieee: 'IEEE Xplore',
    acm: 'ACM DL',
    pdf: 'PDF',
    dataset: 'DATASET',
    github: 'GitHub',
    google_patents: 'Google Patents'
  };

  return Object.entries(links)
    .filter(([, url]) => url)
    .map(([key, url]) => {
      const label = labelMap[key] || key;
      return `<a href="${url}" target="_blank">${label}</a>`;
    })
    .join(' ');
}

function renderPublications(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const conferences = data.filter(p => p.type === 'conference');
  const journals = data.filter(p => p.type === 'journal');

  let html = '';

  if (conferences.length) {
    html += '<h2>Refereed International Conference Publications</h2>';
    html += conferences.map(renderPubEntry).join('');
  }

  if (journals.length) {
    html += '<h2>Refereed International Journal Publications</h2>';
    html += journals.map(renderPubEntry).join('');
  }

  container.innerHTML = html;
}

function renderPubEntry(pub) {
  const links = formatLinks(pub.links);
  const notes = pub.notes && pub.notes.length
    ? pub.notes.map(n => `<strong>${n}.</strong>`).join(' ')
    : '';
  const impactFactor = pub.impactFactor
    ? `<span class="impact-factor">${pub.impactFactor}</span>`
    : '';

  return `
    <div class="pub-entry">
      <div class="pub-header">
        <span class="pub-tag">[${pub.tag}]</span>
        <span class="pub-title">${pub.title}</span>
      </div>
      <div class="pub-links">${links}</div>
      <div class="pub-authors">${formatAuthors(pub.authors)}</div>
      <div class="pub-venue"><em>${pub.venue}</em>, ${pub.date}. ${notes}</div>
      ${impactFactor ? `<div class="pub-if">${impactFactor}</div>` : ''}
    </div>`;
}

function renderPatents(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '<h2>Patents</h2>';
  html += data.map(patent => {
    const links = formatLinks(patent.links);
    return `
      <div class="pub-entry patent-entry">
        <div class="pub-header">
          <span class="pub-title">${patent.title}</span>
        </div>
        ${links ? `<div class="pub-links">${links}</div>` : ''}
        <div class="pub-authors">${formatAuthors(patent.inventors)}</div>
        <div class="pub-venue">${patent.patentNumber}, ${patent.date}.</div>
      </div>`;
  }).join('');

  container.innerHTML = html;
}

// Dark mode
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }

  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// Sticky nav active state
function initStickyNav() {
  const nav = document.getElementById('sticky-nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sticky-nav a');
  if (!nav || !sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.sticky-nav a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -80% 0px' });

  sections.forEach(section => observer.observe(section));
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initStickyNav();

  const [pubs, patents] = await Promise.all([
    fetchJSON('data/publications.json'),
    fetchJSON('data/patents.json')
  ]);

  renderPublications(pubs, 'publications-container');
  renderPatents(patents, 'patents-container');
});
