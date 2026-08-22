var productosSeleccionados = [];
var filasAgregadas = [];
var ID_Venta = generarIdVenta();
var id_de_venta;

Fecha_Actual('Fecha_Venta');
ActualizarFecha();

document.getElementById('IdVenta').textContent='N° Venta: '+ID_Venta;

function mostrarTablaSegunCategoria() 
{
    // Ocultar todas las tablas
    document.getElementById('tablaCalzado').style.display = 'none';
    document.getElementById('tablaPrendas').style.display = 'none';
    document.getElementById('tablaCosmeticos').style.display = 'none';
    document.getElementById('tablaElectrodomesticos').style.display = 'none';
    document.getElementById('tablaPPlasticos').style.display = 'none';
    document.getElementById('factura').style.display = 'none';

    // Obtener la categoría seleccionada
    var seleccion = document.getElementById('categoriaSelect1').value;

    // Mostrar la tabla correspondiente
    switch (seleccion) {
        case '1': 
            document.getElementById('tablaCalzado').style.display = 'block';
            document.getElementById('factura').style.display = 'block';
            break;
        case '2': 
            document.getElementById('tablaPrendas').style.display = 'block';
            document.getElementById('factura').style.display = 'block';
            break;
        case '3': 
            document.getElementById('tablaCosmeticos').style.display = 'block';
            document.getElementById('factura').style.display = 'block';
            break;
        case '4': 
            document.getElementById('tablaElectrodomesticos').style.display = 'block';
            document.getElementById('factura').style.display = 'block';
            break;
        case '5': 
            document.getElementById('tablaPPlasticos').style.display = 'block';
            document.getElementById('factura').style.display = 'block';
            break;
        
    }
}

  //MOSTAR HISTORIAL DE ABONOS
function mostrarPanelHistorialAbonos() 
{
  var panel = document.getElementById("panelHistorialAbonos");
  panel.style.display = "block";
}

function cerrarPanelHistorialAbonos() 
{
  var panel = document.getElementById("panelHistorialAbonos");
  panel.style.display = "none";
}
  //FIN MOSTRAR HISTORIAL

  //AQUI TERMINA

function TipoVenta()
{
  var tipoVenta = document.getElementById("TipoDeVenta_Select").value;

  document.getElementById("formularioCredito").style.display = "block";

  if (tipoVenta === "Contado") 
  {
    document.getElementById("plazo_compra").style.display = "none";
    document.getElementById("FrecuenciaAbono").style.display = "none";
    document.getElementById("lb_plazo_compra").style.display = "none";
    document.getElementById("lb_FrecuenciaAbono").style.display = "none";
  } 
else if (tipoVenta === "Credito") 
{
  document.getElementById("plazo_compra").style.display = "block";
  document.getElementById("FrecuenciaAbono").style.display = "block";
  document.getElementById("lb_plazo_compra").style.display = "block";
  document.getElementById("lb_FrecuenciaAbono").style.display = "block";
}
}

