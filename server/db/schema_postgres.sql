CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN CREATE TYPE tipo_persona_enum AS ENUM ('Cliente','Vendedor','Gerente','Sub-Gerente','Supervisor','Proveedor'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE estado_general_enum AS ENUM ('Activo','Inactivo'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE rol_usuario_enum AS ENUM ('Vendedor','Gerente'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE tipo_venta_enum AS ENUM ('Contado','Credito'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE estado_venta_enum AS ENUM ('Pagada','Abonandose','Cancelada'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE categoria_producto_enum AS ENUM ('Calzado','Prendas de Vestir','Cosmeticos','Electrodomesticos','Productos Plasticos'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE rango_reporte_enum AS ENUM ('mes','semana','quincena','rango'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS persona (
  id_persona SERIAL PRIMARY KEY, tipo_persona tipo_persona_enum NOT NULL, nombre VARCHAR(40) NOT NULL,
  apellido VARCHAR(40) NOT NULL, cedula VARCHAR(20) NOT NULL UNIQUE, telefono VARCHAR(15) NOT NULL,
  credito_disponible NUMERIC(10,2) DEFAULT NULL, distrito VARCHAR(5) NOT NULL, zona_residencia VARCHAR(50) NOT NULL,
  punto_referencia VARCHAR(100), distancia VARCHAR(60), casa VARCHAR(50), estado estado_general_enum NOT NULL DEFAULT 'Activo', comercio VARCHAR(80)
);
CREATE TABLE IF NOT EXISTS usuarios (
  userid SERIAL PRIMARY KEY, usuario VARCHAR(50) NOT NULL UNIQUE, contrasena VARCHAR(255) NOT NULL,
  rol rol_usuario_enum NOT NULL, id_persona INT REFERENCES persona(id_persona) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS productos (
  id_producto SERIAL PRIMARY KEY, marca VARCHAR(40) NOT NULL, existencia INT NOT NULL DEFAULT 0,
  precio_venta NUMERIC(10,2), precio_compra NUMERIC(10,2), color VARCHAR(30) NOT NULL, tipo VARCHAR(40) NOT NULL,
  fecha_ingreso DATE, categoria categoria_producto_enum NOT NULL, talla VARCHAR(15), modelo VARCHAR(40), clasificacion VARCHAR(35),
  dimensiones VARCHAR(20), unidad_medida VARCHAR(10), fecha_vencimiento DATE, estado_producto estado_general_enum NOT NULL DEFAULT 'Activo',
  CONSTRAINT productos_existencia_no_negativa CHECK (existencia >= 0)
);
CREATE TABLE IF NOT EXISTS compras (
  id_compra INT PRIMARY KEY, id_proveedor INT NOT NULL REFERENCES persona(id_persona), id_comprador INT NOT NULL REFERENCES persona(id_persona),
  fecha_compra DATE NOT NULL DEFAULT CURRENT_DATE, total_compra NUMERIC(10,2) NOT NULL CHECK (total_compra >= 0)
);
CREATE TABLE IF NOT EXISTS detalle_compra (
  id_detalle_compra SERIAL PRIMARY KEY, id_producto INT NOT NULL REFERENCES productos(id_producto), id_compra INT NOT NULL REFERENCES compras(id_compra) ON DELETE CASCADE,
  cantidad_comprada INT NOT NULL CHECK (cantidad_comprada > 0), precio_compra NUMERIC(10,2) NOT NULL, precio_venta NUMERIC(10,2) NOT NULL
);
CREATE TABLE IF NOT EXISTS venta (
  id_venta INT PRIMARY KEY, id_cliente INT NOT NULL REFERENCES persona(id_persona), id_vendedor INT NOT NULL REFERENCES persona(id_persona),
  tipo_venta tipo_venta_enum NOT NULL, fecha_venta DATE NOT NULL DEFAULT CURRENT_DATE, total_venta NUMERIC(10,2) NOT NULL CHECK (total_venta >= 0),
  plazo_compra DATE, frecuencia_abonos VARCHAR(20), estado_venta estado_venta_enum NOT NULL DEFAULT 'Abonandose'
);
CREATE TABLE IF NOT EXISTS detalle_venta (
  id_detalle_venta SERIAL PRIMARY KEY, id_producto INT NOT NULL REFERENCES productos(id_producto), id_venta INT NOT NULL REFERENCES venta(id_venta) ON DELETE CASCADE,
  cant_vendida INT NOT NULL CHECK (cant_vendida > 0), precio_unitario NUMERIC(10,2) NOT NULL
);
CREATE TABLE IF NOT EXISTS abonos (
  id_abono SERIAL PRIMARY KEY, id_venta INT NOT NULL REFERENCES venta(id_venta) ON DELETE CASCADE, monto_abonado NUMERIC(10,2) NOT NULL CHECK (monto_abonado > 0), fecha_abono DATE NOT NULL DEFAULT CURRENT_DATE
);
CREATE TABLE IF NOT EXISTS productos_devueltos (
  id_productodevuelto SERIAL PRIMARY KEY, id_producto INT REFERENCES productos(id_producto), id_venta INT REFERENCES venta(id_venta), cantidad_devuelta INT NOT NULL CHECK (cantidad_devuelta > 0), fecha_devolucion DATE DEFAULT CURRENT_DATE, motivo TEXT
);
CREATE TABLE IF NOT EXISTS record_crediticio (
  id_record SERIAL PRIMARY KEY, id_cliente INT NOT NULL REFERENCES persona(id_persona), id_venta INT NOT NULL REFERENCES venta(id_venta), cantidad_productos_adquiridos INT NOT NULL, total_comprado NUMERIC(10,2) NOT NULL, fecha_compra DATE NOT NULL, estado_compra VARCHAR(30)
);

CREATE OR REPLACE FUNCTION fn_venta_estado() RETURNS TRIGGER AS $$ BEGIN NEW.estado_venta := CASE WHEN NEW.tipo_venta = 'Contado' THEN 'Pagada'::estado_venta_enum ELSE 'Abonandose'::estado_venta_enum END; RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS tr_venta_bi ON venta;
CREATE TRIGGER tr_venta_bi BEFORE INSERT ON venta FOR EACH ROW EXECUTE FUNCTION fn_venta_estado();

CREATE OR REPLACE FUNCTION fn_compra_stock() RETURNS TRIGGER AS $$ BEGIN UPDATE productos SET existencia = existencia + NEW.cantidad_comprada, precio_compra = NEW.precio_compra, precio_venta = NEW.precio_venta, fecha_ingreso = (SELECT fecha_compra FROM compras WHERE id_compra = NEW.id_compra) WHERE id_producto = NEW.id_producto; RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS tr_detalle_compra_ai ON detalle_compra;
CREATE TRIGGER tr_detalle_compra_ai AFTER INSERT ON detalle_compra FOR EACH ROW EXECUTE FUNCTION fn_compra_stock();

CREATE OR REPLACE FUNCTION fn_venta_stock() RETURNS TRIGGER AS $$ BEGIN UPDATE productos SET existencia = existencia - NEW.cant_vendida WHERE id_producto = NEW.id_producto AND existencia >= NEW.cant_vendida; IF NOT FOUND THEN RAISE EXCEPTION 'Stock insuficiente para producto %', NEW.id_producto; END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS tr_detalle_venta_ai ON detalle_venta;
CREATE TRIGGER tr_detalle_venta_ai AFTER INSERT ON detalle_venta FOR EACH ROW EXECUTE FUNCTION fn_venta_stock();

CREATE OR REPLACE FUNCTION fn_venta_credito() RETURNS TRIGGER AS $$ BEGIN
  IF NEW.tipo_venta = 'Credito' THEN
    UPDATE persona SET credito_disponible = COALESCE(credito_disponible, 0) - NEW.total_venta WHERE id_persona = NEW.id_cliente;
  END IF;
  UPDATE persona SET estado = 'Activo' WHERE id_persona = NEW.id_cliente;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS tr_venta_ai ON venta;
CREATE TRIGGER tr_venta_ai AFTER INSERT ON venta FOR EACH ROW EXECUTE FUNCTION fn_venta_credito();

CREATE OR REPLACE FUNCTION fn_abono_estado() RETURNS TRIGGER AS $$ DECLARE saldo NUMERIC; total NUMERIC; cliente INT; fecha_limite DATE; cantidad INT; BEGIN
  SELECT v.total_venta, v.id_cliente, v.plazo_compra INTO total, cliente, fecha_limite FROM venta v WHERE v.id_venta = NEW.id_venta;
  SELECT total - COALESCE(SUM(monto_abonado), 0) INTO saldo FROM abonos WHERE id_venta = NEW.id_venta;
  IF saldo <= 0 THEN
    UPDATE venta SET estado_venta = 'Pagada' WHERE id_venta = NEW.id_venta;
    SELECT COALESCE(SUM(cant_vendida), 0) INTO cantidad FROM detalle_venta WHERE id_venta = NEW.id_venta;
    INSERT INTO record_crediticio (id_cliente, id_venta, cantidad_productos_adquiridos, total_comprado, fecha_compra, estado_compra)
    VALUES (cliente, NEW.id_venta, cantidad, total, CURRENT_DATE, CASE WHEN fecha_limite IS NULL OR NEW.fecha_abono <= fecha_limite THEN 'Pago a Tiempo' ELSE 'Pago con Retraso' END);
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS tr_abonos_ai ON abonos;
CREATE TRIGGER tr_abonos_ai AFTER INSERT ON abonos FOR EACH ROW EXECUTE FUNCTION fn_abono_estado();

CREATE OR REPLACE FUNCTION fn_record_credito() RETURNS TRIGGER AS $$ BEGIN
  UPDATE persona SET credito_disponible = GREATEST(0, LEAST(6000, COALESCE(credito_disponible, 0) + CASE WHEN NEW.estado_compra ILIKE 'Pago a Tiempo' THEN 500 WHEN NEW.estado_compra ILIKE 'Pago con Retraso' THEN -1000 ELSE 0 END)) WHERE id_persona = NEW.id_cliente;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS tr_record_crediticio_ai ON record_crediticio;
CREATE TRIGGER tr_record_crediticio_ai AFTER INSERT ON record_crediticio FOR EACH ROW EXECUTE FUNCTION fn_record_credito();

CREATE OR REPLACE FUNCTION fn_devolucion() RETURNS TRIGGER AS $$ DECLARE precio NUMERIC; cantidad INT; BEGIN
  SELECT precio_unitario, cant_vendida INTO precio, cantidad FROM detalle_venta WHERE id_venta = NEW.id_venta AND id_producto = NEW.id_producto FOR UPDATE;
  IF precio IS NULL OR NEW.cantidad_devuelta > cantidad THEN RAISE EXCEPTION 'Cantidad devuelta inválida'; END IF;
  UPDATE venta SET total_venta = total_venta - (precio * NEW.cantidad_devuelta) WHERE id_venta = NEW.id_venta;
  IF cantidad = NEW.cantidad_devuelta THEN DELETE FROM detalle_venta WHERE id_venta = NEW.id_venta AND id_producto = NEW.id_producto; ELSE UPDATE detalle_venta SET cant_vendida = cant_vendida - NEW.cantidad_devuelta WHERE id_venta = NEW.id_venta AND id_producto = NEW.id_producto; END IF;
  UPDATE productos SET existencia = existencia + NEW.cantidad_devuelta WHERE id_producto = NEW.id_producto;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS tr_productos_devueltos_ai ON productos_devueltos;
CREATE TRIGGER tr_productos_devueltos_ai AFTER INSERT ON productos_devueltos FOR EACH ROW EXECUTE FUNCTION fn_devolucion();

CREATE OR REPLACE VIEW mostrarclientes AS SELECT id_persona AS id_cliente, concat(nombre,' ',apellido) AS nombre, cedula, telefono, concat_ws(', ', 'Distrito '||distrito, zona_residencia, punto_referencia, 'Casa '||casa) AS direccion, credito_disponible, estado AS estado_cliente FROM persona WHERE tipo_persona = 'Cliente';
CREATE OR REPLACE VIEW mostrarcolaboradores AS SELECT id_persona AS id_vendedor, tipo_persona, concat(nombre,' ',apellido) AS nombre, cedula, telefono, concat_ws(', ', 'Distrito '||distrito, zona_residencia, punto_referencia, 'Casa '||casa) AS direccion, estado FROM persona WHERE tipo_persona NOT IN ('Cliente','Proveedor');
CREATE OR REPLACE VIEW mostrarproveedores AS SELECT id_persona AS id_proveedor, concat(nombre,' ',apellido) AS nombre, cedula, telefono, concat_ws(', ', 'Distrito '||distrito, zona_residencia, punto_referencia, 'Casa '||casa) AS direccion, comercio, estado FROM persona WHERE tipo_persona = 'Proveedor';
CREATE OR REPLACE VIEW mostrarventas AS SELECT v.id_venta, v.plazo_compra, v.frecuencia_abonos, v.tipo_venta, concat(c.nombre,' ',c.apellido) AS cliente, concat(p.nombre,' ',p.apellido) AS vendedor, v.fecha_venta, v.total_venta, v.estado_venta FROM venta v JOIN persona c ON c.id_persona=v.id_cliente JOIN persona p ON p.id_persona=v.id_vendedor;
CREATE OR REPLACE VIEW showventascredito AS SELECT v.id_venta, concat(c.nombre,' ',c.apellido) AS nombre_cliente, concat(p.nombre,' ',p.apellido) AS nombre_vendedor, v.tipo_venta, v.fecha_venta, v.total_venta, v.total_venta - COALESCE(SUM(a.monto_abonado),0) AS saldo_restante, v.plazo_compra, v.frecuencia_abonos FROM venta v JOIN persona c ON c.id_persona=v.id_cliente JOIN persona p ON p.id_persona=v.id_vendedor LEFT JOIN abonos a ON a.id_venta=v.id_venta WHERE v.tipo_venta='Credito' GROUP BY v.id_venta,c.nombre,c.apellido,p.nombre,p.apellido HAVING v.total_venta - COALESCE(SUM(a.monto_abonado),0) > 0;