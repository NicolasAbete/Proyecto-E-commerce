const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Ruta principal que sirve tu index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// server.js o app.js (Backend Node.js)
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Configuración del transportador de email
const transporter = nodemailer.createTransporter({
  service: 'gmail', // Puedes usar 'gmail', 'outlook', 'yahoo', etc.
    auth: {
    user: process.env.EMAIL_USER, // Tu email
    pass: process.env.EMAIL_PASS  // Tu contraseña de aplicación
    }
});

// Función para generar el HTML del email
const generateEmailHTML = (orderDetails) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Confirmación de Pedido</title>
        <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .order-item { border-bottom: 1px solid #ddd; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; color: #007bff; }
        .footer { text-align: center; padding: 20px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
        <div class="header">
            <h1>¡Gracias por tu pedido!</h1>
        </div>
        <div class="content">
            <h2>Detalles del Pedido #${orderDetails.orderId}</h2>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            <p><strong>Cliente:</strong> ${orderDetails.customerName}</p>
            <p><strong>Email:</strong> ${orderDetails.customerEmail}</p>

            <h3>Productos:</h3>
            ${orderDetails.items.map(item => `
            <div class="order-item">
                <strong>${item.name}</strong><br>
                Cantidad: ${item.quantity}<br>
                Precio unitario: $${item.price}<br>
              Subtotal: $${item.quantity * item.price}
            </div>
            `).join('')}

            <div class="total">
            <p>Total: $${orderDetails.total}</p>
            </div>

            <h3>Información de Pago:</h3>
            <p>${orderDetails.paymentInstructions || 'Te contactaremos pronto con las instrucciones de pago.'}</p>
        </div>
        <div class="footer">
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
        </div>
    </body>
    </html>
    `;
};

// Endpoint para enviar email de confirmación
app.post('/api/send-order-email', async (req, res) => {
    try {
    const { orderDetails } = req.body;

    // Validar datos requeridos
    if (!orderDetails || !orderDetails.customerEmail) {
        return res.status(400).json({ 
        success: false, 
        message: 'Faltan datos del pedido o email del cliente' 
        });
    }

    // Configurar el email
    const mailOptions = {
        from: `"Tu Tienda" <${process.env.EMAIL_USER}>`,
        to: orderDetails.customerEmail,
        subject: `Confirmación de Pedido #${orderDetails.orderId}`,
        html: generateEmailHTML(orderDetails)
    };

    // Enviar el email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email enviado:', info.messageId);
    
    res.json({
        success: true,
        message: 'Email enviado correctamente',
        messageId: info.messageId
    });

    } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({
        success: false,
        message: 'Error al enviar el email',
        error: error.message
    });
    }
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});