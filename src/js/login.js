console.log("Login.js cargado");
console.log("Supabase:", supabaseClient);

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const loginMessage = document.getElementById("loginMessage");

    // Limpiar mensajes anteriores
    emailError.textContent = "";
    passwordError.textContent = "";
    loginMessage.textContent = "";

    let valido = true;

    // Validar correo
    if (email === "") {
        emailError.textContent = "El correo es obligatorio.";
        valido = false;
    } else if (email.length > 100) {
        emailError.textContent = "El correo no puede superar los 100 caracteres.";
        valido = false;
    } else {
        const correoValido =
            email.endsWith("@duoc.cl") ||
            email.endsWith("@profesor.duoc.cl") ||
            email.endsWith("@gmail.com");

        if (!correoValido) {
            emailError.textContent =
                "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
            valido = false;
        }
    }

    // Validar contraseña
    if (password === "") {
        passwordError.textContent = "La contraseña es obligatoria.";
        valido = false;
    } else if (password.length < 4 || password.length > 10) {
        passwordError.textContent =
            "La contraseña debe tener entre 4 y 10 caracteres.";
        valido = false;
    }

    // Si hay errores, no continuar
    if (!valido) {
        return;
    }

    // Intentar iniciar sesión con Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        loginMessage.textContent = "Correo o contraseña incorrectos.";
        return;
    }

    loginMessage.textContent = "Inicio de sesión exitoso.";

    console.log("Usuario autenticado:", data.user);

    // Redirigir al inicio
    setTimeout(() => {
        window.location.href = "home.html";
    }, 1000);
});