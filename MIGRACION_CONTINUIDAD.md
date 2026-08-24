# Comercial Jenny - Documento de continuidad

Fecha de referencia: 2026-08-23

Este documento permite continuar la migración en otra sesión sin perder el contexto técnico ni borrar funcionalidades por accidente.

## Objetivo

Migrar la aplicación desde las vistas EJS y scripts legacy hacia una aplicación React/Vite servida por Express en el puerto `4000`, usando PostgreSQL y la API REST bajo `/api/v1`.

La interfaz final debe ser clara, intuitiva, responsive y fácil de mantener.

## Regla principal

No borrar todavía las carpetas legacy. Primero hay que verificar cada flujo desde React y ejecutar las pruebas.

El backend migrado principal está en `server/src/modules`.
El frontend migrado principal está en `client/src`.

## Cómo ejecutar el sistema

Desde PowerShell, si Node no está en el PATH:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
```

Instalar dependencias:

```powershell
npm.cmd install
npm.cmd --prefix client install
```

Construir React:

```powershell
npm.cmd run build:client
```

Iniciar el sistema unificado:

```powershell
npm.cmd run dev
```

Abrir:

```text
http://localhost:4000
```

La API queda disponible en:

```text
http://localhost:4000/api/v1
```

No usar `http://localhost:5173` para la aplicación final. El cliente Vite sólo se construye y Express sirve `client/dist` en `4000`.

## Arquitectura actual

```text
AMC Jenny 2.0/
├── app.js                         # Entrada Express principal en puerto 4000
├── server/src/
│   ├── config/                    # PostgreSQL y variables de entorno
│   ├── middlewares/               # Autenticación y errores
│   ├── modules/                   # Backend REST migrado por dominio
│   └── routes/api.routes.js       # Monta /api/v1
├── client/src/
│   ├── api/
│   │   ├── client.js              # fetch, errores y formateadores
│   │   └── resources.api.js       # carga coordinada de recursos
│   ├── components/layout/
│   │   ├── AppLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── pages/                     # Pantallas React por módulo
│   ├── App.jsx                    # Sesión, estado y navegación
│   ├── main.jsx                   # Sólo arranque React
│   └── styles.css                 # Sistema visual responsive
├── server/db/                     # Schema y seed PostgreSQL actuales
├── tests/                         # Pruebas existentes
└── legacy/                        # Ver sección de legacy; aún está en raíz
```

## Frontend React activo

Páginas actuales:

- `DashboardPage.jsx`: KPIs, ventas recientes e inventario.
- `ProductsPage.jsx`: listado, búsqueda, crear, editar, activar/desactivar y enviar al POS.
- `ClientsPage.jsx`: listado, búsqueda, crear, editar y activar/desactivar.
- `PosPage.jsx`: catálogo, búsqueda, carrito, cliente, contado/crédito y registro de venta.
- `PurchasesPage.jsx`: proveedor, producto, cantidad, precios, total y registro de compra.
- `InstallmentsPage.jsx`: créditos abiertos y registro de abonos.
- `ReturnsPage.jsx`: registro e historial de devoluciones.
- `ReportsPage.jsx`: indicadores agregados de ventas, crédito, inventario y clientes.
- `RecordsPage.jsx`: listado reutilizable para registros simples.
- `SuppliersPage.jsx`: crear y listar proveedores.
- `EmployeesPage.jsx`: crear, editar y activar/desactivar colaboradores.

`App.jsx` carga los recursos y decide la página mediante `getPage()`.

## Backend REST activo

### Autenticación

