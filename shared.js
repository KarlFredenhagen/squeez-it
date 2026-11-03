// Gemeinsame Logik aller Entwürfe – die Optionen stehen in config.js.

const pick = (list, name) => list.find(x => x.name === name) || list[0];
const esc = s => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const clampQty = n => Math.min(CONFIG.quantity.max, Math.max(CONFIG.quantity.min, parseInt(n, 10) || CONFIG.quantity.min));

function newOrder() {
  return {
    shape: CONFIG.shapes[0].name,
    fill: CONFIG.fillings[0].name,
    size: (CONFIG.sizes[1] || CONFIG.sizes[0]).name,
    qty: CONFIG.quantity.min,
    name: '', phone: '', email: '',
  };
}

// Perlen gleichmäßig auf der Kugel verteilt (Sonnenblumen-Muster) und zum Rand hin
// perspektivisch gestaucht – das macht den 3D-Eindruck. Feste Werte, damit nichts „flackert“.
const beads = Array.from({ length: 260 }, (_, i) => {
  const d = Math.sqrt((i + .5) / 260), a = i * 2.39996;
  const f = Math.max(.25, Math.sqrt(1 - d * d)); // Verkürzung am Kugelrand
  const r = 5.2 * (.75 + (i * 37 % 10) / 22);
  const jx = (i * 53 % 9 - 4) * .8, jy = (i * 29 % 9 - 4) * .8; // leicht unregelmäßig
  const x = 100 + 94 * d * Math.cos(a) + jx * f, y = 100 + 94 * d * Math.sin(a) + jy * f;
  return { x, y, rx: r * f, ry: r, rot: a * 180 / Math.PI };
});
// Wo sich bei zweifarbigen Füllungen die zweite Farbe einmischt (weiche Schlieren)
const marbled = ({ x, y }) => Math.sin(x * .03 + y * .018 + 1.3) + .6 * Math.cos(y * .04 - x * .01) > .35;
const n1 = v => v.toFixed(1);

let svgId = 0;
// icon = true: einfarbige Form ohne Perlen (für die Form-Auswahl, Farbe über CSS currentColor)
function ballSvg(o, icon = false) {
  const shape = pick(CONFIG.shapes, o.shape);
  const scale = pick(CONFIG.sizes, o.size).scale;
  const slime = pick(CONFIG.fillings, o.fill);
  const id = 'b' + svgId++;
  const p = shape.path;
  const body = icon ? `<path d="${p}" fill="currentColor"/>` : `
      <path d="${p}" fill="${slime.hex}"/>
      <g clip-path="url(#${id}c)" stroke="#fff" stroke-opacity=".5" stroke-width=".7">${beads.map(b => {
        const mix = slime.mix && marbled(b);
        return `<ellipse cx="${n1(b.x)}" cy="${n1(b.y)}" rx="${n1(b.rx)}" ry="${n1(b.ry)}" transform="rotate(${b.rot.toFixed(0)} ${n1(b.x)} ${n1(b.y)})" fill="${mix ? slime.mix : '#fff'}" fill-opacity="${mix ? .7 : .2}"/>`
          + `<circle cx="${n1(b.x - b.ry * .3)}" cy="${n1(b.y - b.ry * .3)}" r="${n1(b.rx * .3)}" fill="#fff" fill-opacity=".7" stroke="none"/>`;
      }).join('')}</g>`;
  return `<svg viewBox="0 0 200 200" aria-hidden="true">
    <defs>
      <clipPath id="${id}c"><path d="${p}"/></clipPath>
      <radialGradient id="${id}g" cx=".4" cy=".35" r=".72" fx=".33" fy=".27">
        <stop offset="0" stop-color="#fff" stop-opacity=".35"/>
        <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".85" stop-color="#000" stop-opacity=".12"/>
        <stop offset="1" stop-color="#000" stop-opacity=".38"/>
      </radialGradient>
      <radialGradient id="${id}r" cx=".55" cy=".6" r=".55">
        <stop offset=".8" stop-color="#fff" stop-opacity="0"/>
        <stop offset="1" stop-color="#fff" stop-opacity=".35"/>
      </radialGradient>
      <filter id="${id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter>
    </defs>
    <g transform="translate(100 100) scale(${scale}) translate(-100 -100)">
      ${body}
      <path d="${p}" fill="url(#${id}g)"/>
      <path d="${p}" fill="url(#${id}r)"/>
      <g clip-path="url(#${id}c)" fill="#fff">
        <ellipse cx="66" cy="56" rx="21" ry="11" transform="rotate(-35 66 56)" opacity=".85" filter="url(#${id}b)"/>
        <circle cx="84" cy="44" r="3" opacity=".9"/>
      </g>
      <path d="${p}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linejoin="round"/>
    </g></svg>`;
}

