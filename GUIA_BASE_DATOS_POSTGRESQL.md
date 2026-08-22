# Guía de Base de Datos PostgreSQL

## Requisitos

- Windows
- PostgreSQL 14 o superior
- PostgreSQL instalado en el puerto `5432`
- Node.js y npm
- Proyecto ubicado en:

```text
C:\Users\owner\Desktop\AMC Jenny 2.0
```

Esta guía está preparada para PostgreSQL 18.

## 1. Verificar PostgreSQL

Abre PowerShell y ejecuta:

```powershell
Get-Service postgresql*
```

El servicio debe mostrar:

```text
Status   Name
Running  postgresql-x64-18
```

Si está detenido, inicia el servicio:

```powershell
Start-Service postgresql-x64-18
```

## 2. Configurar las herramientas de PostgreSQL

Agrega PostgreSQL y Node.js al `PATH` de la sesión actual:

```powershell
$env:Path = "C:\Program Files\PostgreSQL\18\bin;C:\Program Files\nodejs;" + $env:Path
```

Comprueba que funcionen:

```powershell
psql --version
node --version
npm.cmd --version
```

Debe aparecer una versión similar a:

```text
psql (PostgreSQL) 18.6
```

Si `psql` no funciona, verifica que exista este archivo:

```text
C:\Program Files\PostgreSQL\18\bin\psql.exe
```

## 3. Configurar el archivo `.env`

El archivo activo está en la raíz del proyecto:

```text
.env
```

Debe contener valores similares a estos:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TU_CONTRASENA_DE_POSTGRES
DB_DATABASE=comercial_jenny

JWT_SECRET=AlmacenJenny
JWT_EXPIRES_IN=4h
```

Reemplaza `TU_CONTRASENA_DE_POSTGRES` por la contraseña definida durante la instalación de PostgreSQL.

El valor `DB_PASSWORD` es la contraseña de PostgreSQL. No es la contraseña de inicio de sesión de la aplicación.

No subas `.env` a Git. Ya está incluido en `.gitignore`.

## 4. Entrar a la carpeta del proyecto

```powershell
cd "C:\Users\owner\Desktop\AMC Jenny 2.0"
```

## 5. Crear la base de datos

Ejecuta:

```powershell
createdb -U postgres comercial_jenny
```

Introduce la contraseña de PostgreSQL cuando la solicite.

También puedes utilizar:

```powershell
psql -U postgres -c "CREATE DATABASE comercial_jenny;"
```

Si aparece el mensaje `database already exists`, la base ya está creada y puedes continuar.

## 6. Ejecutar el esquema

El esquema PostgreSQL está en:

```text
server/db/schema_postgres.sql
```

Este archivo crea:

- Tablas
- Relaciones entre tablas
- Tipos ENUM
- Triggers
- Funciones PL/pgSQL
- Vistas
- Reglas de inventario
- Reglas de crédito
- Reglas de abonos y devoluciones

Ejecuta:

```powershell
psql `
  -U postgres `
  -d comercial_jenny `
  -f "server\db\schema_postgres.sql"
```

## 7. Cargar los datos iniciales

El seed migrado está en:

```text
server/db/seed_postgres.sql
```

Contiene datos de:

- Personas
- Clientes
- Vendedores
- Proveedores
- Productos
- Compras
- Ventas
- Abonos
- Récord crediticio
- Usuarios

Ejecuta:

```powershell
psql `
  -U postgres `
  -d comercial_jenny `
  -f "server\db\seed_postgres.sql"
```

El orden correcto es:

1. `schema_postgres.sql`
2. `seed_postgres.sql`

El archivo original de MySQL está guardado en:

```text
server/db/migrations/mysql_legacy.sql
```

No ejecutes ese archivo directamente en PostgreSQL.

## 8. Verificar las tablas

Abre una consola PostgreSQL:

```powershell
psql -U postgres -d comercial_jenny
```

Lista las tablas:

```sql
\dt
```

Deberías encontrar tablas como:

```text
persona
usuarios
productos
compras
detalle_compra
venta
detalle_venta
abonos
record_crediticio
productos_devueltos
```

Comprueba que existan datos:

```sql
SELECT COUNT(*) FROM persona;
SELECT COUNT(*) FROM productos;
SELECT COUNT(*) FROM venta;
SELECT COUNT(*) FROM usuarios;
```

Comprueba las vistas:

```sql
SELECT * FROM mostrarclientes LIMIT 5;
SELECT * FROM mostrarventas LIMIT 5;
SELECT * FROM showventascredito LIMIT 5;
```

Para salir:

```sql
\q
```

## 9. Instalar dependencias del proyecto

Desde la raíz del proyecto:

```powershell
npm.cmd install
npm.cmd --prefix client install
```

Se usa `npm.cmd` porque algunas configuraciones de PowerShell bloquean `npm.ps1`.

## 10. Iniciar la aplicación

Para iniciar la API nueva y el cliente React:

```powershell
npm.cmd run dev
```

Direcciones:

```text
Frontend React:  http://localhost:5173/
API REST:        http://localhost:4500/
Health check:    http://localhost:4500/api/v1/health
```

El sistema original con vistas EJS se ejecuta en:

```powershell
node app.js
```

Y queda disponible en:

```text
http://localhost:4000/login
```

## 11. Usuario de prueba

El usuario configurado para iniciar sesión en el sistema original es:

```text
Usuario: admin
Contraseña: admin
Rol: Gerente
```

La contraseña se guarda cifrada con bcrypt en PostgreSQL.

## 12. Restablecer el usuario admin

Si necesitas volver a configurar el usuario `admin`, ejecuta desde la raíz:

```powershell
$env:ADMIN_PASSWORD = "admin"
node server\scripts\reset-admin.js
Remove-Item Env:ADMIN_PASSWORD
```

El script actualiza el usuario gerente original y guarda la contraseña usando bcrypt.

## 13. Comprobar la API

Comprueba el estado de la API:

```powershell
Invoke-WebRequest `
  -Uri "http://localhost:4500/api/v1/health" `
  -UseBasicParsing
```

Respuesta esperada:

```json
{
  "success": true,
  "data": {
    "service": "comercial-jenny-api",
    "status": "ok"
  }
}
```

## Problemas frecuentes

### `psql no se reconoce`

Agrega la ruta correcta:

```powershell
$env:Path = "C:\Program Files\PostgreSQL\18\bin;" + $env:Path
```

### `npm.ps1 cannot be loaded`

Usa:

```powershell
npm.cmd run dev
```

### `database does not exist`

Crea la base:

```powershell
createdb -U postgres comercial_jenny
```

### `password authentication failed`

Revisa que `DB_PASSWORD` en `.env` coincida con la contraseña del usuario `postgres`.

### `EADDRINUSE`

Significa que el puerto ya está ocupado. Comprueba los procesos:

```powershell
Get-NetTCPConnection -LocalPort 4000,4500,5173 -State Listen
```

Si la aplicación ya está funcionando, utiliza las URLs existentes en lugar de iniciar otra instancia.

### Login vuelve a `/login`

Comprueba que:

1. PostgreSQL esté ejecutándose.
2. La base `comercial_jenny` exista.
3. Se hayan ejecutado el esquema y el seed.
4. El servidor original se haya reiniciado después de cambiar archivos.
5. Estés entrando por `http://localhost:4000/login`.
