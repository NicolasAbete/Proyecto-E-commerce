// ==================== VARIABLES Y CONSTANTES ====================
// Carrito de compras
let carrito = [];
let listaDeseos = [];

// Productos en el catálogo (simulado)
const productos = [
    { id: 1, nombre: "Smartphone Pro 2025", precio: 999, categoria: "Electrónica", imagen: "/api/placeholder/300/300", descuento: 20, precioOriginal: 1299 },
    { id: 2, nombre: "Smartwatch Premium", precio: 425, categoria: "Tecnología", imagen: "/api/placeholder/300/300", descuento: 15, precioOriginal: 499 },
    { id: 3, nombre: "Auriculares Inalámbricos", precio: 199, categoria: "Audio", imagen: "/api/placeholder/300/300", descuento: 0, precioOriginal: 199 },
    { id: 4, nombre: "Tablet Pro 11\"", precio: 525, categoria: "Tecnología", imagen: "/api/placeholder/300/300", descuento: 30, precioOriginal: 749 },
    { id: 5, nombre: "Laptop UltraSlim 15.6\"", precio: 1299, categoria: "Computación", imagen: "/api/placeholder/300/300", descuento: 0, precioOriginal: 1299 },
    { id: 6, nombre: "Cafetera Express Automática", precio: 349, categoria: "Electrodomésticos", imagen: "/api/placeholder/300/300", descuento: 0, precioOriginal: 349 },
    { id: 7, nombre: "Smart TV 55\" 4K UHD", precio: 799, categoria: "Televisores", imagen: "/api/placeholder/300/300", descuento: 0, precioOriginal: 799 },
    { id: 8, nombre: "Zapatillas Deportivas Pro", precio: 129, categoria: "Calzado", imagen: "/api/placeholder/300/300", descuento: 0, precioOriginal: 129 }
];

// Categorías disponibles
const categorias = [
    "Celulares", "Computadoras", "Ropa", "Hogar", "Autos", "Juegos",
    "Electrónica", "Tecnología", "Audio", "Computación", "Electrodomésticos",
    "Televisores", "Calzado"
];

// ==================== EJECUCIÓN CUANDO EL DOM ESTÁ CARGADO ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Documento cargado completamente");
    
    // Inicializar componentes
    inicializarEventos();
    mostrarBienvenida();
    cargarCarritoDesdeStorage();
    actualizarContadorCarrito();
    
    // Mostrar el botón Back to Top cuando se desplaza
    inicializarBackToTop();
});

// ==================== FUNCIONES DE INICIALIZACIÓN ====================
function inicializarEventos() {
    // Botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll('.btn-add-cart');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
    
    // Botones de wishlist
    const botonesWishlist = document.querySelectorAll('.wishlist-button');
    botonesWishlist.forEach(boton => {
        boton.addEventListener('click', agregarAListaDeseos);
    });
    
    // Formulario de newsletter
    const formularioNewsletter = document.querySelector('.newsletter-form');
    if (formularioNewsletter) {
        formularioNewsletter.addEventListener('submit', suscribirNewsletter);
    }
    
    // Botón de búsqueda
    const formularioBusqueda = document.querySelector('.search-form');
    if (formularioBusqueda) {
        formularioBusqueda.addEventListener('submit', buscarProductos);
    }
    
    // Botón de carrito en navbar
    const botonCarritoDesktop = document.querySelector('.navbar-nav .nav-link:has(i.fa-shopping-cart)');
    if (botonCarritoDesktop) {
        botonCarritoDesktop.addEventListener('click', mostrarCarrito);
    }
    
    // Botón de carrito en mobile nav
    const botonCarritoMobile = document.querySelector('.mobile-nav-item:has(i.fa-shopping-cart) a');
    if (botonCarritoMobile) {
        botonCarritoMobile.addEventListener('click', mostrarCarrito);
    }
    
    // Botón de cuenta en mobile nav
    const botonCuentaMobile = document.querySelector('.mobile-nav-item:has(i.fa-user) a');
    if (botonCuentaMobile) {
        botonCuentaMobile.addEventListener('click', mostrarMenuUsuario);
    }
}

