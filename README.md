# Comercial Jenny

Sistema de gestión comercial con PostgreSQL, API REST, cliente React/Vite y Swagger UI.

## Requisitos

- Windows 10 o superior
- Node.js 18 o superior
- PostgreSQL 14 o superior, ejecutándose en el puerto `5432`

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
cd "C:\Users\owner\Documents\git\comercial-jenny"
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

Los comandos solicitarán la contraseña del usuario `postgres`. La base activa utiliza exclusivamente los archivos PostgreSQL indicados arriba.

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

## Levantar el sistema

Para desarrollo con recarga, abre dos terminales desde la raíz del proyecto.

Terminal 1, API:

```powershell
npm.cmd run dev:api
```

Terminal 2, cliente React/Vite:

```powershell
npm.cmd --prefix client run dev
```

Abre `http://localhost:4000`. Vite reenvía `/api` a `http://localhost:4500`.

Para servir el cliente compilado desde Express en el puerto `4000`:

```powershell
npm.cmd run build:client
npm.cmd run dev
```

Abre `http://localhost:4000`.

Si los puertos están ocupados, no inicies una segunda instancia. Usa las URLs de los procesos que ya están ejecutándose.

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

La interfaz interactiva de Swagger está disponible en `http://localhost:4500/api-docs` durante el desarrollo separado y en `http://localhost:4000/api-docs` cuando Express sirve el cliente compilado:

```text
Desarrollo separado: http://localhost:4500/api-docs
Cliente compilado:   http://localhost:4000/api-docs
```

La autenticación usa JWT en cookie HttpOnly o en el encabezado `Authorization: Bearer <token>`.

## Estado de la migración

La API PostgreSQL ya incluye autenticación, clientes, productos, ventas, compras, abonos, devoluciones, empleados, proveedores y reportes. Las operaciones críticas utilizan transacciones y los cambios de inventario, crédito y estados se gestionan mediante triggers PostgreSQL.

La interfaz activa es React/Vite y el backend activo es la API REST bajo `/api/v1`.

## Pruebas

Ejecuta las pruebas existentes con:

```powershell
npm.cmd test -- --runInBand
```
