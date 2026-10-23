import './style.css';
import { site, person, experience, roles, sharedSkills } from './data/profile.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────────────────────── Data helpers ───────────────────────── */

const params = new URLSearchParams(location.search);
let roleKey = roles[params.get('role')] ? params.get('role') : site.defaultRole;

const parseMonth = (s) => {
  const [y, m] = s.split('-').map(Number);
  return new Date(y, m - 1, 1);
};
const fmtMonth = (s) => (s ? parseMonth(s).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present');
const duration = (start, end) => {
  const a = parseMonth(start);
  const b = end ? parseMonth(end) : new Date();
  const months = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth() + 1;
  const y = Math.floor(months / 12), m = months % 12;
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ');
};
const yearsOfExperience = () => Math.floor((Date.now() - parseMonth(person.careerStart)) / (365.25 * 24 * 3600 * 1000));

/* ───────────────────────── Templates ───────────────────────── */

const chips = (items, cls = 'chip') => items.map((t) => `<li class="${cls}">${esc(t)}</li>`).join('');

function heroTemplate(role) {
  let i = 0;
  const letters = person.name.split(' ').map((word) =>
    `<span class="word">${[...word].map((ch) => `<span class="char" style="--i:${i++}">${esc(ch)}</span>`).join('')}</span>`).join(' ');
  const domains = [...new Set(experience.map((e) => e.domain))];
  return `
    <div class="container hero-inner">
      <p class="eyebrow reveal"><span class="pulse"></span>Open to new opportunities</p>
      <h1 class="hero-name" aria-label="${esc(person.name)}">${letters}</h1>
      <p class="hero-role reveal" style="--d:0.5s"><span class="prompt">&gt;</span> <span id="scramble">${esc(role.titles[0])}</span><span class="caret"></span></p>
      <p class="hero-lede reveal" style="--d:0.65s">${esc(role.headline)}</p>
      <div class="hero-cta reveal" style="--d:0.8s">
        <a class="btn btn-primary magnetic" href="#projects"><span>View my work</span></a>
        <a class="btn btn-ghost magnetic" href="mailto:${esc(person.email)}"><span>Email me</span></a>
        ${person.resumeUrl ? `<a class="btn btn-ghost magnetic" href="${esc(person.resumeUrl)}" download><span>Résumé</span></a>` : ''}
      </div>
      <ul class="hero-stats reveal" style="--d:0.95s">
        <li><strong data-count="${yearsOfExperience()}">0</strong><span>+ years shipping software</span></li>
        <li><strong data-count="${experience.length}">0</strong><span>companies</span></li>
        <li><strong>${domains.map(esc).join(' · ')}</strong><span>domains</span></li>
      </ul>
    </div>
    <a class="scroll-cue" href="#about" aria-label="Scroll to about"><span></span></a>`;
}

function aboutTemplate(role) {
  const facts = [
    ['Focus', role.label],
    ['Education', person.education],
    person.location && ['Location', person.location],
    ['Email', `<a href="mailto:${esc(person.email)}">${esc(person.email)}</a>`],
    person.phone && ['Phone', `<a href="tel:${esc(person.phone.replace(/[^\d+]/g, ''))}">${esc(person.phone)}</a>`],
  ].filter(Boolean);
  const skillCount = new Set([...role.skills, ...sharedSkills].flatMap((g) => g.items)).size;
  return `
    <div class="container narrow-left">
      <p class="section-tag reveal">01 <span>About</span></p>
      <h2 class="section-title reveal">Engineering products people <em>rely on</em>.</h2>
      ${role.summary.map((p, i) => `<p class="lead reveal" style="--d:${0.1 + i * 0.1}s">${esc(p)}</p>`).join('')}
      <dl class="facts reveal" style="--d:0.3s">
        ${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${k === 'Email' || k === 'Phone' ? v : esc(v)}</dd></div>`).join('')}
      </dl>
      <div class="stat-row">
        <div class="stat glass tilt reveal" style="--d:0.35s"><strong data-count="${yearsOfExperience()}">0</strong><span>Years of experience</span></div>
        <div class="stat glass tilt reveal" style="--d:0.45s"><strong data-count="${skillCount}">0</strong><span>Tools &amp; technologies</span></div>
        <div class="stat glass tilt reveal" style="--d:0.55s"><strong data-count="${experience.length}">0</strong><span>Companies</span></div>
      </div>
    </div>`;
}

function skillsTemplate(role) {
  const groups = [...role.skills, ...sharedSkills];
  const all = [...new Set(groups.flatMap((g) => g.items))];
  const half = Math.ceil(all.length / 2);
  const marquee = (items, reverse) => `
    <div class="marquee ${reverse ? 'reverse' : ''}" aria-hidden="true">
      <ul>${chips(items, 'm-chip')}${chips(items, 'm-chip')}</ul>
    </div>`;
  return `
    <div class="container">
      <p class="section-tag reveal">02 <span>Skills</span></p>
      <h2 class="section-title reveal">A toolkit built over <em>${yearsOfExperience()}+ years</em>.</h2>
    </div>
    <div class="marquees reveal">${marquee(all.slice(0, half))}${marquee(all.slice(half), true)}</div>
    <div class="container">
      <div class="skill-grid">
        ${groups.map((g, i) => `
          <article class="skill-card glass tilt reveal" style="--d:${(i % 3) * 0.08}s">
            <header><span class="idx">${String(i + 1).padStart(2, '0')}</span><h3>${esc(g.title)}</h3></header>
            <ul class="chips">${chips(g.items)}</ul>
          </article>`).join('')}
      </div>
    </div>`;
}

function experienceTemplate(role) {
  return `
    <div class="container narrow-left">
      <p class="section-tag reveal">03 <span>Experience</span></p>
      <h2 class="section-title reveal">Where I've <em>made an impact</em>.</h2>
      <ol class="timeline">
        ${experience.map((job) => `
          <li class="job reveal">
            <span class="job-dot" aria-hidden="true"></span>
            <article class="glass tilt">
              <header>
                <div>
                  <h3>${esc(role.jobTitle[job.level] ?? role.jobTitle.senior)}</h3>
                  <p class="company">${esc(job.company)} <span>· ${esc(job.location)}</span></p>
                </div>
                <p class="dates"><span>${fmtMonth(job.start)} — ${fmtMonth(job.end)}</span><small>${duration(job.start, job.end)}</small></p>
              </header>
              <ul class="bullets">${job.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
              <ul class="chips">${chips(role.stacks[job.id] ?? [])}</ul>
            </article>
          </li>`).join('')}
      </ol>
    </div>`;
}

function projectsTemplate(role) {
  const link = (href, label) => href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${label} ↗</a>` : '';
  return `
    <div class="container">
      <p class="section-tag reveal">04 <span>Projects</span></p>
      <h2 class="section-title reveal">Selected <em>work</em>.</h2>
      <div class="project-grid">
        ${role.projects.map((p, i) => `
          <article class="project glass tilt reveal" style="--d:${i * 0.1}s">
            <div class="project-art" aria-hidden="true"><span class="orb"></span><span class="num">${String(i + 1).padStart(2, '0')}</span></div>
            <div class="project-body">
              <h3>${esc(p.title)}</h3>
              <p>${esc(p.description)}</p>
              <ul class="chips">${chips(p.tags)}</ul>
              <div class="project-links">${link(p.links?.live, 'Live')}${link(p.links?.code, 'Code')}</div>
            </div>
          </article>`).join('')}
      </div>
    </div>`;
}

