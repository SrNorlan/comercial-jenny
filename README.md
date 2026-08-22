# Comercial Jenny

Sistema de gestión comercial con PostgreSQL, API REST, cliente React/Vite y una interfaz EJS heredada que se conserva durante la migración.

## Requisitos

- Windows 10 o superior
- Node.js 18 o superior
- PostgreSQL 14 o superior
- PostgreSQL ejecutándose en el puerto `5432`

La guía detallada está en [GUIA_BASE_DATOS_POSTGRESQL.md](GUIA_BASE_DATOS_POSTGRESQL.md).

## Preparar PostgreSQL

Comprueba el servicio:

```powershell
Get-Service postgresql*
```

Debe estar en estado `Running`. Para la instalación actual de PostgreSQL 18, agrega sus herramientas al `PATH`:

```powershell
$env:Path = "C:\Program Files\PostgreSQL\18\bin;C:\Program Files\nodejs;" + $env:Path
```

Entra en la carpeta del proyecto:

```powershell
cd "C:\Users\owner\Desktop\AMC Jenny 2.0"
```

Crea la base de datos:

```powershell
createdb -U postgres comercial_jenny
```

Ejecuta el esquema y los datos iniciales en este orden:

```powershell
psql -U postgres -d comercial_jenny -f "server\db\schema_postgres.sql"
psql -U postgres -d comercial_jenny -f "server\db\seed_postgres.sql"
```

Los comandos solicitarán la contraseña del usuario `postgres`. El archivo original de MySQL está en `server/db/migrations/mysql_legacy.sql` y no debe ejecutarse directamente en PostgreSQL.

## Configurar el entorno

La configuración activa está en `.env` en la raíz. Como mínimo, revisa estos valores:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TU_CONTRASENA_DE_POSTGRES
DB_DATABASE=comercial_jenny
JWT_SECRET=un-secreto-local
JWT_EXPIRES_IN=4h
```

No subas `.env` al repositorio. Está excluido mediante `.gitignore`.

## Instalar dependencias

Desde la raíz:

```powershell
npm.cmd install
npm.cmd --prefix client install
```

En PowerShell se recomienda `npm.cmd` si aparece el error `npm.ps1 cannot be loaded`.

## Levantar el sistema principal

El comando principal inicia el sistema completo original con sus vistas EJS:

```powershell
npm.cmd run dev
```

Abre:

```text
Sistema principal: http://localhost:4000/login
```

El sistema principal utiliza las vistas originales de clientes, productos, ventas, compras, abonos, proveedores, colaboradores, dashboard y reportes.

Si los puertos están ocupados, no inicies una segunda instancia. Usa las URLs de los procesos que ya están ejecutándose.

## Levantar servicios migrados

La API REST se inicia por separado:

```powershell
npm.cmd run dev:api
```

La API queda en `http://localhost:4500`.

El cliente React experimental se inicia por separado:

```powershell
npm.cmd run dev:client
```

React queda en `http://localhost:5173`.

Para iniciar los tres procesos al mismo tiempo:

```powershell
npm.cmd run dev:all
```

## Levantar el sistema original

La interfaz completa anterior usa EJS y está disponible en el puerto `4000`. Iníciala en otra terminal:

```powershell
node app.js
```

Si PowerShell no reconoce `node`, usa:

```powershell
& "C:\Program Files\nodejs\node.exe" app.js
```

Abre:

```text
http://localhost:4000/login
```

Credenciales de prueba:

```text
Usuario: admin
Contraseña: admin
Rol: Gerente
```

## API disponible

Las rutas REST están agrupadas bajo `/api/v1`:

```text
/api/v1/auth
/api/v1/clients
/api/v1/products
/api/v1/sales
/api/v1/purchases
/api/v1/installments
/api/v1/returns
/api/v1/employees
/api/v1/suppliers
/api/v1/reports
```

La autenticación usa JWT en cookie HttpOnly o en el encabezado `Authorization: Bearer <token>`.

## Estado de la migración

La API PostgreSQL ya incluye autenticación, clientes, productos, ventas, compras, abonos, devoluciones, empleados, proveedores y reportes. Las operaciones críticas utilizan transacciones y los cambios de inventario, crédito y estados se gestionan mediante triggers PostgreSQL.

Las carpetas `controllers/`, `models/`, `routes/`, `services/`, `views/` y `public/` contienen temporalmente la interfaz EJS original para mantenerla disponible durante la migración progresiva al cliente React.

## Pruebas

Ejecuta las pruebas existentes con:

```powershell
npm.cmd test -- --runInBand
```