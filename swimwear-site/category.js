const params = new URLSearchParams(window.location.search);
const cat = params.get('cat') || 'bottoms';
const info = CATEGORIES[cat] || CATEGORIES.bottoms;

document.getElementById('pageTitle').textContent = info.label;
document.title = info.label + ' — calma';

const list = PRODUCTS.filter(p => p.category === cat);
const grid = document.getElementById('productGrid');
const toastEl = document.getElementById('toast');

function fmt(n) {
  return '₪' + n.toLocaleString('he-IL');
}

grid.innerHTML = list.map(p => {
  const art = p.img
    ? `<div class="card-art"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>`
    : `<div class="card-art" style="background:${p.gradient}"><span>${p.emoji}</span></div>`;
  return `
  <article class="card" data-id="${p.id}">
    ${art}
    <div class="card-body">
      <h3 class="card-name">${p.name}</h3>
      <div class="card-bottom">
        <span class="price">${p.priceLabel || fmt(p.price)}</span>
      </div>
    </div>
  </article>
`;
}).join('');

// Cart shared with the home page via localStorage.
let cart = JSON.parse(localStorage.getItem('calma-cart') || '[]');

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove('show'), 2000);
}

grid.addEventListener('click', e => {
  const btn = e.target.closest('.add-btn');
  if (!btn) {
    const card = e.target.closest('.card');
    if (card && card.dataset.id) location.href = 'product.html?id=' + card.dataset.id;
    return;
  }
  const id = Number(btn.dataset.id);
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  localStorage.setItem('calma-cart', JSON.stringify(cart));
  const p = PRODUCTS.find(x => x.id === id);
  showToast(`נוסף לסל: ${p.name} 🛍️`);
});
