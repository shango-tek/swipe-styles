// Runs inside the page that render.mjs opens.
// Builds the slides from the carousel data and the style's <template> layouts,
// shrinks text that is too big, and checks that every text stays inside the safe area.
// When done, it sets window.__swipe = { ready: true, errors, warnings }.

(async () => {
  const errors = [];
  const warnings = [];

  try {
    const data = JSON.parse(document.getElementById('swipe-data').textContent);
    build(data);
    await settle(errors);
    fitAndCheck(errors, warnings);
  } catch (error) {
    errors.push({ kind: 'script', message: String((error && error.stack) || error) });
  }

  window.__swipe = { ready: true, errors, warnings };

  // Smallest text size (in px) that stays readable on a phone. Smaller text gets a warning.
  function minReadable() {
    return 22;
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function isEmpty(value) {
    return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
  }

  function build({ slides, brand = {} }) {
    const deck = document.getElementById('deck');
    const total = slides.length;

    slides.forEach((slide, i) => {
      const template = document.querySelector(`template[data-type="${slide.type}"]`);
      const node = template.content.firstElementChild.cloneNode(true);
      node.dataset.slide = String(i + 1);
      node.dataset.type = slide.type;
      node.classList.toggle('is-first', i === 0);
      node.classList.toggle('is-last', i === total - 1);
      // How far the reader is, from 1/total to 1. Styles can draw it (for example as a bar).
      node.style.setProperty('--progress', ((i + 1) / total).toFixed(4));

      const values = {
        ...slide,
        index: pad(i + 1),
        total: pad(total),
        counter: `${pad(i + 1)} / ${pad(total)}`,
        handle: brand.handle,
        name: brand.name,
        logo: brand.logo,
      };

      for (const list of node.querySelectorAll('[data-list]')) {
        fillList(list, values[list.dataset.list]);
      }
      for (const el of node.querySelectorAll('[data-field]')) {
        fillField(el, values[el.dataset.field]);
      }
      for (const el of node.querySelectorAll('[data-if]')) {
        if (isEmpty(values[el.dataset.if])) el.remove();
      }

      deck.append(node);
    });
  }

  function fillField(el, value) {
    if (isEmpty(value)) {
      el.remove();
      return;
    }
    if (el.tagName === 'IMG') {
      el.src = value;
      el.alt = '';
      return;
    }
    setRichText(el, String(value));
  }

  function fillList(list, items) {
    const proto = list.querySelector('[data-item]');
    if (!proto) return;
    proto.remove();
    if (!Array.isArray(items) || items.length === 0) {
      list.remove();
      return;
    }

    items.forEach((raw, n) => {
      const item = typeof raw === 'string' ? { text: raw } : raw;
      const values = { ...item, n: pad(n + 1) };
      const node = proto.cloneNode(true);
      const fields = node.querySelectorAll('[data-item-field]');

      if (fields.length === 0) setRichText(node, item.text ?? '');
      for (const el of fields) {
        const value = values[el.dataset.itemField];
        if (isEmpty(value)) el.remove();
        else setRichText(el, String(value));
      }
      list.append(node);
    });
  }

  // Plain text with two extras: *word* becomes <em>word</em>, and a newline becomes <br>.
  // The text is never parsed as HTML.
  function setRichText(el, text) {
    el.textContent = '';
    text.split('\n').forEach((line, n) => {
      if (n > 0) el.append(document.createElement('br'));
      for (const part of line.split(/(\*[^*\n]+\*)/)) {
        if (!part) continue;
        if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
          const em = document.createElement('em');
          em.textContent = part.slice(1, -1);
          el.append(em);
        } else {
          el.append(document.createTextNode(part));
        }
      }
    });
  }

  async function settle(errors) {
    // Force a layout so that the fonts the slides use start loading, then wait for them.
    void document.body.offsetHeight;
    await document.fonts.ready;
    for (const face of document.fonts) {
      if (face.status === 'error') {
        errors.push({ kind: 'font', message: `The font "${face.family}" could not be loaded.` });
      }
    }

    await Promise.all(
      [...document.images].map(async (img) => {
        try {
          await img.decode();
        } catch {
          const slide = img.closest('.slide');
          errors.push({
            slide: slide ? Number(slide.dataset.slide) : undefined,
            kind: 'image',
            message: `The image could not be loaded: ${decodeURI(img.src)}`,
          });
        }
      }),
    );
  }

  function fitAndCheck(errors, warnings) {
    for (const slide of document.querySelectorAll('.slide')) {
      const n = Number(slide.dataset.slide);
      const type = slide.dataset.type;
      const fitEls = [...slide.querySelectorAll('[data-fit-min]')];

      // Shrink the text marked with data-fit-min step by step until everything fits,
      // but never below the size the style allows.
      for (let guard = 0; overflowing(slide).length > 0 && guard < 80; guard++) {
        let shrunk = false;
        for (const el of fitEls) {
          const size = parseFloat(getComputedStyle(el).fontSize);
          const min = Number(el.dataset.fitMin);
          if (size > min) {
            el.style.fontSize = `${Math.max(min, Math.floor(size * 0.95))}px`;
            shrunk = true;
          }
        }
        if (!shrunk) break;
      }

      const fields = overflowing(slide);
      if (fields.length > 0) {
        errors.push({
          slide: n,
          type,
          kind: 'overflow',
          fields,
          message: `Slide ${n} (${type}): the text in ${fields.join(', ')} does not fit, even at the smallest size this style allows. Shorten it or split it over two slides.`,
        });
      }

      let smallest = Infinity;
      for (const el of textElements(slide)) {
        if (el.textContent.trim()) smallest = Math.min(smallest, parseFloat(getComputedStyle(el).fontSize));
      }
      if (smallest < minReadable()) {
        warnings.push({
          slide: n,
          type,
          kind: 'small-text',
          message: `Slide ${n} (${type}) has text at ${Math.round(smallest)}px, which is hard to read on a phone. Shorten the text so it can stay bigger.`,
        });
      }
    }
  }

  function textElements(slide) {
    return [...slide.querySelectorAll('[data-field], [data-item], [data-item-field]')].filter(
      (el) => el.tagName !== 'IMG' && !el.closest('[data-free]'),
    );
  }

  // Returns the names of the fields whose text leaves the safe area or its own box.
  function overflowing(slide) {
    const safe = slide.querySelector('.safe') ?? slide;
    const box = safe.getBoundingClientRect();
    const names = new Set();

    for (const el of textElements(slide)) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const name = el.dataset.field ?? el.closest('[data-list]')?.dataset.list ?? 'text';
      const outside = r.top < box.top - 1 || r.left < box.left - 1 || r.bottom > box.bottom + 1 || r.right > box.right + 1;
      // A word wider than its box (for example a long word that could not be hyphenated).
      const tooWide = el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2;
      // Text cut off by a box with a fixed height. Boxes that grow with their text are not checked
      // here: with tight line spacing their glyphs reach a few pixels past the box, which is fine.
      const clips = getComputedStyle(el).overflowY !== 'visible';
      const tooTall = clips && el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 2;
      if (outside || tooWide || tooTall) names.add(name);
    }
    return [...names];
  }
})();
