const PRODUCTS = [
  { id: 1, name: 'ביקיני "טרופי"', category: 'bikini', categoryLabel: 'ביקיני', price: 189, emoji: '👙', colors: ['#ff8e7a', '#2a9d8f'], gradient: 'linear-gradient(135deg, #ffe0d6, #ff8e7a)' },
  { id: 2, name: 'בגד ים שלם "אוקיינוס"', category: 'onepiece', categoryLabel: 'בגד ים שלם', price: 249, emoji: '🌊', colors: ['#0e7c86', '#0a5a61'], gradient: 'linear-gradient(135deg, #d6f4f1, #0e7c86)' },
  { id: 3, name: 'ביקיני "שונית"', category: 'bikini', categoryLabel: 'ביקיני', price: 179, emoji: '🐚', colors: ['#f4a261', '#e76f51'], gradient: 'linear-gradient(135deg, #fff0df, #f4a261)' },
  { id: 4, name: 'מכנסי שחייה "גל"', category: 'shorts', categoryLabel: 'מכנסי שחייה', price: 149, emoji: '🏄', colors: ['#264653', '#2a9d8f'], gradient: 'linear-gradient(135deg, #dff0ec, #2a9d8f)' },
  { id: 5, name: 'כיסוי "חוף"', category: 'coverup', categoryLabel: 'כיסוי', price: 219, emoji: '🏖️', colors: ['#e9c46a', '#f6efe6'], gradient: 'linear-gradient(135deg, #fdf6e3, #e9c46a)' },
  { id: 6, name: 'בגד ים שלם "לגונה"', category: 'onepiece', categoryLabel: 'בגד ים שלם', price: 269, emoji: '🐬', colors: ['#48cae4', '#0077b6'], gradient: 'linear-gradient(135deg, #d9f0ff, #48cae4)' },
  { id: 7, name: 'ביקיני "סאנסט"', category: 'bikini', categoryLabel: 'ביקיני', price: 199, emoji: '🌅', colors: ['#ffb3a6', '#ff7a6b'], gradient: 'linear-gradient(135deg, #ffe9e4, #ff7a6b)' },
  { id: 8, name: 'מכנסי שחייה "ספורט"', category: 'shorts', categoryLabel: 'מכנסי שחייה', price: 159, emoji: '🤽', colors: ['#0a2e3a', '#0e7c86'], gradient: 'linear-gradient(135deg, #d6e4e9, #0a5a61)' },
];

const CATEGORIES = {
  bikini: 'ביקיני',
  onepiece: 'בגד ים שלם',
  shorts: 'מכנסי שחייה',
  coverup: 'כיסוי',
};

// ---------- Cart state ----------
let cart = JSON.parse(localStorage.getItem('galim-cart') || '[]');

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
const filters = document.getElementById('filters');

let activeFilter = 'all';

function fmt(n) {
  return '₪' + n.toLocaleString('he-IL');
}

function renderProducts() {
  const list = PRODUCTS.filter(p => activeFilter === 'all' || p.category === activeFilter);
  grid.innerHTML = list.map(p => `
    <article class="card">
      <div class="card-art" style="background:${p.gradient}">
        <span class="wave-tag">${p.categoryLabel}</span>
        <span>${p.emoji}</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${p.name}</h3>
        <div class="card-colors">${p.colors.map(c => `<span class="dot" style="background:${c}"></span>`).join('')}</div>
        <div class="card-bottom">
          <span class="price">${fmt(p.price)}</span>
          <button class="add-btn" data-id="${p.id}">הוספה לסל</button>
        </div>
      </div>
    </article>
  `).join('');
}

function saveCart() {
  localStorage.setItem('galim-cart', JSON.stringify(cart));
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  cartCountEl.textContent = count;
  cartCountEl.style.display = count ? 'grid' : 'none';

  if (!cart.length) {
    cartItemsEl.innerHTML = '<p class="cart-empty">הסל ריק — בואי נמלא אותו בים ☀️</p>';
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

filters.addEventListener('click', e => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  renderProducts();
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