function mostrarBienvenida() {
    // Comprobar si es la primera visita
    const visitaAnterior = localStorage.getItem('ultimaVisita');
    const ahora = new Date().toISOString();
    
    if (!visitaAnterior) {
        // Primera visita
        setTimeout(() => {
            alert("¡Bienvenido a FreshMarket! Tu mercado online con las mejores ofertas.");
        }, 1000);
    } else {
        console.log(`Última visita: ${new Date(visitaAnterior).toLocaleString()}`);
    }
    
    // Guardar la fecha de la visita actual
    localStorage.setItem('ultimaVisita', ahora);
}

function inicializarBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ==================== FUNCIONES DE CARRITO Y LISTA DE DESEOS ====================
function agregarAlCarrito(event) {
    event.preventDefault();
    
    // Obtener el producto desde el elemento clickeado
    const productoCard = event.target.closest('.product-card');
    const productoNombre = productoCard.querySelector('.product-title').textContent;
    const productoPrecio = parseFloat(productoCard.querySelector('.current-price').textContent.replace('$', ''));
    
    // Buscar el producto en el array de productos
    const producto = productos.find(p => p.nombre === productoNombre);
    
    if (producto) {
        // Verificar si el producto ya está en el carrito
        const index = carrito.findIndex(item => item.id === producto.id);
        
        if (index !== -1) {
            // Incrementar cantidad
            carrito[index].cantidad++;
            console.log(`Cantidad de ${productoNombre} actualizada: ${carrito[index].cantidad}`);
        } else {
            // Agregar nuevo producto
            carrito.push({
                id: producto.id,
                nombre: productoNombre,
                precio: productoPrecio,
                cantidad: 1
            });
            console.log(`Producto agregado: ${productoNombre}`);
        }
        
        // Guardar en localStorage y actualizar contador
        guardarCarritoEnStorage();
        actualizarContadorCarrito();
        
        // Mostrar mensaje
        mostrarMensaje(`¡${productoNombre} agregado al carrito!`);
    }
}

function agregarAListaDeseos(event) {
    event.preventDefault();
    
    // Obtener el producto desde el elemento clickeado
    const productoCard = event.target.closest('.product-card');
    const productoNombre = productoCard.querySelector('.product-title').textContent;
    
    // Buscar el producto en el array de productos
    const producto = productos.find(p => p.nombre === productoNombre);
    
    if (producto) {
        // Verificar si el producto ya está en la lista de deseos
        const index = listaDeseos.findIndex(item => item.id === producto.id);
        
        if (index !== -1) {
            // Remover de la lista de deseos
            listaDeseos.splice(index, 1);
            event.target.classList.remove('fas');
            event.target.classList.add('far');
            console.log(`Producto removido de lista de deseos: ${productoNombre}`);
        } else {
            // Agregar a la lista de deseos
            listaDeseos.push({
                id: producto.id,
                nombre: productoNombre
            });
            event.target.classList.remove('far');
            event.target.classList.add('fas');
            console.log(`Producto agregado a lista de deseos: ${productoNombre}`);
        }
        
        // Guardar en localStorage
        localStorage.setItem('listaDeseos', JSON.stringify(listaDeseos));
    }
}

function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    const deseosGuardados = localStorage.getItem('listaDeseos');
    
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        console.log("Carrito cargado desde localStorage:", carrito);
    }
    
    if (deseosGuardados) {
        listaDeseos = JSON.parse(deseosGuardados);
        console.log("Lista de deseos cargada desde localStorage:", listaDeseos);
        
        // Marcar los productos que ya están en la lista de deseos
        listaDeseos.forEach(item => {
            const productoCards = document.querySelectorAll('.product-card');
            productoCards.forEach(card => {
                const nombre = card.querySelector('.product-title').textContent;
                if (nombre === item.nombre) {
                    const wishlistIcon = card.querySelector('.wishlist-button i');
                    if (wishlistIcon) {
                        wishlistIcon.classList.remove('far');
                        wishlistIcon.classList.add('fas');
                    }
                }
            });
        });
    }
}

