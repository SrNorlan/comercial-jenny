# Arquitectura de la aplicación

La aplicación usa una única composición Express y separa el cliente React del backend REST:

```text
app.js                         # Arrancador en puerto 4000
server/src/app.js              # Composición Express compartida
server/src/routes/api.routes.js
server/src/modules/<dominio>/
	├── *.routes.js               # Endpoints y middleware
	├── *.controller.js           # HTTP: request/response
	└── *.service.js              # Reglas de negocio y PostgreSQL
server/src/utils/validation.js  # Validaciones compartidas de entrada
client/src/
	├── api/                      # Comunicación con la API
	├── components/               # Piezas reutilizables
	├── pages/                    # Pantallas de negocio
	├── hooks/                    # Estado y efectos reutilizables
	├── App.jsx                  # Sesión y navegación
	└── styles.css               # Estilos globales
```

## Organización del cliente

```text
src/
├── api/                    # Comunicación con el backend
│   └── client.js           # fetch, errores y formateadores compartidos
├── components/
│   └── layout/             # Estructura visible en toda la aplicación
│       ├── AppLayout.jsx
│       ├── Sidebar.jsx
│       └── Topbar.jsx
├── pages/                  # Pantallas completas por módulo
│   ├── DashboardPage.jsx
│   └── RecordsPage.jsx
├── App.jsx                 # Composición de rutas y sesión
├── main.jsx                # Punto de entrada de React
└── styles.css              # Tokens y estilos globales
```

## Regla para saber dónde editar

- ¿La pantalla necesita datos del servidor? Usa `api/client.js`.
- ¿Se repite en varias pantallas? Va en `components/`.
- ¿Es una pantalla completa de negocio? Va en `pages/`.
- ¿Controla qué pantalla se muestra? Va en `App.jsx`.
- ¿Sólo inicia React? Va en `main.jsx`.

## Flujo de datos

```text
React Page -> api/client.js -> Express -> /api/v1 -> module route -> controller -> service -> PostgreSQL
```

La carpeta `server/src/modules` es la fuente del backend REST. La interfaz activa se sirve desde `client/dist`.

Las operaciones de venta, compra, producto, abono y devolución validan IDs, totales, cantidades y precios mediante `server/src/utils/validation.js` antes de abrir una transacción o consultar la base.

`server/src/app.js` es la única composición Express. `app.js` sólo inicia esa aplicación en el puerto `4000`; `server/src/index.js` permite iniciar la misma composición de forma independiente con el puerto configurado para la API.

La carga de datos es bajo demanda: `client/src/api/resources.api.js` define las dependencias de cada pantalla y `client/src/hooks/useResources.js` conserva en estado los recursos ya consultados. Después de una mutación se recarga sólo el conjunto asociado a la vista activa.
