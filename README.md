# README - Aplicación Adaptador de Frases Colombia-Chile

## Descripción

Esta aplicación web permite adaptar frases de atención al cliente del español de Colombia al español coloquial y respetuoso de Santiago de Chile. Utiliza un backend construido con n8n y un frontend desarrollado en React.

## Requisitos Previos

- Node.js 18+ y pnpm
- Instancia de n8n configurada
- API Key de un servicio de LLM (OpenAI, Google Gemini, etc.)

## Instalación

1. **Clonar o descargar el proyecto**
2. **Instalar dependencias**:
   ```bash
   cd adaptador-frases-chile
   pnpm install
   ```

3. **Configurar la URL del backend**:
   - Abrir `src/App.jsx`
   - Actualizar la constante `WEBHOOK_URL` con la URL real de su webhook de n8n

## Uso

### Desarrollo
```bash
pnpm run dev --host
```
La aplicación estará disponible en `http://localhost:5173`

### Producción
```bash
pnpm run build
```
Los archivos de producción se generarán en la carpeta `dist/`

## Configuración del Backend (n8n)

Consulte el archivo `n8n_backend_instructions.md` para instrucciones detalladas sobre cómo configurar el workflow en n8n.

## Estructura del Proyecto

```
adaptador-frases-chile/
├── public/
├── src/
│   ├── components/ui/     # Componentes UI de shadcn/ui
│   ├── App.jsx           # Componente principal
│   ├── App.css           # Estilos principales
│   └── main.jsx          # Punto de entrada
├── package.json
└── vite.config.js
```

## Características

- ✅ Interfaz intuitiva con dos áreas de texto
- ✅ Indicadores visuales con banderas de países
- ✅ Validación de entrada y manejo de errores
- ✅ Indicador de carga durante el procesamiento
- ✅ Funcionalidad de copia del texto adaptado
- ✅ Sección de ejemplos para guiar a los usuarios
- ✅ Diseño responsivo para móviles y escritorio

## Tecnologías Utilizadas

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, Lucide Icons
- **Backend**: n8n (workflow automation)
- **LLM**: OpenAI GPT / Google Gemini (configurable)

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Cree una rama para su feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit sus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Cree un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Consulte el archivo LICENSE para más detalles.

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, por favor abra un issue en el repositorio del proyecto.

