# Tienda de Videojuegos - React eCommerce

**Actividad Sumativa 3 (Semana 8) — Desarrollo Frontend I**
*Mejorando funcionalidades clave en el eCommerce con React.*

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

E-commerce interactivo desarrollado con React. Esta iteración transforma el catálogo estático en un sistema dinámico con carga de datos asíncrona, gestión de estados complejos y renderizado condicional avanzado.

- **Sitio publicado:** 
- **Autor:** SDFZ

---

## Instalación y Ejecución

El proyecto requiere **Node.js LTS** (probado con v24.21.0). El sitio es totalmente autocontenido y no requiere conexión externa para sus dependencias visuales (Bootstrap está integrado vía npm).

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo local
npm run dev
```

### Comandos disponibles

| Comando | Acción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo con Hot Module Replacement (HMR). |
| `npm run build` | Genera los archivos estáticos optimizados para producción en `/dist`. |
| `npm run preview` | Levanta un servidor local para probar el build de `/dist`. |
| `npm run deploy` | Construye y publica automáticamente en la rama `gh-pages`. |
| `npm run lint` | Ejecuta el análisis estático de código con oxlint. |

---

## Arquitectura y Decisiones Técnicas

El proyecto aplica separación de responsabilidades extrayendo la lógica compleja a Hooks personalizados y manteniendo los componentes limpios.

### Gestión de Estado (`useState`)
Se gestionan 7 estados distribuidos estratégicamente según su alcance:

*   **Estado Global (en `App.jsx`):** `carrito` (arreglo de ítems), `busqueda` (texto del filtro) y `categoria` (filtro por género). Se elevan aquí porque múltiples ramas del árbol los consumen.
*   **Estado de Datos (en `useProductos`):** `productos`, `cargando`, y `error`.
*   **Estado Local (en `Encabezado.jsx`):** `menuAbierto`, encapsulado ya que no afecta al resto de la aplicación.

> **Nota de diseño:** Elementos como el listado filtrado, los subtotales o el contador del carrito **no** son estados, sino valores derivados calculados en cada renderizado para evitar desincronizaciones.

### Carga de Datos (`useEffect` y `useProductos`)
Toda la lógica de obtención del catálogo se abstrajo en el custom hook `useProductos`. Esto limpia el componente `App` y centraliza la lógica de red.

*   **Ejecución única:** El `useEffect` utiliza `[]` como matriz de dependencias para ejecutarse solo al montar el componente.
*   **Manejo de errores HTTP:** Se valida `response.ok` antes de invocar `.json()` para evitar cuelgues ante errores 404.
*   **Función de limpieza (Cleanup):** Se implementó una bandera `cancelado` para prevenir actualizaciones de estado (memory leaks) si el componente se desmonta antes de que la promesa de `fetch` se resuelva.

### Fuente de Datos: Archivo JSON Local vs API Externa
Se optó por consumir los datos desde `public/data/productos.json` en lugar de la API de RAWG sugerida en el material de estudio por las siguientes razones:
1. **Modelo de datos incompleto:** RAWG no provee campos críticos para un eCommerce como `precio` u `oferta`.
2. **Resiliencia:** Se evita una dependencia externa que podría mostrar un catálogo vacío si la API sufre caídas o limita la cuota.
3. **Seguridad:** Previene la exposición de *API Keys* en el bundle de JavaScript expuesto al cliente.

---

## Renderizado Condicional

La interfaz se adapta dinámicamente a 8 situaciones distintas basándose en el estado de la aplicación:

| Situación | Comportamiento UI |
| :--- | :--- |
| **Cargando datos** | Spinner de carga en lugar de la grilla de productos. |
| **Error HTTP** | Mensaje de error amigable; UI estructural (Navbar, Carrito) intacta. |
| **Producto en carrito** | El botón de compra cambia a "En el carrito ✓" (estilo contorno). |
| **Carrito vacío** | Mensaje invitando a explorar el catálogo. |
| **Filtro sin resultados** | Mensaje específico indicando qué combinación dejó la vista vacía. |
| **Oferta destacada** | Etiqueta "¡Mejor precio!" exclusiva para descuentos >= 30%. |
| **Categoría activa** | Botón de la categoría resaltado con color corporativo. |
| **Menú móvil** | La clase CSS `show` se inyecta dinámicamente según el estado. |

---

## Estructura del Proyecto

```text
├── public/                    # Archivos estáticos directos al build
│   ├── data/productos.json    # Catálogo simulado (API local)
│   ├── img/                   # Assets (Portadas SVG, logotipo)
│   └── favicon.svg
├── src/
│   ├── components/            # Componentes UI encapsulados
│   │   ├── Buscador.jsx, Carrito.jsx, Encabezado.jsx, Inicio.jsx...
│   ├── hooks/
│   │   └── useProductos.js    # Lógica de obtención de datos
│   ├── utils/
│   │   └── formato.js         # Helpers (moneda, rutas base)
│   ├── App.jsx                # Layout principal y estado compartido
│   ├── index.css              # Customización sobre Bootstrap
│   └── main.jsx               # Punto de montaje React
├── vite.config.js             # Configuración con base para GH Pages
└── package.json
```

---

## Despliegue (GitHub Pages)

Para garantizar que las rutas de imágenes y del archivo JSON funcionen correctamente al desplegar en un subdirectorio de GitHub Pages, se implementó el uso de `import.meta.env.BASE_URL` en las utilidades de ruteo (`utils/formato.js`). Esto evita errores 404 al intentar acceder a los recursos de la carpeta `/public` en producción.

---

*Proyecto desarrollado con fines académicos. Las portadas y logotipos (SVG) son recursos propios creados para esta interfaz.*