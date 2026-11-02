const PRODUCTS = [
  { id: 1, name: 'ביקיני "נמר"', tag: 'wild', tagLabel: 'צד פראי', price: 199, emoji: '🐆', colors: ['#cd9b77', '#6a3d22'], gradient: 'radial-gradient(circle at 20% 30%, rgba(0,0,0,0.22) 8%, transparent 9%) 0 0/90px 90px, radial-gradient(circle at 70% 60%, rgba(0,0,0,0.25) 7%, transparent 8%) 45px 45px/90px 90px, linear-gradient(135deg, #cd9b77, #6a3d22)' },
  { id: 2, name: 'ביקיני "זברה"', tag: 'wild', tagLabel: 'צד פראי', price: 209, emoji: '🦓', colors: ['#111111', '#ffffff'], gradient: 'repeating-linear-gradient(115deg, #111 0 18px, #fff 18px 36px)' },
  { id: 3, name: 'בגד ים שלם "ניאון ורוד"', tag: 'neon', tagLabel: 'ניאון', price: 249, emoji: '🌸', colors: ['#ff2d95', '#ff8ec7'], gradient: 'linear-gradient(135deg, #ff2d95, #ff8ec7)' },
  { id: 4, name: 'ביקיני "ליים"', tag: 'neon', tagLabel: 'ניאון', price: 189, emoji: '🍋', colors: ['#6bbd4f', '#e3dc81'], gradient: 'linear-gradient(135deg, #6bbd4f, #e3dc81)' },
  { id: 5, name: 'ביקיני "נקודות שחורות"', tag: 'dots', tagLabel: 'נקודות', price: 179, emoji: '🔘', colors: ['#111111', '#f7f3ec'], gradient: 'radial-gradient(circle, #111 22%, transparent 23%) 0 0/46px 46px, linear-gradient(135deg, #f7f3ec, #e9e2d6)' },
  { id: 6, name: 'בגד ים שלם "נקודות"', tag: 'dots', tagLabel: 'נקודות', price: 239, emoji: '⚫', colors: ['#c86800', '#f7f3ec'], gradient: 'radial-gradient(circle, #c86800 22%, transparent 23%) 0 0/46px 46px, linear-gradient(135deg, #f7f3ec, #f0e6d4)' },
  { id: 7, name: 'ביקיני "קלאסי שחור"', tag: 'classic', tagLabel: 'קלאסיק', price: 169, emoji: '🖤', colors: ['#111111', '#292929'], gradient: 'linear-gradient(135deg, #111111, #3a3a3a)' },
  { id: 8, name: 'ביקיני "ברונזה"', tag: 'classic', tagLabel: 'קלאסיק', price: 179, emoji: '🤎', colors: ['#c86800', '#8a4a00'], gradient: 'linear-gradient(135deg, #c86800, #8a4a00)' },
];

const TAG_LABELS = {
  wild: 'צד פראי',
  neon: 'ניאון',
  dots: 'נקודות',
  classic: 'קלאסיק',
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
const newsletterForm = document.getElementById('newsletterForm');
const newsletterNote = document.getElementById('newsletterNote');

let activeFilter = 'all';

function fmt(n) {
  return '₪' + n.toLocaleString('he-IL');
}

function renderProducts() {
  const list = PRODUCTS.filter(p => activeFilter === 'all' || p.tag === activeFilter);
  grid.innerHTML = list.map(p => `
    <article class="card">
      <div class="card-art" style="background:${p.gradient}">
        <span class="wave-tag">${p.tagLabel}</span>
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
    cartItemsEl.innerHTML = '<p class="cart-empty">הסל ריק — בואי נמלא אותו בחוף ☀️</p>';
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

function setFilter(tag) {
  activeFilter = tag;
  document.querySelectorAll('.tile').forEach(t => t.classList.toggle('active', t.dataset.filter === tag));
  renderProducts();
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

document.querySelectorAll('.tile').forEach(tile => {
  tile.addEventListener('click', () => {
    setFilter(tile.dataset.filter);
    document.getElementById('bestsellers').scrollIntoView({ behavior: 'smooth' });
  });
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

newsletterForm.addEventListener('submit', e => {
  e.preventDefault();
  newsletterNote.textContent = 'תודה שנרשמת! 💌';
  newsletterNote.classList.add('ok');
  newsletterForm.reset();
});

// ---------- Init ----------
renderProducts();
renderCart();
