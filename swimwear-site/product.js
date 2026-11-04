const params = new URLSearchParams(window.location.search);
const product = PRODUCTS.find(p => p.id === Number(params.get('id')));
const page = document.getElementById('productPage');
const toastEl = document.getElementById('toast');

if (!product) {
  page.innerHTML = '<p class="cart-empty">המוצר לא נמצא</p>';
} else {
  document.title = product.name + ' — calma';

  const imgs = (product.images && product.images.length) ? product.images : (product.img ? [product.img] : null);
  let art;
  if (imgs && imgs.length > 1) {
    art = `
    <div class="product-slider">
      <div class="product-track" id="prodTrack">
        ${imgs.map(src => `<div class="product-slide" data-full="${src}"><img src="${src}" alt="${product.name}" ${src !== imgs[0] ? 'loading="lazy"' : ''} /></div>`).join('')}
      </div>
    </div>
    <div class="slider-dots" id="prodDots"></div>`;
  } else if (imgs) {
    art = `<div class="product-img" data-full="${imgs[0]}"><img src="${imgs[0]}" alt="${product.name}" /></div>`;
  } else {
    art = `<div class="product-img" style="background:${product.gradient}"><span class="product-emoji">${product.emoji || ''}</span></div>`;
  }

  const priceTxt = product.priceLabel || fmt(product.price);

  const colorRow = product.colorOptions ? `
    <div class="color-line">
    <div class="opt-label">צבע: <span id="colorName" class="color-name">${product.colorOptions[0].name}</span></div>
    <div class="swatch-row" id="swatchRow">
      ${product.colorOptions.map((c, i) => {
        const sel = i === 0 ? 'selected' : '';
        if (c.type === 'dots') return `<button class="swatch dots ${sel}" data-color="${c.name}" style="--c1:${c.c1};--c2:${c.c2}" aria-label="${c.name}"></button>`;
        if (c.type === 'image') return `<button class="swatch img ${sel}" data-color="${c.name}" data-full="${c.img}" style="background-image:url('${c.img}');background-size:cover;background-position:center" aria-label="${c.name}"></button>`;
        return `<button class="swatch ${sel}" data-color="${c.name}" style="background:${c.c}" aria-label="${c.name}"></button>`;
      }).join('')}
    </div>
    </div>` : '';

  const isSet = product.set && product.braSizes && product.bottomSizes;
  const sizeRows = isSet ? `
    <div class="sizes-line">
    <div class="opt-label">מידת חזייה</div>
    <div class="size-row" id="braRow">${product.braSizes.map((s, i) => `<button class="size-btn ${i === 0 ? 'selected' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
    <div class="opt-label">מידת תחתון</div>
    <div class="size-row" id="bottomRow">${product.bottomSizes.map((s, i) => `<button class="size-btn ${i === 0 ? 'selected' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
    </div>` : `
    <div class="sizes-line">
    <div class="opt-label">מידה</div>
    <div class="size-row" id="singleRow">${(product.sizeList || ['XXS', 'XS', 'S', 'M', 'L', 'XL']).map((s, i) => `<button class="size-btn ${i === 0 ? 'selected' : ''}" data-size="${s}">${s}</button>`).join('')}</div>`;

  const shipLine = `
    <div class="ship-line">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 7.5h12.5v8H1.5z"/><path d="M14 10.5h3.6l2.9 3v2h-6.5"/><circle cx="5.5" cy="17.5" r="1.6"/><circle cx="17.5" cy="17.5" r="1.6"/></svg>
      <span>משלוח חינם בקנייה מעל 300 ₪</span>
    </div>`;

  const galleryImgs = product.gallery || [];
  const gallery = `<div class="gallery">${[0, 1, 2].map(i => galleryImgs[i]
    ? `<div class="gallery-img" data-full="${galleryImgs[i]}"><img src="${galleryImgs[i]}" alt="${product.name}" loading="lazy" /></div>`
    : `<div class="gallery-ph">תמונה ${i + 1}</div>`
  ).join('')}</div>`;

  const infoBlock = [
    ['תיאור מוצר', product.description],
    ['הרכב הבד וטיפול', product.fabric],
    ['מידת הדוגמנית', product.modelInfo],
    ['מדריך מידות', product.sizeGuideText],
  ].map(([t, body]) => `
    <details class="info-acc">
      <summary><span class="acc-icon"></span><span class="acc-label">${t}</span></summary>
      <p>${body || 'יושלם בקרוב'}</p>
    </details>`).join('');

  page.innerHTML = `
    ${art}
    <h1 class="product-name">${product.name}</h1>
    <div class="product-price">${priceTxt}</div>
    ${colorRow}
    ${sizeRows}
    ${shipLine}
    <h2 class="ugc-title">איך זה נראה עליכן</h2>
    ${gallery}
    <p class="ugc-sub">תמונות מהקהילה שלנו - שתפי אותנו בלוק שלך</p>
    <div class="info-block">${infoBlock}</div>
    <button class="btn btn-block product-add" id="addBtn">הוספה לסל</button>
  `;
}

function fmt(n) {
  return '₪' + n.toLocaleString('he-IL');
}

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function pickInRow(row) {
  row.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    row.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
}

function selectedInRow(row) {
  const b = row.querySelector('button.selected');
  return b ? b.dataset.size || b.dataset.color : null;
}

['swatchRow', 'braRow', 'bottomRow', 'singleRow'].forEach(id => {
  const el = document.getElementById(id);
  if (el) pickInRow(el);
});

const swatchRowEl = document.getElementById('swatchRow');
const colorNameEl = document.getElementById('colorName');
if (swatchRowEl && colorNameEl) {
  swatchRowEl.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b && b.dataset.color) colorNameEl.textContent = b.dataset.color;
  });
}

