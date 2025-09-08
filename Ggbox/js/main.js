// Espera a que todo el documento HTML se cargue antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA EL FORMULARIO DE LOGIN (solo se ejecuta en login.html) ---
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (loginForm.checkValidity()) {
                // Almacena los datos del usuario en el localStorage
                const username = document.getElementById('username').value;
                const lastLoginDate = new Date().toLocaleString();
                const points = Math.floor(Math.random() * 1000) + 100;

                // Guardar los datos del usuario en el navegador
                // localStorage es un almacenamiento persistente que las páginas pueden compartir.
                localStorage.setItem('currentUser', JSON.stringify({
                    username: username,
                    lastLogin: lastLoginDate,
                    points: points
                }));

                // Redirige al usuario a la página de inicio
                window.location.href = 'index.html';

            } else {
                loginForm.classList.add('was-validated');
            }
        });
    }

    // --- LÓGICA PARA TODAS LAS PÁGINAS (maneja la navegación y la alerta) ---

    // Obtener los enlaces de la barra de navegación
    const loginLink = document.getElementById('login-link');
    const profileLink = document.getElementById('profile-link');
    const userFromLocalStorage = JSON.parse(localStorage.getItem('currentUser'));

    // Si hay un usuario guardado en el localStorage...
    if (userFromLocalStorage) {
        // ...oculta el botón de login y muestra el de "Mi Perfil"
        if (loginLink) loginLink.classList.add('d-none');
        if (profileLink) profileLink.classList.remove('d-none');
    } else {
        // ...si no hay usuario, oculta "Mi Perfil" y muestra el de login
        if (loginLink) loginLink.classList.remove('d-none');
        if (profileLink) profileLink.classList.add('d-none');
    }

    // Lógica para mostrar la alerta de bienvenida con Toast de Bootstrap
    if (userFromLocalStorage && window.location.pathname.endsWith('index.html')) {
        const welcomeToast = document.getElementById('welcomeToast');
        const toastMessage = document.getElementById('toast-message');

        if (welcomeToast && toastMessage) {
            toastMessage.textContent = `¡Bienvenido, ${userFromLocalStorage.username}! Has iniciado sesión correctamente.`;
            const toast = new bootstrap.Toast(welcomeToast);
            toast.show();
        }

        // Elimina el usuario del localStorage después de mostrar la alerta
        // Esto evita que la alerta se muestre cada vez que el usuario regrese al inicio
        // localStorage.removeItem('currentUser');
    }

    // Lógica para la página de perfil
    const isProfilePage = window.location.pathname.endsWith('perfil.html');
    if (isProfilePage) {
        if (!userFromLocalStorage) {
            alert('Debes iniciar sesión para ver tu perfil.');
            window.location.href = 'login.html';
        } else {
            document.getElementById('user-profile-name').textContent = `Hola, ${userFromLocalStorage.username}`;
            document.getElementById('user-last-login').textContent = userFromLocalStorage.lastLogin;
            document.getElementById('user-points').textContent = userFromLocalStorage.points;

            const userEmailElement = document.getElementById('user-profile-email');
            if (userEmailElement) {
                userEmailElement.textContent = `${userFromLocalStorage.username.toLowerCase()}@ejemplo.com`;
            }

            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    localStorage.removeItem('currentUser');
                    alert('Has cerrado sesión correctamente.');
                    window.location.href = 'index.html';
                });
            }
        }
    }
});