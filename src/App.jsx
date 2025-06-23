import { useState, useEffect } from 'react';

export default function App() {
  // --- ESTADOS DE LA APLICACIÓN ---
  const [inputText, setInputText] = useState('');
  const [outputOptions, setOutputOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- EFECTO PARA APLICAR EL TEMA ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- FUNCIÓN PARA ALTERNAR EL TEMA ---
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // --- FUNCIÓN PARA COPIAR TEXTO ---
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Opcional: mostrar feedback visual de que se copió
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // --- FUNCIÓN PRINCIPAL PARA LLAMAR A N8N ---
  const handleAdaptarTexto = async () => {
    if (!inputText.trim()) {
      setError('Por favor, ingrese un texto para adaptar.');
      return;
    }

    setIsLoading(true);
    setError('');
    setOutputOptions([]);

    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      setError('Error de configuración: La URL del webhook no está definida.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texto: inputText }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.statusText}`);
      }

      const data = await response.json();

      // Simular múltiples opciones para el mockup
      // En la implementación real, esto vendría del backend
      if (data.texto_adaptado) {
        setOutputOptions([
          {
            id: 1,
            title: "Opción 1 (Más estándar y emotiva)",
            text: data.texto_adaptado
          },
          {
            id: 2,
            title: "Opción 2 (Con más jerga y confianza)",
            text: data.texto_adaptado + " ¡Al tiro!"
          }
        ]);
      } else {
        throw new Error('La respuesta no contiene el formato esperado.');
      }

    } catch (err) {
      console.error("Detalle del error:", err);
      setError(`Hubo un problema al conectar con el servicio. Inténtelo de nuevo. (Detalle: ${err.message})`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNCIÓN PARA LIMPIAR LOS CAMPOS ---
  const handleLimpiar = () => {
    setInputText('');
    setOutputOptions([]);
    setError('');
  };

  // --- ESTILOS DINÁMICOS BASADOS EN EL TEMA ---
  const getThemeStyles = () => {
    if (isDarkMode) {
      return {
        body: { backgroundColor: '#1a1a1a', color: '#ffffff' },
        container: { backgroundColor: '#2d2d2d', color: '#ffffff', border: '1px solid #444' },
        inputCard: { backgroundColor: '#3a3a3a', color: '#ffffff', border: '1px solid #555' },
        outputCard: { backgroundColor: '#3a3a3a', color: '#ffffff', border: '1px solid #555' },
        optionBox: { backgroundColor: '#4a4a4a', color: '#ffffff', border: '1px solid #666' },
        textarea: { backgroundColor: '#4a4a4a', color: '#ffffff', border: '1px solid #666' },
        button: { backgroundColor: '#555', color: '#ffffff' },
        copyButton: { backgroundColor: '#666', color: '#ffffff' },
        error: { backgroundColor: '#4a1a1a', color: '#ff6b6b' }
      };
    } else {
      return {
        body: { backgroundColor: '#f0f2f5', color: '#333' },
        container: { backgroundColor: '#ffffff', color: '#333', border: '1px solid #ddd' },
        inputCard: { backgroundColor: '#ffffff', color: '#333', border: '1px solid #ddd' },
        outputCard: { backgroundColor: '#ffffff', color: '#333', border: '1px solid #ddd' },
        optionBox: { backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #ddd' },
        textarea: { backgroundColor: '#ffffff', color: '#333', border: '1px solid #ddd' },
        button: { backgroundColor: '#e9ecef', color: '#333' },
        copyButton: { backgroundColor: '#007bff', color: '#ffffff' },
        error: { backgroundColor: '#f8d7da', color: '#d93025' }
      };
    }
  };

  const themeStyles = getThemeStyles();

  // --- ESTRUCTURA VISUAL (JSX) ---
  return (
    <div style={{ 
      ...themeStyles.body,
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'monospace'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative'
      }}>
        
        {/* Título del Mockup */}
        <h1 style={{ 
          color: themeStyles.body.color,
          fontSize: '1.2rem',
          marginBottom: '2rem',
          fontWeight: 'bold'
        }}>
          Mockup (diseño conceptual):
        </h1>

        {/* Botón de tema */}
        <button
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            top: '-2rem',
            right: '0',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isDarkMode ? '#4a4a4a' : '#e9ecef',
            color: isDarkMode ? '#ffffff' : '#333',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Área de Entrada */}
        <div style={{
          ...themeStyles.inputCard,
          padding: '1.5rem',
          marginBottom: '2rem',
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          <div style={{ 
            borderBottom: `1px dashed ${isDarkMode ? '#666' : '#ccc'}`,
            paddingBottom: '0.5rem',
            marginBottom: '1rem'
          }}>
            <span style={{ color: themeStyles.body.color }}>
              | CO Texto de Entrada (Colombia)
            </span>
          </div>
          <div style={{ 
            borderBottom: `1px dashed ${isDarkMode ? '#666' : '#ccc'}`,
            paddingBottom: '0.5rem',
            marginBottom: '1rem'
          }}>
            <span style={{ color: themeStyles.body.color }}>
              |
            </span>
          </div>
          <textarea
            style={{
              ...themeStyles.textarea,
              width: '100%',
              height: '80px',
              padding: '0.8rem',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              resize: 'none',
              borderRadius: '4px'
            }}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="[Área de texto para que el usuario escriba la frase original...]"
            disabled={isLoading}
          />
          <div style={{ 
            borderTop: `1px dashed ${isDarkMode ? '#666' : '#ccc'}`,
            paddingTop: '0.5rem',
            marginTop: '1rem'
          }}>
            <span style={{ color: themeStyles.body.color }}>
              |
            </span>
          </div>
        </div>

        {/* Botón de Acción */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem' 
        }}>
          <button
            onClick={handleAdaptarTexto}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#666' : '#007bff',
              color: '#ffffff',
              border: 'none',
              padding: '0.8rem 2rem',
              borderRadius: '4px',
              fontSize: '1rem',
              fontFamily: 'monospace',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? "Procesando..." : "[ → Adaptar a Chileno ]"}
          </button>
        </div>

        {/* Área de Salida */}
        <div style={{
          ...themeStyles.outputCard,
          padding: '1.5rem',
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          <div style={{ 
            borderBottom: `1px dashed ${isDarkMode ? '#666' : '#ccc'}`,
            paddingBottom: '0.5rem',
            marginBottom: '1rem'
          }}>
            <span style={{ color: themeStyles.body.color }}>
              | CL Texto Adaptado (Chile)
            </span>
          </div>
          <div style={{ 
            borderBottom: `1px dashed ${isDarkMode ? '#666' : '#ccc'}`,
            paddingBottom: '0.5rem',
            marginBottom: '1rem'
          }}>
            <span style={{ color: themeStyles.body.color }}>
              |
            </span>
          </div>

          {/* Opciones de Traducción */}
          {outputOptions.length > 0 ? (
            outputOptions.map((option, index) => (
              <div key={option.id} style={{ marginBottom: '2rem' }}>
                <div style={{
                  ...themeStyles.optionBox,
                  padding: '1rem',
                  borderRadius: '4px',
                  position: 'relative'
                }}>
                  <div style={{ 
                    borderBottom: `1px solid ${isDarkMode ? '#666' : '#ddd'}`,
                    paddingBottom: '0.5rem',
                    marginBottom: '0.8rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      | {option.title}
                    </span>
                    <button
                      onClick={() => copyToClipboard(option.text)}
                      style={{
                        ...themeStyles.copyButton,
                        border: 'none',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontFamily: 'monospace'
                      }}
                    >
                      [Copiar]
                    </button>
                  </div>
                  <div style={{
                    borderLeft: `1px solid ${isDarkMode ? '#666' : '#ddd'}`,
                    paddingLeft: '0.8rem',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    | {option.text}
                  </div>
                  <div style={{ 
                    borderTop: `1px solid ${isDarkMode ? '#666' : '#ddd'}`,
                    paddingTop: '0.5rem',
                    marginTop: '0.8rem'
                  }}>
                    <span style={{ color: themeStyles.body.color }}>
                      |
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              ...themeStyles.optionBox,
              padding: '2rem',
              textAlign: 'center',
              borderRadius: '4px',
              fontStyle: 'italic',
              color: isDarkMode ? '#aaa' : '#666'
            }}>
              {isLoading ? "Adaptando..." : "[Aquí aparecerían las opciones de traducción...]"}
            </div>
          )}

          <div style={{ 
            borderTop: `1px dashed ${isDarkMode ? '#666' : '#ccc'}`,
            paddingTop: '0.5rem',
            marginTop: '1rem'
          }}>
            <span style={{ color: themeStyles.body.color }}>
              |
            </span>
          </div>
        </div>

        {/* Botón Limpiar */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem' 
        }}>
          <button
            onClick={handleLimpiar}
            disabled={isLoading}
            style={{
              ...themeStyles.button,
              border: `1px solid ${isDarkMode ? '#666' : '#ddd'}`,
              padding: '0.6rem 1.5rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Limpiar
          </button>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div style={{
            ...themeStyles.error,
            padding: '1rem',
            borderRadius: '4px',
            textAlign: 'center',
            marginTop: '2rem',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

