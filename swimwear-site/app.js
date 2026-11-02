const PRODUCTS = [
  { id: 1, name: 'ביקיני "שמש"', price: 189, emoji: '☀️', colors: ['#e8a87c', '#d9b38c'], gradient: 'linear-gradient(150deg, #f6e3c8, #e8b98a)' },
  { id: 2, name: 'ביקיני "חוף"', price: 179, emoji: '🌊', colors: ['#8fd3d0', '#5bb7b2'], gradient: 'linear-gradient(150deg, #d8f1ee, #8fd3d0)' },
  { id: 3, name: 'ביקיני "גל"', price: 199, emoji: '🐚', colors: ['#e8c9b0', '#c9a184'], gradient: 'linear-gradient(150deg, #f3e6d6, #dcc4a8)' },
  { id: 4, name: 'בגד ים שלם "לגונה"', price: 249, emoji: '🦋', colors: ['#a8cbe8', '#7aa8c9'], gradient: 'linear-gradient(150deg, #dce9f5, #a8cbe8)' },
  { id: 5, name: 'ביקיני "ענבר"', price: 209, emoji: '🍯', colors: ['#d9a05b', '#b87a34'], gradient: 'linear-gradient(150deg, #f6dfb5, #d9a05b)' },
  { id: 6, name: 'ביקיני "קורל"', price: 189, emoji: '🌸', colors: ['#f0a8a0', '#dd8b86'], gradient: 'linear-gradient(150deg, #fbe2df, #f0a8a0)' },
  { id: 7, name: 'בגד ים שלם "ליל"', price: 239, emoji: '🌙', colors: ['#3a3a3a', '#111111'], gradient: 'linear-gradient(150deg, #4a4a4a, #1a1a1a)' },
  { id: 8, name: 'ביקיני "פרל"', price: 169, emoji: '🦪', colors: ['#f1ede4', '#ddd6c8'], gradient: 'linear-gradient(150deg, #f7f3ec, #e4ddd0)' },
];

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
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="card">
      <div class="card-art" style="background:${p.gradient}">
        <span>${p.emoji}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${p.name}</h3>
        <div class="card-bottom">
          <span class="price">${fmt(p.price)}</span>
          <button class="add-btn" data-id="${p.id}">הוספה לסל</button>
        </div>
      </div>
    </article>
  `).join('');
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
        <div class="ci-art">${p.emoji}</div>
        <div class="ci-info">
          <div class="ci-name">${p.name}</div>
          <div class="ci-price">${fmt(p.price * item.qty)}</div>
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

  const total = cart.reduce((s, i) => s + (PRODUCTS.find(x => x.id === i.id).price * i.qty), 0);
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
  if (btn) addToCart(Number(btn.dataset.id));
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