document.getElementById('backBtn').addEventListener('click', () => history.back());

// Lightbox: click any product image to open it full-screen.
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('.product-img[data-full], .gallery-img[data-full], .swatch.img[data-full]').forEach(el => {
  el.addEventListener('click', () => {
    lightboxImg.src = el.dataset.full;
    lightbox.classList.add('open');
  });
});
lightbox.addEventListener('click', () => lightbox.classList.remove('open'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') lightbox.classList.remove('open'); });


// Product gallery: native horizontal scroll slider (smooth on iPhone) + dots. Tap opens full-screen.
const track = document.getElementById('prodTrack');
if (track) {
  const slides = [...track.children];
  const dotsEl = document.getElementById('prodDots');
  let cur = 0, swiped = false;
  const setActive = i => dotsEl.querySelectorAll('button').forEach((b, bi) => b.classList.toggle('active', bi === i));
  slides.forEach((s, i) => {
    const d = document.createElement('button');
    if (i === 0) d.classList.add('active');
    d.addEventListener('click', () => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' }));
    dotsEl.appendChild(d);
  });
  track.addEventListener('scroll', () => {
    const i = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    if (i !== cur) { cur = i; setActive(cur); }
  }, { passive: true });
  track.addEventListener('touchmove', () => { swiped = true; }, { passive: true });
  track.addEventListener('click', e => {
    if (swiped) { swiped = false; return; }
    const slide = e.target.closest('.product-slide');
    if (slide && slide.dataset.full) {
      lightboxImg.src = slide.dataset.full;
      lightbox.classList.add('open');
    }
  });
}

const addBtn = document.getElementById('addBtn');
if (addBtn) {
  addBtn.addEventListener('click', () => {
    const colorRow = document.getElementById('swatchRow');
    const braRow = document.getElementById('braRow');
    const bottomRow = document.getElementById('bottomRow');
    const singleRow = document.getElementById('singleRow');

    const color = colorRow ? selectedInRow(colorRow) : null;
    const bra = braRow ? selectedInRow(braRow) : null;
    const bottom = bottomRow ? selectedInRow(bottomRow) : null;
    const single = singleRow ? selectedInRow(singleRow) : null;

    const opts = [
      color,
      bra ? `חזייה ${bra}` : null,
      bottom ? `תחתון ${bottom}` : null,
      (!bra && !bottom && single) ? `מידה ${single}` : null,
    ].filter(Boolean).join(' · ');

    let cart = JSON.parse(localStorage.getItem('calma-cart') || '[]');
    cart.push({ id: product.id, qty: 1, opts });
    localStorage.setItem('calma-cart', JSON.stringify(cart));
    showToast(`נוסף לסל: ${product.name} 🛍️`);
  });
}
