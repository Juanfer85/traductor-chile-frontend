import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Loader2, ArrowRight, Languages } from 'lucide-react'
import './App.css'

function App() {
  const [textoEntrada, setTextoEntrada] = useState('')
  const [textoAdaptado, setTextoAdaptado] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  // URL del webhook de n8n - DEBE SER REEMPLAZADA POR LA URL REAL
  const WEBHOOK_URL = 'https://tu-instancia-n8n.com/webhook/adaptar-frases'

  const adaptarFrase = async () => {
    if (!textoEntrada.trim()) {
      setError('Por favor, ingrese una frase para adaptar')
      return
    }

    setCargando(true)
    setError('')
    setTextoAdaptado('')

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texto: textoEntrada
        })
      })

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`)
      }

      const data = await response.json()
      
      // Verificar si la respuesta tiene el formato esperado
      if (data.texto_adaptado) {
        setTextoAdaptado(data.texto_adaptado)
      } else {
        // Fallback en caso de que el formato sea diferente
        setTextoAdaptado(data.response || data.message || JSON.stringify(data))
      }
    } catch (err) {
      console.error('Error al adaptar la frase:', err)
      setError(`Error al procesar la solicitud: ${err.message}`)
    } finally {
      setCargando(false)
    }
  }

  const limpiarCampos = () => {
    setTextoEntrada('')
    setTextoAdaptado('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Languages className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Adaptador de Frases Colombia-Chile
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convierte frases de atención al cliente del español de Colombia al español coloquial 
            y respetuoso de Santiago de Chile
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Entrada (Colombia) */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-yellow-600">🇨🇴</span>
                Texto de Entrada (Colombia)
              </CardTitle>
              <CardDescription>
                Ingrese la frase en español de Colombia que desea adaptar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Ejemplo: A la orden, su merced, ¿en qué le puedo colaborar?"
                value={textoEntrada}
                onChange={(e) => setTextoEntrada(e.target.value)}
                className="min-h-32 resize-none"
                disabled={cargando}
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={adaptarFrase}
                  disabled={cargando || !textoEntrada.trim()}
                  className="flex-1"
                >
                  {cargando ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adaptando...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Adaptar a Chileno
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={limpiarCampos}
                  disabled={cargando}
                >
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Salida (Chile) */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-red-600">🇨🇱</span>
                Texto Adaptado (Chile)
              </CardTitle>
              <CardDescription>
                Resultado adaptado al español de Santiago de Chile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="El texto adaptado aparecerá aquí..."
                value={textoAdaptado}
                readOnly
                className="min-h-32 resize-none bg-gray-50"
              />
              
              {textoAdaptado && (
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => navigator.clipboard.writeText(textoAdaptado)}
                >
                  Copiar Texto Adaptado
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Examples Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ejemplos de Adaptación</CardTitle>
            <CardDescription>
              Algunos ejemplos de cómo se adaptan las frases de Colombia a Chile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-yellow-700">🇨🇴 Colombia</h4>
                <div className="space-y-2 text-sm">
                  <p className="bg-yellow-50 p-2 rounded">"A la orden, su merced"</p>
                  <p className="bg-yellow-50 p-2 rounded">"¿En qué le puedo colaborar?"</p>
                  <p className="bg-yellow-50 p-2 rounded">"Qué pena con usted"</p>
                  <p className="bg-yellow-50 p-2 rounded">"Ya le consigo el datico"</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-red-700">🇨🇱 Chile</h4>
                <div className="space-y-2 text-sm">
                  <p className="bg-red-50 p-2 rounded">"Dígame, ¿en qué le puedo ayudar?"</p>
                  <p className="bg-red-50 p-2 rounded">"¿En qué le puedo ayudar?"</p>
                  <p className="bg-red-50 p-2 rounded">"No se preocupe"</p>
                  <p className="bg-red-50 p-2 rounded">"Le busco el dato al tiro"</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Desarrollado para adaptar el lenguaje de atención al cliente entre Colombia y Chile
          </p>
        </div>
      </div>
    </div>
  )
}

export default App

