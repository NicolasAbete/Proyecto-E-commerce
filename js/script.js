// ==================== VARIABLES Y CONSTANTES ====================
// Carrito de compras
let carrito = [];
let listaDeseos = [];

// Productos en el catálogo (se cargarán desde JSON)
let productos = [];



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

// ==================== FUNCIÓN PARA CARGAR PRODUCTOS DESDE JSON ====================
async function cargarProductosDesdeJSON() {
    try {
        const response = await fetch('./json/productos.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const productosData = await response.json();
        productos = productosData;
        console.log("Productos cargados exitosamente:", productos.length);
        
        // Después de cargar los productos, generar el HTML si es necesario
        generarProductosHTML();
        
    } catch (error) {
        console.error("Error al cargar productos:", error);
        // Fallback: usar productos por defecto si falla la carga
        usarProductosPorDefecto();
    }
}

// Función fallback con todos los productos del HTML
function usarProductosPorDefecto() {
    productos = [
        { id: 1, nombre: "IPhone 16 Pro Max", precio: 999, categoria: "Electrónica", imagen: "./img/iphone16.webp", descuento: 20, precioOriginal: 1299 },
        { id: 2, nombre: "Apple Watch Series 10", precio: 425, categoria: "Tecnología", imagen: "./img/applewatch.webp", descuento: 15, precioOriginal: 499 },
        { id: 3, nombre: "Auriculares Logitech G733", precio: 199, categoria: "Audio", imagen: "./img/g733.webp" },
        { id: 4, nombre: "Volante De Carreras Y Pedales Logitech G G923", precio: 525, categoria: "Tecnología", imagen: "./img/g923.webp", descuento: 30, precioOriginal: 749 },
        { id: 5, nombre: "Notebook Gamer Msi Katana 17 B13vek I7 16gb, 512gb Rtx 4050", precio: 2299, categoria: "Computación", imagen: "./img/laptopGamer.webp" },
        { id: 6, nombre: "Cafetera Express Automática", precio: 349, categoria: "Electrodomésticos", imagen: "./img/cafetera-automatica.webp" },
        { id: 7, nombre: "Tv Led LG 70 Uhd Smart 4k", precio: 1799, categoria: "Televisores", imagen: "./img/tv.webp" },
        { id: 8, nombre: "Zapatillas Deportivas adidas", precio: 129, categoria: "Calzado", imagen: "./img/zapatillas.webp" }
    ];
    console.log("Usando productos por defecto");
    generarProductosHTML();
}
// Función para generar HTML dinámicamente (opcional)
function generarProductosHTML() {
    // Esta función sería útil si quieres generar las tarjetas de productos dinámicamente
    // Por ahora, los productos ya están en tu HTML, así que no es necesaria
    console.log("Productos listos para usar");
}


// ==================== EJECUCIÓN CUANDO EL DOM ESTÁ CARGADO ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Documento cargado completamente");
    
    // Cargar productos desde JSON primero
    await cargarProductosDesdeJSON();
    
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
    inicializarCheckoutModal();
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
            // Agregar nuevo producto usando el precio del objeto producto
            carrito.push({
                id: producto.id,
                nombre: productoNombre,
                precio: producto.precio, // Usar precio del objeto producto, no del DOM
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
    } else {
        console.error('Producto no encontrado en el array de productos');
        mostrarMensaje('Error al agregar el producto', 'error');
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
    
    // Cerrar el carrito y abrir el checkout
    cerrarCarrito();
    setTimeout(() => {
        mostrarCheckout();
    }, 300);
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

// Variables para el checkout modal
let checkoutModal;
let checkoutModalOverlay;

// Función para inicializar el checkout modal (agregar después de inicializarCarritoModal)
function inicializarCheckoutModal() {
    checkoutModalOverlay = document.getElementById('checkoutModal');
    
    if (!checkoutModalOverlay) {
        console.error("No se encontró el elemento #checkoutModal");
        return;
    }
    
    checkoutModal = checkoutModalOverlay.querySelector('.checkout-modal');
    
    // Botones de control del checkout
    const closeCheckoutBtn = checkoutModalOverlay.querySelector('.checkout-close-btn');
    const backToCartBtn = document.getElementById('backToCartBtn');
    const confirmOrderBtn = document.getElementById('confirmOrderBtn');
    const checkoutForm = document.getElementById('checkoutForm');
    
    // Eventos para cerrar el modal
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', cerrarCheckout);
    if (backToCartBtn) backToCartBtn.addEventListener('click', volverAlCarrito);
    if (confirmOrderBtn) confirmOrderBtn.addEventListener('click', confirmarPedido);
    
    // Cerrar al hacer clic fuera del modal
    checkoutModalOverlay.addEventListener('click', (e) => {
        if (e.target === checkoutModalOverlay) {
            cerrarCheckout();
        }
    });
    
    // Manejar cambios en métodos de pago
    const paymentMethods = document.querySelectorAll('input[name="metodoPago"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', manejarCambioMetodoPago);
    });
    
    // Formatear campos de tarjeta
    const numeroTarjeta = document.getElementById('numeroTarjeta');
    const fechaVencimiento = document.getElementById('fechaVencimiento');
    const cvv = document.getElementById('cvv');
    
    if (numeroTarjeta) {
        numeroTarjeta.addEventListener('input', formatearNumeroTarjeta);
    }
    
    if (fechaVencimiento) {
        fechaVencimiento.addEventListener('input', formatearFechaVencimiento);
    }
    
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    console.log("Checkout modal inicializado correctamente");
}


// Función para mostrar el checkout
function mostrarCheckout() {
    if (!checkoutModalOverlay) {
        console.error("checkoutModalOverlay no está disponible");
        return;
    }
    
    // Mostrar el overlay del checkout
    checkoutModalOverlay.style.display = 'block';
    
    // Pequeño timeout para permitir la transición CSS
    setTimeout(() => {
        checkoutModal.classList.add('active');
    }, 10);
    
    // Actualizar el contenido del checkout
    actualizarResumenPedido();
}

// Función para cerrar el checkout
function cerrarCheckout() {
    if (!checkoutModal || !checkoutModalOverlay) {
        console.error("checkoutModal o checkoutModalOverlay no están disponibles");
        return;
    }
    
    checkoutModal.classList.remove('active');
    
    // Esperar a que termine la animación para ocultar el overlay
    setTimeout(() => {
        checkoutModalOverlay.style.display = 'none';
    }, 300);
}

// Función para volver al carrito
function volverAlCarrito() {
    cerrarCheckout();
    setTimeout(() => {
        mostrarCarrito();
    }, 300);
}

// Función para actualizar el resumen del pedido
function actualizarResumenPedido() {
    const orderSummary = document.getElementById('orderSummary');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!orderSummary || !checkoutSubtotal || !checkoutTotal) {
        console.error("Elementos del resumen no disponibles");
        return;
    }
    
    // Limpiar el resumen
    orderSummary.innerHTML = '';
    
    let subtotal = 0;
    
    // Generar items del pedido
    carrito.forEach(item => {
        const productoInfo = productos.find(p => p.id === item.id);
        const itemSubtotal = item.precio * item.cantidad;
        subtotal += itemSubtotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-info">
                <div class="order-item-name">${item.nombre}</div>
                <div class="order-item-quantity">Cantidad: ${item.cantidad}</div>
            </div>
            <div class="order-item-price">$${itemSubtotal.toFixed(2)}</div>
        `;
        
        orderSummary.appendChild(orderItem);
    });
    
    // Actualizar totales
    checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    checkoutTotal.textContent = `$${subtotal.toFixed(2)}`;
}

// Función para manejar cambio de método de pago
function manejarCambioMetodoPago(event) {
    const cardDetails = document.getElementById('cardDetails');
    const numeroTarjeta = document.getElementById('numeroTarjeta');
    const fechaVencimiento = document.getElementById('fechaVencimiento');
    const cvv = document.getElementById('cvv');
    const nombreTarjeta = document.getElementById('nombreTarjeta');
    
    if (event.target.value === 'tarjeta') {
        cardDetails.classList.remove('hidden');
        cardDetails.style.display = 'block';
        // Hacer campos requeridos
        numeroTarjeta.required = true;
        fechaVencimiento.required = true;
        cvv.required = true;
        nombreTarjeta.required = true;
    } else {
        cardDetails.classList.add('hidden');
        cardDetails.style.display = 'none';
        // Remover campos requeridos
        numeroTarjeta.required = false;
        fechaVencimiento.required = false;
        cvv.required = false;
        nombreTarjeta.required = false;
    }
}

// Función para formatear número de tarjeta
function formatearNumeroTarjeta(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ');
    if (formattedValue.endsWith(' ')) {
        formattedValue = formattedValue.slice(0, -1);
    }
    e.target.value = formattedValue;
}

// Función para formatear fecha de vencimiento
function formatearFechaVencimiento(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

// Función para confirmar el pedido


function confirmarPedido(event) {
    event.preventDefault();
    
    const form = document.getElementById('checkoutForm');
    
    // Validar formulario
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Recopilar datos del formulario
    const formData = new FormData(form);
    const datosCompra = {};
    
    for (let [key, value] of formData.entries()) {
        datosCompra[key] = value;
    }
    
    // Estructurar datos para el email service
    const orderDataForEmail = {
        customer: {
            name: datosCompra.nombre || datosCompra.clientName || "Cliente",
            email: datosCompra.email || "cliente@email.com"
        },
        items: carrito.map(item => ({
            id: item.id,
            name: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio
        })),
        total: carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0),
        fecha: new Date().toISOString()
    };
    
    console.log('Datos de la compra:', orderDataForEmail);
    
    // Llamar a onPaymentSuccess con los datos estructurados
    onPaymentSuccess(orderDataForEmail);
    
    // Limpiar carrito después de la compra exitosa
    carrito = [];
    guardarCarritoEnStorage();
    actualizarContadorCarrito();
    
    // Cerrar modal
    cerrarCheckout();
    
    // Guardar en historial
    const comprasAnteriores = JSON.parse(localStorage.getItem('historialCompras') || '[]');
    comprasAnteriores.push(orderDataForEmail);
    localStorage.setItem('historialCompras', JSON.stringify(comprasAnteriores));
}

function onPaymentComplete() {
    const orderData = {
    customer: {
      name: "Juan Pérez",  // Del formulario
      email: "juan@email.com"  // Del formulario
    },
    items: [
        { name: "Producto 1", quantity: 2, price: 50 }
    ],
    total: 100
    };

  // Esto mostrará la página de éxito y enviará el email
    onPaymentSuccess(orderData);
}

// Cerrar al hacer clic en el overlay
document.querySelector('.checkout-success').addEventListener('click', function(e) {
    if (e.target === this) {
        this.remove();
    }
});

// Cerrar con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.checkout-success');
        if (modal) modal.remove();
    }
});


// ==================== CONFIGURACIÓN WHATSAPP ====================
// Número de WhatsApp de la tienda (con código de país, sin + ni espacios)
// Declaramos como const y la asignamos inmediatamente
const WHATSAPP_CONFIG = {
    number: "5492604206747", // Tu número actual
    businessName: "FRESHMARKET"
};

// ==================== FUNCIÓN PRINCIPAL PARA MANEJAR PEDIDO EXITOSO ====================
function onPaymentSuccess(orderData) {
    console.log('Procesando pedido exitoso:', orderData);
    
    // Validar que tenemos los datos necesarios
    if (!orderData || !orderData.customer || !orderData.items) {
        console.error('Datos del pedido incompletos:', orderData);
        return;
    }
    
    // Mostrar notificación de éxito primero
    mostrarNotificacionExito(orderData);
    
    // Después de 2 segundos, mostrar opción de WhatsApp
    setTimeout(() => {
        mostrarOpcionWhatsApp(orderData);
    }, 2000);
}

// ==================== FUNCIÓN PARA MOSTRAR NOTIFICACIÓN DE ÉXITO ====================
function mostrarNotificacionExito(orderData) {
    // Remover notificación existente si hay alguna
    const existingNotification = document.querySelector('.success-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Crear modal de éxito
    const successModal = document.createElement('div');
    successModal.className = 'success-notification';
    successModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeInSuccess 0.3s ease;
    `;
    
    successModal.innerHTML = `
        <div class="success-content" style="
            background: white;
            padding: 40px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            animation: slideInSuccess 0.4s ease;
        ">
            <div style="color: #4CAF50; font-size: 80px; margin-bottom: 20px;">✅</div>
            <h2 style="color: #333; margin-bottom: 15px; font-size: 28px;">¡Pedido Exitoso!</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left;">
                <h4 style="color: #333; margin-bottom: 15px; text-align: center;">Resumen del Pedido</h4>
                <p><strong>Cliente:</strong> ${orderData.customer.name || 'N/A'}</p>
                <p><strong>Email:</strong> ${orderData.customer.email || 'N/A'}</p>
                <p><strong>Total:</strong> $${(orderData.total || 0).toFixed(2)}</p>
                
                <div style="margin-top: 15px;">
                    <strong>Productos:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        ${orderData.items.map(item => 
                            `<li>${item.name || 'Producto'} (${item.cantidad || 1}x) - $${((item.precio || 0) * (item.cantidad || 1)).toFixed(2)}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
            
            <p style="color: #666; margin-bottom: 25px; font-size: 16px;">
                Tu pedido ha sido procesado correctamente.<br>
                Te contactaremos pronto para confirmar los detalles.
            </p>
            
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button onclick="cerrarNotificacionExito()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s;
                " onmouseover="this.style.background='#545b62'" onmouseout="this.style.background='#6c757d'">
                    Continuar Comprando
                </button>
            </div>
        </div>
    `;
    
    // Agregar estilos de animación si no existen
    if (!document.querySelector('#success-styles')) {
        const styles = document.createElement('style');
        styles.id = 'success-styles';
        styles.textContent = `
            @keyframes fadeInSuccess {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideInSuccess {
                from { transform: translateY(-50px) scale(0.9); opacity: 0; }
                to { transform: translateY(0) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(successModal);
}

// ==================== FUNCIÓN PARA CERRAR NOTIFICACIÓN DE ÉXITO ====================
function cerrarNotificacionExito() {
    const notification = document.querySelector('.success-notification');
    if (notification) {
        notification.style.animation = 'fadeInSuccess 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// ==================== FUNCIÓN PARA MOSTRAR OPCIÓN DE WHATSAPP ====================
function mostrarOpcionWhatsApp(orderData) {
    // Remover modal existente si hay alguno
    const existingModal = document.querySelector('.whatsapp-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Crear modal de WhatsApp
    const whatsappModal = document.createElement('div');
    whatsappModal.className = 'whatsapp-modal';
    whatsappModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
        animation: fadeIn 0.3s ease;
    `;
    
    whatsappModal.innerHTML = `
        <div class="whatsapp-content" style="
            background: white;
            padding: 35px;
            border-radius: 15px;
            max-width: 550px;
            width: 90%;
            text-align: center;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            animation: slideInWhatsApp 0.4s ease;
        ">
            <div style="color: #25D366; font-size: 70px; margin-bottom: 20px;">📱</div>
            <h2 style="color: #333; margin-bottom: 15px; font-size: 26px;">¿Confirmar por WhatsApp?</h2>
            
            <p style="color: #666; margin-bottom: 25px; font-size: 16px; line-height: 1.5;">
                Te ayudamos a confirmar tu pedido enviándolo directamente a nuestro WhatsApp.<br>
                <strong>¡Es rápido y seguro!</strong>
            </p>
            
            <div style="background: #f0f8f0; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #25D366;">
                <h4 style="color: #25D366; margin-bottom: 10px;">✅ Ventajas:</h4>
                <ul style="text-align: left; color: #555; line-height: 1.6; margin: 0; padding-left: 20px;">
                    <li>Confirmación inmediata del pedido</li>
                    <li>Seguimiento en tiempo real</li>
                    <li>Resolución rápida de dudas</li>
                    <li>Atención personalizada</li>
                </ul>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 25px;">
                <button onclick="enviarPedidoPorWhatsApp()" class="btn-whatsapp-send" style="
                    background: linear-gradient(135deg, #25D366, #128C7E);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 30px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(37, 211, 102, 0.4)'" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(37, 211, 102, 0.3)'">
                    <span style="font-size: 20px;">📲</span>
                    Sí, enviar por WhatsApp
                </button>
                
                <button onclick="cerrarModalWhatsApp()" style="
                    background: transparent;
                    color: #6c757d;
                    border: 2px solid #dee2e6;
                    padding: 15px 30px;
                    border-radius: 30px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s;
                " onmouseover="this.style.borderColor='#adb5bd'; this.style.color='#495057'" 
                   onmouseout="this.style.borderColor='#dee2e6'; this.style.color='#6c757d'">
                    Tal vez después
                </button>
            </div>
            
            <p style="color: #888; font-size: 14px; margin-top: 20px; font-style: italic;">
                No te preocupes, tu pedido ya está guardado 😊
            </p>
        </div>
    `;
    
    // Guardar datos del pedido para uso posterior
    window.currentOrderData = orderData;
    
    // Agregar estilos específicos para WhatsApp modal si no existen
    if (!document.querySelector('#whatsapp-styles')) {
        const whatsappStyles = document.createElement('style');
        whatsappStyles.id = 'whatsapp-styles';
        whatsappStyles.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideInWhatsApp {
                from { transform: translateY(-30px) scale(0.95); opacity: 0; }
                to { transform: translateY(0) scale(1); opacity: 1; }
            }
            
            .btn-whatsapp-send:active {
                transform: translateY(0) scale(0.98) !important;
            }
        `;
        document.head.appendChild(whatsappStyles);
    }
    
    document.body.appendChild(whatsappModal);
    
    // Cerrar con clic fuera del modal
    whatsappModal.addEventListener('click', (e) => {
        if (e.target === whatsappModal) {
            cerrarModalWhatsApp();
        }
    });
    
    // Cerrar con tecla Escape
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            cerrarModalWhatsApp();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// ==================== FUNCIÓN PARA CERRAR MODAL DE WHATSAPP ====================
function cerrarModalWhatsApp() {
    const modal = document.querySelector('.whatsapp-modal');
    if (modal) {
        modal.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// ==================== FUNCIÓN PARA ENVIAR PEDIDO POR WHATSAPP ====================
function enviarPedidoPorWhatsApp() {
    console.log('Iniciando envío por WhatsApp...');
    
    // Obtener datos del pedido
    const orderData = window.currentOrderData;
    
    if (!orderData) {
        console.error('No hay datos del pedido disponibles');
        alert('Error: No se pudieron recuperar los datos del pedido');
        return;
    }
    
    try {
        // Crear mensaje estructurado para WhatsApp
        let mensaje = `🛒 *NUEVO PEDIDO - ${WHATSAPP_CONFIG.businessName}*\n\n`;
        
        // Información del cliente
        mensaje += `👤 *DATOS DEL CLIENTE:*\n`;
        mensaje += `• Nombre: ${orderData.customer.name || 'No especificado'}\n`;
        mensaje += `• Email: ${orderData.customer.email || 'No especificado'}\n`;
        
        // Obtener datos adicionales del formulario si están disponibles
        const direccion = document.getElementById('direccion');
        const telefono = document.getElementById('telefono');
        const ciudad = document.getElementById('ciudad');
        
        if (telefono && telefono.value) {
            mensaje += `• Teléfono: ${telefono.value}\n`;
        }
        if (direccion && direccion.value) {
            mensaje += `• Dirección: ${direccion.value}\n`;
        }
        if (ciudad && ciudad.value) {
            mensaje += `• Ciudad: ${ciudad.value}\n`;
        }
        
        mensaje += `\n📦 *PRODUCTOS PEDIDOS:*\n`;
        
        // Lista detallada de productos
        if (orderData.items && orderData.items.length > 0) {
            orderData.items.forEach((item, index) => {
                mensaje += `\n${index + 1}. *${item.name || 'Producto'}*\n`;
                mensaje += `   • Cantidad: ${item.cantidad || 1}\n`;
                mensaje += `   • Precio unitario: $${(item.precio || 0).toFixed(2)}\n`;
                mensaje += `   • Subtotal: $${((item.precio || 0) * (item.cantidad || 1)).toFixed(2)}`;
            });
        }
        
        mensaje += `\n\n💰 *RESUMEN FINAL:*\n`;
        mensaje += `• Subtotal: $${(orderData.total || 0).toFixed(2)}\n`;
        mensaje += `• *TOTAL: $${(orderData.total || 0).toFixed(2)}*\n`;
        
        // Método de pago si está disponible
        const metodoPago = document.querySelector('input[name="metodoPago"]:checked');
        if (metodoPago) {
            const metodos = {
                'tarjeta': 'Tarjeta de crédito/débito 💳',
                'efectivo': 'Efectivo 💵',
                'transferencia': 'Transferencia bancaria 🏦'
            };
            mensaje += `• Método de pago: ${metodos[metodoPago.value] || metodoPago.value}\n`;
        }
        
        mensaje += `\n⏰ *Fecha del pedido:* ${new Date().toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}\n`;
        
        mensaje += `\n✅ *Pedido listo para confirmar*\n`;
        mensaje += `Por favor confirme la disponibilidad y tiempo de entrega.`;
        
        // Codificar mensaje para URL
        const mensajeCodificado = encodeURIComponent(mensaje);
        
        // Crear URL de WhatsApp
        const urlWhatsApp = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${mensajeCodificado}`;
        
        console.log('URL de WhatsApp generada:', urlWhatsApp);
        
        // Mostrar mensaje de confirmación antes de abrir WhatsApp
        mostrarMensajeEnvio();
        
        // Abrir WhatsApp después de un breve delay
        setTimeout(() => {
            window.open(urlWhatsApp, '_blank');
            cerrarModalWhatsApp();
        }, 1500);
        
        console.log('Mensaje enviado a WhatsApp:', mensaje);
        
    } catch (error) {
        console.error('Error al enviar por WhatsApp:', error);
        alert('Error al procesar el pedido. Por favor, inténtalo de nuevo.');
    }
}

// ==================== FUNCIÓN PARA MOSTRAR MENSAJE DE ENVÍO ====================
function mostrarMensajeEnvio() {
    // Remover mensaje existente si hay alguno
    const existingMessage = document.querySelector('.mensaje-envio');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Crear mensaje de confirmación de envío
    const mensajeEnvio = document.createElement('div');
    mensajeEnvio.className = 'mensaje-envio';
    mensajeEnvio.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #25D366, #128C7E);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10002;
        box-shadow: 0 5px 20px rgba(37, 211, 102, 0.4);
        animation: slideInRight 0.5s ease;
        max-width: 300px;
    `;
    
    mensajeEnvio.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">📱</span>
            <div>
                <div style="font-weight: bold; margin-bottom: 5px;">¡Abriendo WhatsApp!</div>
                <div style="font-size: 14px; opacity: 0.9;">Tu pedido se está enviando...</div>
            </div>
        </div>
    `;
    
    // Agregar animación si no existe
    if (!document.querySelector('#slide-animation')) {
        const animationStyle = document.createElement('style');
        animationStyle.id = 'slide-animation';
        animationStyle.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(animationStyle);
    }
    
    document.body.appendChild(mensajeEnvio);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        if (mensajeEnvio && mensajeEnvio.parentNode) {
            mensajeEnvio.style.animation = 'slideInRight 0.5s ease reverse';
            setTimeout(() => {
                if (mensajeEnvio.parentNode) {
                    mensajeEnvio.remove();
                }
            }, 500);
        }
    }, 4000);
}

// ==================== FUNCIONES DE UTILIDAD ADICIONALES ====================

// Función para contacto directo por WhatsApp (para otros botones)
function contactarPorWhatsApp(mensaje = "¡Hola! Me interesa conocer más sobre sus productos en FreshMarket.") {
    try {
        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWhatsApp = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${mensajeCodificado}`;
        window.open(urlWhatsApp, '_blank');
    } catch (error) {
        console.error('Error al contactar por WhatsApp:', error);
        alert('Error al abrir WhatsApp. Verifica tu conexión e inténtalo de nuevo.');
    }
}

// Función para crear botón flotante de WhatsApp (opcional)
function crearBotonFlotanteWhatsApp() {
    // Verificar si ya existe
    if (document.getElementById('whatsapp-float')) {
        return;
    }
    
    const botonFlotante = document.createElement('div');
    botonFlotante.id = 'whatsapp-float';
    botonFlotante.innerHTML = `
        <a href="#" onclick="contactarPorWhatsApp(); return false;" style="
            position: fixed;
            bottom: 25px;
            right: 25px;
            background: linear-gradient(135deg, #25D366, #128C7E);
            color: white;
            border-radius: 50px;
            padding: 15px;
            text-decoration: none;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
        " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            <span style="font-size: 28px;">💬</span>
            <span style="font-weight: bold;">Chat</span>
        </a>
    `;
    
    // Agregar animación de pulso si no existe
    if (!document.querySelector('#pulse-style')) {
        const pulseStyle = document.createElement('style');
        pulseStyle.id = 'pulse-style';
        pulseStyle.textContent = `
            @keyframes pulse {
                0% { box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); }
                50% { box-shadow: 0 4px 25px rgba(37, 211, 102, 0.6); }
                100% { box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4); }
            }
        `;
        document.head.appendChild(pulseStyle);
    }
    
    document.body.appendChild(botonFlotante);
}

// ==================== INICIALIZACIÓN ====================
// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('WhatsApp integration cargada correctamente');
    console.log('Configuración WhatsApp:', WHATSAPP_CONFIG);
    
    // Crear botón flotante (opcional - descomenta la siguiente línea si lo quieres)
    // crearBotonFlotanteWhatsApp();
});

// Asegurar que las funciones estén disponibles globalmente
window.onPaymentSuccess = onPaymentSuccess;
window.enviarPedidoPorWhatsApp = enviarPedidoPorWhatsApp;
window.cerrarModalWhatsApp = cerrarModalWhatsApp;
window.cerrarNotificacionExito = cerrarNotificacionExito;
window.contactarPorWhatsApp = contactarPorWhatsApp;
window.WHATSAPP_CONFIG = WHATSAPP_CONFIG;

// Función de prueba para verificar que todo funciona
function testWhatsAppIntegration() {
    console.log('Probando integración de WhatsApp...');
    console.log('Configuración disponible:', WHATSAPP_CONFIG);
    
    // Datos de prueba
    const testOrderData = {
        customer: {
            name: "Juan Pérez",
            email: "juan@example.com"
        },
        items: [
            {
                name: "Producto de prueba",
                cantidad: 2,
                precio: 15.50
            }
        ],
        total: 31.00
    };
    
    onPaymentSuccess(testOrderData);
}

// Hacer disponible la función de prueba globalmente
window.testWhatsAppIntegration = testWhatsAppIntegration;