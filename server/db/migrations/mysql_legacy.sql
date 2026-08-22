-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-05-2025 a las 02:22:58
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `comercial_jenny`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddProducto` (IN `p_Marca` VARCHAR(30), IN `p_Color` VARCHAR(30), IN `p_Tipo` VARCHAR(30), IN `p_Categoria` VARCHAR(30), IN `p_Talla` VARCHAR(15), IN `p_Modelo` VARCHAR(30), IN `p_Clasificacion` VARCHAR(30), IN `p_Dimensiones` VARCHAR(30), IN `p_Unidad_Medida` VARCHAR(10), IN `p_Fecha_Vencimiento` DATE)   BEGIN
    IF p_Categoria = 'Calzado' THEN -- calzado    
        INSERT INTO Productos (Marca, Existencia, Color, Tipo, Categoria, Talla, Modelo)
        VALUES (p_Marca, 0, p_Color, p_Tipo, p_Categoria , p_Talla, p_Modelo);
        
    ELSEIF p_Categoria = 'Prendas de Vestir' THEN -- vestimenta    
        INSERT INTO Productos (Marca, Existencia, Color, Tipo, Categoria, Talla)
        VALUES (p_Marca, 0, p_Color, p_Tipo, p_Categoria, p_Talla);
        
    ELSEIF p_Categoria = 'Cosmeticos' THEN -- cosmeticos
        INSERT INTO Productos (Marca, Existencia, Color, Tipo, Categoria, Clasificacion, Fecha_Vencimiento)
        VALUES (p_Marca,0,p_Color, p_Tipo, p_Categoria, p_Clasificacion,p_Fecha_Vencimiento);
        
    ELSEIF p_Categoria = 'Electrodomesticos' THEN -- electrodomesticos
        INSERT INTO Productos (Marca, Existencia, Color, Tipo, Categoria, Modelo)
        VALUES (p_Marca,0, p_Color, p_Tipo, p_Categoria, p_Modelo);
        
    ELSEIF p_Categoria = 'Productos Plasticos' THEN -- Productos plasticos
        INSERT INTO Productos (Marca, Existencia, Color, Tipo, Categoria, Dimensiones, Unidad_Medida)
        VALUES (p_Marca,0, p_Color, p_Tipo, p_Categoria, p_Dimensiones, p_Unidad_Medida);
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AddUser` (IN `p_user` VARCHAR(30), IN `p_Pass` VARCHAR(255), IN `p_Rol` SET('Vendedor','Gerente'), IN `p_Colaborador` INT)   BEGIN
    DECLARE contador INT;
    SELECT COUNT(*) INTO contador FROM usuarios WHERE usuarios.Id_Persona = p_Colaborador;
    
    IF contador = 0 THEN
        INSERT INTO usuarios (Usuario, Contraseña, Rol, Id_Persona)
        VALUES (p_user, p_Pass, p_Rol, p_Colaborador);
    ELSE
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No se puede insertar debido a que ya se ha registrado un usuario para este Colaborador';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `BuscarProducto` (IN `p_Categoria` VARCHAR(20), IN `p_IdProducto` INT)   CASE p_Categoria
    WHEN 'Calzado' THEN
        SELECT *,CONCAT(Categoria,' ',Tipo,' ',Marca,' ',Modelo,' Color ',Color,' Talla ',Talla) as 'Descripcion' FROM productos WHERE productos.Id_Producto = p_IdProducto;
    WHEN 'Prendas_Vestir' THEN
        SELECT *, CONCAT(productos.Tipo,' ',productos.Marca,' Color ',productos.Color,' Talla ',Talla) as 'Descripcion' FROM productos WHERE productos.Id_Producto = p_IdProducto;
    WHEN 'Cosmeticos' THEN
        SELECT *,CONCAT(Clasificacion,' ',productos.Tipo,' ',productos.Marca,' Color ',productos.Color) as 'Descripcion' FROM productos WHERE productos.Id_Producto = p_IdProducto;
    WHEN 'Electrodomesticos' THEN
        SELECT *, CONCAT(productos.Tipo,' ',productos.Marca,' ',Modelo,' Color ',productos.Color) as 'Descripcion' FROM productos WHERE productos.Id_Producto = p_IdProducto;
    WHEN 'Productos_Plasticos' THEN
        SELECT *,CONCAT(productos.Tipo,' ',productos.Marca,' Color ',productos.Color,' Dimensiones ',Dimensiones,' ',Unidad_Medida) as 'Descripcion' FROM productos WHERE productos.Id_Producto = p_IdProducto;
    WHEN 'Productos Plasticos' THEN
        SELECT *,CONCAT(productos.Tipo,' ',productos.Marca,' Color ',productos.Color,' Dimensiones ',Dimensiones,' ',Unidad_Medida) as 'Descripcion' FROM productos WHERE productos.Id_Producto = p_IdProducto;
            WHEN 'Prendas de Vestir' THEN
        SELECT *, CONCAT(productos.Tipo,' ',productos.Marca,' Color ',productos.Color,' Talla ',Talla) as 'Descripcion' FROM productos WHERE productos.Id_Producto = p_IdProducto;