function AñadirProducto(Id_Producto,Nombre_Producto,Precio, CantidadExistente) 
{
  var tabla = document.getElementById("tablacliente").getElementsByTagName('tbody')[1];
  const celda_total = document.getElementById("celda_total");

  var nuevaFila = document.createElement("tr");
  var celdaProducto = document.createElement("td");
  var celdaCantidad = document.createElement("td");
  var celdaPrecio = document.createElement("td");
  var celdaBoton = document.createElement("td")
  var celdaSubtotal = document.createElement("td")

  var inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.style.textAlign = 'center';
  inputCantidad.id = 'CantProduct';
  inputCantidad.value=1;
  inputCantidad.style.border = "none";
  inputCantidad.addEventListener('keypress', (e) => {
    let expre;
    expre = /^[0-9]+$/;
    
    // Verificar si la tecla presionada cumple con la expresión regular
    if (!expre.test(e.key)) {
        e.preventDefault(); // Evitar que se ingrese la tecla en el input
    }
});
  inputCantidad.addEventListener('keypress', (e) => {
    // Obtener el valor actual del input como un número
    const cantidadIngresada = parseInt(inputCantidad.value + e.key);
    
    // Obtener la existencia del producto como un número
    const existenciaProducto = producto.Existencia;
    
    // Validar si la tecla presionada es un número y si la cantidad ingresada es mayor que la existencia del producto
    if (cantidadIngresada > existenciaProducto) {
        e.preventDefault(); // Prevenir la entrada de más caracteres
    }
  });
  inputCantidad.onchange = function() 
  {
    var nuevaCantidad = parseInt(inputCantidad.value);
    if (nuevaCantidad < 1) 
    {
      // Si es negativa, establecer la cantidad a 1 (o al valor mínimo aceptable)
      inputCantidad.value = 1;
      nuevaCantidad = 1;
    }

    inputCantidad.max = producto.Existencia;
    if (nuevaCantidad > producto.Existencia) {

      inputCantidad.value = producto.Existencia;
      nuevaCantidad = producto.Existencia;
      Swal.fire({
        title: "Stock Excedido",
        text: "La cantidad no puede ser más de "+producto.Existencia,
        icon: 'warning',
        showConfirmButton: true,
        timer: false,
      });
    }
    
    actualizarCantidadProductoEnArreglo(Id_Producto, nuevaCantidad);
    actualizarTotalEnTabla();
    celdaSubtotal.textContent = 'C$' + Precio*inputCantidad.value;
  };

  var BotonEliminar = document.createElement("button");
  BotonEliminar.className = "btn btn-danger px-3"
  BotonEliminar.innerHTML = "<i class='fa-solid fa-trash'>";
  BotonEliminar.onclick = function() 
  { EliminarProducto(this , Id_Producto ); };

  var productoExistente = productosSeleccionados.find(function(producto) { return producto.IdProducto === Id_Producto; });

  if (productoExistente) 
  { 
    Swal.fire({
      title: "Producto repetido",
      text: "El producto ya ha sido añadido",
      icon: 'warning',
      showConfirmButton: true,
      timer: false,
    });
  }
  else
  {
    // Agregar contenido a las celdas
    celdaProducto.textContent = Nombre_Producto;
    celdaCantidad.appendChild(inputCantidad);
    celdaPrecio.textContent = 'C$ '+Precio;
    celdaBoton.appendChild(BotonEliminar);
    celdaSubtotal.textContent = 'C$' + Precio*inputCantidad.value;

    // Agregar las celdas a la fila
    nuevaFila.appendChild(celdaProducto);
    nuevaFila.appendChild(celdaCantidad);
    nuevaFila.appendChild(celdaPrecio);
    nuevaFila.appendChild(celdaSubtotal);
    nuevaFila.appendChild(celdaBoton);
    

    // Agregar la fila a la tabla
    tabla.appendChild(nuevaFila);

    var producto = 
    {
      IdProducto: Id_Producto,
      Cantidad: 1,
      Precio: Precio,
      Existencia: CantidadExistente
    };

    productosSeleccionados.push(producto);
    console.log("Productos seleccionados:", productosSeleccionados);

    let total_venta = 0;

    productosSeleccionados.forEach(function(producto) 
    { total_venta += producto.Precio * producto.Cantidad; });

    celda_total.innerHTML = 'C$ ' + total_venta.toFixed(2);  
  }

}

function AñadirVenta()
{
  const Cliente = document.getElementById('CedulaCliente').value;
  const Vendedor = document.getElementById('CedulaVendedor').value;
  const tipo_venta = document.getElementById('TipoDeVenta_Select').value;
  const Fecha_Venta = document.getElementById('Fecha_Venta').value;
  const Total_venta_td = document.getElementById('celda_total').innerText;
  const Plazo = document.getElementById('plazo_compra').value;
  const Frecuencia_Abonos = document.getElementById('FrecuenciaAbono').value;

  const Total_venta = parseFloat(Total_venta_td.replace("C$", "").trim());
  
  const DatosVenta = 
  {
    Tipo_Venta:tipo_venta,
    Cliente:Cliente,
    Vendedor:Vendedor,
    Fecha_Venta:Fecha_Venta,
    Productos: productosSeleccionados,
    Plazo: Plazo,
    Frecuencia_Abonos: Frecuencia_Abonos,
    Total: Total_venta,
    Id_Venta:ID_Venta
  }

    
  if (productosSeleccionados.length == 0)
  {
    Swal.fire({
      title: "No ha agregado Productos",
      text: "No ha agregado ningun producto a la venta, por favor agregue productos e intentelo nuevamente",
      icon: 'warning',
      showConfirmButton: true,
      timer: false,
    });
  }
  else  
  {
    fetch('/AddVenta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(DatosVenta)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('La solicitud ha fallado');
        }
        return response.json();
      })
      .then(data => 
      {
        if (data.success)
        {
          Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Venta agregada correctamente',
                    confirmButtonText: 'Aceptar'})
                .then(() => { window.location.reload();});
        } 
        else 
        {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo ingresar la venta',
            text: 'Hubo un error al ingresar la venta, verifique los datos e intentelo nuevamente x',
            confirmButtonText: 'Aceptar'
          })
        }
      })
      .catch(error => 
      {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo ingresar la venta',
          text: 'Hubo un error al ingresar la venta, verifique los datos e intentelo nuevamente',
          confirmButtonText: 'Aceptar'
        })
      });
  }
 


}