function actualizarContadorCarrito() {
    // Calcular cantidad total de productos
    const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    // Actualizar en el desktop
    const carritoIconDesktop = document.querySelector('.navbar-nav .nav-link:has(i.fa-shopping-cart)');
    
    if (carritoIconDesktop) {
        // Eliminar contador existente si hay
        const contadorExistenteDesktop = carritoIconDesktop.querySelector('.cart-count');
        if (contadorExistenteDesktop) {
            contadorExistenteDesktop.remove();
        }
        
        if (cantidadTotal > 0) {
            // Asegurar posición relativa para el contenedor del ícono
            carritoIconDesktop.style.position = 'relative';
            
            const nuevoContadorDesktop = document.createElement('span');
            nuevoContadorDesktop.className = 'cart-count';
            nuevoContadorDesktop.textContent = cantidadTotal;
            carritoIconDesktop.appendChild(nuevoContadorDesktop);
        }
    }
    
    // Actualizar en el mobile
    const carritoIconMobile = document.querySelector('.mobile-nav-item:has(i.fa-shopping-cart) a');
    
    if (carritoIconMobile) {
        // Eliminar contador existente si hay
        const contadorExistenteMobile = carritoIconMobile.querySelector('.cart-count');
        if (contadorExistenteMobile) {
            contadorExistenteMobile.remove();
        }
        
        if (cantidadTotal > 0) {
            // Asegurar posición relativa para el contenedor del ícono
            carritoIconMobile.style.position = 'relative';
            
            const nuevoContadorMobile = document.createElement('span');
            nuevoContadorMobile.className = 'cart-count';
            nuevoContadorMobile.textContent = cantidadTotal;
            carritoIconMobile.appendChild(nuevoContadorMobile);
        }
    }
}

function mostrarCarrito(event) {
    if (event) {
        event.preventDefault();
    }
    
    if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }
    
    let mensaje = "Productos en tu carrito:\n\n";
    let total = 0;
    
    // Iterar sobre los productos del carrito
    for (let i = 0; i < carrito.length; i++) {
        const item = carrito[i];
        const subtotal = item.precio * item.cantidad;
        mensaje += `${item.nombre} - $${item.precio} x ${item.cantidad} = $${subtotal.toFixed(2)}\n`;
        total += subtotal;
    }
    
    mensaje += `\nTotal: $${total.toFixed(2)}`;
    
    // Preguntar si quiere ver detalles o finalizar compra
    const respuesta = confirm(`${mensaje}\n\n¿Deseas finalizar tu compra?`);
    
    if (respuesta) {
        finalizarCompra();
    }
}

function finalizarCompra() {
    // Calcular total
    const total = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
    
    const codigoDescuento = prompt("Ingresa un código de descuento si lo tienes:");
    let descuento = 0;
    
    // Verificar código de descuento
    if (codigoDescuento) {
        if (codigoDescuento.toUpperCase() === "FRESH10") {
            descuento = total * 0.1;
            alert(`¡Código de descuento aplicado! Descuento: $${descuento.toFixed(2)}`);
        } else {
            alert("Código de descuento inválido");
        }
    }
    
    const totalFinal = total - descuento;
    
    // Confirmación final
    const confirmacion = confirm(`Total de la compra: $${totalFinal.toFixed(2)}\n¿Confirmar compra?`);
    
    if (confirmacion) {
        alert("¡Gracias por tu compra! Recibirás un correo con los detalles de tu pedido.");
        
        // Limpiar carrito
        carrito = [];
        guardarCarritoEnStorage();
        actualizarContadorCarrito();
    }
}

// ==================== FUNCIONES PARA FORMULARIOS ====================
function suscribirNewsletter(event) {
    event.preventDefault();
    
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email) {
        alert("Por favor ingresa tu correo electrónico");
        return;
    }
    
    // Validar formato de correo electrónico con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor ingresa un correo electrónico válido");
        return;
    }
    
    // Simular suscripción exitosa
    console.log(`Correo suscrito: ${email}`);
    alert(`¡Gracias por suscribirte a nuestro boletín! Recibirás nuestras ofertas en ${email}`);
    
    // Limpiar el campo
    emailInput.value = '';
}

function buscarProductos(event) {
    event.preventDefault();
    
    const busquedaInput = event.target.querySelector('.search-input');
    const terminoBusqueda = busquedaInput.value.trim().toLowerCase();
    
    if (!terminoBusqueda) {
        alert("Por favor ingresa un término de búsqueda");
        return;
    }
    
    // Filtrar productos que coincidan con la búsqueda
    const resultados = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(terminoBusqueda) || 
        producto.categoria.toLowerCase().includes(terminoBusqueda)
    );
    
    if (resultados.length === 0) {
        alert(`No se encontraron productos que coincidan con "${terminoBusqueda}"`);
    } else {
        // Mostrar los resultados en la consola
        console.log(`Resultados para "${terminoBusqueda}":`);
        resultados.forEach(producto => {
            console.log(`- ${producto.nombre} ($${producto.precio}) - ${producto.categoria}`);
        });
        
        // Mostrar los resultados en un alert
        let mensaje = `Encontramos ${resultados.length} productos para "${terminoBusqueda}":\n\n`;
        for (let i = 0; i < resultados.length; i++) {
            mensaje += `- ${resultados[i].nombre} ($${resultados[i].precio})\n`;
        }
        
        alert(mensaje);
    }
}