END CASE$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `BuscarUser` (IN `ID` INT)   SELECT U.Usuario,U.Rol,CONCAT(P.Nombre,' ',P.Apellido) as 'Nombre',U.Id_Persona
FROM usuarios U 
INNER JOIN persona P on U.Id_Persona = P.Id_Persona
 WHERE U.Id_Persona = ID$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EditarPersona` (IN `id_persona` INT, IN `Cedula` VARCHAR(20), IN `Nombre` VARCHAR(40), IN `Apellido` VARCHAR(40), IN `Telefono` VARCHAR(10), IN `Distrito` CHAR(3), IN `ZonaResidencia` VARCHAR(30), IN `PuntoReferencia` VARCHAR(50), IN `Distancia` VARCHAR(60), IN `Casa` VARCHAR(20), IN `p_Tipo` VARCHAR(30), IN `p_Comercio` VARCHAR(50))   BEGIN
    DECLARE persona_found INT;

    -- Verificar si la persona existe
    SELECT COUNT(*) INTO persona_found FROM Persona WHERE Id_Persona = id_persona;

    IF persona_found > 0 THEN
        -- Actualizar la información de la persona
        UPDATE persona
        SET
            Nombre = Nombre,
            Apellido = Apellido,
            Telefono = Telefono,
            Distrito = Distrito,
            Zona_Residencia = ZonaResidencia,
            Punto_Referencia = PuntoReferencia,
            Distancia = Distancia,
            Casa = Casa,
            Tipo_Persona = p_Tipo,
            Comercio = p_Comercio
        WHERE
            persona.Id_Persona = id_persona;
    ELSE
        -- Mostrar un mensaje si la persona no fue encontrada
        SELECT 'No se encontró ninguna persona con esa cédula.' AS Message;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `IngresosVentasMensuales` ()   BEGIN
    -- Definimos variables para obtener el primer y el último día del mes actual
    DECLARE primer_dia_mes DATE;
    DECLARE ultimo_dia_mes DATE;

    SET primer_dia_mes := DATE_FORMAT(CURDATE(), '%Y-%m-01');
    SET ultimo_dia_mes := LAST_DAY(CURDATE());

    -- Consulta para obtener la suma de las ventas al contado del mes actual
SELECT
    ( SELECT IFNULL(SUM(venta.Total_Venta),0) AS total FROM venta
      WHERE 
     	venta.Tipo_Venta = 'Contado' AND venta.Fecha_Venta BETWEEN primer_dia_mes AND ultimo_dia_mes)
	+	

    -- Consulta para obtener la suma de los abonos de ventas a crédito del mes actual
    ( SELECT IFNULL(SUM(abonos.Monto_Abonado),0) AS total FROM abonos
      WHERE abonos.Fecha_Abono BETWEEN primer_dia_mes AND ultimo_dia_mes)
AS 'Ingresos';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `IngresosVentasMensualesVendedor` (IN `Id_Vendedor` INT)   BEGIN
    -- Definimos variables para obtener el primer y el último día del mes actual
    DECLARE primer_dia_mes DATE;
    DECLARE ultimo_dia_mes DATE;

    SET primer_dia_mes := DATE_FORMAT(CURDATE(), '%Y-%m-01');
    SET ultimo_dia_mes := LAST_DAY(CURDATE());

    -- Consulta para obtener la suma de las ventas al contado del mes actual filtrado por Id_Vendedor
    SELECT
        ( SELECT IFNULL(SUM(venta.Total_Venta),0) AS total FROM venta
          WHERE 
             venta.Tipo_Venta = 'Contado' 
          AND venta.Fecha_Venta BETWEEN primer_dia_mes AND ultimo_dia_mes
          AND venta.Id_Vendedor = Id_Vendedor)
        +    
        -- Consulta para obtener la suma de los abonos de ventas a crédito del mes actual filtrado por Id_Vendedor
        ( SELECT IFNULL(SUM(abonos.Monto_Abonado),0) AS total FROM abonos
          INNER JOIN venta ON abonos.Id_Venta = venta.Id_Venta
          WHERE abonos.Fecha_Abono BETWEEN primer_dia_mes AND ultimo_dia_mes
          AND venta.Id_Vendedor = Id_Vendedor)
    AS 'Ingresos';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarCompra` (IN `Id_Compra` INT(11), IN `Cedula_Proveedor` VARCHAR(20), IN `Cedula_Comprador` VARCHAR(20), IN `Fecha_Compra` DATE, IN `Total_Compra` DECIMAL(10,2))   BEGIN
	DECLARE Id_Proveedor INT; 
    DECLARE Id_Comprador INT;
    
    IF EXISTS (SELECT * FROM persona WHERE persona.Cedula = Cedula_Proveedor and persona.Tipo_Persona = 'Proveedor') THEN
    	SELECT Id_Persona INTO Id_Proveedor FROM persona WHERE persona.Cedula = Cedula_Proveedor;
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existe un Proveedor con esa Cedula';
	END IF;

	IF EXISTS (SELECT * FROM persona WHERE persona.Cedula = Cedula_Comprador and persona.Tipo_Persona = 'Gerente') THEN
    	SELECT Id_Persona INTO Id_Comprador FROM persona WHERE persona.Cedula = Cedula_Comprador;
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existe un Comprador con esa Cedula';
	END IF;
   
    INSERT INTO compras(Id_Compra,Id_Proveedor,Id_Comprador,Fecha_Compra,Total_Compra)
        	VALUES (Id_Compra, Id_Proveedor, Id_Comprador, Fecha_Compra, Total_Compra);    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarDetallesCompra` (IN `id_compra` INT(11), IN `id_producto` INT(11), IN `cant` INT(11), IN `precio_compra` DECIMAL(10,2), IN `precio_venta` DECIMAL(10,2))   BEGIN
	INSERT INTO detalle_compra (Id_Compra ,Id_Producto ,Cantidad_Comprada,Precio_Compra,Precio_Venta) 
    	VALUES (id_compra,id_producto,cant,precio_compra,precio_venta);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarDetallesVenta` (IN `id_venta` INT(11), IN `id_producto` INT(11), IN `cant_vendida` INT(11), IN `precio_unit` DECIMAL(10,2))   BEGIN
            INSERT INTO detalle_venta(Id_Venta,Id_Producto,Cant_Vendida,Precio_Unitario)
            VALUES (id_venta,id_producto,cant_vendida,precio_unit);
        END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarPersona` (IN `p_Tipo` VARCHAR(15), IN `p_Nombre` VARCHAR(50), IN `p_Apellido` VARCHAR(50), IN `p_Cedula` VARCHAR(17), IN `p_Telefono` VARCHAR(10), IN `p_Distrito` CHAR(2), IN `p_Zona_Residencia` VARCHAR(50), IN `p_Punto_Referencia` VARCHAR(50), IN `p_Distancia` VARCHAR(50), IN `p_Casa` VARCHAR(50), IN `p_Comercio` VARCHAR(30))   BEGIN
    DECLARE contador INT;
    
    SELECT COUNT(*) INTO contador FROM Persona WHERE Cedula = p_Cedula;
    
    IF contador = 0 THEN
    
        IF p_Tipo = 'Cliente' THEN
            INSERT INTO Persona (Tipo_Persona, Nombre, Apellido, Cedula, Telefono, Distrito, Zona_Residencia, Punto_Referencia, Distancia, Casa, Credito_Disponible)
            VALUES (p_Tipo, p_Nombre, p_Apellido, p_Cedula, p_Telefono, p_Distrito, p_Zona_Residencia, p_Punto_Referencia, p_Distancia, p_Casa, 2000);
            
        ELSEIF p_Tipo = 'Vendedor' THEN
            INSERT INTO Persona (Tipo_Persona, Nombre, Apellido, Cedula, Telefono, Distrito, Zona_Residencia, Punto_Referencia, Distancia, Casa)
            VALUES (p_Tipo, p_Nombre, p_Apellido, p_Cedula, p_Telefono, p_Distrito, p_Zona_Residencia, p_Punto_Referencia, p_Distancia, p_Casa);
            
		ELSEIF p_Tipo = 'Proveedor' THEN
        	INSERT INTO Persona (Tipo_Persona, Nombre, Apellido, Cedula, Telefono, Distrito, Zona_Residencia, Punto_Referencia, Distancia, Casa,Comercio)
            VALUES (p_Tipo, p_Nombre, p_Apellido, p_Cedula, p_Telefono, p_Distrito, p_Zona_Residencia, p_Punto_Referencia, p_Distancia, p_Casa, p_Comercio);
        ELSE 
            INSERT INTO Persona (Tipo_Persona, Nombre, Apellido, Cedula, Telefono, Distrito, Zona_Residencia, Punto_Referencia, Distancia, Casa)
                VALUES (p_Tipo, p_Nombre, p_Apellido, p_Cedula, p_Telefono, p_Distrito, p_Zona_Residencia, p_Punto_Referencia, p_Distancia, p_Casa);
        END IF;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se puede insertar debido a que ya existe un registro con este número de cédula.';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarProductos` (IN `p_Marca` VARCHAR(20), IN `p_Color` VARCHAR(10), IN `p_Tipo` VARCHAR(30), IN `p_Categoria` VARCHAR(20), IN `p_Talla` CHAR(10), IN `p_Modelo` VARCHAR(30), IN `p_Clasificacion` VARCHAR(25), IN `p_Dimensiones` VARCHAR(10), IN `p_Unidad_Medida` CHAR(5), IN `p_Fecha_Vencimiento` DATE)   BEGIN
    IF p_Categoria = 'Calzado' THEN -- calzado    
        INSERT INTO Productos (Marca, Existencia, Color, Tipo, Categoria, Talla, Modelo)
        VALUES (p_Marca, 0, p_Color, p_Tipo, p_Categoria , p_Talla, p_Modelo);
        
    ELSEIF p_Categoria = 'Prendas de Vestir' THEN -- vestimenta    
        INSERT INTO Productos (Marca, Existencia, Color, Tipo, Categoria, Talla)
        VALUES (p_Marca, 0, p_Color, p_Tipo, p_Categoria, p_Talla);
        
    ELSEIF p_Categoria = 'Cosmeticos' THEN -- cosmeticos
        INSERT INTO Productos (Marca, Existencia, Color, Tipo, Categoria, Clasificacion, Fecha_Vencimiento)
        VALUES (p_Marca,0,p_Color, p_Tipo, p_Categoria, p_Clasificacion,p_Fecha_Vencimiento);
        
    ELSEIF p_Categoria = 'Electrodomesticos' THEN -- electrodomesticos
        INSERT INTO Productos (Marca, Existencia, Color, Tipo, Categoria, Modelo)
        VALUES (p_Marca,0, p_Color, p_Tipo, p_Categoria, p_Modelo);
        
    ELSEIF p_Categoria = 'Productos Plasticos' THEN -- Productos plasticos
        INSERT INTO Productos (Marca, Existencia, Color, Tipo, Categoria, Dimensiones, Unidad_Medida)
        VALUES (p_Marca,0, p_Color, p_Tipo, p_Categoria, p_Dimensiones, p_Unidad_Medida);
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertarVenta` (IN `Id_Venta` INT(11), IN `tipo_venta` VARCHAR(8), IN `Cedula_Cliente` VARCHAR(20), IN `Cedula_Vendedor` VARCHAR(20), IN `Fecha_Venta` DATE, IN `Total_Venta` DECIMAL(10,2), IN `Plazo_Compra` VARCHAR(20), IN `Frecuencia_Abonos` VARCHAR(20))   BEGIN
	DECLARE Id_Cliente INT; 
    DECLARE Id_Vendedor INT;   
    DECLARE Credito_Cliente Decimal(10,2);
    
    IF EXISTS (SELECT * FROM persona WHERE persona.Cedula = Cedula_Cliente and persona.Tipo_Persona = 'Cliente') THEN
    	SELECT Id_Persona INTO Id_Cliente FROM persona WHERE persona.Cedula = Cedula_Cliente;
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existe un Cliente con esa Cedula';
	END IF;

	IF EXISTS (SELECT * FROM persona WHERE persona.Cedula = Cedula_Vendedor and persona.Tipo_Persona = 'Vendedor') THEN
    	SELECT Id_Persona INTO Id_Vendedor FROM persona WHERE persona.Cedula = Cedula_Vendedor;
	ELSE
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existe un Vendedor con esa Cedula';
	END IF;
    
    SELECT P.Credito_Disponible into Credito_Cliente
    from persona P
    WHERE P.Id_Persona = Id_Cliente;
    
    IF tipo_venta = 'Credito' THEN
    	IF Credito_Cliente >= Total_Venta THEN
        	INSERT INTO Venta(Id_Venta, Tipo_Venta, Total_Venta, Id_Cliente, Id_Vendedor, Fecha_Venta, Plazo_Compra, Frecuencia_Abonos)
        	VALUES (Id_Venta, tipo_venta, Total_Venta, Id_Cliente, Id_Vendedor, Fecha_Venta, Plazo_Compra, Frecuencia_Abonos);
    	ELSE
        	SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No posee Crédito Suficiente';
    END IF;
ELSEIF tipo_venta = 'Contado' THEN
    INSERT INTO Venta(Id_Venta, Tipo_Venta, Total_Venta, Id_Cliente, Id_Vendedor, Fecha_Venta)
    VALUES (Id_Venta, tipo_venta, Total_Venta, Id_Cliente, Id_Vendedor, Fecha_Venta);
END IF;

    
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `MostrarProductos` (IN `p_Categoria` VARCHAR(20))   CASE p_Categoria
    WHEN 'Calzado' THEN
        SELECT *,CONCAT(Categoria,' ',Tipo,' ',Marca,' ',Modelo,' COLOR ',Color,' TALLA ',Talla) as 'Descripcion' FROM productos WHERE productos.Categoria = 'Calzado';
    WHEN 'Prendas_Vestir' THEN
        SELECT *, CONCAT(productos.Tipo,' ',productos.Marca,' COLOR ',productos.Color,' TALLA ',Talla) as 'Descripcion' FROM productos WHERE productos.Categoria = 'Prendas de Vestir';
    WHEN 'Cosmeticos' THEN
        SELECT *,CONCAT(Clasificacion,' ',productos.Tipo,' ',productos.Marca,' COLOR ',productos.Color) as 'Descripcion' FROM productos WHERE productos.Categoria = 'Cosmeticos';
    WHEN 'Electrodomesticos' THEN
        SELECT *, CONCAT(productos.Tipo,' ',productos.Marca,' ',Modelo,' COLOR ',productos.Color) as 'Descripcion' FROM productos WHERE productos.Categoria = 'Electrodomesticos';
        
    WHEN 'Productos_Plasticos' THEN
        SELECT *,CONCAT(Tipo,' ',Marca,' COLOR ',Color,' DIMENSIONES ',Dimensiones,' ',Unidad_Medida) as 'Descripcion' FROM productos WHERE productos.Categoria = 'Productos Plasticos';
    
    WHEN 'Productos Plasticos' THEN
        SELECT *,CONCAT(productos.Tipo,' ',productos.Marca,' COLOR ',productos.Color,' DIMENSIONES ',Dimensiones,' ',Unidad_Medida) as 'Descripcion' FROM productos WHERE productos.Categoria = 'Productos Plasticos';
            WHEN 'Prendas de Vestir' THEN
        SELECT *, CONCAT(productos.Tipo,' ',productos.Marca,' COLOR ',productos.Color,' TALLA ',Talla) as 'Descripcion' FROM productos WHERE productos.Categoria = 'Prendas de Vestir';
END CASE$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `MostrarProductosMasVendidos` ()   BEGIN
    -- Crear una tabla temporal para almacenar los 5 productos más vendidos
    CREATE TEMPORARY TABLE TempProductosMasVendidos AS
    SELECT 
        P.Id_Producto,
        P.Categoria,
        P.Tipo,
        P.Marca,
        P.Modelo,
        P.Color,
        P.Talla,
        P.Clasificacion,
        P.Dimensiones,
        P.Unidad_Medida,
        SUM(DV.Cant_Vendida) AS total_vendido
    FROM 
        detalle_venta DV
    JOIN 
        productos P ON DV.Id_Producto = P.Id_Producto
    GROUP BY 
        P.Id_Producto, P.Categoria, P.Tipo, P.Marca, P.Modelo, P.Color, P.Talla, P.Clasificacion, P.Dimensiones, P.Unidad_Medida
    ORDER BY 
        total_vendido DESC
    LIMIT 5;

    -- Seleccionar y mostrar productos con descripciones adecuadas
    SELECT *,
        CASE
            WHEN Categoria = 'Calzado' THEN
                CONCAT(Categoria, ' ', Tipo, ' ', Marca, ' ', Modelo, ' COLOR ', Color, ' TALLA ', Talla)
            WHEN Categoria = 'Prendas_Vestir' OR Categoria = 'Prendas de Vestir' THEN
                CONCAT(Tipo, ' ', Marca, ' COLOR ', Color, ' TALLA ', Talla)
            WHEN Categoria = 'Cosmeticos' THEN
                CONCAT(Clasificacion, ' ', Tipo, ' ', Marca, ' COLOR ', Color)
            WHEN Categoria = 'Electrodomesticos' THEN
                CONCAT(Tipo, ' ', Marca, ' ', Modelo, ' COLOR ', Color)
            WHEN Categoria = 'Productos_Plasticos' OR Categoria = 'Productos Plasticos' THEN
                CONCAT(Tipo, ' ', Marca, ' COLOR ', Color, ' DIMENSIONES ', Dimensiones, ' ', Unidad_Medida)
            ELSE
                'Descripción no disponible'
        END AS Descripcion
    FROM TempProductosMasVendidos;

    -- Limpiar la tabla temporal
    DROP TEMPORARY TABLE TempProductosMasVendidos;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteCompras` (IN `rangoTiempo` ENUM('mes','semana','quincena','rango'), IN `fechaInicio` DATE, IN `fechaFin` DATE)   BEGIN
    DECLARE fechaInicioRango DATE;
    DECLARE fechaFinRango DATE;

    -- Determinar las fechas de inicio y fin basadas en el rango de tiempo
    IF rangoTiempo = 'mes' THEN
        -- Usar la fecha de inicio proporcionada para determinar el mes y año
        SET fechaInicioRango = DATE(CONCAT(YEAR(fechaInicio), '-', LPAD(MONTH(fechaInicio), 2, '0'), '-01'));
        SET fechaFinRango = LAST_DAY(fechaInicioRango);
    ELSEIF rangoTiempo = 'semana' THEN
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);
        SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 6 DAY);
    ELSEIF rangoTiempo = 'quincena' THEN
        IF DAY(CURDATE()) <= 15 THEN
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
            SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 14 DAY);
        ELSE
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-15 DAY);
            SET fechaFinRango = LAST_DAY(CURDATE());
        END IF;
    ELSEIF rangoTiempo = 'rango' THEN
        SET fechaInicioRango = fechaInicio;
        SET fechaFinRango = fechaFin;
    ELSE
        -- Caso por defecto: usar el mes actual
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
        SET fechaFinRango = LAST_DAY(CURDATE());
    END IF;