// Hintergrund für ein Farbfeld in der Auswahl: Perlen angedeutet + ggf. zweite Farbe
function swatch(x) {
  return [[30, 35], [68, 30], [50, 70], [25, 65], [72, 62], [48, 48]]
    .map(([px, py]) => `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,.7) 0 1.5px, transparent 2.5px)`)
    .concat(`linear-gradient(135deg, ${x.hex} 30%, ${x.mix || x.hex})`).join(',');
}

function drawBall(el, o) {
  el.innerHTML = ballSvg(o);
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', `Vorschau: ${o.shape}, Füllung ${o.fill}, Größe ${o.size}`);
}

// Radio-Gruppe aus einer Config-Liste; label(x) liefert den sichtbaren Inhalt
function renderOptions(box, key, list, o, label, onChange) {
  box.innerHTML = list.map(x => `<label class="opt" title="${esc(x.name)}">
    <input type="radio" name="${key}" value="${esc(x.name)}" aria-label="${esc(x.name)}" ${x.name === o[key] ? 'checked' : ''}>
    <span>${label(x)}</span></label>`).join('');
  box.onchange = e => { o[key] = e.target.value; onChange(); };
}

function validate(o) {
  const e = {};
  const phone = o.phone.trim(), email = o.email.trim();
  if (o.name.trim().split(/\s+/).length < 2) e.name = 'Bitte Vor- und Nachnamen angeben.';
  if (!phone && !email) e.contact = 'Bitte Telefonnummer oder E-Mail angeben.';
  if (phone && (!/^\+?[\d\s/()-]+$/.test(phone) || phone.replace(/\D/g, '').length < 6)) e.phone = 'Bitte Telefonnummer prüfen.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Bitte E-Mail-Adresse prüfen.';
  return e;
}

// Fehler erst zeigen, wenn das Feld verlassen wurde (oder beim Absenden)
function showErrors(root, errs, touched) {
  root.querySelectorAll('[data-err]').forEach(el => {
    const k = el.dataset.err;
    el.textContent = (touched.has(k) || touched.has('*')) && errs[k] || '';
    root.querySelector(`[name="${k}"]`)?.setAttribute('aria-invalid', !!el.textContent);
  });
}

// Verbindet Textfelder und Mengen-Stepper mit der Bestellung
function bindFields(root, o, onChange) {
  const touched = new Set();
  const refresh = () => showErrors(root, validate(o), touched);
  const qtyInput = root.querySelector('[name="qty"]');
  root.querySelectorAll('input[name]:not([type=radio])').forEach(el => {
    el.value = o[el.name];
    if (el.name === 'qty') { el.min = CONFIG.quantity.min; el.max = CONFIG.quantity.max; }
    el.addEventListener('input', () => {
      o[el.name] = el.name === 'qty' ? clampQty(el.value) : el.value;
      refresh(); onChange?.();
    });
    el.addEventListener('blur', () => {
      touched.add(el.name);
      if (el.name === 'email') touched.add('contact');
      if (el.name === 'qty') el.value = o.qty;
      refresh();
    });
  });
  root.querySelectorAll('[data-qty]').forEach(b => b.addEventListener('click', () => {
    o.qty = clampQty(o.qty + Number(b.dataset.qty));
    if (qtyInput) qtyInput.value = o.qty;
    onChange?.();
  }));
  return {
    check() {
      touched.add('*'); refresh();
      const errs = validate(o);
      const first = errs.name ? 'name' : errs.contact || errs.phone ? 'phone' : errs.email ? 'email' : null;
      if (first) root.querySelector(`[name="${first}"]`)?.focus();
      return !first;
    },
  };
}

function summaryHtml(o) {
  const size = pick(CONFIG.sizes, o.size);
  const rows = [
    ['Form', o.shape], ['Füllung', o.fill], ['Größe', `${size.name} · ${size.cm} cm`], ['Anzahl', o.qty],
    ['Name', o.name], ['Kontakt', [o.phone, o.email].filter(Boolean).join(' · ')],
  ];
  return '<dl class="summary">' + rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('') + '</dl>';
}

// shortcut: speichert nichts – reicht zum Design-Test auf GitHub Pages.
// Für den Heimserver hier z. B. fetch('/api/bestellung', { method: 'POST', body: JSON.stringify(o) }) einbauen.
async function submitOrder(o) {
  console.info('Bestellung (Testmodus, nicht gespeichert):', o);
  return true;
}

// Selbsttest – meldet sich nur in der Browser-Konsole, wenn etwas kaputt ist
console.assert(!Object.keys(validate({ name: 'Max Muster', phone: '', email: 'max@test.de' })).length, 'gültige Bestellung');
console.assert(validate({ name: 'Max', phone: '', email: '' }).name && validate({ name: 'Max', phone: '', email: '' }).contact, 'Name/Kontakt fehlt');
console.assert(validate({ name: 'A B', phone: '12', email: '' }).phone && !validate({ name: 'A B', phone: '+49 171 1234567', email: '' }).phone, 'Telefon');