// ==================== FUNCIONES DE UTILIDAD ====================
function mostrarMensaje(texto, tipo = 'success') {
    // Crear elemento para el mensaje
    const mensajeElement = document.createElement('div');
    mensajeElement.className = `toast-message ${tipo}`;
    mensajeElement.textContent = texto;
    
    // Estilos para el mensaje
    mensajeElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${tipo === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    `;
    
    // Agregar al body
    document.body.appendChild(mensajeElement);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        mensajeElement.style.opacity = '0';
        mensajeElement.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            if (mensajeElement.parentNode) {
                mensajeElement.parentNode.removeChild(mensajeElement);
            }
        }, 500);
    }, 3000);
}

// la funcion mostrarMenuUsuario es simplemente para poner en practica el uso de la consola, en una pagina real no seria funcional del todo
function mostrarMenuUsuario(event) {
    if (event) {
        event.preventDefault();
    }
    
    // Opciones del menú
    const opciones = ["Iniciar sesión", "Registrarse", "Mis compras", "Salir"];
    
    // Usar prompt para simular un menú
    let mensaje = "Selecciona una opción:\n";
    for (let i = 0; i < opciones.length; i++) {
        mensaje += `${i + 1}. ${opciones[i]}\n`;
    }
    
    const seleccion = prompt(mensaje);
    
    // Procesar selección
    if (seleccion !== null) {
        const opcion = parseInt(seleccion);
        
        if (!isNaN(opcion) && opcion >= 1 && opcion <= opciones.length) {
            switch (opcion) {
                case 1:
                    iniciarSesion();
                    break;
                case 2:
                    registrarse();
                    break;
                case 3:
                    verCompras();
                    break;
                case 4:
                    alert("Sesión cerrada");
                    break;
                default:
                    alert("Opción no válida");
            }
        } else {
            alert("Por favor ingresa un número válido");
        }
    }
}

function iniciarSesion() {
    const email = prompt("Ingresa tu correo electrónico:");
    
    if (email) {
        const password = prompt("Ingresa tu contraseña:");
        
        if (password) {
            // Simular validación
            if (email === "usuario@example.com" && password === "12345") {
                alert("¡Inicio de sesión exitoso!");
                localStorage.setItem('usuarioLogueado', email);
            } else {
                alert("Credenciales incorrectas. Inténtalo de nuevo.");
            }
        }
    }
}

function registrarse() {
    const nombre = prompt("Ingresa tu nombre:");
    
    if (nombre) {
        const email = prompt("Ingresa tu correo electrónico:");
        
        if (email) {
            const password = prompt("Crea una contraseña:");
            
            if (password) {
                const confirmPassword = prompt("Confirma tu contraseña:");
                
                if (password === confirmPassword) {
                    alert(`¡Registro exitoso! Bienvenido/a ${nombre}`);
                    localStorage.setItem('usuarioLogueado', email);
                } else {
                    alert("Las contraseñas no coinciden. Inténtalo de nuevo.");
                }
            }
        }
    }
}

function verCompras() {
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    
    if (usuarioLogueado) {
        // Simulación de historial de compras
        const compras = [
            { id: "ORD-123456", fecha: "15/04/2025", total: 1525.99 },
            { id: "ORD-123123", fecha: "02/03/2025", total: 359.50 }
        ];
        
        if (compras.length > 0) {
            let mensaje = "Tu historial de compras:\n\n";
            
            for (let i = 0; i < compras.length; i++) {
                mensaje += `Orden: ${compras[i].id}\n`;
                mensaje += `Fecha: ${compras[i].fecha}\n`;
                mensaje += `Total: $${compras[i].total.toFixed(2)}\n\n`;
            }
            
            alert(mensaje);
        } else {
            alert("No tienes compras recientes");
        }
    } else {
        alert("Debes iniciar sesión para ver tus compras");
        iniciarSesion();
    }
}