SELECT fechaInicioRango AS FechaInicio, fechaFinRango AS FechaFin;

    -- Consulta principal
    SELECT 
        p.Id_Producto,
        CASE 
            WHEN p.Categoria = 'Calzado' THEN
                CONCAT(p.Categoria, ' ', p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Prendas de Vestir' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Cosmeticos' THEN
                CONCAT(p.Clasificacion, ' ', p.Tipo, ' ', p.Marca, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Electrodomesticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Productos Plasticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' DIMENSIONES ', p.Dimensiones, ' ', p.Unidad_Medida)
            ELSE
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color) -- Default case if no category matches
        END AS Descripcion,
        SUM(dc.Cantidad_Comprada) AS TotalComprado,
        SUM(dc.Cantidad_Comprada * dc.Precio_Compra) AS TotalGastado
    FROM 
        productos p
    JOIN 
        detalle_compra dc ON p.Id_Producto = dc.Id_Producto
    JOIN 
        compras c ON dc.Id_Compra = c.Id_Compra
    WHERE 
        c.Fecha_Compra BETWEEN fechaInicioRango AND fechaFinRango
    GROUP BY 
        p.Id_Producto, Descripcion
    ORDER BY 
        TotalGastado DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteIngresos` (IN `rangoTiempo` ENUM('mes','semana','quincena','rango'), IN `fechaInicio` DATE, IN `fechaFin` DATE)   BEGIN
    DECLARE fechaInicioRango DATE;
    DECLARE fechaFinRango DATE;

    -- Determinar las fechas de inicio y fin basadas en el rango de tiempo
    IF rangoTiempo = 'mes' THEN
        -- Usar la fecha de inicio proporcionada para determinar el mes y año
        SET fechaInicioRango = DATE(CONCAT(YEAR(fechaInicio), '-', LPAD(MONTH(fechaInicio), 2, '0'), '-01'));
        SET fechaFinRango = LAST_DAY(fechaInicioRango);
    ELSEIF rangoTiempo = 'semana' THEN
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);
        SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 6 DAY);
    ELSEIF rangoTiempo = 'quincena' THEN
        IF DAY(CURDATE()) <= 15 THEN
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
            SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 14 DAY);
        ELSE
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-15 DAY);
            SET fechaFinRango = LAST_DAY(CURDATE());
        END IF;
    ELSEIF rangoTiempo = 'rango' THEN
        SET fechaInicioRango = fechaInicio;
        SET fechaFinRango = fechaFin;
    ELSE
        -- Caso por defecto: usar el mes actual
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
        SET fechaFinRango = LAST_DAY(CURDATE());
    END IF;

    -- Consulta principal
    SELECT 
        p.Id_Producto,
        CASE 
            WHEN p.Categoria = 'Calzado' THEN
                CONCAT(p.Categoria, ' ', p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Prendas de Vestir' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Cosmeticos' THEN
                CONCAT(p.Clasificacion, ' ', p.Tipo, ' ', p.Marca, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Electrodomesticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Productos Plasticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' DIMENSIONES ', p.Dimensiones, ' ', p.Unidad_Medida)
            ELSE
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color) -- Default case if no category matches
        END AS Descripcion,
        COALESCE(contado.IngresoTotal, 0) + COALESCE(credito.IngresoTotal, 0) AS IngresoTotal,
        COALESCE(contado.TotalVendido, 0) + COALESCE(credito.TotalVendido, 0) AS TotalVendido
    FROM 
        productos p
    LEFT JOIN (
        SELECT 
            dv.Id_Producto,
            SUM(dv.Cant_Vendida * dv.Precio_Unitario) AS IngresoTotal,
            SUM(dv.Cant_Vendida) AS TotalVendido
        FROM 
            venta v
        JOIN 
            detalle_venta dv ON v.Id_Venta = dv.Id_Venta
        WHERE 
            v.Tipo_Venta = 'contado' AND v.Fecha_Venta BETWEEN fechaInicioRango AND fechaFinRango
        GROUP BY 
            dv.Id_Producto
    ) AS contado ON p.Id_Producto = contado.Id_Producto
    LEFT JOIN (
        SELECT 
            dv.Id_Producto,
            SUM(a.Monto_Abonado) AS IngresoTotal,
            SUM(dv.Cant_Vendida) AS TotalVendido
        FROM 
            venta v
        JOIN 
            detalle_venta dv ON v.Id_Venta = dv.Id_Venta
        JOIN 
            abonos a ON v.Id_Venta = a.Id_Venta
        WHERE 
            v.Tipo_Venta = 'credito' AND v.Fecha_Venta BETWEEN fechaInicioRango AND fechaFinRango
        GROUP BY 
            dv.Id_Producto
    ) AS credito ON p.Id_Producto = credito.Id_Producto
    WHERE 
        contado.IngresoTotal IS NOT NULL OR credito.IngresoTotal IS NOT NULL
    ORDER BY 
        IngresoTotal DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteIngresosContado` (IN `rangoTiempo` ENUM('mes','semana','quincena','rango'), IN `fechaInicio` DATE, IN `fechaFin` DATE)   BEGIN
    DECLARE fechaInicioRango DATE;
    DECLARE fechaFinRango DATE;

    -- Determinar las fechas de inicio y fin basadas en el rango de tiempo
    IF rangoTiempo = 'mes' THEN
        -- Usar la fecha de inicio proporcionada para determinar el mes y año
        SET fechaInicioRango = DATE(CONCAT(YEAR(fechaInicio), '-', LPAD(MONTH(fechaInicio), 2, '0'), '-01'));
        SET fechaFinRango = LAST_DAY(fechaInicioRango);
    ELSEIF rangoTiempo = 'semana' THEN
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);
        SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 6 DAY);
    ELSEIF rangoTiempo = 'quincena' THEN
        IF DAY(CURDATE()) <= 15 THEN
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
            SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 14 DAY);
        ELSE
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-15 DAY);
            SET fechaFinRango = LAST_DAY(CURDATE());
        END IF;
    ELSEIF rangoTiempo = 'rango' THEN
        SET fechaInicioRango = fechaInicio;
        SET fechaFinRango = fechaFin;
    ELSE
        -- Caso por defecto: usar el mes actual
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
        SET fechaFinRango = LAST_DAY(CURDATE());
    END IF;
    
    SELECT 
    		p.Id_Producto,
            CASE 
                WHEN p.Categoria = 'Calzado' THEN
                    CONCAT(p.Categoria, ' ', p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color, ' TALLA ', p.Talla)
                WHEN p.Categoria = 'Prendas de Vestir' THEN
                    CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' TALLA ', p.Talla)
                WHEN p.Categoria = 'Cosmeticos' THEN
                    CONCAT(p.Clasificacion, ' ', p.Tipo, ' ', p.Marca, ' COLOR ', p.Color)
                WHEN p.Categoria = 'Electrodomesticos' THEN
                    CONCAT(p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color)
                WHEN p.Categoria = 'Productos Plasticos' THEN
                    CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' DIMENSIONES ', p.Dimensiones, ' ', p.Unidad_Medida)
                ELSE
                    CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color) -- Default case if no category matches
            END AS Descripcion,
            p.Categoria,
            SUM(dv.Cant_Vendida * dv.Precio_Unitario) AS IngresoTotal,
            SUM(dv.Cant_Vendida) AS TotalVendido
    FROM 
        venta v
    JOIN 
        detalle_venta dv ON v.Id_Venta = dv.Id_Venta
    JOIN 
        productos p ON dv.Id_Producto = p.Id_Producto
    WHERE 
        v.Tipo_Venta = 'contado'  AND v.Fecha_Venta BETWEEN fechaInicioRango AND fechaFinRango
    GROUP BY 
        p.Id_Producto
    ORDER BY 
        IngresoTotal DESC;

 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteIngresosContadoVendedor` (IN `rangoTiempo` ENUM('mes','semana','quincena','rango'), IN `fechaInicio` DATE, IN `fechaFin` DATE, IN `idVendedor` INT)   BEGIN
    DECLARE fechaInicioRango DATE;
    DECLARE fechaFinRango DATE;

    -- Determinar las fechas de inicio y fin basadas en el rango de tiempo
    IF rangoTiempo = 'mes' THEN
        -- Usar la fecha de inicio proporcionada para determinar el mes y año
        SET fechaInicioRango = DATE(CONCAT(YEAR(fechaInicio), '-', LPAD(MONTH(fechaInicio), 2, '0'), '-01'));
        SET fechaFinRango = LAST_DAY(fechaInicioRango);
    ELSEIF rangoTiempo = 'semana' THEN
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);
        SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 6 DAY);
    ELSEIF rangoTiempo = 'quincena' THEN
        IF DAY(CURDATE()) <= 15 THEN
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
            SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 14 DAY);
        ELSE
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-15 DAY);
            SET fechaFinRango = LAST_DAY(CURDATE());
        END IF;
    ELSEIF rangoTiempo = 'rango' THEN
        SET fechaInicioRango = fechaInicio;
        SET fechaFinRango = fechaFin;
    ELSE
        -- Caso por defecto: usar el mes actual
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
        SET fechaFinRango = LAST_DAY(CURDATE());
    END IF;

    -- Consulta principal
    SELECT 
        p.Id_Producto,
        CASE 
            WHEN p.Categoria = 'Calzado' THEN
                CONCAT(p.Categoria, ' ', p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Prendas de Vestir' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Cosmeticos' THEN
                CONCAT(p.Clasificacion, ' ', p.Tipo, ' ', p.Marca, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Electrodomesticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Productos Plasticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' DIMENSIONES ', p.Dimensiones, ' ', p.Unidad_Medida)
            ELSE
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color) -- Default case if no category matches
        END AS Descripcion,
        p.Categoria,
        SUM(dv.Cant_Vendida * dv.Precio_Unitario) AS IngresoTotal,
        SUM(dv.Cant_Vendida) AS TotalVendido
    FROM 
        venta v
    JOIN 
        detalle_venta dv ON v.Id_Venta = dv.Id_Venta
    JOIN 
        productos p ON dv.Id_Producto = p.Id_Producto
    WHERE 
        v.Tipo_Venta = 'contado'  
        AND v.Fecha_Venta BETWEEN fechaInicioRango AND fechaFinRango
        AND v.Id_Vendedor = idVendedor
    GROUP BY 
        p.Id_Producto
    ORDER BY 
        IngresoTotal DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteIngresosCredito` (IN `rangoTiempo` ENUM('mes','semana','quincena','rango'), IN `fechaInicio` DATE, IN `fechaFin` DATE)   BEGIN
    DECLARE fechaInicioRango DATE;
    DECLARE fechaFinRango DATE;

    -- Determinar las fechas de inicio y fin basadas en el rango de tiempo
    IF rangoTiempo = 'mes' THEN
        -- Usar la fecha de inicio proporcionada para determinar el mes y año
        SET fechaInicioRango = DATE(CONCAT(YEAR(fechaInicio), '-', LPAD(MONTH(fechaInicio), 2, '0'), '-01'));
        SET fechaFinRango = LAST_DAY(fechaInicioRango);
    ELSEIF rangoTiempo = 'semana' THEN
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);
        SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 6 DAY);
    ELSEIF rangoTiempo = 'quincena' THEN
        IF DAY(CURDATE()) <= 15 THEN
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
            SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 14 DAY);
        ELSE
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-15 DAY);
            SET fechaFinRango = LAST_DAY(CURDATE());
        END IF;
    ELSEIF rangoTiempo = 'rango' THEN
        SET fechaInicioRango = fechaInicio;
        SET fechaFinRango = fechaFin;
    ELSE
        -- Caso por defecto: usar el mes actual
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
        SET fechaFinRango = LAST_DAY(CURDATE());
    END IF;
    
    SELECT fechaInicioRango AS FechaInicio, fechaFinRango AS FechaFin;
    
SELECT 
			p.Id_Producto,
            CASE 
            WHEN p.Categoria = 'Calzado' THEN
                CONCAT(p.Categoria, ' ', p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Prendas de Vestir' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Cosmeticos' THEN
                CONCAT(p.Clasificacion, ' ', p.Tipo, ' ', p.Marca, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Electrodomesticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Productos Plasticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' DIMENSIONES ', p.Dimensiones, ' ', p.Unidad_Medida)
            ELSE
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color) -- Default case if no category matches
        END AS Descripcion,
    p.Categoria,
    SUM(a.Monto_Abonado) AS IngresoTotal,
    SUM(dv.Cant_Vendida) AS TotalVendido
FROM 
    venta v
JOIN 
    detalle_venta dv ON v.Id_Venta = dv.Id_Venta
JOIN 
    productos p ON dv.Id_Producto = p.Id_Producto
JOIN 
    abonos a ON v.Id_Venta = a.Id_Venta
WHERE 
    v.Tipo_Venta = 'credito' AND v.Fecha_Venta BETWEEN fechaInicioRango AND fechaFinRango
GROUP BY 
    p.Id_Producto
