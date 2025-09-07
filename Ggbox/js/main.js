// Espera a que todo el documento HTML se cargue antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {
    
    // Busca el formulario de login en la página actual por su id.
    const loginForm = document.getElementById('login-form');

    // Esta condición es la clave: el código de validación solo se ejecutará
    // si estamos en la página que contiene el formulario de login.
    // Esto evita que se produzcan errores en las otras páginas (index, catalogo, etc.).
    if (loginForm) {
        
        loginForm.addEventListener('submit', (e) => {
            
            // previene que el formulario se envíe de la forma tradicional (recargando la página).
            // Esto nos permite manejar la validación con JavaScript.
            e.preventDefault();

            // checkValidity() es el método de Bootstrap que revisa las reglas que pusimos en el HTML (required, minlength).
            if (loginForm.checkValidity()) {
                // Si el formulario es válido (todos los campos están correctos)...
                
                // 1. Se obtiene el nombre del usuario para el mensaje.
                const username = document.getElementById('username').value;
                
                // 2. Se muestra un mensaje de éxito, similar al del ejemplo "Ritmo Lab".
                alert(`¡Bienvenido, ${username}! Has iniciado sesión correctamente.`);
                
                // 3. Se redirige al usuario a la página de inicio.
                window.location.href = 'index.html';

            } else {
                // Si el formulario no es válido...
                // ...se añade la clase 'was-validated' para que Bootstrap se encargue de mostrar
                // los mensajes de error en rojo que definimos en el HTML.
                loginForm.classList.add('was-validated');
            }
        });
    }

});