function EliminarProducto(boton,id) {
    
    // Obtener el índice de la fila en la tabla
    var filaTabla = boton.parentNode.parentNode;
    var indexFila = filaTabla.rowIndex;
    
    // Eliminar la fila de la tabla
    document.getElementById("tablacliente").deleteRow(indexFila);

    productosSeleccionados = productosSeleccionados.filter(producto => producto.IdProducto !== id);
    actualizarTotalEnTabla() 
}
var fecha_venta;
function mostrarDetallesVenta(Id_Venta, Cliente, Vendedor, Fecha , Total) 
{
  var panel = document.getElementById("panelDetalleVentas");
  panel.style.display = "block";
  id_de_venta = Id_Venta;
  fecha_venta = Fecha;

  document.getElementById("DetalleTitle").innerText = 'Detalles de la Venta N° '+Id_Venta;
  document.getElementById("ClienteDetalle").textContent = Cliente;
  document.getElementById("VendedorDetalle").textContent = Vendedor;
  document.getElementById("FechaDetalle").textContent = Fecha;
  document.getElementById("TotalDetalle").textContent = 'C$ '+Total;
  
  fetch(`/buscar-detalleventa?id=${encodeURIComponent(Id_Venta)}`)
  .then(response => response.json())
  .then(data => 
  {
    const Detalles = data.DetallesVenta;
    Detalles.forEach((Detalle) => 
    {
      AddProductoTabla (Detalle.Producto,Detalle.Cant_Vendida,Detalle.Precio_Unitario,Detalle.Sub_Total, Id_Venta,Cliente,Vendedor,Detalle.Id_Producto)
    })

  })
  .catch(error => console.error('Error:', error)); 


}

function cerrarDetallesVenta() 
{
    var panel = document.getElementById("panelDetalleVentas");
    panel.style.display = "none";
    
    var tabla = document.getElementById("tablaDetalleVenta").getElementsByTagName('tbody')[1];
    
    while (tabla.firstChild) 
    { tabla.removeChild(tabla.firstChild);}
    filasAgregadas=[];
    
}

function actualizarCantidadProductoEnArreglo(idProducto, nuevaCantidad) 
{
  productosSeleccionados.forEach(function(producto) 
  {
    if (producto.IdProducto === idProducto) 
    { producto.Cantidad = nuevaCantidad; }
  });
}

function actualizarTotalEnTabla() 
{
  let totalVenta = 0;
  const celda_total = document.getElementById("celda_total");
  
  productosSeleccionados.forEach(function(producto) 
  { totalVenta += producto.Precio * producto.Cantidad; });
  celda_total.innerHTML = 'C$ ' + totalVenta.toFixed(2);
}

function BuscarCliente(cedula)
{
  fetch(`/buscar-cliente?cedula=${encodeURIComponent(cedula)}`)
  .then(response => response.json())
  .then(data => {
      // Mostrar el resultado en la tabla de factura
      const btnBusqueda = document.getElementById("btnBuscarCliente");

      if(data.nombreCliente == "No se encontro al Cliente")
      {
        btnBusqueda.className = "btn btn-outline-danger";
        btnBusqueda.innerHTML = "No se encontro al Cliente <i class='bx bx-search'></i> ";
      }
      else
      {
        btnBusqueda.className = "btn btn-outline-success";
        btnBusqueda.innerText = data.nombreCliente;
        document.getElementById('ClienteFactura').textContent = data.nombreCliente;
        document.getElementById('CedulaCliente').value = cedula;
        cerrarClienteVenta();
      }
  })
  .catch(error => console.error('Error:', error));
}

