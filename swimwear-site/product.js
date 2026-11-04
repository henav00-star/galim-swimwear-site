const params = new URLSearchParams(window.location.search);
const product = PRODUCTS.find(p => p.id === Number(params.get('id')));
const page = document.getElementById('productPage');
const toastEl = document.getElementById('toast');

if (!product) {
  page.innerHTML = '<p class="cart-empty">המוצר לא נמצא</p>';
} else {
  document.title = product.name + ' — calma';

  const art = product.img
    ? `<div class="product-img"><img src="${product.img}" alt="${product.name}" /></div>`
    : `<div class="product-img" style="background:${product.gradient}"><span class="product-emoji">${product.emoji || ''}</span></div>`;

  const priceTxt = product.priceLabel || fmt(product.price);

  const colorRow = product.colorOptions ? `
    <div class="opt-label">צבע</div>
    <div class="swatch-row" id="swatchRow">
      ${product.colorOptions.map((c, i) => c.type === 'dots'
        ? `<button class="swatch dots ${i === 0 ? 'selected' : ''}" data-color="${c.name}" style="--c1:${c.c1};--c2:${c.c2}" aria-label="${c.name}"></button>`
        : `<button class="swatch ${i === 0 ? 'selected' : ''}" data-color="${c.name}" style="background:${c.c}" aria-label="${c.name}"></button>`
      ).join('')}
    </div>` : '';

  const isSet = product.set && product.braSizes && product.bottomSizes;
  const sizeRows = isSet ? `
    <div class="opt-label">מידת חזייה</div>
    <div class="size-row" id="braRow">${product.braSizes.map((s, i) => `<button class="size-btn ${i === 0 ? 'selected' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
    <div class="opt-label">מידת תחתון</div>
    <div class="size-row" id="bottomRow">${product.bottomSizes.map((s, i) => `<button class="size-btn ${i === 0 ? 'selected' : ''}" data-size="${s}">${s}</button>`).join('')}` : `
    <div class="opt-label">מידה</div>
    <div class="size-row" id="singleRow">${(product.sizeList || ['XXS', 'XS', 'S', 'M', 'L', 'XL']).map((s, i) => `<button class="size-btn ${i === 0 ? 'selected' : ''}" data-size="${s}">${s}</button>`).join('')}</div>`;

  page.innerHTML = `
    ${art}
    <h1 class="product-name">${product.name}</h1>
    ${product.sizes ? `<div class="card-sizes">מידות ${product.sizes}</div>` : ''}
    <div class="product-price">${priceTxt}</div>
    ${colorRow}
    ${sizeRows}
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

document.getElementById('backBtn').addEventListener('click', () => history.back());

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