function contactTemplate(role) {
  const socials = person.socials.filter((s) => s.url);
  return `
    <div class="gl-slot" data-gl-anchor aria-hidden="true"></div>
    <div class="container contact-inner">
      <p class="section-tag reveal">05 <span>Contact</span></p>
      <h2 class="section-title reveal">Let's build something <em>remarkable</em>.</h2>
      <p class="lead reveal">Have a role, a project or an idea? My inbox is always open — I usually reply within a day.</p>
      <div class="contact-grid">
        <div class="contact-card glass reveal">
          <p class="label">Email</p>
          <a class="big-link" href="mailto:${esc(person.email)}">${esc(person.email)}</a>
          <button class="copy" type="button" data-copy="${esc(person.email)}">Copy address</button>
          ${person.phone ? `<p class="label">Phone</p><a class="big-link small" href="tel:${esc(person.phone.replace(/[^\d+]/g, ''))}">${esc(person.phone)}</a>` : ''}
          <dl class="contact-facts">
            <div><dt>Looking for</dt><dd>${esc(role.titles[0])} roles</dd></div>
            <div><dt>Work style</dt><dd>Full-time or contract · Remote or on-site</dd></div>
            ${person.location ? `<div><dt>Based in</dt><dd>${esc(person.location)}</dd></div>` : ''}
          </dl>
          ${socials.length ? `<ul class="socials">${socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a></li>`).join('')}</ul>` : ''}
        </div>
        <form class="contact-form glass reveal" id="contact-form" style="--d:0.1s">
          <label><span>Name</span><input name="name" required autocomplete="name" /></label>
          <label><span>Email</span><input name="email" type="email" required autocomplete="email" /></label>
          <label class="full"><span>Message</span><textarea name="message" rows="4" required></textarea></label>
          <button class="btn btn-primary magnetic full" type="submit"><span>Send message</span></button>
        </form>
      </div>
    </div>`;
}

/* ───────────────────────── Interactions ───────────────────────── */

let revealObserver;
function setupReveal() {
  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(countUp);
      if (e.target.matches('[data-count]')) countUp(e.target);
      revealObserver.unobserve(e.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  $$('.reveal, .hero-name').forEach((el) => revealObserver.observe(el));
}

function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const end = Number(el.dataset.count);
  if (reducedMotion) { el.textContent = end; return; }
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / 1400);
    el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function setupTilt() {
  if (matchMedia('(pointer: coarse)').matches || reducedMotion) return;
  $$('.tilt').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${x * 100}%`);
      el.style.setProperty('--my', `${y * 100}%`);
      el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
      el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });
  $$('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

let scrambleTimer;
function setupScramble(titles) {
  clearInterval(scrambleTimer);
  const el = $('#scramble');
  if (!el || titles.length < 2 || reducedMotion) return;
  const glyphs = '!<>-_\\/[]{}—=+*^?#01';
  let index = 0;
  const scramble = (to) => {
    const from = el.textContent;
    const len = Math.max(from.length, to.length);
    let frame = 0;
    const total = 28;
    const run = () => {
      let out = '';
      for (let i = 0; i < len; i++) {
        const revealAt = (i / len) * total * 0.7 + 6;
        if (frame >= revealAt) out += to[i] ?? '';
        else if (frame >= revealAt - 8) out += glyphs[(Math.random() * glyphs.length) | 0];
        else out += from[i] ?? '';
      }
      el.textContent = out;
      if (frame++ < total) requestAnimationFrame(run);
      else el.textContent = to;
    };
    run();
  };
  scrambleTimer = setInterval(() => {
    index = (index + 1) % titles.length;
    scramble(titles[index]);
  }, 3200);
}

function setupContact() {
  $('#contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Portfolio enquiry from ${data.get('name')}`);
    const body = encodeURIComponent(`${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`);
    location.href = `mailto:${person.email}?subject=${subject}&body=${body}`;
  });
  $$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = 'Copied ✓';
    } catch {
      btn.textContent = 'Copy failed';
    }
    setTimeout(() => { btn.textContent = 'Copy address'; }, 1800);
  }));
}

