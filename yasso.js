  let cart = {};

  function toggleCart() {
    document.getElementById('cartDrawer').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('open');
  }

  function addToCart(btn) {
    const name  = btn.dataset.name;
    const price = btn.dataset.price;
    if (cart[name]) {
      cart[name].qty++;
    } else {
      cart[name] = { price, qty: 1 };
    }
    renderCart();
    showToast(name);
  }

  function changeQty(name, delta) {
    if (!cart[name]) return;
    cart[name].qty += delta;
    if (cart[name].qty <= 0) delete cart[name];
    renderCart();
  }

  function renderCart() {
    const keys = Object.keys(cart);
    const count = keys.reduce((s, k) => s + cart[k].qty, 0);
    const badge = document.getElementById('cart-count');
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);

    const empty = document.getElementById('cartEmpty');
    const items = document.getElementById('cartItems');
    empty.style.display = keys.length ? 'none' : 'block';

    // remove old item rows
    items.querySelectorAll('.cart-item').forEach(el => el.remove());

    let total = 0;
    keys.forEach(name => {
      const { price, qty } = cart[name];
      const num = parseFloat(price.replace('$',''));
      total += num * qty;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${name}</div>
          <div class="cart-item-price">${price}</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty('${name}',-1)">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" onclick="changeQty('${name}',1)">+</button>
        </div>
      `;
      items.appendChild(div);
    });

    document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
  }

  function showToast(name) {
    const t = document.getElementById('toast');
    t.textContent = `"${name}" added to bag`;
    t.classList.add('show');
    clearTimeout(window._toast);
    window._toast = setTimeout(() => t.classList.remove('show'), 2200);
  }