function BuscarVendedor(cedula)
{
  fetch(`/buscar-vendedor?cedula=${encodeURIComponent(cedula)}`)
  .then(response => response.json())
  .then(data => {
      // Mostrar el resultado en la tabla de factura
      const btnBusqueda = document.getElementById("btnBuscarVendedor");

      if(data.nombreVendedor == "No se encontro al Vendedor")
      {
        btnBusqueda.className = "btn btn-outline-danger";
        btnBusqueda.innerHTML = "No se encontro al Vendedor <i class='bx bx-search'></i> ";
      }
      else
      {
        btnBusqueda.className = "btn btn-outline-success";
        btnBusqueda.innerText = data.nombreVendedor;
        document.getElementById('VendedorFactura').textContent =  data.nombreVendedor;
        document.getElementById('CedulaVendedor').value = cedula;
        cerrarVendedorVenta();
      }
  })
  .catch(error => console.error('Error:', error));
}

function generarIdVenta() 
{
  const numeroAleatorio = Math.floor(Math.random() * 1000000);
  const idVenta = numeroAleatorio;
  return idVenta;
}

//filasAgregadas = [];
var venta_cliente;
var venta_vendedor;

function AddProductoTabla (Producto,Cantidad,Precio,SubTotal,Id_Venta, Cliente,Vendedor,Id_Producto)
{
  var tabla = document.getElementById("tablaDetalleVenta").getElementsByTagName('tbody')[1];

  var nuevaFila = document.createElement("tr");
  var celda_Producto = document.createElement("td");
  var celda_Cantidad = document.createElement("td");
  var celda_Precio = document.createElement("td");
  var celda_Subtotal = document.createElement("td")
  var celda_Vacia = document.createElement("td")
  var celda_boton_devolver = document.createElement("td")

  // Agregar contenido a las celdas
  celda_Producto.textContent = Producto;
  celda_Cantidad.textContent = Cantidad;
  celda_Precio.textContent = 'C$ '+Precio;
  celda_Subtotal.textContent = 'C$ '+ SubTotal;

  var BotonDevolver = document.createElement("button");
  BotonDevolver.className = "btn btn-primary px-3"
  BotonDevolver.innerHTML = " <i class='fa-solid fa-rotate-left'></i>";
  BotonDevolver.onclick = function() 
  { mostrarPanelDevolverProducto(Id_Venta,Cliente,Vendedor,Id_Producto,Producto,Cantidad); };
  
  celda_boton_devolver.appendChild(BotonDevolver);

  // Agregar las celdas a la fila
  nuevaFila.appendChild(celda_Producto);
  nuevaFila.appendChild(celda_Cantidad);
  nuevaFila.appendChild(celda_Vacia);
  nuevaFila.appendChild(celda_Precio);
  nuevaFila.appendChild(celda_Subtotal);
  //nuevaFila.appendChild(celda_boton_devolver);
  
  // Agregar la fila a la tabla
  tabla.appendChild(nuevaFila);
  venta_cliente = Cliente;
  venta_vendedor = Vendedor;
  
  var fila = {
    Producto: Producto,
    Cantidad: Cantidad,
    Precio: Precio,
    SubTotal: SubTotal,
    Id_Venta: Id_Venta,
    Cliente: Cliente,
    Vendedor: Vendedor,
    Id_Producto: Id_Producto
  };
  filasAgregadas.push(fila);
}

function ActualizarFecha()
{
  const InputFecha = document.getElementById('FechatablaFactura');

  InputFecha.textContent = document.getElementById('Fecha_Venta').value;
}