ORDER BY 
    IngresoTotal DESC;

 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteIngresosCreditoVendedor` (IN `rangoTiempo` ENUM('mes','semana','quincena','rango'), IN `fechaInicio` DATE, IN `fechaFin` DATE, IN `idVendedor` INT)   BEGIN
    DECLARE fechaInicioRango DATE;
    DECLARE fechaFinRango DATE;

    -- Determinar las fechas de inicio y fin basadas en el rango de tiempo
    IF rangoTiempo = 'mes' THEN
        -- Usar la fecha de inicio proporcionada para determinar el mes y año
        SET fechaInicioRango = DATE(CONCAT(YEAR(fechaInicio), '-', LPAD(MONTH(fechaInicio), 2, '0'), '-01'));
        SET fechaFinRango = LAST_DAY(fechaInicioRango);
    ELSEIF rangoTiempo = 'semana' THEN
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);
        SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 6 DAY);
    ELSEIF rangoTiempo = 'quincena' THEN
        IF DAY(CURDATE()) <= 15 THEN
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
            SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 14 DAY);
        ELSE
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-15 DAY);
            SET fechaFinRango = LAST_DAY(CURDATE());
        END IF;
    ELSEIF rangoTiempo = 'rango' THEN
        SET fechaInicioRango = fechaInicio;
        SET fechaFinRango = fechaFin;
    ELSE
        -- Caso por defecto: usar el mes actual
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
        SET fechaFinRango = LAST_DAY(CURDATE());
    END IF;
    
    SELECT fechaInicioRango AS FechaInicio, fechaFinRango AS FechaFin;
    
    SELECT 
        p.Id_Producto,
        CASE 
            WHEN p.Categoria = 'Calzado' THEN
                CONCAT(p.Categoria, ' ', p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Prendas de Vestir' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Cosmeticos' THEN
                CONCAT(p.Clasificacion, ' ', p.Tipo, ' ', p.Marca, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Electrodomesticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Productos Plasticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' DIMENSIONES ', p.Dimensiones, ' ', p.Unidad_Medida)
            ELSE
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color) -- Default case if no category matches
        END AS Descripcion,
        p.Categoria,
        SUM(a.Monto_Abonado) AS IngresoTotal,
        SUM(dv.Cant_Vendida) AS TotalVendido
    FROM 
        venta v
    JOIN 
        detalle_venta dv ON v.Id_Venta = dv.Id_Venta
    JOIN 
        productos p ON dv.Id_Producto = p.Id_Producto
    JOIN 
        abonos a ON v.Id_Venta = a.Id_Venta
    WHERE 
        v.Tipo_Venta = 'credito' 
        AND v.Fecha_Venta BETWEEN fechaInicioRango AND fechaFinRango
        AND (idVendedor IS NULL OR v.Id_Vendedor = idVendedor)
    GROUP BY 
        p.Id_Producto
    ORDER BY 
        IngresoTotal DESC;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ReporteIngresosVendedor` (IN `rangoTiempo` ENUM('mes','semana','quincena','rango'), IN `fechaInicio` DATE, IN `fechaFin` DATE, IN `idVendedor` INT)   BEGIN
    DECLARE fechaInicioRango DATE;
    DECLARE fechaFinRango DATE;

    -- Determinar las fechas de inicio y fin basadas en el rango de tiempo
    IF rangoTiempo = 'mes' THEN
        -- Usar la fecha de inicio proporcionada para determinar el mes y año
        SET fechaInicioRango = DATE(CONCAT(YEAR(fechaInicio), '-', LPAD(MONTH(fechaInicio), 2, '0'), '-01'));
        SET fechaFinRango = LAST_DAY(fechaInicioRango);
    ELSEIF rangoTiempo = 'semana' THEN
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY);
        SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 6 DAY);
    ELSEIF rangoTiempo = 'quincena' THEN
        IF DAY(CURDATE()) <= 15 THEN
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
            SET fechaFinRango = DATE_ADD(fechaInicioRango, INTERVAL 14 DAY);
        ELSE
            SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-15 DAY);
            SET fechaFinRango = LAST_DAY(CURDATE());
        END IF;
    ELSEIF rangoTiempo = 'rango' THEN
        SET fechaInicioRango = fechaInicio;
        SET fechaFinRango = fechaFin;
    ELSE
        -- Caso por defecto: usar el mes actual
        SET fechaInicioRango = DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY);
        SET fechaFinRango = LAST_DAY(CURDATE());
    END IF;

    -- Consulta principal
    SELECT 
        p.Id_Producto,
        CASE 
            WHEN p.Categoria = 'Calzado' THEN
                CONCAT(p.Categoria, ' ', p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Prendas de Vestir' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' TALLA ', p.Talla)
            WHEN p.Categoria = 'Cosmeticos' THEN
                CONCAT(p.Clasificacion, ' ', p.Tipo, ' ', p.Marca, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Electrodomesticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' ', p.Modelo, ' COLOR ', p.Color)
            WHEN p.Categoria = 'Productos Plasticos' THEN
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color, ' DIMENSIONES ', p.Dimensiones, ' ', p.Unidad_Medida)
            ELSE
                CONCAT(p.Tipo, ' ', p.Marca, ' COLOR ', p.Color) -- Default case if no category matches
        END AS Descripcion,
        COALESCE(contado.IngresoTotal, 0) + COALESCE(credito.IngresoTotal, 0) AS IngresoTotal,
        COALESCE(contado.TotalVendido, 0) + COALESCE(credito.TotalVendido, 0) AS TotalVendido
    FROM 
        productos p
    LEFT JOIN (
        SELECT 
            dv.Id_Producto,
            SUM(dv.Cant_Vendida * dv.Precio_Unitario) AS IngresoTotal,
            SUM(dv.Cant_Vendida) AS TotalVendido
        FROM 
            venta v
        JOIN 
            detalle_venta dv ON v.Id_Venta = dv.Id_Venta
        WHERE 
            v.Tipo_Venta = 'contado' 
            AND v.Fecha_Venta BETWEEN fechaInicioRango AND fechaFinRango
            AND (idVendedor IS NULL OR v.Id_Vendedor = idVendedor)
        GROUP BY 
            dv.Id_Producto
    ) AS contado ON p.Id_Producto = contado.Id_Producto
    LEFT JOIN (
        SELECT 
            dv.Id_Producto,
            SUM(a.Monto_Abonado) AS IngresoTotal,
            SUM(dv.Cant_Vendida) AS TotalVendido
        FROM 
            venta v
        JOIN 
            detalle_venta dv ON v.Id_Venta = dv.Id_Venta
        JOIN 
            abonos a ON v.Id_Venta = a.Id_Venta
        WHERE 
            v.Tipo_Venta = 'credito' 
            AND v.Fecha_Venta BETWEEN fechaInicioRango AND fechaFinRango
            AND (idVendedor IS NULL OR v.Id_Vendedor = idVendedor)
        GROUP BY 
            dv.Id_Producto
    ) AS credito ON p.Id_Producto = credito.Id_Producto
    WHERE 
        contado.IngresoTotal IS NOT NULL OR credito.IngresoTotal IS NOT NULL
    ORDER BY 
        IngresoTotal DESC;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_producto` (IN `p_IdProd` INT, IN `p_marca` VARCHAR(20), IN `p_color` VARCHAR(10), IN `p_tipo` VARCHAR(30), IN `p_talla` CHAR(10), IN `p_modelo` VARCHAR(30), IN `p_clasificacion` VARCHAR(25), IN `p_dimensiones` VARCHAR(10), IN `p_unidad_medida` CHAR(5), IN `p_Fecha_Vencimiento` DATE)   BEGIN
	UPDATE productos
    SET 
    	productos.Marca = p_marca,
        productos.Color = p_color,
        productos.Tipo = p_tipo,
        productos.Talla = p_talla,
        productos.Modelo = p_modelo,
        productos.Clasificacion = p_clasificacion,
        productos.Dimensiones =  p_dimensiones,
        productos.Unidad_Medida = p_unidad_medida,
        productos.Fecha_Vencimiento = p_Fecha_Vencimiento
     WHERE productos.Id_Producto = p_IdProd ;
        
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `abonos`
--

CREATE TABLE `abonos` (
  `Id_Abono` int(11) NOT NULL,
  `Id_Venta` int(11) NOT NULL,
  `Monto_Abonado` decimal(10,2) NOT NULL,
  `Fecha_Abono` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `abonos`
--

INSERT INTO `abonos` (`Id_Abono`, `Id_Venta`, `Monto_Abonado`, `Fecha_Abono`) VALUES
(92, 217581, 150.00, '2024-06-28'),
(93, 615147, 300.00, '2024-05-15'),
(94, 466405, 150.00, '2024-06-05'),
(95, 373630, 300.00, '2024-07-05'),
(96, 615147, 1030.00, '2025-03-06'),
(97, 217581, 150.00, '2025-05-01');

--
-- Disparadores `abonos`
--
DELIMITER $$
CREATE TRIGGER `Agregar_Record_Crediticio` AFTER INSERT ON `abonos` FOR EACH ROW BEGIN
    DECLARE saldo DECIMAL(10, 2);
    DECLARE fecha_venta DATE;
    DECLARE fecha_limite DATE;
    DECLARE total_Venta decimal(10,2);
    DECLARE estado_compra VARCHAR(20);
	Declare ClientID INT;
    DECLARE cant_Productos INT;
    
    -- OBTENER CANTIDAD DE PRODUCTOS
    SELECT SUM(DV.Cant_Vendida) INTO cant_Productos
    FROM detalle_venta DV
    WHERE DV.Id_Venta = NEW.Id_Venta
    GROUP by Id_Venta;
    
    -- Obtener el saldo restante para la venta actual
    SELECT (V.Total_Venta - SUM(A.Monto_Abonado)) INTO saldo
    FROM venta V
    LEFT JOIN 
    Abonos A ON V.Id_Venta = A.Id_Venta
    WHERE V.Id_Venta = NEW.Id_Venta
    GROUP BY V.Id_Venta;
    
    SELECT V.Total_Venta into total_Venta
    from venta V
    WHERE V.Id_Venta= NEW.Id_Venta;

    -- Obtener la fecha de venta
    SELECT venta.Fecha_Venta INTO fecha_venta
    FROM venta
    WHERE venta.Id_Venta = NEW.Id_Venta;
    
    -- Obtener Id cliente
	SELECT venta.Id_Cliente into ClientID
    from venta
	WHERE venta.Id_Venta = NEW.Id_Venta;

    -- Obtener Fecha Limite (PLAZO COMPRA)
    SELECT Plazo_Compra INTO fecha_limite
    FROM venta
    WHERE venta.Id_Venta = NEW.Id_Venta;
    
    -- Verificar si el saldo restante es 0
    IF saldo = 0 THEN
        -- Verificar si la fecha del último abono supera la fecha límite de pago
        IF NEW.Fecha_Abono > fecha_limite THEN
            SET estado_compra = 'Pago con Retraso';
        ELSE
            SET estado_compra = 'Pago a Tiempo';
        END IF;

        -- Insertar el registro en Record_Crediticio
        INSERT INTO Record_Crediticio (Id_Cliente, Id_Venta, Cantidad_Productos_Adquiridos, Total_Comprado, Fecha_Compra, Estado_Compra)
        VALUES (ClientID, NEW.Id_Venta, cant_Productos,total_Venta  , fecha_venta, estado_compra);
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `actualizar_estado_venta_abono` AFTER INSERT ON `abonos` FOR EACH ROW BEGIN
    DECLARE saldo DECIMAL(10, 2);

    -- Obtener el saldo restante para la venta actual
    SELECT (V.Total_Venta - SUM(A.Monto_Abonado)) INTO saldo
    FROM venta V
    LEFT JOIN 
    Abonos A ON V.Id_Venta = A.Id_Venta
    WHERE V.Id_Venta = NEW.Id_Venta
    GROUP BY V.Id_Venta;

    -- Si el saldo restante es 0, actualizar el estado de la venta a 'Pagada'
    IF saldo = 0 THEN
        UPDATE venta
        SET Estado_Venta = 'Pagada'
        WHERE Id_Venta = NEW.Id_Venta;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `Id_Compra` int(11) NOT NULL,
  `Id_Proveedor` int(11) NOT NULL,
  `Id_Comprador` int(11) NOT NULL,
  `Fecha_Compra` date NOT NULL,
  `Total_Compra` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`Id_Compra`, `Id_Proveedor`, `Id_Comprador`, `Fecha_Compra`, `Total_Compra`) VALUES
(110708, 78, 2, '2024-04-08', 10495.00),
(221417, 71, 1, '2024-07-01', 990.00),
(549869, 71, 3, '2024-07-02', 2790.00),
(807476, 86, 2, '2025-05-02', 2800.00),
(884472, 80, 75, '2024-03-07', 12850.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compra`
--

