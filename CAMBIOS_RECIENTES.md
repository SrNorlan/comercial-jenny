# Cambios Recientes - Comercial Jenny

## Resumen
Se completó la implementación de la relación vendedor-cliente para permitir que:
- Admin vea todos los clientes con información del vendedor que los creó
- Vendedores vean solo sus clientes
- Nuevos clientes se asignen automáticamente al vendedor que los crea

---

## Cambios en Base de Datos

### 1. Tabla `persona` - Nueva Columna
```sql
ALTER TABLE persona ADD COLUMN IF NOT EXISTS id_vendedor INT REFERENCES persona(id_persona);
```
- Almacena el ID del vendedor responsable de cada cliente
- Nulo para clientes sin asignar (creados por gerentes)
- Referencia a la misma tabla `persona`

### 2. Vista `mostrarclientes` - Actualizada
Se añadió un JOIN para incluir el nombre del vendedor:
```sql
CREATE OR REPLACE VIEW mostrarclientes AS 
SELECT c.id_persona AS id_cliente, 
       concat(c.nombre,' ',c.apellido) AS nombre, 
       c.cedula, c.telefono, 
       concat_ws(', ', 'Distrito '||c.distrito, c.zona_residencia, c.punto_referencia, 'Casa '||c.casa) AS direccion, 
       c.credito_disponible, 
       c.estado AS estado_cliente, 
       c.id_vendedor, 
       COALESCE(concat(v.nombre,' ',v.apellido), 'Admin') AS vendedor_nombre 
FROM persona c 
LEFT JOIN persona v ON c.id_vendedor = v.id_persona 
WHERE c.tipo_persona = 'Cliente';
```

### 3. Actualización de Datos Históricos
Se ejecutó un UPDATE que asigna a cada cliente histórico sin vendedor el vendedor de su venta más reciente:
```sql
UPDATE persona AS cliente
SET id_vendedor = asignacion.id_vendedor
FROM (
  SELECT DISTINCT ON (v.id_cliente) v.id_cliente, v.id_vendedor
  FROM venta v
  ORDER BY v.id_cliente, v.fecha_venta DESC, v.id_venta DESC
) AS asignacion
WHERE cliente.id_persona = asignacion.id_cliente
  AND cliente.tipo_persona = 'Cliente'
  AND cliente.id_vendedor IS NULL;
```
**Resultado:** 10 clientes históricos fueron asignados a sus vendedores

---

## Cambios en Servidor

### 1. `clients.service.js` - Filtrado por Vendedor
- `list(actor)`: Filtra clientes por vendedor usando `id_vendedor` o ventas con crédito pendiente
- `getById(id, actor)`: Solo retorna clientes del vendedor o sin asignar
- `create()`: Asigna automáticamente el vendedor actual al nuevo cliente
- Todas las operaciones verifican permisos del vendedor

### 2. Mantiene Validaciones
- Los vendedores solo ven sus clientes
- Los gerentes ven todos los clientes
- Los clientes nuevos se asignan al vendedor que los crea
- Se mantiene compatibilidad con ventas de crédito pendientes

---

## Cambios en Cliente (Frontend)

### `ClientsPage.jsx` - Mostrar Vendedor
Se actualizó la lista para mostrar el nombre del vendedor:
```jsx
<small>
  {pick(client, ['cedula', 'telefono', 'celular'], 'Sin datos de contacto')}
  {client.vendedor_nombre && ` • ${client.vendedor_nombre}`}
</small>
```

### `package.json` - Comando de Desarrollo
Se mejoró el script `dev:all`:
```json
"dev:all": "concurrently \"npm run dev:api\" \"npm --prefix client run dev\""
```
Ahora levanta servidor (nodemon) y cliente (Vite) en paralelo con hot reload.

---

## Scripts Disponibles

### Desarrollo (con hot reload)
```bash
npm run dev:all
```
- Servidor Node (API): `http://localhost:5000`
- Cliente Vite (React): `http://localhost:5173`

### Producción
```bash
npm run build:client && npm start:api
```

### Pruebas
```bash
npm test
```

---

## Estado Actual

✅ Filtrado de clientes por vendedor funcionando
✅ Clientes históricos asignados a sus vendedores  
✅ Vista incluye nombre del vendedor
✅ Frontend muestra información del vendedor
✅ Todas las pruebas pasadas (5/5)
✅ Compatibilidad con bases datos existentes (CREATE OR REPLACE)

---

## Próximos Pasos (Opcional)

- [ ] Agregar filtro visual en ClientsPage para vendedores
- [ ] Mostrar histórico de cambio de vendedor
- [ ] Dashboard por vendedor con sus clientes
- [ ] Reportes de clientes por vendedor
