document.addEventListener('DOMContentLoaded', () => {
    
    // "BASE DE DATOS" DE PRODUCTOS
    // Se incluye aquí para evitar problemas al abrir el archivo localmente y cumplir con los requisitos del curso.
    const productos = [
      { "id": 1, "nombre": "Monitor Gear", "descripcion": "Monitor 22\" Full HD, Panel IPS, 100Hz", "stock": 20, "precio": 69990, "img": "img/monitor/1.png", "categoria": "monitor" },
      { "id": 2, "nombre": "Samsung Odyssey", "descripcion": "OLED G6 27 pulgadas 160hz", "stock": 30, "precio": 649990, "img": "img/monitor/2.png", "categoria": "monitor" },
      { "id": 3, "nombre": "Xiaomi G", "descripcion": "Pro 27 pulgadas 180 hz", "stock": 40, "precio": 299990, "img": "img/monitor/3.png", "categoria": "monitor" },
      { "id": 4, "nombre": "ASUS ROG Strix XG27WCMS", "descripcion": "1ms, 240 hz, 27 pulgadas", "stock": 59, "precio": 890000, "img": "img/monitor/4.png", "categoria": "monitor" },
      { "id": 5, "nombre": "Mouse Logitech", "descripcion": "DPI 8000, laser", "stock": 18, "precio": 49990, "img": "img/mouse/1.png", "categoria": "mouse" },
      { "id": 6, "nombre": "Mouse Gear", "descripcion": "7 botones programables, sensor óptico de 800 a 4000 DPI", "stock": 10, "precio": 12990, "img": "img/mouse/2.jpg", "categoria": "mouse" },
      { "id": 7, "nombre": "Mouse Mlogix", "descripcion": "Alámbrico, 800 dpi", "stock": 7, "precio": 5690, "img": "img/mouse/3.jpg", "categoria": "mouse" },
      { "id": 8, "nombre": "Mouse Pro Fit", "descripcion": "Inalámbrico, Conexión USB, 2.4GHz", "stock": 6, "precio": 13990, "img": "img/mouse/4.jpg", "categoria": "mouse" },
      { "id": 9, "nombre": "Corsair K100 RGB", "descripcion": "Teclado Mecánico Corsair K100 RGB (CH-912A01A-NA)", "stock": 29, "precio": 349000, "img": "img/teclado/1.png", "categoria": "teclado" },
      { "id": 10, "nombre": "Razer BlackWidow V3", "descripcion": "Razer BlackWidow V3 Mini HyperSpeed Phantom Edition - Inglés (Yellow Switches)", "stock": 45, "precio": 322445, "img": "img/teclado/2.png", "categoria": "teclado" },
      { "id": 11, "nombre": "ASUS ROG Azoth White", "descripcion": "Teclado Gamer Inalámbrico ASUS ROG Azoth White (ROG NX Snow)", "stock": 43, "precio": 249000, "img": "img/teclado/3.png", "categoria": "teclado" },
      { "id": 12, "nombre": "ASUS ROG Azoth", "descripcion": "Teclado Gamer Inalámbrico ASUS ROG Azoth (ROG NX Snow)", "stock": 23, "precio": 249995, "img": "img/teclado/4.png", "categoria": "teclado" },
      { "id": 13, "nombre": "MSI GeForce RTX 5080", "descripcion": "MSI GeForce RTX 5080 16G VANGUARD SOC LAUNCH EDITION", "stock": 40, "precio": 1804990, "img": "img/grafica/1.png", "categoria": "tarjeta-grafica" },
      { "id": 14, "nombre": "MSI GeForce RTX 5080 Liquid", "descripcion": "MSI GeForce RTX 5080 16G SUPRIM LIQUID SOC", "stock": 324, "precio": 1749890, "img": "img/grafica/2.png", "categoria": "tarjeta-grafica" },
      { "id": 15, "nombre": "ASUS ROG-ASTRAL-RTX5080", "descripcion": "ASUS ROG-ASTRAL-RTX5080-O16G-GAMING", "stock": 24, "precio": 1999900, "img": "img/grafica/3.png", "categoria": "tarjeta-grafica" },
      { "id": 16, "nombre": "Palit GeForce RTX 5090", "descripcion": "Palit GeForce RTX 5090 GameRock OC", "stock": 32, "precio": 2849990, "img": "img/grafica/4.png", "categoria": "tarjeta-grafica" }
    ];

    // ESTADO DE LA APLICACIÓN (Variables que guardan la información)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentUser = localStorage.getItem('currentUser');

    // --- FUNCIONES DE RENDERIZADO (Dibujar en pantalla) ---
    function createProductCard(product) {
        const isOutOfStock = product.stock === 0;
        const stockBadge = isOutOfStock ? `<span class="badge bg-danger">Agotado</span>` : `<span class="badge bg-success">En Stock (${product.stock})</span>`;
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
                            <p class="card-text text-primary fw-bold fs-5 mb-0">${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.precio)}</p>
                            ${stockBadge}
                        </div>
                    </div>
                </div>
            </div>`;
    }

    // --- FUNCIONES DE UI (Actualizar interfaz) ---
    function updateNavUI() {
        const navAuthSection = document.getElementById('nav-auth-section');
        if (!navAuthSection) return;

        if (currentUser) {
            navAuthSection.innerHTML = `<span class="navbar-text user-greeting me-3">Hola, ${currentUser}</span><button id="logout-btn" class="btn btn-outline-danger btn-sm">Cerrar Sesión</button>`;
        } else {
            navAuthSection.innerHTML = `<a href="login.html" class="btn btn-outline-primary btn-sm"><i class="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión</a>`;
        }
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                currentUser = null;
                localStorage.removeItem('currentUser');
                updateNavUI();
            });
        }
    }

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems;
        });
    }

    // --- FUNCIONES DEL CARRITO ---
    function addToCart(productId) {
        const product = productos.find(p => p.id === productId);
        if (!product || product.stock === 0) return;

        const itemInCart = cart.find(i => i.id === productId);
        if (itemInCart) {
            if (itemInCart.quantity < product.stock) {
                itemInCart.quantity++;
            }
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        const toastEl = document.getElementById('notificationToast');
        if (toastEl) {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    }

    function changeQuantity(productId, change) {
        const itemInCart = cart.find(i => i.id === productId);
        const product = productos.find(p => p.id === productId);
        if (itemInCart && product) {
            let newQuantity = itemInCart.quantity + change;
            if (newQuantity > 0 && newQuantity <= product.stock) {
                itemInCart.quantity = newQuantity;
            } else if (newQuantity <= 0) {
                removeFromCart(productId);
                return;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            if(document.getElementById('cart-page-container')) renderCartPage();
        }
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        if(document.getElementById('cart-page-container')) renderCartPage();
    }
    
    function clearCart() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        if(document.getElementById('cart-page-container')) renderCartPage();
    }
    
    function handleCheckout() {
        if (cart.length === 0) return;
        clearCart();
    }

    // --- LÓGICA ESPECÍFICA PARA CADA PÁGINA ---

    function renderHomePage() {
        const featuredProductsContainer = document.getElementById('featured-products');
        if (featuredProductsContainer) {
            const featured = [...productos].sort(() => 0.5 - Math.random()).slice(0, 4);
            featuredProductsContainer.innerHTML = featured.map(createProductCard).join('');
        }
    }

    function renderCatalogPage() {
        const catalogContainer = document.getElementById('catalog-container');
        if (catalogContainer) {
            catalogContainer.innerHTML = productos.map(createProductCard).join('');
        }
    }
    
    function renderCartPage() {
        const cartPageContainer = document.getElementById('cart-page-container');
        if (!cartPageContainer) return;

        if (cart.length === 0) {
            cartPageContainer.innerHTML = `
                <div class="text-center p-5">
                    <i class="bi bi-cart-x" style="font-size: 5rem;"></i>
                    <h3 class="mt-3">Tu carrito está vacío</h3>
                    <p class="text-body-secondary">Parece que aún no has añadido productos.</p>
                    <a href="catalogo.html" class="btn btn-primary mt-3">Ir al Catálogo</a>
                </div>`;
            return;
        }

        const cartItemsHTML = cart.map(item => {
            const product = productos.find(p => p.id === item.id);
            if (!product) return '';
            return `
                <div class="row mb-3 align-items-center">
                    <div class="col-2 col-md-1"><img src="${product.img}" class="img-fluid rounded"></div>
                    <div class="col-4 col-md-5"><p class="mb-0 fw-semibold">${product.nombre}</p></div>
                    <div class="col-3 col-md-3">
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary change-quantity" data-id="${item.id}" data-change="-1">-</button>
                            <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                            <button class="btn btn-outline-secondary change-quantity" data-id="${item.id}" data-change="1">+</button>
                        </div>
                    </div>
                    <div class="col-2 col-md-2 text-end"><p class="mb-0 fw-semibold">${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.precio * item.quantity)}</p></div>
                    <div class="col-1 text-end"><button class="btn btn-link text-danger p-0 remove-from-cart" data-id="${item.id}"><i class="bi bi-trash3-fill"></i></button></div>
                </div>`;
        }).join('<hr class="my-3">');
        
        const totalPrice = cart.reduce((total, item) => {
            const product = productos.find(p => p.id === item.id);
            return total + (product ? product.precio * item.quantity : 0);
        }, 0);

        cartPageContainer.innerHTML = `
            <div class="card shadow"><div class="card-body">${cartItemsHTML}</div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Total: <span class="text-primary fw-bold">${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(totalPrice)}</span></h5>
                    <div>
                        <button class="btn btn-outline-danger clear-cart">Vaciar Carrito</button>
                        <button class="btn btn-success checkout-btn" data-bs-toggle="modal" data-bs-target="#successModal">Proceder al Pago</button>
                    </div>
                </div>
            </div>`;
    }

    function setupLoginPage() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (loginForm.checkValidity()) {
                    currentUser = document.getElementById('username').value;
                    localStorage.setItem('currentUser', currentUser);
                    window.location.href = 'index.html';
                } else {
                    loginForm.classList.add('was-validated');
                }
            });
        }
    }

    // --- INICIALIZACIÓN ---
    
    // Funciones que se ejecutan en todas las páginas.
    updateNavUI();
    updateCartCount();

    // Ejecuta la lógica de renderizado específica para la página actual.
    renderHomePage();
    renderCatalogPage();
    renderCartPage();
    setupLoginPage();

    // Configura el manejador de eventos global para los clics.
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart')) {
            addToCart(parseInt(e.target.closest('.add-to-cart').dataset.id));
        }
        if (e.target.closest('.change-quantity')) {
            changeQuantity(parseInt(e.target.closest('.change-quantity').dataset.id), parseInt(e.target.closest('.change-quantity').dataset.change));
        }
        if (e.target.closest('.remove-from-cart')) {
            removeFromCart(parseInt(e.target.closest('.remove-from-cart').dataset.id));
        }
        if (e.target.matches('.clear-cart')) {
            clearCart();
        }
        if (e.target.matches('.checkout-btn')) {
            handleCheckout();
        }
    });
});