CREATE TABLE `detalle_compra` (
  `Id_Detalle_Compra` int(11) NOT NULL,
  `Id_Producto` int(11) NOT NULL,
  `Id_Compra` int(11) NOT NULL,
  `Cantidad_Comprada` int(11) NOT NULL,
  `Precio_Compra` decimal(10,2) NOT NULL,
  `Precio_Venta` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_compra`
--

INSERT INTO `detalle_compra` (`Id_Detalle_Compra`, `Id_Producto`, `Id_Compra`, `Cantidad_Comprada`, `Precio_Compra`, `Precio_Venta`) VALUES
(49, 90, 110708, 5, 125.00, 310),
(50, 91, 110708, 5, 100.00, 300),
(51, 92, 110708, 5, 160.00, 350),
(52, 93, 110708, 5, 250.00, 3),
(53, 94, 110708, 4, 280.00, 380),
(54, 95, 110708, 5, 280.00, 400),
(55, 96, 110708, 5, 400.00, 550),
(56, 97, 110708, 4, 250.00, 600),
(57, 98, 110708, 4, 450.00, 650),
(58, 99, 884472, 3, 580.00, 4),
(59, 100, 884472, 3, 420.00, 3),
(60, 101, 884472, 5, 550.00, 3),
(61, 102, 884472, 2, 2875.00, 1),
(62, 103, 884472, 3, 450.00, 2),
(63, 107, 221417, 5, 150.00, 350),
(64, 109, 221417, 3, 80.00, 300),
(65, 93, 549869, 3, 150.00, 360),
(66, 94, 549869, 3, 130.00, 400),
(67, 95, 549869, 2, 230.00, 380),
(68, 96, 549869, 3, 230.00, 350),
(69, 97, 549869, 2, 400.00, 600),
(70, 110, 807476, 8, 350.00, 750);

--
-- Disparadores `detalle_compra`
--
DELIMITER $$
CREATE TRIGGER `actualizar_fecha_ingreso` AFTER INSERT ON `detalle_compra` FOR EACH ROW BEGIN
	DECLARE Fecha Date;
    
    SELECT  C.Fecha_Compra into Fecha
    from compras C
    WHERE C.Id_Compra = NEW.Id_Compra;
    
    UPDATE productos
    SET fecha_ingreso = Fecha
    WHERE productos.Id_Producto = NEW.Id_Producto;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `agregarExistenciaProducto` AFTER INSERT ON `detalle_compra` FOR EACH ROW BEGIN
    -- Actualizar la existencia del producto
    UPDATE productos
    SET 
    	productos.Existencia = productos.Existencia + NEW.Cantidad_Comprada,
        productos.Precio_Compra = NEW.Precio_Compra,
        productos.Precio_Venta = NEW.Precio_Venta
    WHERE productos.Id_Producto = NEW.Id_Producto;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `Id_Detalle_Venta` int(11) NOT NULL,
  `Id_Producto` int(11) NOT NULL,
  `Id_Venta` int(11) NOT NULL,
  `Cant_Vendida` int(11) NOT NULL,
  `Precio_Unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_venta`
--

INSERT INTO `detalle_venta` (`Id_Detalle_Venta`, `Id_Producto`, `Id_Venta`, `Cant_Vendida`, `Precio_Unitario`) VALUES
(117, 91, 78084, 2, 300.00),
(118, 92, 78084, 1, 350.00),
(119, 97, 662407, 2, 600.00),
(120, 95, 662407, 1, 380.00),
(121, 102, 405771, 1, 4300.00),
(122, 103, 118031, 1, 680.00),
(123, 107, 995488, 1, 350.00),
(124, 109, 995488, 1, 300.00),
(125, 91, 929356, 1, 300.00),
(126, 90, 929356, 1, 310.00),
(127, 103, 538697, 1, 680.00),
(128, 102, 538697, 1, 4300.00),
(129, 109, 424280, 1, 300.00),
(130, 96, 767405, 1, 350.00),
(131, 93, 612536, 1, 360.00),
(132, 106, 804582, 1, 650.00),
(133, 103, 615147, 1, 680.00),
(134, 100, 615147, 1, 650.00),
(135, 105, 373630, 1, 950.00),
(136, 104, 373630, 1, 750.00),
(137, 95, 466405, 1, 380.00),
(138, 94, 466405, 1, 400.00),
(139, 104, 217581, 1, 750.00),
(140, 97, 610229, 1, 600.00);

--
-- Disparadores `detalle_venta`
--
DELIMITER $$
CREATE TRIGGER `actualizar_estado_venta_Cancelada` AFTER DELETE ON `detalle_venta` FOR EACH ROW BEGIN
    DECLARE cantidad_registros INT;

    -- Contar la cantidad de registros restantes para la venta
    SELECT COUNT(*) INTO cantidad_registros
    FROM Detalle_Venta
    WHERE Id_Venta = OLD.Id_Venta;

    -- Si no quedan registros, actualizar el estado de la venta a 'Cancelada'
    IF cantidad_registros = 0 THEN
        UPDATE Venta
        SET Estado_Venta = 'Cancelada'
        WHERE Id_Venta = OLD.Id_Venta;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `actualizar_existencia_despues_venta` AFTER INSERT ON `detalle_venta` FOR EACH ROW BEGIN
    UPDATE Productos
    SET Existencia = Existencia - NEW.Cant_Vendida
    WHERE Id_Producto = NEW.Id_Producto;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `historial_abonos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `historial_abonos` (
`Id_Abono` int(11)
,`Id_Venta` int(11)
,`Total_Venta` decimal(10,2)
,`Monto_Abonado` decimal(10,2)
,`Fecha_Abono` date
,`Saldo_Restante` decimal(33,2)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `infoproovedorcompra`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `infoproovedorcompra` (
`Id_Compra` int(11)
,`Proveedor` varchar(81)
,`Comercio` varchar(50)
,`Telefono` varchar(10)
,`Cedula` varchar(20)
,`Dirección` varchar(190)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `mostrarclientes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `mostrarclientes` (
`Id_Cliente` int(11)
,`Nombre` varchar(81)
,`Cedula` varchar(20)
,`Telefono` varchar(10)
,`Dirección` varchar(132)
,`Credito_Disponible` decimal(10,2)
,`Estado_Cliente` enum('Activo','Inactivo')
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `mostrarcolaboradores`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `mostrarcolaboradores` (
`Id_Vendedor` int(11)
,`Tipo_Persona` varchar(15)
,`Nombre` varchar(81)
,`Cedula` varchar(20)
,`Telefono` varchar(10)
,`Dirección` varchar(132)
,`Estado` enum('Activo','Inactivo')
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `mostrarcompras`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `mostrarcompras` (
`Id_Compra` int(11)
,`Fecha_Compra` date
,`Total_Compra` decimal(10,2)
,`Proveedor` varchar(81)
,`Comercio` varchar(50)
,`Comprador` varchar(81)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `mostrardetallecompras`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `mostrardetallecompras` (
`Producto` varchar(152)
,`Cantidad_Comprada` int(11)
,`Precio_Compra` decimal(10,2)
,`Precio_Venta` decimal(10,0)
,`Sub_Total` decimal(20,2)
,`Id_Compra` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `mostrardetalleventa`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `mostrardetalleventa` (
`Producto` varchar(152)
,`Cant_Vendida` int(11)
,`Precio_Unitario` decimal(10,2)
,`Sub_Total` decimal(20,2)
,`Id_Venta` int(11)
,`Id_Producto` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `mostrarproveedores`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `mostrarproveedores` (
`Id_Proveedor` int(11)
,`Nombre` varchar(81)
,`Cedula` varchar(20)
,`Telefono` varchar(10)
,`Dirección` varchar(128)
,`Comercio` varchar(50)
,`Estado` enum('Activo','Inactivo')
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `mostrarvendedores`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `mostrarvendedores` (
`Id_Vendedor` int(11)
,`Nombre` varchar(81)
,`Cedula` varchar(20)
,`Telefono` varchar(10)
,`Dirección` varchar(132)
,`Estado` enum('Activo','Inactivo')
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `mostrarventas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `mostrarventas` (
`Id_Venta` int(11)
,`Plazo_Compra` date
,`Frecuencia_Abonos` varchar(20)
,`Tipo_Venta` varchar(8)
,`Cliente` varchar(81)
,`Vendedor` varchar(81)
,`Fecha_Venta` date
,`Total_Venta` decimal(10,2)
,`Estado_Venta` enum('Pagada','Abonandose','Cancelada')
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `Id_Persona` int(11) NOT NULL,
  `Tipo_Persona` varchar(15) NOT NULL,
  `Nombre` varchar(40) NOT NULL,
  `Apellido` varchar(40) NOT NULL,
  `Cedula` varchar(20) NOT NULL,
  `Telefono` varchar(10) NOT NULL,
  `Credito_Disponible` decimal(10,2) DEFAULT NULL,
  `Distrito` char(3) NOT NULL,
  `Zona_Residencia` varchar(30) NOT NULL,
  `Punto_Referencia` varchar(50) DEFAULT NULL,
  `Distancia` varchar(60) DEFAULT NULL,
  `Casa` varchar(30) DEFAULT NULL,
  `Estado` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `Comercio` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`Id_Persona`, `Tipo_Persona`, `Nombre`, `Apellido`, `Cedula`, `Telefono`, `Credito_Disponible`, `Distrito`, `Zona_Residencia`, `Punto_Referencia`, `Distancia`, `Casa`, `Estado`, `Comercio`) VALUES
(1, 'Gerente', 'Kenneth', 'Silva', '001-060504-1008M', '75237218', NULL, 'VI', 'Praderas del Doral', '3 Etapa', 'Alameda 11', '874', 'Activo', NULL),
(2, 'Gerente', 'Norlan ', 'Gonzalez', '002-190903-0005F', '87365743', NULL, 'VI', 'Praderas del Doral', '3 Etapa', 'Alameda 11', '874', 'Activo', NULL),
(3, 'Gerente', 'Nahum', 'Gutierrez', '001-250304-0005F', '87574719', NULL, 'V', 'Praderas del Doral', 'De los Chilamates', '4 cuadras al lago', 'Esquinera roja', 'Activo', NULL),
(42, 'Cliente', 'Néstor', 'Silva ', '004-051274-0000G', '85387489', 1550.00, 'VI', 'Praderas Del Doral', '3 Etapa', ' Alameda 11 ', '874', 'Activo', NULL),
(43, 'Cliente', 'Isabellaaaa', 'Sandino', '001-240401-1060J', '22793218', 1720.00, 'V', 'Barrio La fuente', 'De la Iglesia el Calvario', '2 cuadras arriba', 'Roja J7', 'Activo', NULL),
(46, 'Cliente', 'Juan', 'González', '001-100403-1108M', '22791465', 1450.00, 'V', 'Don Bosco', 'De la Cruz Roja', '100 metros al sur', 'Roja Esquinera', 'Activo', NULL),
(47, 'Cliente', 'María', 'López', '001-060504-1568G', '57689314', 2000.00, 'IV', 'Primero de Mayo', 'Del Colegio Primero Mayo', '5 cuadras arriba', '125-A', 'Activo', NULL),
(48, 'Cliente', 'Carlos', 'Martínez', '001-020601-0000M', '72506412', 1250.00, 'VI', 'Barrio Campo Bruce', 'Del Colegio España', '1 cuadra al Oeste 1/2 al Norte', '875', 'Activo', NULL),
(49, 'Cliente', 'Ana', 'Hernández', '001-150174-1245G', '84163271', 2000.00, 'V', 'Colonia 14 Septiembre', 'Del Super Express 14 Septiembre', '3 andenes al lago, una y media abajo', 'Color mamon', 'Activo', NULL),
(50, 'Cliente', 'Luis', 'Ramírez', '417-120981-1289F', '56789012', 2000.00, 'IV', 'Barrio Campo Bruce', 'De donde fue el antiguo Cine Salinas', '1 cuadra y media al sur', 'Blanca', 'Activo', NULL),
(51, 'Cliente', 'Laura', 'Pérez', '003-261103-0001H', '76890123', 2000.00, 'VII', 'Villa Milagro de Dios', 'Colegio Una Cita con Dios', '2 Cuadras al sur', 'N69', 'Activo', NULL),
(52, 'Cliente', 'Pedro', 'Díaz', '001-261000-0007F', '78901234', 2000.00, 'VI', 'Las Delicias', 'De la Entrada a las Mercedes', '1 Km al lago', 'M56', 'Activo', NULL),
(53, 'Cliente', 'Sofía', 'Gómez', '004-140775-0102M', '89012345', 2000.00, 'VII', 'Sabana Grande', 'Del Cementerio San Jose', '1 cuadra antes', 'Verde Esquinera', 'Activo', NULL),
(54, 'Cliente', 'Daniel', 'Castro', '000-300588-0145M', '78951765', 2000.00, 'IV', 'La Salvadorita', 'Del Puente el Eden', '1 cuadra abajo 1/2 al lago', 'A562', 'Activo', NULL),
(55, 'Cliente', 'Elena', 'Sánchez', '001-060503-1008M', '22791832', 2000.00, 'I', 'Villa Venezuela', 'De la iglesia madre de Dios', '1 cuadra y media abajo 1/2 al algo', 'B1259', 'Activo', NULL),
(56, 'Cliente', 'Aaron', 'Gutierrez', '001-061209-104H', '88637500', 2000.00, 'VI', 'Residencial Montecristi', 'De la Entrada Principal', '1 cuadra abajo, 1 y 1/2 al sur', 'N° 218', 'Activo', NULL),
(57, 'Cliente', 'Moises', 'Gutierrez', '001-090610-105H', '87657540', 2000.00, 'III', 'San Judas', 'Del Centro de Salud', '2 cuadras al norte, 2 cuadras arriba y 1/2 cuadra al norte', '', 'Activo', NULL),
(58, 'Cliente', 'Irwingt', 'Gutierrez', '001-030802-106H', '89330800', 2000.00, 'III', 'Residencial Vista Hermosa', 'De los semaforos del parque Nacional de Ferias', '1 cuadra al norte, 1/2 cuadra abajo', 'N° 6', 'Activo', NULL),
(59, 'Cliente', 'Luis', 'Muñoz', '001-061222-107H', '87634500', 2000.00, 'III', 'Barrio Altagracia', 'De El Eskimo', '1 cuadra abajo', 'N° 580', 'Activo', NULL),
(60, 'Cliente', 'Reyna', 'Lopez', '001-060109-108H', '78637514', 2000.00, 'IV', 'Puente El Eden', 'La American University', 'contiguo a', '', 'Activo', NULL),
(61, 'Cliente', 'Oscar', 'Martinez', '001-240309-109H', '87761788', 2000.00, 'III', 'Barrio Tierra Prometida', 'De los semaforos del Israel Lewites', '3 cuadras al sur, 1 cuadra abajo', 'Color mamon', 'Activo', NULL),
(62, 'Cliente', 'Erling', 'Marenco', '001-151204-110H', '88637530', 300.00, 'VII', 'Rubenia', 'De la Iglesia Catolica', '1 cuadra al norte, 1 cuadra al oeste', 'I-32', 'Activo', NULL),
(63, 'Cliente', 'Aura', 'Vargas', '001-220301-111H', '88365709', 0.00, 'VI', 'Praderas del Doral', 'Del Parque', '1 cuadra al sur 1 arriba 1 al este 2 al sur y media al este', 'N° 870', 'Activo', NULL),
(64, 'Cliente', 'Yassira', 'Salgado', '001-061220-112H', '78144100', 2000.00, 'VI', 'Villa Reconciliacion', 'De la Bloquera Horward', '3 al norte', 'Esquinera Blanca', 'Activo', NULL),
(65, 'Cliente', 'Nayeli', 'Gonzalez', '001-010109-113H', '78634114', 2000.00, 'VI', 'Praderas del Doral', 'Del Parque', '1 cuadra al sur 1 arriba 1 al este 2 al sur y media al este', 'N° 874', 'Activo', NULL),
(68, 'Vendedor', 'Alvaro ', 'Mena Morales', '002-120589-1005F', '56897125', NULL, 'II', 'Villa Reconciliacion', 'De la Bloquera Horward', '5 cuadras arriba', 'Esquinera Blanca', 'Activo', NULL),
(69, 'Vendedor', 'Luis', 'Gurdian ', '223-050400-1104J', '22798654', NULL, 'II', 'Barrio Campo Bruce', 'Del Colegio España ', '3  cuadras abajo', 'Esquinera Color Mamon', 'Activo', NULL),
(70, 'Vendedor', 'Carlos', 'Martinez', '002-1240885-1005F', '58963215', NULL, 'II', 'Barrio Primera de Mayo ', 'Del Colegio Primero de Mayo', '2 Andenes al sur', 'K87', 'Activo', NULL),
(71, 'Proveedor', 'Carlos Isaia', 'Guinea', '002-060504-1027K', '75237218', NULL, 'V', 'Mercado Oriental', 'De la Gasolinera Uno', '300 Metros al Sur', 'Tramo A87', 'Activo', 'Almacén Alejandria'),
(72, 'Cliente', 'Luisa', 'Jimenez', '004-140200-0001G', '22587868', 2000.00, 'II', 'Praderas Del Doral', '2 Etapa', '', '526', 'Activo', NULL),
(73, 'Cliente', 'Natalia', 'Camado', '232-020874-0250K', '78507568', 2000.00, 'IV', 'Barrio Villa Israel', 'Del Centro de Salud Villa Israel ', '1 cuadra arriba', 'Roja Esquinera', 'Activo', NULL),
(74, 'Vendedor', 'Isaia', 'Velasquez', '003-051201-5620L', '89652165', NULL, 'II', 'Barrio Altagracia', 'Del Super Express Altagracia', '5 cuadras al sur', 'A89', 'Activo', NULL),
(75, 'Gerente', 'Jose', 'Delgado', '002-051600-2563K', '58689512', NULL, 'II', 'Barrio Villa Flor', 'Del Colegio Villa Flor', '4 cuadras y media al Sur', 'A24', 'Activo', NULL),
(76, 'Supervisor', 'Arnulfo de Jesus', 'Rodriguez Silva', '001-160865-0065M', '88746523', NULL, 'II', 'Barrio Tierra Prometida', 'a la par del Preescolar ', '', 'Color Mamon', 'Activo', NULL),
(77, 'Proveedor', 'Luis', 'Zavala', '002-021078-0065J', '22845689', NULL, 'I', 'Mercado Oriental', 'de la Gasolinera Uno', '300 metros al sur', 'Tramo A58', 'Activo', 'Distribuidora Bendicion de Dio'),
(78, 'Proveedor', 'Christian ', 'Gomez', '005-020578-0085J', '22793218', NULL, 'I', 'Ciudad Jardin', 'Puma Ciudad Jardin', '2 y media cuadra abajo', 'Tramo Esquinero', 'Activo', 'El rey del Buen Vestir'),
(79, 'Cliente', 'Keila ', 'Lechado', '002-110879-0026L', '58682756', 2000.00, 'VI', 'Praderas del Doral ', '3 etapa Alameda 11', '', '870', 'Activo', NULL),
(80, 'Proveedor', 'Juana ', 'Cruz', '231-051280-0025L', '22793217', NULL, 'II', 'Mercado Oriental', 'De la caimana', '1c al lago, 1c arriba', 'Tramo 10G', 'Activo', 'Distribuidora Electrónica La Bendición'),
(81, 'Cliente', 'Mario', 'Chamorro', '001-021374-0001M', '22793218', 1220.00, 'VI', 'Praderas del Doral', '3 Etapa Alameda 11', '', '874', 'Activo', NULL),
(82, 'Cliente', 'Arnoldo', 'Aleman Gallo', '002-051285-0023M', '22793156', 2000.00, 'VI', 'Barrio San Patricio', 'Del palo de mango', '500 varas al lago', '95N', 'Activo', NULL),
(83, 'Cliente', 'Alonso', 'Corazón de Tigre', '002-050404-1008L', '75236418', 2000.00, 'I', 'Praderas', 'De la costa', '5 cuadras al sur', 'Roja M58', 'Activo', NULL),
(84, 'Cliente', 'Hanseel', 'Centeno', '001-060504-1005M', '75237218', 2000.00, 'VI', 'ola', 'k', 'm', '5', 'Activo', NULL),
(85, 'Vendedor', 'Santiago Elias', 'Perez Zamora', '002-050601-1005A', '22791563', NULL, 'VI', 'Barrio Garita Norte', 'De donde escupio el borracho', '5 cuadras al sur', 'Casa Roja ', 'Activo', NULL),
(86, 'Proveedor', 'Alonso', 'Rosales', '002-012387-0404F', '22546523', NULL, 'II', 'Mercado Oriental', 'De la Gasolinera Uno', '5 cuadras al lago', 'Edificio Negro', 'Activo', 'Ramitex');

--
-- Disparadores `persona`
--
DELIMITER $$
CREATE TRIGGER `actualizar_rol_usuario` AFTER UPDATE ON `persona` FOR EACH ROW BEGIN
IF NEW.Tipo_Persona NOT IN ('Cliente', 'Proveedor') THEN
	IF NEW.Tipo_Persona = 'Vendedor' THEN
    	UPDATE usuarios
        SET usuarios.Rol = NEW.Tipo_Persona
        WHERE usuarios.Id_Persona = NEW.Id_Persona;
    ELSE 
    	UPDATE usuarios
        SET usuarios.Rol = 'Gerente'
        WHERE usuarios.Id_Persona = NEW.Id_Persona;
    END IF;
    

  END IF;
  
  
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `Id_Producto` int(11) NOT NULL,
  `Marca` varchar(20) NOT NULL,
  `Existencia` int(11) NOT NULL,
  `Precio_Venta` decimal(10,2) DEFAULT NULL,
  `Precio_Compra` decimal(10,0) DEFAULT NULL,
  `Color` varchar(25) NOT NULL,
  `Tipo` varchar(30) NOT NULL,
  `Fecha_Ingreso` date DEFAULT NULL,
  `Categoria` varchar(20) NOT NULL,
  `Talla` char(10) DEFAULT NULL,
  `Modelo` varchar(30) DEFAULT NULL,
  `Clasificacion` varchar(25) DEFAULT NULL,
  `Dimensiones` varchar(10) DEFAULT NULL,
  `Unidad_Medida` char(5) DEFAULT NULL,
  `Fecha_Vencimiento` date DEFAULT NULL,
  `Estado_Producto` set('Activo','Inactivo') NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`Id_Producto`, `Marca`, `Existencia`, `Precio_Venta`, `Precio_Compra`, `Color`, `Tipo`, `Fecha_Ingreso`, `Categoria`, `Talla`, `Modelo`, `Clasificacion`, `Dimensiones`, `Unidad_Medida`, `Fecha_Vencimiento`, `Estado_Producto`) VALUES
(90, 'NIKE', 4, 310.00, 125, 'NEGRO', 'TENNIS', '2024-04-08', 'Calzado', '42', 'AIR ZOOM PEGASUS 37', '', '', '', '0000-00-00', 'Activo'),
(91, 'NIKE', 11, 300.00, 100, 'AZUL', 'DEPORTIVO', '2024-04-08', 'Calzado', '39', ' REACT INFINITY RUN FLYKNIT', NULL, NULL, NULL, NULL, 'Activo'),
(92, 'ADIDAS', 4, 350.00, 160, 'AZUL', 'DEPORTIVO', '2024-04-08', 'Calzado', '40', 'ULTRABOOST 21', NULL, NULL, NULL, NULL, 'Activo'),
(93, 'NEVER LEGAL', 10, 360.00, 150, 'BLANCA', 'CAMISA', '2024-07-02', 'Prendas de Vestir', 'S', NULL, NULL, NULL, NULL, NULL, 'Activo'),
(94, 'LACOSTE', 6, 400.00, 130, 'NEGRO', 'CAMISETA', '2024-07-02', 'Prendas de Vestir', 'M', NULL, NULL, NULL, NULL, NULL, 'Activo'),
(95, 'LACOSTE', 5, 380.00, 230, 'ROJO', 'CAMISA', '2024-07-02', 'Prendas de Vestir', 'L', NULL, NULL, NULL, NULL, NULL, 'Activo'),
(96, 'LEVIS', 7, 350.00, 230, 'AZUL', 'PANTALON JEAN', '2024-07-02', 'Prendas de Vestir', '28', NULL, NULL, NULL, NULL, NULL, 'Activo'),
(97, 'LEVIS', 3, 600.00, 400, 'NEGRON', 'PANTALON', '2024-07-02', 'Prendas de Vestir', '30', NULL, NULL, NULL, NULL, NULL, 'Activo'),
(98, 'GUESS', 4, 650.00, 450, 'AZUL', 'PANTALON JEANS', '2024-04-08', 'Prendas de Vestir', '30', NULL, NULL, NULL, NULL, NULL, 'Activo'),
(99, 'OSTER', 7, 750.00, 580, 'BLANCO', 'PLANCHA DE VAPOR', '2024-03-07', 'Electrodomesticos', NULL, 'GCSTBS4801', NULL, NULL, NULL, NULL, 'Activo'),
(100, 'BLACK+DECKER', 5, 650.00, 420, 'NEGRO', 'LICUADORA', '2024-03-07', 'Electrodomesticos', NULL, 'BLBD10G', NULL, NULL, NULL, NULL, 'Activo'),
(101, 'HAMILTON BEACH', 8, 830.00, 550, 'ROJA', 'ARROCERA', '2024-03-07', 'Electrodomesticos', NULL, '37518', NULL, NULL, NULL, NULL, 'Activo'),
(102, 'SAMSUNG', 1, 4300.00, 2875, 'NEGRO', 'TELEVISOR 24 PUL', '2024-03-07', 'Electrodomesticos', '', ' UN24H4000', '', '', '', '0000-00-00', 'Activo'),
(103, 'OSTER', 2, 680.00, 450, 'BLANCA', 'LICUADORA', '2024-03-07', 'Electrodomesticos', NULL, 'BLST4655', NULL, NULL, NULL, NULL, 'Activo'),
(104, 'PROPLASA', 0, 750.00, 600, 'BLANCA', 'SILLA PLASTICA', '2024-03-06', 'Productos Plasticos', NULL, NULL, NULL, '90 X 45X 5', 'CM', NULL, 'Activo'),
(105, 'PROPLASA', 0, 950.00, 800, 'VERDE', 'MESA PLASTICA', '2024-03-06', 'Productos Plasticos', NULL, NULL, NULL, '74 X 70X 7', 'CM', NULL, 'Activo'),
(106, 'REAL PLASTICS', 1, 650.00, 380, 'MULTICOLOR', 'GAVETERO DE  CAJONES', '2024-03-06', 'Productos Plasticos', NULL, NULL, NULL, '100 X 40  ', 'CM', NULL, 'Activo'),
(107, 'MAYBELLINE', 5, 350.00, 150, 'BEIGE CLARO (SHADE 120)', 'BASE LIQUIDA', '2024-07-01', 'Cosmeticos', NULL, NULL, 'MAQUILLAJE', NULL, NULL, '2025-12-01', 'Activo'),
(109, 'BIOAQUA', 4, 300.00, 80, 'BLANCO (NEUTRO)', 'CREMA FACIAL', '2024-07-01', 'Cosmeticos', NULL, NULL, 'CUIDADO DE LA PIEL', NULL, NULL, '2026-06-20', 'Activo'),
(110, 'ADIDAS', 8, 750.00, 350, 'NEGRO', 'CAMISA', '2025-05-02', 'Prendas de Vestir', 'XS', NULL, NULL, NULL, NULL, NULL, 'Activo'),
(111, 'UNDERARMOUR', 0, NULL, NULL, 'AZUL', 'PANTALON', NULL, 'Prendas de Vestir', '34', NULL, NULL, NULL, NULL, NULL, 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_devueltos`
--

CREATE TABLE `productos_devueltos` (
  `Id_ProductoDevuelto` int(11) NOT NULL,
  `Id_Producto` int(11) DEFAULT NULL,
  `Id_Venta` int(11) DEFAULT NULL,
  `Cantidad_Devuelta` int(11) DEFAULT NULL,
  `Fecha_Devolucion` date DEFAULT NULL,
  `Motivo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `productos_devueltos`
--
DELIMITER $$
CREATE TRIGGER `actualizar_venta_Producto_Devuelto` AFTER INSERT ON `productos_devueltos` FOR EACH ROW BEGIN
    DECLARE cantidad_comprada_actual INT;
    DECLARE producto_precio DECIMAL(10, 2);
    DECLARE total_venta DECIMAL(10, 2);
    DECLARE nuevo_total DECIMAL(10, 2); 
    DECLARE total_productos DECIMAL(10, 2); 
    
    -- Obtener el precio unitario del producto
    SELECT D.Precio_Unitario INTO producto_precio
    FROM detalle_venta D
    WHERE D.Id_Producto = NEW.Id_Producto and D.Id_Venta=NEW.Id_Venta;
    
        -- Obtener Total Venta
        SELECT v.Total_Venta INTO total_venta
    FROM venta v
    WHERE v.Id_Venta=NEW.Id_Venta;

	SET total_productos = producto_precio * NEW.Cantidad_Devuelta;
    
    
    
-- Asignar nuevo Total
    SET nuevo_total = total_venta - total_productos;

    -- Restar el precio del producto devuelto al total de la venta
    UPDATE Venta
    SET Total_Venta = nuevo_total
    WHERE Id_Venta = NEW.Id_Venta;

    -- Obtener la cantidad comprada actual del producto en Detalle_Venta
    SELECT D.Cant_Vendida INTO cantidad_comprada_actual
    FROM Detalle_Venta D
    WHERE D.Id_Venta = NEW.Id_Venta AND D.Id_Producto = NEW.Id_Producto;

    -- Calcular la nueva cantidad comprada después de la devolución
    SET cantidad_comprada_actual = cantidad_comprada_actual - NEW.Cantidad_Devuelta;

    -- Actualizar la cantidad comprada en Detalle_Venta
    UPDATE Detalle_Venta 
    SET Cant_Vendida = cantidad_comprada_actual
    WHERE Id_Venta = NEW.Id_Venta AND Id_Producto = NEW.Id_Producto;

    -- Si la cantidad comprada es 0, eliminar el registro de Detalle_Venta
    IF cantidad_comprada_actual <= 0 THEN
        DELETE FROM Detalle_Venta 
        WHERE Id_Venta = NEW.Id_Venta AND Id_Producto = NEW.Id_Producto;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `record_crediticio`
--

CREATE TABLE `record_crediticio` (
  `Id_Record` int(11) NOT NULL,
  `Id_Cliente` int(11) NOT NULL,
  `Id_Venta` int(11) NOT NULL,
  `Cantidad_Productos_Adquiridos` int(11) NOT NULL,
  `Total_Comprado` decimal(10,2) NOT NULL,
  `Fecha_Compra` date NOT NULL,
  `Estado_Compra` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `record_crediticio`
--

INSERT INTO `record_crediticio` (`Id_Record`, `Id_Cliente`, `Id_Venta`, `Cantidad_Productos_Adquiridos`, `Total_Comprado`, `Fecha_Compra`, `Estado_Compra`) VALUES
(36, 63, 615147, 2, 1330.00, '2024-04-09', 'Pago con Retraso');

--
-- Disparadores `record_crediticio`
--
DELIMITER $$
CREATE TRIGGER `ajustar_credito_disponible` AFTER INSERT ON `record_crediticio` FOR EACH ROW BEGIN
    DECLARE credito_disponible_actual DECIMAL(10, 2);
    DECLARE nuevo_credito DECIMAL(10, 2);

    -- Obtener el crédito disponible actual del cliente
    SELECT Credito_Disponible INTO credito_disponible_actual
    FROM Persona
    WHERE Id_Persona = NEW.Id_Cliente;

    -- Verificar el estado de la compra y ajustar el crédito disponible
    IF NEW.Estado_Compra = 'Pago a tiempo' THEN
    	SET nuevo_credito = credito_disponible_actual + 500;
    ELSEIF NEW.Estado_Compra = 'Pago con retraso' THEN
    	SET nuevo_credito = credito_disponible_actual  - 1000;
    END IF;
    
    IF nuevo_credito < 0 THEN 
        UPDATE Persona
        SET Credito_Disponible = 0
        WHERE Id_Persona = NEW.Id_Cliente;
    ELSEIF nuevo_credito > 6000 THEN
        UPDATE Persona
        SET Credito_Disponible = 6000
        WHERE Id_Persona = NEW.Id_Cliente;
    ELSE
    	UPDATE Persona
        SET Credito_Disponible = nuevo_credito
        WHERE Id_Persona = NEW.Id_Cliente;
    END IF;
    	
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `showproductosdevueltos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `showproductosdevueltos` (
`Id_Venta` int(11)
,`Producto` varchar(152)
,`Cliente` varchar(81)
,`Vendedor` varchar(81)
,`Cantidad_Devuelta` int(11)
,`Fecha_Devolucion` date
,`Motivo` text
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `showventascredito`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `showventascredito` (
`Id_Venta` int(11)
,`Nombre_Cliente` varchar(81)
,`Nombre_Vendedor` varchar(81)
,`Tipo_Venta` varchar(8)
,`Fecha_Venta` date
,`Total_Venta` decimal(10,2)
,`Saldo_Restante` decimal(33,2)
,`Plazo_Compra` date
,`Frecuencia_Abonos` varchar(20)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `top_10_productos_mas_vendidos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `top_10_productos_mas_vendidos` (
`Id_Producto` int(11)
,`Descripcion` varchar(152)
,`IngresoTotal` decimal(43,2)
,`TotalVendido` decimal(33,0)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `UserID` int(11) NOT NULL,
  `Usuario` varchar(30) DEFAULT NULL,
  `Contraseña` varchar(255) DEFAULT NULL,
  `Rol` set('Vendedor','Gerente') NOT NULL,
  `Id_Persona` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`UserID`, `Usuario`, `Contraseña`, `Rol`, `Id_Persona`) VALUES
(4, 'kenth060', '$2a$08$1i84.z6aS5TgQvSlzXOn4OeI1qz/3yVdOMlka9CzN39B0z0EgVRW6', 'Gerente', 1),
(5, 'Ng2024', '$2a$08$CJSR7j2slck45NpWkomzHOqZVmOjq.ZIZ55jDIZDE1ja22.uuaIU2', 'Gerente', 2),
(8, 'a.mena.120589', '$2a$08$cId2n/TSu3kt4tdxzTAKROvCv8XgUctclTKYVkblE2zsdTZJBcscm', 'Vendedor', 68),
(9, 'l.gurdian.050400', '$2a$08$OcYORK/IzqORT4NpMsQLZuKZuQHap/CZkyREu3NR/EHeDiB81OxPS', 'Vendedor', 69),
(10, 'c.martinez.1240885', '$2a$08$1i84.z6aS5TgQvSlzXOn4OeI1qz/3yVdOMlka9CzN39B0z0EgVRW6', 'Vendedor', 70),
(11, 'i.velasquez.051201', '$2a$08$vKh1bRTmBnIhNAlpmFP3J.CPOe6EsLUnXaQ61GkBxWlQBTIZYcFfK', 'Vendedor', 74),
(12, 'f.delgado.051600', '$2a$08$xGFpN2ESNcKphTKwy3oztud0ZXimcMb4HfIHP0Jto6BzSYIW8fYGi', 'Gerente', 75),
(13, 'a.silva rodriguez.160865', '$2a$08$Y7cW8W5mDqizLoZgC5lDZOWAYWQ7Gr8RVTi/uvc7Ic15Dt38o.N9K', 'Gerente', 76),
(14, 's.perez zamora.050601', '$2a$08$TSm4jouQJ6ubhkmFZ7z46./0eMKztG2bGybN2KExDgeQPW9rzSe2K', 'Vendedor', 85);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vendedores_mas_ventas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vendedores_mas_ventas` (
`Id_Persona` int(11)
,`Nombre` varchar(81)
,`Cant_ventas` bigint(21)
,`Total_Vendido` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `Id_Venta` int(11) NOT NULL,
  `Id_Cliente` int(11) NOT NULL,
  `Id_Vendedor` int(11) NOT NULL,
  `Tipo_Venta` varchar(8) NOT NULL,
  `Fecha_Venta` date NOT NULL,
  `Total_Venta` decimal(10,2) DEFAULT NULL,
  `Plazo_Compra` date DEFAULT NULL,
  `Frecuencia_Abonos` varchar(20) DEFAULT NULL,
  `Estado_Venta` enum('Pagada','Abonandose','Cancelada') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`Id_Venta`, `Id_Cliente`, `Id_Vendedor`, `Tipo_Venta`, `Fecha_Venta`, `Total_Venta`, `Plazo_Compra`, `Frecuencia_Abonos`, `Estado_Venta`) VALUES
(78084, 57, 74, 'Contado', '2024-03-20', 950.00, NULL, NULL, 'Pagada'),
(118031, 79, 68, 'Contado', '2024-06-19', 680.00, NULL, NULL, 'Pagada'),
(217581, 48, 69, 'Credito', '2024-06-20', 750.00, '2024-10-25', 'Quincenal', 'Abonandose'),
(373630, 62, 74, 'Credito', '2024-05-16', 1700.00, '2024-08-30', 'Quincenal', 'Abonandose'),
(405771, 61, 69, 'Contado', '2024-05-16', 4300.00, NULL, NULL, 'Pagada'),
(424280, 73, 68, 'Contado', '2024-04-17', 300.00, NULL, NULL, 'Pagada'),
(466405, 81, 70, 'Credito', '2024-06-05', 780.00, '2024-09-20', 'Quincenal', 'Abonandose'),
(538697, 58, 74, 'Contado', '2024-07-08', 4980.00, NULL, NULL, 'Pagada'),
(610229, 62, 85, 'Contado', '2025-05-02', 600.00, NULL, NULL, 'Pagada'),
(612536, 62, 70, 'Contado', '2024-07-08', 360.00, NULL, NULL, 'Pagada'),
(615147, 63, 70, 'Credito', '2024-04-09', 1330.00, '2024-07-09', 'Quincenal', 'Pagada'),
(662407, 81, 69, 'Contado', '2024-04-26', 1580.00, NULL, NULL, 'Pagada'),
(767405, 63, 74, 'Contado', '2024-04-11', 350.00, NULL, NULL, 'Pagada'),
(804582, 57, 68, 'Contado', '2024-06-20', 650.00, NULL, NULL, 'Pagada'),
(929356, 61, 68, 'Contado', '2024-07-03', 610.00, NULL, NULL, 'Pagada'),
(995488, 43, 70, 'Contado', '2024-07-03', 650.00, NULL, NULL, 'Pagada');

--
-- Disparadores `venta`
--
DELIMITER $$
CREATE TRIGGER `actualizar_credito_disponible` AFTER INSERT ON `venta` FOR EACH ROW BEGIN
    DECLARE credito_actual DECIMAL(10, 2);

    -- Obtener el crédito disponible actual del cliente
    SELECT Credito_Disponible INTO credito_actual
    FROM Persona
    WHERE Id_Persona = NEW.Id_Cliente;

    -- Restar el total de la venta al crédito disponible
    IF NEW.Tipo_Venta = 'Credito' THEN
        SET credito_actual = credito_actual - NEW.Total_Venta;
        -- Actualizar el crédito disponible en la tabla Persona
        UPDATE Persona
        SET Credito_Disponible = credito_actual
        WHERE Id_Persona = NEW.Id_Cliente;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `actualizar_estado_cliente` AFTER INSERT ON `venta` FOR EACH ROW BEGIN
    DECLARE fecha_ultima_venta DATE;
    DECLARE tipo_persona_cliente VARCHAR(15);
    
    -- Obtener la fecha de la última venta del cliente
    SELECT MAX(Fecha_Venta) INTO fecha_ultima_venta
    FROM Venta
    WHERE Id_Cliente = NEW.Id_Cliente;
    
    -- Obtener el tipo de persona del cliente
    SELECT Tipo_Persona INTO tipo_persona_cliente
    FROM Persona
    WHERE Id_Persona = NEW.Id_Cliente;

    -- Si el cliente es tipo "cliente" y lleva más de 6 meses sin venta, actualizar su estado a "inactivo"
    IF tipo_persona_cliente = 'cliente' AND fecha_ultima_venta IS NOT NULL AND fecha_ultima_venta <= DATE_SUB(NOW(), INTERVAL 6 MONTH) THEN
        UPDATE Persona
        SET Estado = 'Inactivo'
        WHERE Id_Persona = NEW.Id_Cliente;
    ELSE
        -- Si el cliente estaba inactivo y realizó una venta, actualizar su estado a "activo"
        UPDATE Persona
        SET Estado = 'Activo'
        WHERE Id_Persona = NEW.Id_Cliente;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `actualizar_estado_venta_insercion` BEFORE INSERT ON `venta` FOR EACH ROW BEGIN
    IF NEW.Tipo_Venta = 'Contado' THEN
        SET NEW.Estado_Venta = 'Pagada';
    ELSE
        SET NEW.Estado_Venta = 'Abonandose';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `ventascontxmes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `ventascontxmes` (
`Mes` varchar(69)
,`Total_Ventas` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `ventascredxmes`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `ventascredxmes` (
`Mes` varchar(69)
,`IngresoTotal` decimal(32,2)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `historial_abonos`
--
DROP TABLE IF EXISTS `historial_abonos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `historial_abonos`  AS SELECT `a`.`Id_Abono` AS `Id_Abono`, `a`.`Id_Venta` AS `Id_Venta`, `v`.`Total_Venta` AS `Total_Venta`, `a`.`Monto_Abonado` AS `Monto_Abonado`, `a`.`Fecha_Abono` AS `Fecha_Abono`, `v`.`Total_Venta`- coalesce((select sum(`abonos`.`Monto_Abonado`) from `abonos` where `abonos`.`Id_Venta` = `a`.`Id_Venta` and `abonos`.`Fecha_Abono` <= `a`.`Fecha_Abono`),0) AS `Saldo_Restante` FROM (`abonos` `a` join `venta` `v` on(`a`.`Id_Venta` = `v`.`Id_Venta`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `infoproovedorcompra`
--
DROP TABLE IF EXISTS `infoproovedorcompra`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `infoproovedorcompra`  AS SELECT `c`.`Id_Compra` AS `Id_Compra`, concat(`p`.`Nombre`,' ',`p`.`Apellido`) AS `Proveedor`, `p`.`Comercio` AS `Comercio`, `p`.`Telefono` AS `Telefono`, `p`.`Cedula` AS `Cedula`, concat('Distrito ',`p`.`Distrito`,', ',`p`.`Zona_Residencia`,', ',`p`.`Punto_Referencia`,' ',`p`.`Distancia`,' ',', ',`p`.`Casa`) AS `Dirección` FROM (`compras` `c` join `persona` `p` on(`c`.`Id_Proveedor` = `p`.`Id_Persona`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `mostrarclientes`
--
DROP TABLE IF EXISTS `mostrarclientes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `mostrarclientes`  AS SELECT `persona`.`Id_Persona` AS `Id_Cliente`, concat(`persona`.`Nombre`,' ',`persona`.`Apellido`) AS `Nombre`, `persona`.`Cedula` AS `Cedula`, `persona`.`Telefono` AS `Telefono`, concat('Distrito ',`persona`.`Distrito`,', ',`persona`.`Zona_Residencia`,', ',`persona`.`Punto_Referencia`,',Casa ',`persona`.`Casa`) AS `Dirección`, `persona`.`Credito_Disponible` AS `Credito_Disponible`, `persona`.`Estado` AS `Estado_Cliente` FROM `persona` WHERE `persona`.`Tipo_Persona` = 'Cliente' ;

-- --------------------------------------------------------

--
-- Estructura para la vista `mostrarcolaboradores`
--
DROP TABLE IF EXISTS `mostrarcolaboradores`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `mostrarcolaboradores`  AS SELECT `persona`.`Id_Persona` AS `Id_Vendedor`, `persona`.`Tipo_Persona` AS `Tipo_Persona`, concat(`persona`.`Nombre`,' ',`persona`.`Apellido`) AS `Nombre`, `persona`.`Cedula` AS `Cedula`, `persona`.`Telefono` AS `Telefono`, concat('Distrito ',`persona`.`Distrito`,', ',`persona`.`Zona_Residencia`,', ',`persona`.`Punto_Referencia`,',Casa ',`persona`.`Casa`) AS `Dirección`, `persona`.`Estado` AS `Estado` FROM `persona` WHERE `persona`.`Tipo_Persona` <> 'Cliente' AND `persona`.`Tipo_Persona` <> 'Proveedor' ;

-- --------------------------------------------------------

--
-- Estructura para la vista `mostrarcompras`
--
DROP TABLE IF EXISTS `mostrarcompras`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `mostrarcompras`  AS SELECT `c`.`Id_Compra` AS `Id_Compra`, `c`.`Fecha_Compra` AS `Fecha_Compra`, `c`.`Total_Compra` AS `Total_Compra`, concat(`p`.`Nombre`,' ',`p`.`Apellido`) AS `Proveedor`, `p`.`Comercio` AS `Comercio`, concat(`g`.`Nombre`,' ',`g`.`Apellido`) AS `Comprador` FROM ((`compras` `c` join `persona` `p` on(`c`.`Id_Proveedor` = `p`.`Id_Persona`)) join `persona` `g` on(`c`.`Id_Comprador` = `g`.`Id_Persona`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `mostrardetallecompras`
--
DROP TABLE IF EXISTS `mostrardetallecompras`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `mostrardetallecompras`  AS SELECT CASE WHEN `p`.`Categoria` = 'Calzado' THEN concat(`p`.`Categoria`,' ',`p`.`Tipo`,' ',`p`.`Marca`,' ',`p`.`Modelo`,' Color ',`p`.`Color`,' Talla ',`p`.`Talla`) WHEN `p`.`Categoria` = 'Prendas de Vestir' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' Color ',`p`.`Color`,' Talla',`p`.`Talla`) WHEN `p`.`Categoria` = 'Cosmeticos' THEN concat(`p`.`Clasificacion`,' ',`p`.`Tipo`,' ',`p`.`Marca`,' Color ',`p`.`Color`) WHEN `p`.`Categoria` = 'Electrodomesticos' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' ',`p`.`Modelo`,' Color ',`p`.`Color`) WHEN `p`.`Categoria` = 'Productos Plasticos' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' Color ',`p`.`Color`,' Dimensiones ',`p`.`Dimensiones`,' ',`p`.`Unidad_Medida`) END AS `Producto`, `c`.`Cantidad_Comprada` AS `Cantidad_Comprada`, `c`.`Precio_Compra` AS `Precio_Compra`, `c`.`Precio_Venta` AS `Precio_Venta`, `c`.`Cantidad_Comprada`* `c`.`Precio_Compra` AS `Sub_Total`, `c`.`Id_Compra` AS `Id_Compra` FROM (`detalle_compra` `c` join `productos` `p` on(`c`.`Id_Producto` = `p`.`Id_Producto`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `mostrardetalleventa`
--
DROP TABLE IF EXISTS `mostrardetalleventa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `mostrardetalleventa`  AS SELECT CASE WHEN `p`.`Categoria` = 'Calzado' THEN concat(`p`.`Categoria`,' ',`p`.`Tipo`,' ',`p`.`Marca`,' ',`p`.`Modelo`,' Color ',`p`.`Color`,' Talla ',`p`.`Talla`) WHEN `p`.`Categoria` = 'Prendas de Vestir' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' Color ',`p`.`Color`,' Talla',`p`.`Talla`) WHEN `p`.`Categoria` = 'Cosmeticos' THEN concat(`p`.`Clasificacion`,' ',`p`.`Tipo`,' ',`p`.`Marca`,' Color ',`p`.`Color`) WHEN `p`.`Categoria` = 'Electrodomesticos' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' ',`p`.`Modelo`,' Color ',`p`.`Color`) WHEN `p`.`Categoria` = 'Productos Plasticos' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' Color ',`p`.`Color`,' Dimensiones ',`p`.`Dimensiones`,' ',`p`.`Unidad_Medida`) END AS `Producto`, `v`.`Cant_Vendida` AS `Cant_Vendida`, `v`.`Precio_Unitario` AS `Precio_Unitario`, `v`.`Cant_Vendida`* `v`.`Precio_Unitario` AS `Sub_Total`, `v`.`Id_Venta` AS `Id_Venta`, `p`.`Id_Producto` AS `Id_Producto` FROM (`detalle_venta` `v` join `productos` `p` on(`v`.`Id_Producto` = `p`.`Id_Producto`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `mostrarproveedores`
--
DROP TABLE IF EXISTS `mostrarproveedores`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `mostrarproveedores`  AS SELECT `persona`.`Id_Persona` AS `Id_Proveedor`, concat(`persona`.`Nombre`,' ',`persona`.`Apellido`) AS `Nombre`, `persona`.`Cedula` AS `Cedula`, `persona`.`Telefono` AS `Telefono`, concat('Distrito ',`persona`.`Distrito`,', ',`persona`.`Zona_Residencia`,', ',`persona`.`Punto_Referencia`,', ',`persona`.`Casa`) AS `Dirección`, `persona`.`Comercio` AS `Comercio`, `persona`.`Estado` AS `Estado` FROM `persona` WHERE `persona`.`Tipo_Persona` = 'Proveedor' ;

-- --------------------------------------------------------

--
-- Estructura para la vista `mostrarvendedores`
--
DROP TABLE IF EXISTS `mostrarvendedores`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `mostrarvendedores`  AS SELECT `persona`.`Id_Persona` AS `Id_Vendedor`, concat(`persona`.`Nombre`,' ',`persona`.`Apellido`) AS `Nombre`, `persona`.`Cedula` AS `Cedula`, `persona`.`Telefono` AS `Telefono`, concat('Distrito ',`persona`.`Distrito`,', ',`persona`.`Zona_Residencia`,', ',`persona`.`Punto_Referencia`,',Casa ',`persona`.`Casa`) AS `Dirección`, `persona`.`Estado` AS `Estado` FROM `persona` WHERE `persona`.`Tipo_Persona` = 'Vendedor' ;

-- --------------------------------------------------------

--
-- Estructura para la vista `mostrarventas`
--
DROP TABLE IF EXISTS `mostrarventas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `mostrarventas`  AS SELECT `v`.`Id_Venta` AS `Id_Venta`, `v`.`Plazo_Compra` AS `Plazo_Compra`, `v`.`Frecuencia_Abonos` AS `Frecuencia_Abonos`, `v`.`Tipo_Venta` AS `Tipo_Venta`, concat(`c`.`Nombre`,' ',`c`.`Apellido`) AS `Cliente`, concat(`pv`.`Nombre`,' ',`pv`.`Apellido`) AS `Vendedor`, `v`.`Fecha_Venta` AS `Fecha_Venta`, `v`.`Total_Venta` AS `Total_Venta`, `v`.`Estado_Venta` AS `Estado_Venta` FROM ((`venta` `v` join `persona` `c` on(`v`.`Id_Cliente` = `c`.`Id_Persona`)) join `persona` `pv` on(`v`.`Id_Vendedor` = `pv`.`Id_Persona`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `showproductosdevueltos`
--
DROP TABLE IF EXISTS `showproductosdevueltos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `showproductosdevueltos`  AS SELECT `v`.`Id_Venta` AS `Id_Venta`, CASE WHEN `p`.`Categoria` = 'Calzado' THEN concat(`p`.`Categoria`,' ',`p`.`Tipo`,' ',`p`.`Marca`,' ',`p`.`Modelo`,' Color ',`p`.`Color`,' Talla ',`p`.`Talla`) WHEN `p`.`Categoria` = 'Prendas de Vestir' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' Color ',`p`.`Color`,' Talla',`p`.`Talla`) WHEN `p`.`Categoria` = 'Cosmeticos' THEN concat(`p`.`Clasificacion`,' ',`p`.`Tipo`,' ',`p`.`Marca`,' Color ',`p`.`Color`) WHEN `p`.`Categoria` = 'Electrodomesticos' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' ',`p`.`Modelo`,' Color ',`p`.`Color`) WHEN `p`.`Categoria` = 'Productos Plasticos' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' Color ',`p`.`Color`,' Dimensiones ',`p`.`Dimensiones`,' ',`p`.`Unidad_Medida`) END AS `Producto`, concat(`c`.`Nombre`,' ',`c`.`Apellido`) AS `Cliente`, concat(`vd`.`Nombre`,' ',`vd`.`Apellido`) AS `Vendedor`, `pd`.`Cantidad_Devuelta` AS `Cantidad_Devuelta`, `pd`.`Fecha_Devolucion` AS `Fecha_Devolucion`, `pd`.`Motivo` AS `Motivo` FROM ((((`productos_devueltos` `pd` join `venta` `v` on(`pd`.`Id_Venta` = `v`.`Id_Venta`)) join `productos` `p` on(`pd`.`Id_Producto` = `p`.`Id_Producto`)) join `persona` `c` on(`v`.`Id_Cliente` = `c`.`Id_Persona`)) join `persona` `vd` on(`v`.`Id_Vendedor` = `vd`.`Id_Persona`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `showventascredito`
--
DROP TABLE IF EXISTS `showventascredito`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `showventascredito`  AS SELECT `v`.`Id_Venta` AS `Id_Venta`, concat(`pc`.`Nombre`,' ',`pc`.`Apellido`) AS `Nombre_Cliente`, concat(`pv`.`Nombre`,' ',`pv`.`Apellido`) AS `Nombre_Vendedor`, `v`.`Tipo_Venta` AS `Tipo_Venta`, `v`.`Fecha_Venta` AS `Fecha_Venta`, `v`.`Total_Venta` AS `Total_Venta`, coalesce(`v`.`Total_Venta` - ifnull(sum(`a`.`Monto_Abonado`),0),`v`.`Total_Venta`) AS `Saldo_Restante`, `v`.`Plazo_Compra` AS `Plazo_Compra`, `v`.`Frecuencia_Abonos` AS `Frecuencia_Abonos` FROM (((`venta` `v` left join `abonos` `a` on(`v`.`Id_Venta` = `a`.`Id_Venta`)) join `persona` `pc` on(`v`.`Id_Cliente` = `pc`.`Id_Persona`)) join `persona` `pv` on(`v`.`Id_Vendedor` = `pv`.`Id_Persona`)) WHERE `v`.`Tipo_Venta` = 'Credito' GROUP BY `v`.`Id_Venta` HAVING `Saldo_Restante` <> 0 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `top_10_productos_mas_vendidos`
--
DROP TABLE IF EXISTS `top_10_productos_mas_vendidos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `top_10_productos_mas_vendidos`  AS SELECT `p`.`Id_Producto` AS `Id_Producto`, CASE WHEN `p`.`Categoria` = 'Calzado' THEN concat(`p`.`Categoria`,' ',`p`.`Tipo`,' ',`p`.`Marca`,' ',`p`.`Modelo`,' COLOR ',`p`.`Color`,' TALLA ',`p`.`Talla`) WHEN `p`.`Categoria` = 'Prendas de Vestir' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' COLOR ',`p`.`Color`,' TALLA ',`p`.`Talla`) WHEN `p`.`Categoria` = 'Cosmeticos' THEN concat(`p`.`Clasificacion`,' ',`p`.`Tipo`,' ',`p`.`Marca`,' COLOR ',`p`.`Color`) WHEN `p`.`Categoria` = 'Electrodomesticos' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' ',`p`.`Modelo`,' COLOR ',`p`.`Color`) WHEN `p`.`Categoria` = 'Productos Plasticos' THEN concat(`p`.`Tipo`,' ',`p`.`Marca`,' COLOR ',`p`.`Color`,' DIMENSIONES ',`p`.`Dimensiones`,' ',`p`.`Unidad_Medida`) ELSE concat(`p`.`Tipo`,' ',`p`.`Marca`,' COLOR ',`p`.`Color`) END AS `Descripcion`, coalesce(`contado`.`IngresoTotal`,0) + coalesce(`credito`.`IngresoTotal`,0) AS `IngresoTotal`, coalesce(`contado`.`TotalVendido`,0) + coalesce(`credito`.`TotalVendido`,0) AS `TotalVendido` FROM ((`productos` `p` left join (select `dv`.`Id_Producto` AS `Id_Producto`,sum(`dv`.`Cant_Vendida` * `dv`.`Precio_Unitario`) AS `IngresoTotal`,sum(`dv`.`Cant_Vendida`) AS `TotalVendido` from (`venta` `v` join `detalle_venta` `dv` on(`v`.`Id_Venta` = `dv`.`Id_Venta`)) where `v`.`Tipo_Venta` = 'contado' and month(`v`.`Fecha_Venta`) = month(curdate()) and year(`v`.`Fecha_Venta`) = year(curdate()) group by `dv`.`Id_Producto`) `contado` on(`p`.`Id_Producto` = `contado`.`Id_Producto`)) left join (select `dv`.`Id_Producto` AS `Id_Producto`,sum(`a`.`Monto_Abonado`) AS `IngresoTotal`,sum(`dv`.`Cant_Vendida`) AS `TotalVendido` from ((`venta` `v` join `detalle_venta` `dv` on(`v`.`Id_Venta` = `dv`.`Id_Venta`)) join `abonos` `a` on(`v`.`Id_Venta` = `a`.`Id_Venta`)) where `v`.`Tipo_Venta` = 'credito' and month(`v`.`Fecha_Venta`) = month(curdate()) and year(`v`.`Fecha_Venta`) = year(curdate()) group by `dv`.`Id_Producto`) `credito` on(`p`.`Id_Producto` = `credito`.`Id_Producto`)) WHERE `contado`.`IngresoTotal` is not null OR `credito`.`IngresoTotal` is not null ORDER BY coalesce(`contado`.`TotalVendido`,0) + coalesce(`credito`.`TotalVendido`,0) DESC LIMIT 0, 5 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vendedores_mas_ventas`
--
DROP TABLE IF EXISTS `vendedores_mas_ventas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vendedores_mas_ventas`  AS SELECT `v`.`Id_Persona` AS `Id_Persona`, concat(`v`.`Nombre`,' ',`v`.`Apellido`) AS `Nombre`, count(`vt`.`Id_Venta`) AS `Cant_ventas`, sum(`vt`.`Total_Venta`) AS `Total_Vendido` FROM (`venta` `vt` join `persona` `v` on(`vt`.`Id_Vendedor` = `v`.`Id_Persona`)) WHERE month(`vt`.`Fecha_Venta`) = month(curdate()) AND year(`vt`.`Fecha_Venta`) = year(curdate()) GROUP BY `v`.`Id_Persona` ORDER BY sum(`vt`.`Total_Venta`) DESC, count(`vt`.`Id_Venta`) DESC LIMIT 0, 5 ;

-- --------------------------------------------------------

--
-- Estructura para la vista `ventascontxmes`
--
DROP TABLE IF EXISTS `ventascontxmes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `ventascontxmes`  AS SELECT date_format(`v`.`Fecha_Venta`,'%M %Y') AS `Mes`, sum(`v`.`Total_Venta`) AS `Total_Ventas` FROM `venta` AS `v` WHERE `v`.`Fecha_Venta` >= date_format(curdate() - interval 4 month,'%Y-%m-01') AND `v`.`Tipo_Venta` = 'Contado' GROUP BY date_format(`v`.`Fecha_Venta`,'%Y-%m') ORDER BY `v`.`Fecha_Venta` ASC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `ventascredxmes`
--
DROP TABLE IF EXISTS `ventascredxmes`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `ventascredxmes`  AS SELECT date_format(`v`.`Fecha_Venta`,'%M %Y') AS `Mes`, sum(`a`.`Monto_Abonado`) AS `IngresoTotal` FROM (`venta` `v` join `abonos` `a` on(`a`.`Id_Venta` = `v`.`Id_Venta`)) WHERE `v`.`Fecha_Venta` >= date_format(curdate() - interval 4 month,'%Y-%m-01') AND `v`.`Tipo_Venta` = 'Credito' GROUP BY date_format(`v`.`Fecha_Venta`,'%Y-%m') ORDER BY `v`.`Fecha_Venta` ASC ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `abonos`
--
ALTER TABLE `abonos`
  ADD PRIMARY KEY (`Id_Abono`),
  ADD KEY `Id_Venta` (`Id_Venta`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`Id_Compra`),
  ADD KEY `Id_Proveedor` (`Id_Proveedor`),
  ADD KEY `Id_Gerente` (`Id_Comprador`);

--
-- Indices de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD PRIMARY KEY (`Id_Detalle_Compra`),
  ADD KEY `Id_Compra` (`Id_Compra`),
  ADD KEY `Id_Producto` (`Id_Producto`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`Id_Detalle_Venta`),
  ADD KEY `Id_Producto` (`Id_Producto`),
  ADD KEY `Id_Venta` (`Id_Venta`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`Id_Persona`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`Id_Producto`);

--
-- Indices de la tabla `productos_devueltos`
--
ALTER TABLE `productos_devueltos`
  ADD PRIMARY KEY (`Id_ProductoDevuelto`),
  ADD KEY `Id_Producto` (`Id_Producto`),
  ADD KEY `Id_Venta` (`Id_Venta`);

--
-- Indices de la tabla `record_crediticio`
--
ALTER TABLE `record_crediticio`
  ADD PRIMARY KEY (`Id_Record`),
  ADD KEY `Id_Venta` (`Id_Venta`),
  ADD KEY `Id_Cliente` (`Id_Cliente`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`UserID`),
  ADD KEY `Id_Persona` (`Id_Persona`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`Id_Venta`),
  ADD KEY `Id_Cliente` (`Id_Cliente`),
  ADD KEY `Id_Vendedor` (`Id_Vendedor`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `abonos`
--
ALTER TABLE `abonos`
  MODIFY `Id_Abono` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `Id_Compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=884473;

--
-- AUTO_INCREMENT de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  MODIFY `Id_Detalle_Compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `Id_Detalle_Venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `Id_Persona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `Id_Producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT de la tabla `productos_devueltos`
--
ALTER TABLE `productos_devueltos`
  MODIFY `Id_ProductoDevuelto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `record_crediticio`
--
ALTER TABLE `record_crediticio`
  MODIFY `Id_Record` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `Id_Venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1255622;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `abonos`
--
ALTER TABLE `abonos`
  ADD CONSTRAINT `abonos_ibfk_1` FOREIGN KEY (`Id_Venta`) REFERENCES `venta` (`Id_Venta`);

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`Id_Proveedor`) REFERENCES `persona` (`Id_Persona`),
  ADD CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`Id_Comprador`) REFERENCES `persona` (`Id_Persona`);

--
-- Filtros para la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD CONSTRAINT `detalle_compra_ibfk_1` FOREIGN KEY (`Id_Compra`) REFERENCES `compras` (`Id_Compra`),
  ADD CONSTRAINT `detalle_compra_ibfk_2` FOREIGN KEY (`Id_Producto`) REFERENCES `productos` (`Id_Producto`);

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`Id_Producto`) REFERENCES `productos` (`Id_Producto`),
  ADD CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`Id_Venta`) REFERENCES `venta` (`Id_Venta`);

--
-- Filtros para la tabla `productos_devueltos`
--
ALTER TABLE `productos_devueltos`
  ADD CONSTRAINT `productos_devueltos_ibfk_1` FOREIGN KEY (`Id_Producto`) REFERENCES `productos` (`Id_Producto`),
  ADD CONSTRAINT `productos_devueltos_ibfk_2` FOREIGN KEY (`Id_Venta`) REFERENCES `venta` (`Id_Venta`);

--
-- Filtros para la tabla `record_crediticio`
--
ALTER TABLE `record_crediticio`
  ADD CONSTRAINT `record_crediticio_ibfk_1` FOREIGN KEY (`Id_Venta`) REFERENCES `venta` (`Id_Venta`),
  ADD CONSTRAINT `record_crediticio_ibfk_2` FOREIGN KEY (`Id_Cliente`) REFERENCES `persona` (`Id_Persona`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`Id_Persona`) REFERENCES `persona` (`Id_Persona`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`Id_Cliente`) REFERENCES `persona` (`Id_Persona`),
  ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`Id_Vendedor`) REFERENCES `persona` (`Id_Persona`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
