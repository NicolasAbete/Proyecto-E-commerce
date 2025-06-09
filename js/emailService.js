// js/emailService.js
class EmailService {
    constructor() {
    this.apiUrl = 'http://localhost:3000/api';
    }

    async sendOrderConfirmationEmail(orderData) {
    try {
        const response = await fetch(`${this.apiUrl}/send-order-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderDetails: orderData
        })
        });

        const result = await response.json();

        if (!response.ok) {
        throw new Error(result.message || 'Error al enviar email');
        }

        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
    }
}

// Función para mostrar el estado del email en la página
function showEmailStatus(status, message, isError = false) {
    const statusContainer = document.getElementById('email-status');
    if (!statusContainer) return;

    statusContainer.innerHTML = `
    <div class="email-notification ${isError ? 'error' : 'success'}">
        <h3>${isError ? '❌' : '✅'} ${status}</h3>
        <p>${message}</p>
        ${isError ? '<button onclick="retryEmailSend()" class="retry-btn">Intentar Nuevamente</button>' : ''}
    </div>
    `;
}

// Función para generar ID de orden único
function generateOrderId() {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Función principal para enviar email después del pago
async function sendPaymentConfirmationEmail(orderData) {
    const emailService = new EmailService();

  // Mostrar estado de carga
    showEmailStatus('Enviando Email', 'Enviando confirmación por email...');

    try {
    // Estructura los datos del pedido
    const orderDetails = {
        orderId: orderData.id || generateOrderId(),
        customerName: orderData.customer.name,
        customerEmail: orderData.customer.email,
        items: orderData.items,
        total: orderData.total,
        paymentInstructions: orderData.paymentInstructions || 
        'Te contactaremos pronto con las instrucciones de pago.'
    };

    const result = await emailService.sendOrderConfirmationEmail(orderDetails);
    
    if (result.success) {
        showEmailStatus(
        'Email Enviado', 
        `Se ha enviado un email de confirmación a: ${orderData.customer.email}. Revisa tu bandeja de entrada y carpeta de spam.`
        );
        console.log('Email enviado exitosamente:', result.messageId);
    }
    
    return result;
    } catch (error) {
    showEmailStatus(
        'Error al Enviar Email',
        `Hubo un problema enviando el email de confirmación: ${error.message}`,
        true
    );
    console.error('Error enviando email:', error);
    throw error;
    }
}

// Función para reintentar envío (llamada desde el botón)
async function retryEmailSend() {
  // Obtener datos del pedido del almacenamiento local o variables globales
    const orderData = window.lastOrderData;
    if (orderData) {
    await sendPaymentConfirmationEmail(orderData);
    } else {
    showEmailStatus('Error', 'No se encontraron datos del pedido para reenviar', true);
    }
}

// Función que se llama cuando el pago se completa exitosamente
function onPaymentSuccess(datosCompra) {
  // Guardar datos para posible reintento
    window.lastOrderData = datosCompra;

  // Mostrar página de éxito
    showSuccessPage(datosCompra);

  // Enviar email automáticamente
    sendPaymentConfirmationEmail(datosCompra);
}

// Función para mostrar la página de éxito
function showSuccessPage(orderData) {
    const mainContainer = document.getElementById('main-container') || document.body;

    mainContainer.innerHTML = `
    <div class="checkout-success">
        <div class="success-container">
        <h1>¡Pago Procesado Exitosamente!</h1>
        
        <div class="order-summary">
            <h2>Resumen del Pedido</h2>
            
            <p><strong>Cliente:</strong> ${orderData.customer.name}</p>
            <p><strong>Email:</strong> ${orderData.customer.email}</p>
            <p><strong>Total:</strong> $${orderData.total}</p>

            <div class="items-list">
            <h3>Productos:</h3>
            ${orderData.items.map(item => `
                <div class="order-item">
                <span>${item.name} (x${item.cantidad})</span>
                <span>$${item.precio * item.cantidad}</span>
                </div>
            `).join('')}
            </div>
        </div>

        <div id="email-status" class="email-status">
            <!-- Aquí se mostrará el estado del email -->
        </div>

        <div class="next-steps">
            <h3>Próximos Pasos</h3>
            <ul>
            <li>Recibirás las instrucciones de pago por email</li>
            <li>Una vez realizado el pago, procesaremos tu pedido</li>
            <li>Te notificaremos cuando tu pedido esté listo</li>
            </ul>
        </div>

        <button onclick="goBackToStore()" class="back-btn">Volver a la Tienda</button>
        </div>
    </div>
    `;
}

// Función para volver a la tienda
function goBackToStore() {
    window.location.href = 'index.html';
}

// Exportar funciones para uso global
window.sendPaymentConfirmationEmail = sendPaymentConfirmationEmail;
window.onPaymentSuccess = onPaymentSuccess;
window.retryEmailSend = retryEmailSend;