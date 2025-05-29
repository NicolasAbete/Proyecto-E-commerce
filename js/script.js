// ==================== VARIABLES Y CONSTANTES ====================
// Carrito de compras
let carrito = [];
let listaDeseos = [];

// Productos en el catálogo (simulado)
const productos = [
    { id: 1, nombre: "IPhone 16 Pro Max", precio: 999, categoria: "Electrónica", imagen: "./img/iphone16.webp", descuento: 20, precioOriginal: 1299 },
    { id: 2, nombre: "Apple Watch Series 10", precio: 425, categoria: "Tecnología", imagen: "./img/applewatch.webp", descuento: 15, precioOriginal: 499 },
    { id: 3, nombre: "Auriculares Logitech G733", precio: 199, categoria: "Audio", imagen: "./img/g733.webp", descuento: 0, precioOriginal: 199 },
    { id: 4, nombre: "Volante De Carreras Y Pedales Logitech G G923", precio: 525, categoria: "Tecnología", imagen: "./img/g923.webp", descuento: 30, precioOriginal: 749 },
    { id: 5, nombre: "Notebook Gamer Msi Katana 17 B13vek I7 16gb, 512gb Rtx 4050", precio: 2299, categoria: "Computación", imagen: "./img/laptopGamer.webp", descuento: 0, precioOriginal: 2299 },
    { id: 6, nombre: "Cafetera Express Automática", precio: 349, categoria: "Electrodomésticos", imagen: "./img/cafetera-automatica.webp", descuento: 0, precioOriginal: 349 },
    { id: 7, nombre: "Tv Led LG 70 Uhd Smart 4k", precio: 1799, categoria: "Televisores", imagen: "./img/tv.webp", descuento: 0, precioOriginal: 1799 },
    { id: 8, nombre: "Zapatillas Deportivas adidas", precio: 129, categoria: "Calzado", imagen: "./img/zapatillas.webp", descuento: 0, precioOriginal: 129 }
];

// Categorías disponibles
const categorias = [
    "Celulares", "Computadoras", "Ropa", "Hogar", "Autos", "Juegos",
    "Electrónica", "Tecnología", "Audio", "Computación", "Electrodomésticos",
    "Televisores", "Calzado"
];

// Variables para el carrito modal
let cartModal;
let cartModalOverlay;
let cartItemsContainer;
let emptyCartMessage;
let cartSubtotal;
let cartFooter;

// ==================== EJECUCIÓN CUANDO EL DOM ESTÁ CARGADO ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Documento cargado completamente");
    
    // Inicializar componentes
    cargarCarritoDesdeStorage();
    inicializarEventos();
    mostrarBienvenida();
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
    
    // Inicializar el carrito modal
    inicializarCarritoModal();
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

// ==================== FUNCIONES LISTA DE DESEOS ====================
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

// ==================== FUNCIONES DEL CARRITO DE COMPRAS ====================

// Función para cargar el carrito desde el localStorage
function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        console.log("Carrito cargado desde localStorage:", carrito);
    }
    
    const listaDeseosGuardada = localStorage.getItem('listaDeseos');
    if (listaDeseosGuardada) {
        listaDeseos = JSON.parse(listaDeseosGuardada);
        console.log("Lista de deseos cargada desde localStorage:", listaDeseos);
    }
}

// Función para guardar el carrito en localStorage
function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
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

// Función para agregar un producto al carrito
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
        
        // Actualizar el carrito modal si está abierto
        if (cartModalOverlay && cartModalOverlay.style.display === 'block') {
            actualizarContenidoCarrito();
        }
        
        // Mostrar mensaje
        mostrarMensaje(`¡${productoNombre} agregado al carrito!`);
    }
}

// Función para inicializar el carrito modal
function inicializarCarritoModal() {
    // Obtener referencias a los elementos del DOM
    cartModalOverlay = document.getElementById('cartModal');
    
    if (!cartModalOverlay) {
        console.error("No se encontró el elemento #cartModal");
        return;
    }
    
    cartModal = cartModalOverlay.querySelector('.cart-modal');
    cartItemsContainer = document.getElementById('cartItems');
    emptyCartMessage = document.getElementById('emptyCartMessage');
    cartSubtotal = document.getElementById('cartSubtotal');
    cartFooter = document.getElementById('cartFooter');
    
    if (!cartModal || !cartItemsContainer || !emptyCartMessage || !cartSubtotal || !cartFooter) {
        console.error("No se encontraron todos los elementos necesarios para el carrito");
        return;
    }
    
    // Botones de control del carrito
    const closeCartBtn = cartModalOverlay.querySelector('.cart-close-btn');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const startShoppingBtn = cartModalOverlay.querySelector('.btn-start-shopping');
    
    // Eventos para abrir/cerrar el carrito
    const carritoBtn = document.getElementById('carrito-btn');
    if (carritoBtn) {
        carritoBtn.addEventListener('click', mostrarCarrito);
    }
    
    // Evento de clic en el botón móvil del carrito (si existe)
    const mobileCartBtn = document.querySelector('.mobile-nav-item:has(i.fa-shopping-cart) a');
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', mostrarCarrito);
    }
    
    // Eventos para los botones del carrito
    if (closeCartBtn) closeCartBtn.addEventListener('click', cerrarCarrito);
    if (clearCartBtn) clearCartBtn.addEventListener('click', vaciarCarrito);
    if (checkoutBtn) checkoutBtn.addEventListener('click', procesarCompra);
    if (startShoppingBtn) startShoppingBtn.addEventListener('click', cerrarCarrito);
    
    // Cerrar al hacer clic fuera del modal (en el overlay)
    cartModalOverlay.addEventListener('click', (e) => {
        if (e.target === cartModalOverlay) {
            cerrarCarrito();
        }
    });
    
    console.log("Carrito modal inicializado correctamente");
}