document.addEventListener('DOMContentLoaded', function() {
  // Obtener la referencia al elemento de fecha
  const fechaVentaInput = document.getElementById('Fecha_Venta');

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Obtener la hora y los minutos actuales
  const horaActual = fechaActual.getHours();
  const minutosActuales = fechaActual.getMinutes();

  // Definir la hora y minutos de corte (6:45 PM)
  const horaCorte = 17; // 6 PM en formato militar
  const minutosCorte = 0; // 45 minutos

  // Verificar si la hora actual es después de las 6:45 PM
  const esDespuesDeLas645PM = horaActual > horaCorte || (horaActual === horaCorte && minutosActuales >= minutosCorte);

  // Calcular la fecha mínima permitida
  const fechaMinima = new Date();
  if (esDespuesDeLas645PM) {
    // Si es después de las 6:45 PM, permitir seleccionar a partir del día siguiente
    fechaMinima.setDate(fechaActual.getDate() - 1);
  } else {
    // Si es antes de las 6:45 PM, permitir seleccionar a partir de hoy
    fechaMinima.setDate(fechaActual.getDate());
  }

  // Establecer la fecha mínima en el campo de fecha
  const fechaMinimaISO = fechaMinima.toISOString().split('T')[0];
  fechaVentaInput.setAttribute('max', fechaMinimaISO);
});

  // Validación de texto para los inputs de texto
  const inputLetra = document.querySelectorAll('input[type="text"]');

  // Recorre cada input encontrado
  inputLetra.forEach(input => {
    // Agrega un evento "keypress" a cada input
    input.addEventListener("keypress", (e) => {
      let expre;

      if(input.id === 'plazo_compra'){
        expre = /^[a-zA-Z0-9\sñÑ]+$/; 
      }else{
        expre = /^[a-zA-Z0-9-]+$/; 
      }

      // Verifica si la tecla presionada cumple con la expresión regular
      if (!expre.test(e.key)) {
          e.preventDefault(); // Evita que se ingrese la tecla en el input
      }
    });
  });


  function mostrarPanelDevolverProducto(ID_Venta,Cliente,Vendedor,ID_Producto,Nombre_Producto,Cantidad) 
  {
    cerrarDetallesVenta();
    var panel = document.getElementById("ProductoDevuelto");
    panel.style.display = "block";

    document.getElementById('Title_Devolucion').innerText = 'Devolver Producto de la Venta N° '+ID_Venta;
    document.getElementById('ClienteDevuelto').textContent = Cliente;
    document.getElementById('VendedorDevuelto').textContent = Vendedor;
    document.getElementById('NombreProductoDevuelto').textContent = Nombre_Producto;
    document.getElementById('StockAvailable').textContent = Cantidad; 
    document.getElementById('Cantidad_Devolver').max = Cantidad;
    document.getElementById('idventadevolver').value = ID_Venta;
    document.getElementById('idproductodevolver').value=ID_Producto;


  }

  function cerrarPanelDevolverProducto() {
    var panel = document.getElementById("ProductoDevuelto");
    panel.style.display = "none";
  }

  function DevolverProducto()
  {
    const ID_Producto = document.getElementById('idproductodevolver').value;
    const Fecha_Devolver = document.getElementById('FechaDevuelto').value;
    const Cantidad_Devolver = document.getElementById('Cantidad_Devolver').value;
    const motivo = document.getElementById('MotivoDevolucion').value;
    const ID_Venta = document.getElementById('idventadevolver').value
    
    const DatosDevolucion = 
    {
      Id_Producto: ID_Producto,
      Id_Venta: ID_Venta,
      Cantidad_Devuelta:Cantidad_Devolver,
      Motivo: motivo,
      Fecha_Devolucion: Fecha_Devolver
    }

    fetch('/DevolverProducto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(DatosDevolucion)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La solicitud ha fallado');
      }
      return response.json();
    })
    .then(data => 
    {
      if (data.success)
      {
        Swal.fire({
                  icon: 'success',
                  title: '¡Éxito!',
                  text: 'Producto Devuelto correctamente',
                  confirmButtonText: 'Aceptar'})
              .then(() => { window.location.reload();});
      } 
      else 
      {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo Devolver el producto',
          text: 'Hubo un error al devolver el producto, verifique los datos e intentelo nuevamente',
          confirmButtonText: 'Aceptar'
        })
      }
    })
    .catch(error => 
    {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo Devolver el producto',
        text: 'Hubo un error al devolver el producto, verifique los datos e intentelo nuevamente',
        confirmButtonText: 'Aceptar'
      })
    }); 


  }

  function mostrarClienteVenta() {
    var panel = document.getElementById("BuscarClienteVenta");
    panel.style.display = "block";
  }

  function cerrarClienteVenta() {
    var panel = document.getElementById("BuscarClienteVenta");
    panel.style.display = "none";
  }

  function mostrarVendedorVenta() {
    var panel = document.getElementById("BuscarVendedorVenta");
    panel.style.display = "block";
  }

  function cerrarVendedorVenta() {
    var panel = document.getElementById("BuscarVendedorVenta");
    panel.style.display = "none";
  }

  function Fecha_Actual(Fecha)
  {
    const InputFecha = document.getElementById(Fecha);
    // Obtiene la fecha actual
    var today = new Date();

    // Formatea la fecha a 'YYYY-MM-DD'
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
    var year = today.getFullYear();

    // Establece el valor del input con la fecha formateada
    InputFecha.value = `${year}-${month}-${day}`;
  }

  //MOSTAR HISTORIAL DE ABONOS
  function mostrarPanelHistorialAbonosUnico(Id,Cliente,Vendedor) 
  {
    var panel = document.getElementById("panelHistorialAbonosVenta");
    panel.style.display = "block";
  
    document.getElementById('TitleHistorialAbonosVenta').innerText = 'Historial de abonos Venta N° '+Id;
  
    fetch(`/buscar-abonos?id=${encodeURIComponent(Id)}`)
    .then(response => response.json())
    .then(data => 
    {
      data.Abonos.forEach((abono) => 
      { AgregarAbonosHistorial(Cliente,Vendedor,abono.Fecha_Abono,abono.Monto_Abonado,abono.Saldo_Restante); })
    })
    .catch(error => console.error('Error:', error));
  }
  
  function cerrarPanelHistorialAbonosUnico() 
  {
    var panel = document.getElementById("panelHistorialAbonosVenta");
    panel.style.display = "none";
    
    var tabla = document.getElementById("Tabla_Historial_Abonos_Venta").getElementsByTagName('tbody')[0];
      
    while (tabla.firstChild) 
    { tabla.removeChild(tabla.firstChild);}
  
  }

  function AgregarAbonosHistorial(Cliente,Vendedor,Fecha,Monto,Saldo)
  {
    var tabla = document.getElementById("Tabla_Historial_Abonos_Venta").getElementsByTagName('tbody')[0];

    var nuevaFila = document.createElement("tr");
    var celda_Cliente = document.createElement("td");
    var celda_Vendedor = document.createElement("td");
    var celda_Fecha_Abono = document.createElement("td");
    var celda_Monto_abonado = document.createElement("td");
    var celda_Saldo_Restante = document.createElement("td");

    celda_Cliente.textContent = Cliente;
    celda_Vendedor.textContent = Vendedor;
    celda_Fecha_Abono.textContent = Fecha;
    celda_Monto_abonado.textContent = 'C$ '+Monto;
    celda_Saldo_Restante.textContent = 'C$ '+ Saldo;
    
    // Agregar las celdas a la fila
    nuevaFila.appendChild(celda_Cliente);
    nuevaFila.appendChild(celda_Vendedor);
    nuevaFila.appendChild(celda_Fecha_Abono);
    nuevaFila.appendChild(celda_Monto_abonado);
    nuevaFila.appendChild(celda_Saldo_Restante);
    
    // Agregar la fila a la tabla
    tabla.appendChild(nuevaFila);
  }
  
  var fechaactual;
  document.addEventListener('DOMContentLoaded', function() {
    // Obtener la referencia al elemento de fecha
    const fechaVentaInput = document.getElementById('plazo_compra');
  
    // Obtener la fecha actual
    const fechaActual = new Date();
  
    // Obtener la hora y los minutos actuales
    const horaActual = fechaActual.getHours();
    const minutosActuales = fechaActual.getMinutes();
  
    const horaCorte = 17;
    const minutosCorte = 0; 
  
    // Verificar si la hora actual es después de las 6:45 PM
    const esDespuesDeLas645PM = horaActual > horaCorte || (horaActual === horaCorte && minutosActuales >= minutosCorte);
  
    // Calcular la fecha mínima permitida
    const fechaMinima = new Date();
    if (esDespuesDeLas645PM) {
      // Si es después de las 
      fechaMinima.setDate(fechaActual.getDate());
    } else {
      // Si es antes de las 
      fechaMinima.setDate(fechaActual.getDate() + 1);
    }
  
    // Establecer la fecha mínima en el campo de fecha
    const fechaMinimaISO = fechaMinima.toISOString().split('T')[0];
    fechaactual=fechaMinimaISO;
    fechaVentaInput.setAttribute('min', fechaMinimaISO);
  });

  function genPDF() 
  {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    fechaventa= convertirFecha(fecha_venta);
        // Obtener la fecha actual
    var fechaActual = new Date();

    // Obtener el día, mes y año
    var dia = fechaActual.getDate();
    var mes = fechaActual.getMonth() + 1; // Los meses empiezan desde 0, por lo que se suma 1
    var año = fechaActual.getFullYear();

    // Asegurarse de que el día y el mes tengan dos dígitos
    if (dia < 10) {
        dia = '0' + dia;
    }
    if (mes < 10) {
        mes = '0' + mes;
    }

    // Formatear la fecha en dia/mes/año
    var fechaFormateada = dia + '/' + mes + '/' + año;

    var Y_desplazador = 8;
  
    // Agregar el logo en la esquina superior izquierda
    const logo = '/resources/images/Logo.png'; // Reemplaza con la ruta de tu imagen
  
    // Cargar la imagen del logo
    const img = new Image();
    img.src = logo;
  
    
    img.onload = function() {
      const totalSubTotal = filasAgregadas.reduce((acumulador, fila) => acumulador + fila.SubTotal, 0);
  
      // Añadir la imagen al documento
      doc.addImage(img, 'PNG', 7, 10, 35, 35); // Ajusta las coordenadas y el tamaño según tus necesidades
  
      // Título centrado del documento y fecha que se genero el archivo PDF
      doc.setFont("times");
      doc.setFontSize(18);
      doc.text("FACTURA  No " + id_de_venta, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text("Fecha: " +fechaventa, 180, 20, { align: 'center' });
  
      // Info de la Empresa
      doc.setFont("times","bold");
      doc.setFontSize(20);
      doc.text("ALMACEN COMERCIAL JENNIFER", doc.internal.pageSize.getWidth() / 2, 34, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont("times","normal");
      doc.text("De la Nestlé 1 cuadra al sur, 2 cuadras abajo 2 cuadras al sur", doc.internal.pageSize.getWidth() / 2, 36 + Y_desplazador, { align: 'center' });
      doc.setFontSize(12);
      doc.text("Número Telefónico: 2232-3159", doc.internal.pageSize.getWidth() / 2, 44 + Y_desplazador, { align: 'center' });
      doc.text("RUC: 004 160851 0001F", doc.internal.pageSize.getWidth() / 2, 49 + Y_desplazador, { align: 'center' });
  
      doc.setFontSize(12);
  
      doc.text("Cliente: " + venta_cliente, 20, 64);
      doc.text("Vendedor: " + venta_vendedor, 20, 70);
  
      // Crear la tabla en el PDF en el mismo orden que las filas agregadas
      const headers2 = ['Producto', 'Cantidad', '', 'Precio', 'SubTotal'];
      const data2 = filasAgregadas.map(fila => [fila.Producto, fila.Cantidad, '', fila.Precio, fila.SubTotal]);
  
      doc.autoTable({
        head: [headers2],
        body: data2,
        startY: 80 + Y_desplazador, // Añadir espacio entre las tablas
        headStyles: {
            fillColor: [192, 192, 192], // Color gris para el encabezado
            textColor: [0, 0, 0], // Color negro para el texto del encabezado
            font: "times", // Fuente Times New Roman para el encabezado
            halign: "center", 
            valign: "middle" 
        },
        bodyStyles: {
            fillColor: [255, 255, 255], 
            textColor: [0, 0, 0], 
            font: "times", 
            halign: "center", 
            valign: "middle" 
        },
        styles: {
            font: "times", 
            textColor: [0, 0, 0], 
            halign: "center", 
            valign: "middle"
        }
    });
      const finalY = doc.lastAutoTable.finalY;
  
      const x = 165; // Posición X del rectángulo
      const y = 7 + finalY; // Posición Y del rectángulo
      const width = 24; // Ancho del rectángulo
      const height = 10; // Alto del rectángulo
      const borderColor = [192, 192, 192];
      const fillColor = [255, 255, 255]; // Color de relleno (blanco)
  
      doc.setDrawColor(0,0,0); 
      doc.setFillColor(...fillColor); 
      doc.setLineWidth(0.5);
      doc.rect(x, y, width, height, 'FD'); 
      doc.setLineWidth(1);
      doc.rect(52,276, width + 82, height-5, 'FD'); 
  
      doc.setFontSize(10);
      doc.text(`Total C$:    ${totalSubTotal}`, 150, 13 + finalY);
      doc.text("NO SE ACEPTAN DEVOLUCIONES, GRACIAS POR SU COMPRA",doc.internal.pageSize.getWidth() / 2, 280,{ align: 'center' });

      doc.setDrawColor(0,0,0);
      doc.setLineWidth(0.3);var linex=10; 
      doc.line(25+linex, 255, 75+linex, 255);
      doc.line(115+linex, 255, 165+linex, 255);
      doc.text("RECIBI CONFORME                                                               ENTREGUE CONFORME",doc.internal.pageSize.getWidth() / 2,260,{ align: 'center' });
  
      // Guardar el PDF
      doc.save(`Factura_${venta_cliente}.pdf`);
  
      
  };
  }
  
function abrirPanelReportes()
{
  console.log('Abriendo panel de reportes siuu');

  var panel = document.getElementById("PanelReportes");
  panel.style.display = "block";

}

function cerrarPanelReportes()
{
  console.log('Cerrando panel de reportes siuu');

  var panel = document.getElementById("PanelReportes");
  panel.style.display = "none";

}


document.addEventListener('DOMContentLoaded', function () {
  const periodRadios = document.querySelectorAll('input[name="period"]');
  const selectMesDiv = document.getElementById('select-mes');
  const rangoFechasInputs = document.getElementById('rango-fechas-inputs');
  const mesSelect = document.getElementById('mes-select');
  const fechaInicioInput = document.getElementById('fecha_inicio');
  const fechaFinInput = document.getElementById('fecha_fin');
  const reportForm = document.getElementById('report-form');

  periodRadios.forEach(radio => {
      radio.addEventListener('change', function () {
          if (this.value === 'mes') {
              selectMesDiv.style.display = 'block';
              rangoFechasInputs.style.display = 'none';
              populateMonths();
          } else if (this.value === 'rango') {
              selectMesDiv.style.display = 'none';
              rangoFechasInputs.style.display = 'block';
              setDateRange();
          } else {
              selectMesDiv.style.display = 'none';
              rangoFechasInputs.style.display = 'none';
          }
      });
  });

  function populateMonths() {
      mesSelect.innerHTML = ''; // Clear previous options
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const startYear = 2023;
      const startMonth = 11; // December (0-based index)
      
      for (let year = startYear; year <= currentYear; year++) {
          const monthStart = (year === startYear) ? startMonth : 0;
          const monthEnd = (year === currentYear) ? currentMonth : 11;
          
          for (let month = monthStart; month <= monthEnd; month++) {
              const monthName = new Date(year, month).toLocaleString('es-ES', { month: 'long' });
              const option = document.createElement('option');
              option.value = `${year}-${month + 1}`;
              option.text = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
              mesSelect.appendChild(option);
          }
      }
  }

  function setDateRange() {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      fechaInicioInput.value = firstDayOfMonth.toISOString().substr(0, 10);
      fechaFinInput.value = now.toISOString().substr(0, 10);
  }

  reportForm.addEventListener('submit', function (event) {
      const selectedPeriod = document.querySelector('input[name="period"]:checked');
      if (!selectedPeriod) {
          event.preventDefault();
          Swal.fire({
              icon: 'warning',
              title: 'Atención',
              text: 'Debe seleccionar una opción de periodo de tiempo.'
          });
          return;
      }

      if (selectedPeriod.value === 'mes' && !mesSelect.value) {
          event.preventDefault();
          Swal.fire({
              icon: 'warning',
              title: 'Atención',
              text: 'Debe seleccionar un mes.'
          });
          return;
      }

      if (selectedPeriod.value === 'rango' && (!fechaInicioInput.value || !fechaFinInput.value)) {
          event.preventDefault();
          Swal.fire({
              icon: 'warning',
              title: 'Atención',
              text: 'Debe seleccionar una fecha de inicio y una fecha de fin.'
          });
          return;
      }
  });
});

function convertirFecha(fecha) {
  // Crear un objeto con los meses en español y sus números correspondientes
  const meses = {
      "enero": "01",
      "febrero": "02",
      "marzo": "03",
      "abril": "04",
      "mayo": "05",
      "junio": "06",
      "julio": "07",
      "agosto": "08",
      "septiembre": "09",
      "octubre": "10",
      "noviembre": "11",
      "diciembre": "12"
  };

  // Dividir la fecha en partes
  let partes = fecha.toLowerCase().split(' ');

  // Obtener el día, mes y año
  let dia = partes[0].padStart(2, '0'); // Asegurarse de que el día tenga dos dígitos
  let mes = meses[partes[2]]; // Obtener el número del mes
  let año = partes[4]; // Obtener el año

  // Construir la fecha en formato YYYY-MM-DD
  let fechaFormateada = `${dia}/${mes}/${año}`;

  return fechaFormateada;
}