```text
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Clientes

```text
GET   /api/v1/clients
GET   /api/v1/clients/:id
GET   /api/v1/clients/:id/credit-history
POST  /api/v1/clients
PUT   /api/v1/clients/:id
PATCH /api/v1/clients/:id/status
```

### Productos

```text
GET   /api/v1/products
GET   /api/v1/products/:id
POST  /api/v1/products
PUT   /api/v1/products/:id
PATCH /api/v1/products/:id/status
```

### Ventas y POS

```text
GET  /api/v1/sales
POST /api/v1/sales
```

El payload de venta usa:

```json
{
  "idVenta": 123,
  "idCliente": 1,
  "idVendedor": 2,
  "tipoVenta": "Contado",
  "totalVenta": 100,
  "items": [{ "idProducto": 1, "cantidad": 1, "precioUnitario": 100 }]
}
```

### Compras

```text
GET  /api/v1/purchases
POST /api/v1/purchases
```

### Abonos

```text
GET  /api/v1/installments
POST /api/v1/installments
```

### Devoluciones

```text
GET  /api/v1/returns
POST /api/v1/returns
```

### Proveedores

```text
GET  /api/v1/suppliers
POST /api/v1/suppliers
```

### Colaboradores

```text
GET   /api/v1/employees
POST  /api/v1/employees
PUT   /api/v1/employees/:id
PATCH /api/v1/employees/:id/status
```

### Reportes

```text
GET /api/v1/reports/summary
```

## Cambios ya realizados

- Express sirve React desde `client/dist` en el puerto `4000`.
- `app.js` quedó reducido a arrancar la única composición Express de `server/src/app.js`.
- Reportes quedó separado en ruta, controlador y servicio, sin SQL dentro del router.
- La carga del frontend quedó bajo demanda por pantalla; `resources.api.js` ya no solicita todos los recursos al iniciar sesión.
- La carga de recursos quedó extraída al hook `client/src/hooks/useResources.js`; `App.jsx` conserva sólo composición y navegación.
- Se centralizaron las validaciones numéricas y de líneas de productos para ventas y compras en `server/src/utils/validation.js`.
- Se extendieron las validaciones compartidas a productos, abonos y devoluciones.
- La API REST migrada se monta en el mismo servidor bajo `/api/v1`.
- Se eliminó la dependencia operativa de `5173`.
- Tailwind, PostCSS y Autoprefixer están configurados en `client`.
- `main.jsx` quedó reducido al arranque de React.
- `App.jsx` controla sesión, carga de datos y navegación.
- Sidebar, Topbar y AppLayout están separados.
- Se centralizaron API y carga de recursos.
- Productos, Clientes, POS, Compras, Abonos, Devoluciones, Reportes, Proveedores y Colaboradores tienen páginas React.
- Productos y Clientes tienen crear, editar y activar/desactivar.
- Colaboradores tiene crear, editar y activar/desactivar.
- Se añadió historial de devoluciones con `GET /api/v1/returns`.
- Se añadieron validaciones básicas en los servicios REST.
- Se aplicó autorización de `Gerente` a las mutaciones de colaboradores, compras y proveedores, y a la edición/desactivación de productos.
- El sidebar queda fijo y el área de trabajo tiene scroll independiente.
- En móvil el menú se convierte en navegación horizontal inferior.

## Legacy eliminado

Se eliminaron los controladores, modelos, rutas, servicios, vistas, scripts, estilos y `router.js` de la aplicación anterior. Los tests históricos que los importaban deben migrarse a `server/src/modules` antes de volver a ejecutar la suite.

## Pendientes prioritarios

### 1. Verificación manual desde React

Probar en `http://localhost:4000`:

- Login y logout.
- Dashboard.
- Crear, editar y desactivar producto.
- Crear, editar y desactivar cliente.
- Crear proveedor.
- Crear, editar y desactivar colaborador.
- Crear compra y comprobar incremento de inventario.
- Crear venta contado y comprobar decremento de inventario.
- Crear venta crédito.
- Registrar abono.
- Registrar devolución y comprobar incremento de inventario.
- Revisar reportes.

### 2. Completar y validar permisos por rol

La API ya bloquea con `403` las mutaciones administrativas reservadas al gerente. Falta comprobar manualmente con un vendedor que no pueda ejecutar esas operaciones y decidir si la interfaz debe ocultar también los controles administrativos según `user.rol`.

### 3. Completar formularios avanzados

- Compras con múltiples productos en una sola orden.
- Edición de Proveedores.
- Edición de datos de usuario y credenciales de Colaboradores.
- Gestión de usuarios asociados a colaboradores.
- Detalle completo de una venta.
- Historial de crédito de cliente dentro de la interfaz.
- Exportación y descarga de reportes PDF/CSV.

### 4. Mejorar mantenibilidad

- Extraer componentes de formulario compartidos: `Field`, `SelectField`, `FormActions`. Ya existe el componente base `client/src/components/form/Field.jsx`; falta aplicarlo gradualmente a las páginas cuyo JSX histórico sigue comprimido.
- Extraer tablas y filas repetidas a componentes comunes.
- Separar los estilos CSS restantes en componentes o capas de Tailwind.
- Evitar JSX comprimido en líneas extensas.
- Añadir pruebas para los nuevos servicios REST y páginas críticas.

### 5. Eliminar legacy

La ejecución principal usa React, la API REST y Swagger UI en `http://localhost:4000/api-docs`.

Pendiente: actualizar las pruebas históricas para que apunten a los módulos REST, y después ejecutar build, tests y revisión manual final.

## Validaciones conocidas

Últimos resultados conocidos:

```text
Vite build exitoso
43 módulos transformados en una validación previa
14 suites aprobadas
60 tests aprobados
```

Para repetirlas:

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm.cmd run build:client
npm.cmd test -- --runInBand --silent
```

Si PowerShell muestra `bash: :Path: command not found`, el comando aun puede continuar porque la ejecución está pasando por una shell bash. En PowerShell normal debe usarse `$env:Path` como se muestra arriba.

## Regla para la siguiente sesión

La siguiente sesión debe comenzar leyendo este archivo y comprobando:

1. `git status --short`.
2. `client/src/App.jsx`.
3. `client/src/pages/`.
4. `server/src/modules/`.
5. El build del cliente.
6. La suite de tests.

No borrar carpetas legacy antes de comprobar manualmente los flujos indicados en este documento.
