import React from 'react';
import ReactDOM from 'react-dom/client';
import "../estilos/style.css"
import "../js/script.js"


function App() {
    return (
    <div>
        <h1>Mi E-commerce con React</h1>
    </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);