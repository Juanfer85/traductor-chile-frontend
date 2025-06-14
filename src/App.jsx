import { useState } from 'react';

// Estilos CSS básicos para que se vea bien sin complicaciones.
// Puedes poner esto en tu archivo App.css o index.css
/*
body {
  background-color: #f0f2f5;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}
.app-container {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 800px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.card {
  display: flex;
  flex-direction: column;
}
.card h2 {
  font-size: 1.2rem;
  margin-top: 0;
  color: #333;
}
textarea {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 0.8rem;
  font-size: 1rem;
  resize: none;
}
.actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s;
}
.submit-btn {
  background-color: #007bff;
  color: white;
}
.submit-btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}
.clear-btn {
  background-color: #e9ecef;
  color: #333;
}
.error-message {
  grid-column: 1 / -1;
  color: #d93025;
  background-color: #f8d7da;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}
*/


export default function App() {
  // --- ESTADOS DE LA APLICACIÓN ---
  // Guarda el texto que el usuario escribe (Colombia)
  const [inputText, setInputText] = useState('');
  // Guarda el texto traducido que devuelve n8n (Chile)
  const [outputText, setOutputText] = useState('');
  // Sirve para mostrar un indicador de "cargando..."
  const [isLoading, setIsLoading] = useState(false);
  // Guarda cualquier mensaje de error para mostrarlo al usuario
  const [error, setError] = useState('');

  // --- FUNCIÓN PRINCIPAL PARA LLAMAR A N8N ---
  const handleAdaptarTexto = async () => {
    // 1. Validar que el usuario haya escrito algo
    if (!inputText.trim()) {
      setError('Por favor, ingrese un texto para adaptar.');
      return;
    }

    // 2. Preparar para la llamada
    setIsLoading(true);
    setError('');
    setOutputText('');

    // 3. Obtener la URL de n8n desde las variables de entorno de Vercel
    // Esta es la forma correcta y segura de hacerlo.
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

    // Verificar si la URL existe. Si no, es un error de configuración.
    if (!webhookUrl) {
      setError('Error de configuración: La URL del webhook no está definida.');
      setIsLoading(false);
      return;
    }

    // 4. Bloque try...catch para manejar errores de red o del servidor
    try {
      // 5. La llamada FETCH a n8n
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enviamos el texto en el formato que n8n espera: { "texto": "..." }
        body: JSON.stringify({ texto: inputText }),
      });

      // 6. Si la respuesta del servidor no es exitosa (ej: error 404, 500)
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.statusText}`);
      }

      // 7. Si todo fue bien, convertimos la respuesta a JSON
      const data = await response.json();

      // 8. Actualizamos el estado con el texto adaptado
      if (data.texto_adaptado) {
        setOutputText(data.texto_adaptado);
      } else {
        throw new Error('La respuesta no contiene el formato esperado.');
      }

    } catch (err) {
      // 9. Si ocurre cualquier error en el proceso, lo mostramos
      console.error("Detalle del error:", err);
      setError(`Hubo un problema al conectar con el servicio. Inténtelo de nuevo. (Detalle: ${err.message})`);
    } finally {
      // 10. Finalmente, sin importar si hubo éxito o error, dejamos de cargar
      setIsLoading(false);
    }
  };

  // --- FUNCIÓN PARA LIMPIAR LOS CAMPOS ---
  const handleLimpiar = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };


  // --- ESTRUCTURA VISUAL (JSX) ---
  return (
    <div className="app-container" style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', width: '90%', maxWidth: '800px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      {/* Columna Izquierda */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.2rem', marginTop: '0', color: '#333' }}>🇨🇴 Texto de Entrada (Colombia)</h2>
        <textarea
          style={{ width: '100%', height: '200px', borderRadius: '8px', border: '1px solid #ddd', padding: '0.8rem', fontSize: '1rem', resize: 'none' }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="A la orden, ¿en qué le puedo colaborar?"
          disabled={isLoading}
        />
      </div>

      {/* Columna Derecha */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.2rem', marginTop: '0', color: '#333' }}>🇨🇱 Texto Adaptado (Chile)</h2>
        <textarea
          style={{ width: '100%', height: '200px', borderRadius: '8px', border: '1px solid #ddd', padding: '0.8rem', fontSize: '1rem', resize: 'none', backgroundColor: '#f8f9fa' }}
          value={isLoading ? "Adaptando..." : outputText}
          readOnly
          placeholder="El texto adaptado aparecerá aquí..."
        />
      </div>

      {/* Fila de Acciones (Botones) */}
      <div className="actions" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          className="submit-btn"
          style={{ padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', transition: 'background-color 0.2s', backgroundColor: isLoading ? '#a0a0a0' : '#007bff', color: 'white' }}
          onClick={handleAdaptarTexto}
          disabled={isLoading}
        >
          {isLoading ? "Procesando..." : "→ Adaptar a Chileno"}
        </button>
        <button
          className="clear-btn"
          style={{ padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', transition: 'background-color 0.2s', backgroundColor: '#e9ecef', color: '#333' }}
          onClick={handleLimpiar}
          disabled={isLoading}
        >
          Limpiar
        </button>
      </div>

      {/* Mensaje de Error (si existe) */}
      {error && (
        <div className="error-message" style={{ gridColumn: '1 / -1', color: '#d93025', backgroundColor: '#f8d7da', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  );
}

