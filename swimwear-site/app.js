// PRODUCTS are defined in products.js (loaded before this file).

// ---------- Cart state ----------
let cart = JSON.parse(localStorage.getItem('calma-cart') || '[]');

const grid = document.getElementById('productGrid');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const cartBtn = document.getElementById('cartBtn');
const cartEl = document.getElementById('cart');
const overlay = document.getElementById('overlay');
const cartClose = document.getElementById('cartClose');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutNote = document.getElementById('checkoutNote');
const toastEl = document.getElementById('toast');
const menuBtn = document.getElementById('menuBtn');

function fmt(n) {
  return '₪' + n.toLocaleString('he-IL');
}

function renderProducts() {
  grid.innerHTML = PRODUCTS.filter(p => p.newIn).map(p => {
    const art = p.img
      ? `<div class="card-art"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>`
      : `<div class="card-art" style="background:${p.gradient}"><span>${p.emoji}</span></div>`;
    return `
    <article class="card" data-id="${p.id}">
      ${art}
      <div class="card-body">
        <h3 class="card-name">${p.name}</h3>
        ${p.sizes ? `<div class="card-sizes">מידות ${p.sizes}</div>` : ''}
        <div class="card-bottom">
          <span class="price">${p.priceLabel || fmt(p.price)}</span>
          <button class="add-btn" data-id="${p.id}">הוספה לסל</button>
        </div>
      </div>
    </article>
  `;
  }).join('');
}

function saveCart() {
  localStorage.setItem('calma-cart', JSON.stringify(cart));
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  cartCountEl.textContent = count;
  cartCountEl.style.display = count ? 'grid' : 'none';

  if (!cart.length) {
    cartItemsEl.innerHTML = '<p class="cart-empty">הסל ריק 🛍️</p>';
    cartTotalEl.textContent = '₪0';
    return;
  }

  cartItemsEl.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return `
      <div class="cart-item">
        <div class="ci-art">${p.emoji || '🛍️'}</div>
        <div class="ci-info">
          <div class="ci-name">${p.name}</div>
          ${item.opts ? `<div class="ci-opts">${item.opts}</div>` : ''}
          <div class="ci-price">${p.priceLabel || fmt(p.price * item.qty)}</div>
          <div class="ci-qty">
            <button data-act="dec" data-id="${item.id}">−</button>
            <span>${item.qty}</span>
            <button data-act="inc" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="ci-remove" data-act="remove" data-id="${item.id}">הסרה</button>
      </div>
    `;
  }).join('');

  const total = cart.reduce((s, i) => s + ((PRODUCTS.find(x => x.id === i.id).price || 0) * i.qty), 0);
  cartTotalEl.textContent = fmt(total);
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  const p = PRODUCTS.find(x => x.id === id);
  showToast(`נוסף לסל: ${p.name} 🛍️`);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove('show'), 2000);
}

function openCart() {
  cartEl.classList.add('open');
  overlay.classList.add('open');
}
function closeCart() {
  cartEl.classList.remove('open');
  overlay.classList.remove('open');
}

// ---------- Menu (hamburger) ----------
menuBtn.addEventListener('click', () => showToast('התפריט יגיע בקרוב ✨'));

// ---------- Events ----------
grid.addEventListener('click', e => {
  const btn = e.target.closest('.add-btn');
  if (btn) { addToCart(Number(btn.dataset.id)); return; }
  const card = e.target.closest('.card');
  if (card && card.dataset.id) location.href = 'product.html?id=' + card.dataset.id;
});

cartItemsEl.addEventListener('click', e => {
  const btn = e.target.closest('button[data-act]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.act === 'inc') changeQty(id, 1);
  else if (btn.dataset.act === 'dec') changeQty(id, -1);
  else if (btn.dataset.act === 'remove') removeItem(id);
});

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

checkoutBtn.addEventListener('click', () => {
  if (!cart.length) {
    checkoutNote.textContent = 'הסל ריק — הוסיפי פריטים לפני המעבר לקופה.';
    return;
  }
  checkoutNote.textContent = '✨ שלב התשלום (סליקה, משלוח והזמנות) הוא השלב הבא — נחבר אותו לפי מה שתבחרי.';
});

// ---------- Init ----------
renderProducts();
renderCart();