// Función para mostrar el carrito
function mostrarCarrito(e) {
    if (e) e.preventDefault();
    
    if (!cartModalOverlay) {
        console.error("cartModalOverlay no está disponible");
        return;
    }
    
    // Mostrar el overlay del carrito
    cartModalOverlay.style.display = 'block';
    
    // Pequeño timeout para permitir la transición CSS
    setTimeout(() => {
        cartModal.classList.add('active');
    }, 10);
    
    // Actualizar el contenido del carrito
    actualizarContenidoCarrito();
}

// Función para cerrar el carrito
function cerrarCarrito() {
    if (!cartModal || !cartModalOverlay) {
        console.error("cartModal o cartModalOverlay no están disponibles");
        return;
    }
    
    cartModal.classList.remove('active');
    
    // Esperar a que termine la animación para ocultar el overlay
    setTimeout(() => {
        cartModalOverlay.style.display = 'none';
    }, 300);
}

// Función para actualizar el contenido del carrito
function actualizarContenidoCarrito() {
    if (!cartItemsContainer || !emptyCartMessage || !cartFooter) {
        console.error("Elementos del carrito no disponibles");
        return;
    }
    
    // Limpiar el contenedor de items
    cartItemsContainer.innerHTML = '';
    
    // Verificar si el carrito está vacío
    if (carrito.length === 0) {
        emptyCartMessage.style.display = 'flex';
        cartFooter.style.display = 'none';
        return;
    }
    
    // Ocultar mensaje de carrito vacío y mostrar el footer
    emptyCartMessage.style.display = 'none';
    cartFooter.style.display = 'block';
    
    // Calcular subtotal
    let subtotal = 0;
    
    // Generar HTML para cada producto en el carrito
    carrito.forEach(item => {
        // Buscar información adicional del producto
        const productoInfo = productos.find(p => p.id === item.id);
        const itemSubtotal = item.precio * item.cantidad;
        subtotal += itemSubtotal;
        
        // Crear elemento del item
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${productoInfo ? productoInfo.imagen : '/api/placeholder/70/70'}" alt="${item.nombre}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-price">$${item.precio.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.cantidad}" min="1" data-id="${item.id}" readonly>
                        <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">Eliminar</button>
                </div>
            </div>
        `;
        
        // Agregar el item al contenedor
        cartItemsContainer.appendChild(itemElement);
        
        // Configurar eventos para los botones de control de cantidad
        const decreaseBtn = itemElement.querySelector('.decrease-btn');
        const increaseBtn = itemElement.querySelector('.increase-btn');
        const removeBtn = itemElement.querySelector('.cart-item-remove');
        
        decreaseBtn.addEventListener('click', () => disminuirCantidad(item.id));
        increaseBtn.addEventListener('click', () => aumentarCantidad(item.id));
        removeBtn.addEventListener('click', () => eliminarDelCarrito(item.id));
    });
    
    // Actualizar el subtotal en el footer
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
}

// Función para aumentar la cantidad de un producto
function aumentarCantidad(id) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        carrito[index].cantidad++;
        guardarCarritoEnStorage();
        actualizarContadorCarrito();
        actualizarContenidoCarrito();
    }
}

// Función para disminuir la cantidad de un producto
function disminuirCantidad(id) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad--;
        } else {
            eliminarDelCarrito(id);
            return;
        }
        guardarCarritoEnStorage();
        actualizarContadorCarrito();
        actualizarContenidoCarrito();
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        const productoEliminado = carrito[index].nombre;
        carrito.splice(index, 1);
        guardarCarritoEnStorage();
        actualizarContadorCarrito();
        actualizarContenidoCarrito();
        mostrarMensaje(`${productoEliminado} eliminado del carrito`);
    }
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
    if (carrito.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
        carrito = [];
        guardarCarritoEnStorage();
        actualizarContadorCarrito();
        actualizarContenidoCarrito();
        mostrarMensaje('Carrito vaciado correctamente');
    }
}

// Función para procesar la compra
function procesarCompra() {
    if (carrito.length === 0) return;
    
    // Aquí iría la lógica para procesar la compra
    // Por ahora, solo mostramos un mensaje
    alert('¡Gracias por tu compra! Serás redirigido al proceso de pago.');
    
    // Opcional: Vaciar el carrito después de la compra
    carrito = [];
    guardarCarritoEnStorage();
    actualizarContadorCarrito();
    cerrarCarrito();
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

// Funcion para manejar el menu de usuario (placeholder)
function mostrarMenuUsuario(event) {
    if (event) event.preventDefault();
    alert("Funcionalidad de cuenta de usuario en desarrollo");
}

// Funciones como iniciarSesion, registrarse, verCompras
function iniciarSesion() {
    alert("Funcionalidad de inicio de sesión en desarrollo");
}

function registrarse() {
    alert("Funcionalidad de registro en desarrollo");
}

function verCompras() {
    alert("Funcionalidad de historial de compras en desarrollo");
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
        background-color: ${tipo === 'success' ? '#4CAF50' : '#F44336'};
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        opacity: 1;
        transition: opacity 0.5s ease;
    `;
    
    // Agregar al body
    document.body.appendChild(mensajeElement);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        mensajeElement.style.opacity = '0';
        
        setTimeout(() => {
            if (mensajeElement.parentNode) {
                mensajeElement.parentNode.removeChild(mensajeElement);
            }
        }, 500);
    }, 3000);
}