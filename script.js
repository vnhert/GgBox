<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    
        document.addEventListener('DOMContentLoaded', () => {
            const productos = [
              { "id": 1, "nombre": "Monitor Gear", "descripcion": "Monitor 22\" Full HD, Panel IPS, 100Hz", "stock": 20, "precio": 69990, "img": "https://placehold.co/600x400/0d1117/white?text=Monitor+Gear" },
              { "id": 2, "nombre": "Samsung Odyssey", "descripcion": "OLED G6 27 pulgadas 160hz", "stock": 30, "precio": 649990, "img": "https://placehold.co/600x400/0d1117/white?text=Samsung+Odyssey" },
              { "id": 3, "nombre": "Xiaomi G Pro", "descripcion": "Pro 27 pulgadas 180 hz", "stock": 0, "precio": 299990, "img": "https://placehold.co/600x400/0d1117/white?text=Xiaomi+G" },
              { "id": 4, "nombre": "ASUS ROG Strix", "descripcion": "1ms, 240 hz, 27 pulgadas", "stock": 59, "precio": 890000, "img": "https://placehold.co/600x400/0d1117/white?text=ASUS+ROG" },
              { "id": 5, "nombre": "Mouse Gear", "descripcion": "7 botones programables, 4000 DPI", "stock": 10, "precio": 12990, "img": "https://placehold.co/600x400/0d1117/white?text=Mouse+Gear" },
              { "id": 6, "nombre": "Mouse Mlogix", "descripcion": "Alámbrico, 800 dpi", "stock": 7, "precio": 5690, "img": "https://placehold.co/600x400/0d1117/white?text=Mouse+Mlogix" },
              { "id": 7, "nombre": "Mouse Pro Fit", "descripcion": "Inalámbrico, Conexión USB, 2.4GHz", "stock": 6, "precio": 13990, "img": "https://placehold.co/600x400/0d1117/white?text=Mouse+Pro+Fit" },
              { "id": 8, "nombre": "Corsair K100 RGB", "descripcion": "Teclado Mecánico Corsair K100 RGB", "stock": 29, "precio": 349000, "img": "https://placehold.co/600x400/0d1117/white?text=Corsair+K100" },
              { "id": 9, "nombre": "Razer BlackWidow V3", "descripcion": "Razer BlackWidow V3 Mini HyperSpeed", "stock": 0, "precio": 322445, "img": "https://placehold.co/600x400/0d1117/white?text=Razer+BW+V3" },
              { "id": 10, "nombre": "ASUS ROG Azoth", "descripcion": "Teclado Gamer Inalámbrico ASUS ROG Azoth", "stock": 23, "precio": 249995, "img": "https://placehold.co/600x400/0d1117/white?text=ASUS+Azoth" }
            ];
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let currentUser = localStorage.getItem('currentUser');
            const homeSection = document.getElementById('home-section');
            const catalogSection = document.getElementById('catalog-section');
            const toastElement = document.getElementById('notificationToast');
            const toast = new bootstrap.Toast(toastElement);
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            const loginForm = document.getElementById('login-form');

            function init() {
                updateNavUI();
                renderCatalog();
                renderFeaturedProducts();
                saveAndRerender();
                setupEventListeners();
            }

            function showSection(sectionToShow) {
                homeSection.classList.add('d-none');
                catalogSection.classList.add('d-none');
                sectionToShow.classList.remove('d-none');
            }
            
            function updateNavUI() {
                const navAuthSection = document.getElementById('nav-auth-section');
                if (currentUser) {
                    navAuthSection.innerHTML = `<span class="navbar-text user-greeting me-3">Hola, ${currentUser}</span><button id="logout-btn" class="btn btn-outline-danger btn-sm">Cerrar Sesión</button>`;
                } else {
                    navAuthSection.innerHTML = `<button id="login-btn" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#loginModal"><i class="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión</button>`;
                }
            }
            
            function setupEventListeners() {
                document.getElementById('home-link').addEventListener('click', (e) => { e.preventDefault(); showSection(homeSection); });
                document.getElementById('brand-link').addEventListener('click', (e) => { e.preventDefault(); showSection(homeSection); });
                document.getElementById('catalog-link').addEventListener('click', (e) => { e.preventDefault(); showSection(catalogSection); });
                document.getElementById('see-catalog-btn').addEventListener('click', (e) => { e.preventDefault(); showSection(catalogSection); });
                
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (loginForm.checkValidity()) {
                        const username = document.getElementById('username').value;
                        currentUser = username;
                        localStorage.setItem('currentUser', username);
                        updateNavUI();
                        loginModal.hide();
                        loginForm.classList.remove('was-validated');
                        loginForm.reset();
                    } else {
                       loginForm.classList.add('was-validated');
                    }
                });

                document.getElementById('nav-auth-section').addEventListener('click', (e) => {
                    if(e.target.id === 'logout-btn') {
                        currentUser = null;
                        localStorage.removeItem('currentUser');
                        updateNavUI();
                    }
                });

                document.body.addEventListener('click', (e) => {
                    const target = e.target.closest('.add-to-cart');
                    if (target) {
                        e.preventDefault();
                        addToCart(parseInt(target.dataset.id));
                    }
                    const changeQtyBtn = e.target.closest('.change-quantity');
                    if (changeQtyBtn) {
                         changeQuantity(parseInt(changeQtyBtn.dataset.id), parseInt(changeQtyBtn.dataset.change));
                    }
                    const removeBtn = e.target.closest('.remove-from-cart');
                    if (removeBtn) {
                        removeFromCart(parseInt(removeBtn.dataset.id));
                    }
                    if (e.target.matches('.clear-cart')) clearCart();
                    if (e.target.matches('.checkout-btn')) handleCheckout();
                });
            }

            const formatPrice = (price) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

            function createProductCard(product) {
                const isOutOfStock = product.stock === 0;
                const stockBadge = isOutOfStock
                    ? `<span class="badge bg-danger">Agotado</span>`
                    : `<span class="badge bg-success">En Stock (${product.stock})</span>`;

                return `
                    <div class="col">
                        <div class="card h-100 product-card rounded-3 overflow-hidden border-0">
                            <div class="card-img-container rounded-top-3">
                                <img src="${product.img}" class="card-img-top" alt="${product.nombre}">
                                <div class="img-overlay">
                                    <button class="btn btn-light add-to-cart" data-id="${product.id}" ${isOutOfStock ? 'disabled' : ''}>
                                        <i class="bi bi-cart-plus-fill me-2"></i> ${isOutOfStock ? 'Agotado' : 'Agregar'}
                                    </button>
                                </div>
                            </div>
                            <div class="card-body d-flex flex-column">
                                <h6 class="card-title fw-semibold">${product.nombre}</h6>
                                <p class="card-text text-body-secondary small flex-grow-1">${product.descripcion}</p>
                                <div class="d-flex justify-content-between align-items-center mt-auto pt-2">
                                    <p class="card-text text-primary fw-bold fs-5 mb-0">${formatPrice(product.precio)}</p>
                                    ${stockBadge}
                                </div>
                            </div>
                        </div>
                    </div>`;
            }

            function renderCatalog() {
                document.getElementById('catalog-container').innerHTML = productos.map(createProductCard).join('');
            }
            
            function renderFeaturedProducts() {
                const featured = [...productos].sort(() => 0.5 - Math.random()).slice(0, 4);
                document.getElementById('featured-products').innerHTML = featured.map(createProductCard).join('');
            }

            function renderCart() {
                const container = document.getElementById('offcanvas-cart-body');
                if (!container) return;
                if (cart.length === 0) {
                    container.innerHTML = `<div class="text-center p-5 vh-100 d-flex flex-column justify-content-center"><i class="bi bi-cart-x fa-4x text-body-tertiary mb-3"></i><h4 class="text-body-tertiary">Tu carrito está vacío</h4></div>`;
                    return;
                }
                const cartItemsHTML = cart.map(item => {
                    const product = productos.find(p => p.id === item.id);
                    if (!product) return '';
                    return `
                        <div class="row mb-3 align-items-center">
                            <div class="col-3"><img src="${product.img}" class="img-fluid rounded"></div>
                            <div class="col-9">
                                <p class="mb-0 small fw-semibold">${product.nombre}</p>
                                <div class="input-group input-group-sm my-1"><button class="btn btn-outline-secondary change-quantity" data-id="${item.id}" data-change="-1">-</button><input type="text" class="form-control text-center" value="${item.quantity}" readonly><button class="btn btn-outline-secondary change-quantity" data-id="${item.id}" data-change="1">+</button></div>
                                <div class="d-flex justify-content-between align-items-center"><small class="text-body-tertiary">${formatPrice(product.precio)}</small><button class="btn btn-link text-danger p-0 remove-from-cart" data-id="${item.id}"><i class="bi bi-trash3-fill"></i></button></div>
                            </div>
                        </div>`;
                }).join('<hr class="my-2">');
                const totalPrice = cart.reduce((total, item) => {
                    const product = productos.find(p => p.id === item.id);
                    return total + (product ? product.precio * item.quantity : 0);
                }, 0);
                container.innerHTML = `<div class="flex-grow-1">${cartItemsHTML}</div><div class="mt-auto pt-3 border-top"><div class="d-flex justify-content-between align-items-center"><h5 class="mb-0">Total:</h5><p class="fw-bold fs-5 mb-0">${formatPrice(totalPrice)}</p></div><button class="btn btn-success w-100 mt-3 checkout-btn">Proceder al Pago</button><button class="btn btn-outline-danger w-100 mt-2 clear-cart">Vaciar Carrito</button></div>`;
            }

            function addToCart(productId) {
                const product = productos.find(p => p.id === productId);
                if (!product || product.stock === 0) return;
                const itemInCart = cart.find(i => i.id === productId);
                if (itemInCart) {
                    if (itemInCart.quantity < product.stock) {
                        itemInCart.quantity++;
                        saveAndRerender();
                        toast.show();
                    }
                } else {
                    cart.push({ id: productId, quantity: 1 });
                    saveAndRerender();
                    toast.show();
                }
            }

            function changeQuantity(productId, change) {
                const item = cart.find(i => i.id === productId);
                const product = productos.find(p => p.id === productId);
                if (item && product) {
                    const newQuantity = item.quantity + change;
                    if (newQuantity > 0 && newQuantity <= product.stock) {
                        item.quantity = newQuantity;
                    } else if (newQuantity <= 0) {
                        removeFromCart(productId);
                    }
                    saveAndRerender();
                }
            }

            function removeFromCart(productId) {
                cart = cart.filter(i => i.id !== productId);
                saveAndRerender();
            }

            function clearCart() {
                cart = [];
                saveAndRerender();
            }

            function saveAndRerender() {
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                renderCart();
            }

            function updateCartCount() {
                const count = cart.reduce((total, item) => total + item.quantity, 0);
                document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
            }
            
            function handleCheckout() {
                if (cart.length === 0) return;
                const cartOffcanvasEl = document.getElementById('cartOffcanvas');
                const cartOffcanvas = bootstrap.Offcanvas.getInstance(cartOffcanvasEl);
                if (cartOffcanvas) cartOffcanvas.hide();
                cartOffcanvasEl.addEventListener('hidden.bs.offcanvas', () => { successModal.show(); }, { once: true });
                clearCart();
            }

            init();
        });
   