function setupNav() {
  const nav = $('#nav');
  const toggle = $('#nav-toggle');
  const links = $('#nav-links');
  const bar = $('.progress span');
  const anchors = $$('a', links);
  const sections = $$('[data-section]');

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  anchors.forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    nav.classList.toggle('scrolled', scrollY > 30);
    let active = sections[0].id;
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.45) active = s.id;
    anchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${active}`));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ───────────────────────── Render ───────────────────────── */

function applyTheme(theme) {
  const root = document.documentElement.style;
  root.setProperty('--a', theme.a);
  root.setProperty('--b', theme.b);
  root.setProperty('--c', theme.c);
}

function render() {
  const role = roles[roleKey];
  applyTheme(role.theme);
  document.title = `${person.name} — ${role.titles[0]}`;
  $('meta[name="description"]').setAttribute('content', role.headline);
  $('#home').innerHTML = heroTemplate(role);
  $('#about').innerHTML = aboutTemplate(role);
  $('#skills').innerHTML = skillsTemplate(role);
  $('#experience').innerHTML = experienceTemplate(role);
  $('#projects').innerHTML = projectsTemplate(role);
  $('#contact').innerHTML = contactTemplate(role);
  $('#footer').innerHTML = `
    <div class="container footer-inner">
      <p>© ${new Date().getFullYear()} ${esc(person.name)}</p>
      <p class="muted">Built with Three.js &amp; custom GLSL shaders</p>
      <a href="#home">Back to top ↑</a>
    </div>`;
  $$('[data-monogram]').forEach((el) => { el.textContent = person.monogram; });
  setupReveal();
  setupTilt();
  setupScramble(role.titles);
  setupContact();
}

function setupRoleSwitcher(onChange) {
  const show = import.meta.env.DEV || site.showRoleSwitcher || params.has('switcher');
  const el = $('#role-switcher');
  if (!show) return;
  el.hidden = false;
  el.innerHTML = Object.entries(roles).map(([key, r]) =>
    `<button type="button" data-role="${key}" aria-pressed="${key === roleKey}">${esc(r.label)}</button>`).join('');
  el.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-role]');
    if (!btn || btn.dataset.role === roleKey) return;
    roleKey = btn.dataset.role;
    $$('[data-role]', el).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.role === roleKey)));
    const url = new URL(location.href);
    url.searchParams.set('role', roleKey);
    history.replaceState(null, '', url);
    onChange();
  });
}

render();
setupNav();

function webglAvailable() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

// Three.js is loaded on demand so the content paints before the WebGL bundle.
let scene = null;
async function startScene() {
  if (!webglAvailable()) throw new Error('WebGL2 not supported');
  const { createScene } = await import('./webgl/scene.js');
  scene = createScene($('#webgl'), {
    sections: $$('[data-section]'),
    monogram: person.monogram,
    theme: roles[roleKey].theme,
    reducedMotion,
  });
}
startScene().catch((err) => {
  console.warn('WebGL scene unavailable:', err);
  document.body.classList.add('no-webgl');
});

setupRoleSwitcher(() => {
  render();
  scene?.setTheme(roles[roleKey].theme);
});

requestAnimationFrame(() => document.body.classList.add('loaded'));
