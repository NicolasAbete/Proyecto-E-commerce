// js/checkout.js - Ejemplo de cómo integrar en tu proceso de pago existente

// Función que probablemente ya tienes para procesar el pago
function processPayment() {
  // Tu lógica de pago existente...

  // Cuando el pago se complete exitosamente, llama a esta función:
const orderData = {
    id: generateOrderId(), // o usa tu propio sistema de IDs
    customer: {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value
    },
    items: getCartItems(), // función que ya debes tener
    total: calculateTotal(), // función que ya debes tener
    paymentInstructions: 'Te contactaremos pronto con las instrucciones de pago.'
    };

  // Llamar a la función de éxito que enviará el email
    onPaymentSuccess(orderData);
}

// Ejemplo de función para obtener items del carrito
function getCartItems() {
  // Si tienes los items en localStorage:
const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // O si los tienes en una variable global:
  // const cart = window.cartItems || [];

return cart.map(item => ({
    name: item.name || item.title,
    quantity: item.quantity || 1,
    price: item.price || 0
    }));
}

// Ejemplo de función para calcular total
function calculateTotal() {
    const items = getCartItems();
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Función para obtener datos del formulario de checkout
function getCustomerData() {
    return {
    name: document.getElementById('customer-name')?.value || '',
    email: document.getElementById('customer-email')?.value || ''
    };
}

// Ejemplo de validación antes de procesar el pago
function validateCheckoutForm() {
    const customer = getCustomerData();

    if (!customer.name.trim()) {
    alert('Por favor ingresa tu nombre');
    return false;
    }

    if (!customer.email.trim() || !isValidEmail(customer.email)) {
    alert('Por favor ingresa un email válido');
    return false;
    }

    const items = getCartItems();
    if (items.length === 0) {
    alert('Tu carrito está vacío');
    return false;
    }

    return true;
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Event listener para el botón de finalizar compra
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();

        if (validateCheckoutForm()) {
        processPayment();
        }
    });
    }
});

// Ejemplo de cómo usar en tu HTML existente:
/*
En tu index.html o página de checkout, agrega:

<div id="checkout-form">
  <input type="text" id="customer-name" placeholder="Nombre completo" required>
  <input type="email" id="customer-email" placeholder="Email" required>
  <button id="checkout-btn">Finalizar Compra</button>
</div>

<div id="main-container">
  <!-- Aquí se mostrará la página de éxito -->
</div>
*/