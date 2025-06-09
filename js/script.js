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