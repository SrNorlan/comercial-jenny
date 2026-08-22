Fecha_Actual('FCompra');
ActualizarFecha();
var invalidProductFound = false;
var filasAgregadas = [];

var productosSeleccionados = [];
var id_de_compra , proveedor,  comprador ,fecha_compra,comercio;

const Id_Compra = generarIdCompra();
document.getElementById('NumCompra').textContent='N° Compra: '+ Id_Compra;

function mostrarTablaSegunCategoria() 
{
    // Ocultar todas las tablas
    document.getElementById('tablaCalzado').style.display = 'none';
    document.getElementById('tablaPrendas').style.display = 'none';
    document.getElementById('tablaCosmeticos').style.display = 'none';
    document.getElementById('tablaElectrodomesticos').style.display = 'none';
    document.getElementById('tablaPPlasticos').style.display = 'none';

    // Obtener la categoría seleccionada
    var seleccion = document.getElementById('categoriaSelect1').value;

    // Mostrar la tabla correspondiente
    switch (seleccion) 
    {
        case '1': 
            document.getElementById('tablaCalzado').style.display = 'block';
            break;
        case '2': 
            document.getElementById('tablaPrendas').style.display = 'block';
            break;
        case '3': 
            document.getElementById('tablaCosmeticos').style.display = 'block';
            break;
        case '4': 
            document.getElementById('tablaElectrodomesticos').style.display = 'block';
            break;
        case '5': 
            document.getElementById('tablaPPlasticos').style.display = 'block';
            break;
        
    }
}

function AbrirPanelProductoCompra() 
{
    //alert('Abrir PANEL');
    let panel = document.getElementById("CompraProducto");
    panel.style.display = "block";
}

function CerrarPanelProductoCompra() 
{
    //alert('Cerrar PANEL');
    var panel = document.getElementById("CompraProducto");
    panel.style.display = "none";
    filasAgregadas=[];
} 

function mostrarDetallesCompra(Id_Compra, Proveedor, Comprador, Fecha , Total,prov_nombre,Comercio) 
{
  filasAgregadas = []

  proveedor=prov_nombre;
  comprador=Comprador;
  id_de_compra = Id_Compra;
  fecha_compra = Fecha;
  proveedor = Proveedor;
  comprador = Comprador;
  comercio = Comercio;

  var tabla = document.getElementById("tablaDetalleCompra").getElementsByTagName('tbody')[1];
    
  while (tabla.firstChild) 
  { tabla.removeChild(tabla.firstChild);}


  var panel = document.getElementById("panelDetalleCompras");
  panel.style.display = "block";
  id_de_compra = Id_Compra;

  document.getElementById("DetalleCompraTitle").innerText = 'Detalles de la Compra N° '+Id_Compra;
  document.getElementById("ProveedorDetalle").textContent = Proveedor;
  document.getElementById("CompradorDetalle").textContent = Comprador;
  document.getElementById("FechaCompraDetalle").textContent = Fecha;
  document.getElementById("TotalCompraDetalle").textContent = 'C$ '+Total;

  fetch(`/buscar-detallecompra?id=${encodeURIComponent(Id_Compra)}`)
  .then(response => response.json())
  .then( data => 
  {
    const Detalles = data.DetallesCompra;

    Detalles.forEach((Detalle) => 
    {
      AddProductoTabla(Detalle.Producto,Detalle.Cantidad_Comprada,Detalle.Precio_Compra,Detalle.Precio_Venta,Detalle.Sub_Total)
    })

  })
  .catch(error => console.error('Error:', error)); 


}

function cerrarDetallesCompra() 
{
  var panel = document.getElementById("panelDetalleCompras");
  panel.style.display = "none";

  var tabla = document.getElementById("tablaDetalleCompra").getElementsByTagName('tbody')[1];
    
  while (tabla.firstChild) 
  { tabla.removeChild(tabla.firstChild);}
  filasAgregadas = []
}

function mostrarProveedorCompras() 
{
  var panel = document.getElementById("BuscarProveedorVenta");
  panel.style.display = "block";
}

function cerrarProveedorCompras() 
{
    var panel = document.getElementById("BuscarProveedorVenta");
    panel.style.display = "none";
}

function mostrarGerenteCompras() 
{
    var panel = document.getElementById("BuscarGerenteVenta");
    panel.style.display = "block";
}

function cerrarGerenteCompras() 
{
    var panel = document.getElementById("BuscarGerenteVenta");
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
 
//btnBuscarProveedor
function BuscarProveedor(cedula)
{
  fetch(`/buscar-prov?cedula=${encodeURIComponent(cedula)}`)
  .then(response => response.json())
  .then(data => {

      // Mostrar el resultado en la tabla
      const btnBusqueda = document.getElementById("btnBuscarProveedor");

      if(data.nombreProveedor== "No se encontro al Proveedor" )
      {
        btnBusqueda.className = "btn btn-outline-danger";
        btnBusqueda.innerHTML = "No se encontro al Proveedor <i class='bx bx-search'></i> ";
      }
      else
      {
        btnBusqueda.className = "btn btn-outline-success";
        btnBusqueda.innerText = data.nombreProveedor;
        document.getElementById('ProveedorFactura').textContent = data.comercio + '/'+ data.nombreProveedor;
        document.getElementById('ProveedorCed').value = cedula;
        cerrarProveedorCompras();
      }
  })
  .catch(error => console.error('Error:', error));

}

function BuscarGerente(cedula)
{
    fetch(`/buscar-gerente?cedula=${encodeURIComponent(cedula)}`)
    .then(response => response.json())
    .then(data => 
    {
        // Mostrar el resultado en la tabla
        const btnBusqueda = document.getElementById("btnBuscarGerente");
  
        if(data.nombreGerente == "No se encontro al Gerente" )
        {
          btnBusqueda.className = "btn btn-outline-danger";
          btnBusqueda.innerHTML = "No se encontro al Comprador <i class='bx bx-search'></i> ";
        }
        else
        {
          btnBusqueda.className = "btn btn-outline-success";
          btnBusqueda.innerText = data.nombreGerente;
          document.getElementById('GerenteFactura').textContent = 'Almacen Jennifer/'+data.nombreGerente;
          document.getElementById('GerenteCed').value = cedula;
          cerrarGerenteCompras();
        }
    })
    .catch(error => console.error('Error:', error));
  
}

function ActualizarFecha()
{
  const InputFecha = document.getElementById('FechatablaCompra');

  InputFecha.textContent = document.getElementById('FCompra').value;
}

function generarIdCompra() 
{
  const numeroAleatorio = Math.floor(Math.random() * 1000000);
  return numeroAleatorio;
}

function AñadirProducto(Id_Producto,Nombre_Producto,Precio_Compra,Precio_Venta) 
{
  var tabla = document.getElementById("tablacompra").getElementsByTagName('thead')[1];
  const celda_total = document.getElementById("celda_totalCompra");

  if(Precio_Compra == '')
  {Precio_Compra=0;}

  if(Precio_Venta == '')
  {Precio_Venta=0;}

  var nuevaFila = document.createElement("tr");
  var celdaProducto = document.createElement("th");
  var celdaCantidad = document.createElement("th");
  var celdaPrecioCompra = document.createElement("th");
  var celdaPrecioVenta = document.createElement("th");
  var celdaBoton = document.createElement("th");
  var celdaSubtotal = document.createElement("th");

  var inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.style.textAlign = 'center';
  inputCantidad.id = 'CantProductCompra';
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

  inputCantidad.onchange = function() 
  {
    let Precio = inputPrecioCompra.value;
    var nuevaCantidad = parseInt(inputCantidad.value);
    if (nuevaCantidad < 1) {
      // Si es negativa, establecer la cantidad a 1 (o al valor mínimo aceptable)
      inputCantidad.value = 1;
      nuevaCantidad = 1;
    }

    var nuevaCantidad = parseInt(inputCantidad.value);
    actualizarCantidadProductoEnArreglo(Id_Producto, nuevaCantidad);
    actualizarTotalEnTabla();
    celdaSubtotal.textContent = 'C$' + Precio*inputCantidad.value;
  };

  /*****   Input Precio de Compra *************************************************************/
  var contenedorCompra = document.createElement("div");
  contenedorCompra.className="d-flex align-items-center justify-content-center";

  var inputPrecioCompra = document.createElement("input");
  inputPrecioCompra.type = "number";
  inputPrecioCompra.style.textAlign = 'center';
  inputPrecioCompra.id = 'PrecioProductCompra';
  inputPrecioCompra.value=Precio_Compra;
  inputPrecioCompra.style.border = "none";
  inputPrecioCompra.addEventListener('keypress', (e) => 
  {
    let expre;
    expre = /^[0-9]+$/;
    
    // Verificar si la tecla presionada cumple con la expresión regular
    if (!expre.test(e.key)) {
        e.preventDefault(); // Evitar que se ingrese la tecla en el input
    }
  });

  inputPrecioCompra.onchange = function() 
  {
    var nuevoPrecio = parseInt(inputPrecioCompra.value);
    if (nuevoPrecio < 1) 
    {
      // Si es negativo, establecer la cantidad a 1 (o al valor mínimo aceptable)
      inputPrecioCompra.value = Precio_Compra;
    }
    celdaSubtotal.textContent = 'C$' + nuevoPrecio*inputCantidad.value; 
    actualizarPrecioCompraProductoEnArreglo(Id_Producto, nuevoPrecio);
    actualizarTotalEnTabla(); 
  };
 
/***************************************************************************************/

  /*****   Input Precio de Venta *************************************************************/
  var contenedorVenta = document.createElement("div");
  contenedorVenta.className="d-flex align-items-center justify-content-center";

  var inputPrecioVenta = document.createElement("input");
  inputPrecioVenta.type = "number";
  inputPrecioVenta.style.textAlign = 'center';
  inputPrecioVenta.id = 'PrecioProductCompra';
  inputPrecioVenta.value=Precio_Venta;
  inputPrecioVenta.style.border = "none";
  inputPrecioVenta.addEventListener('keypress', (e) => 
  {
    let expre;
    expre = /^[0-9]+$/;
    
    // Verificar si la tecla presionada cumple con la expresión regular
    if (!expre.test(e.key)) {
        e.preventDefault(); // Evitar que se ingrese la tecla en el input
    }
  });

  inputPrecioVenta.onchange = function() 
  {
    var nuevoPrecio = parseInt(inputPrecioVenta.value);
    if (nuevoPrecio < 1) 
    {
      // Si es negativo, establecer la cantidad a 1 (o al valor mínimo aceptable)
      inputPrecioVenta.value = Precio_Venta;
    }

    actualizarPrecioVentaProductoEnArreglo(Id_Producto, nuevoPrecio);
  };
 
/***************************************************************************************/


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

    //Agregar el texto y el input al div de compra
    contenedorCompra.textContent = 'C$ ';
    contenedorCompra.appendChild(inputPrecioCompra);
    //Agregar el contenedor a la celda
    celdaPrecioCompra.appendChild(contenedorCompra);

    //Agregar el texto y el input al div de venta
    contenedorVenta.textContent = 'C$ ';
    contenedorVenta.appendChild(inputPrecioVenta);
    //Agregar el contenedor a la celda
    celdaPrecioVenta.appendChild(contenedorVenta);

    //Agregar Boton eliminar a la celda
    celdaBoton.appendChild(BotonEliminar);
    //Columna Subtotal
    celdaSubtotal.textContent = 'C$' +( Precio_Compra * inputCantidad.value);

    // Agregar las celdas a la fila
    nuevaFila.appendChild(celdaProducto);
    nuevaFila.appendChild(celdaCantidad);
    nuevaFila.appendChild(celdaPrecioVenta);
    nuevaFila.appendChild(celdaPrecioCompra);
    nuevaFila.appendChild(celdaSubtotal);
    nuevaFila.appendChild(celdaBoton);
    
    // Agregar la fila a la tabla
    tabla.appendChild(nuevaFila);
    
    var producto = 
    {
      IdProducto: Id_Producto,
      Cantidad: 1,
      Precio_Compra: Precio_Compra,
      Precio_Venta: Precio_Venta
    };

    productosSeleccionados.push(producto);
    let total_venta = 0;

    productosSeleccionados.forEach(function(producto) 
    { total_venta += producto.Precio_Compra * producto.Cantidad; });
    celda_total.innerHTML = 'C$ ' + total_venta.toFixed(2);  
  } 

}

function EliminarProducto(boton,id) 
{
    // Obtener el índice de la fila en la tabla
    var filaTabla = boton.parentNode.parentNode;
    var indexFila = filaTabla.rowIndex;
    
    // Eliminar la fila de la tabla
    document.getElementById("tablacompra").deleteRow(indexFila);

    productosSeleccionados = productosSeleccionados.filter(producto => producto.IdProducto !== id);
    actualizarTotalEnTabla();

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
  const celda_total = document.getElementById("celda_totalCompra");
  
  productosSeleccionados.forEach(function(producto) 
  { totalVenta += producto.Precio_Compra * producto.Cantidad; });
  celda_total.textContent = 'C$ ' + totalVenta.toFixed(2);
}

function actualizarPrecioCompraProductoEnArreglo(idProducto, nuevoPrecio) 
{
  productosSeleccionados.forEach(function(producto) 
  {
    if (producto.IdProducto === idProducto) 
    { producto.Precio_Compra = nuevoPrecio; 
      invalidProductFound = false;
    }
  });


}

function actualizarPrecioVentaProductoEnArreglo(idProducto, nuevoPrecio) 
{
  productosSeleccionados.forEach(function(producto) 
  {
    if (producto.IdProducto === idProducto) 
    { 
      producto.Precio_Venta = nuevoPrecio; 
      invalidProductFound = false;
    }
  });


}

function AñadirCompra()
{
  const Proveedor = document.getElementById('ProveedorCed').value;
  const Gerente = document.getElementById('GerenteCed').value;
  const Fecha_Compra = document.getElementById('FCompra').value;
  const Total_Compra_td = document.getElementById('celda_totalCompra').innerText;


  const Total_compra = parseFloat(Total_Compra_td.replace("C$", "").trim());
  
  const DatosCompra = 
  {
    Proveedor:Proveedor,
    Comprador:Gerente,
    Fecha_Compra:Fecha_Compra,
    Productos: productosSeleccionados,
    Total_compra: Total_compra,
    Id_Compra:Id_Compra
  }
    
  if(Proveedor != '')
  {
    if(Gerente != '')
    {
      if (productosSeleccionados.length != 0)
      {
        productosSeleccionados.forEach(function(product) 
        {
          if (product.Precio_Compra == 0 || product.Precio_Venta == 0) 
          {invalidProductFound = true;}
        });
  
        if(invalidProductFound == false)
        {
          fetch('/AddCompra', 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(DatosCompra)
          })
          .then(response => 
          {
            if (!response.ok) 
            { throw new Error('La solicitud ha fallado'); }
            return response.json();
          })
          .then( data => 
          {
            if (data.success)
            {
              Swal.fire(
              {
                icon: 'success',
                title: '¡Éxito!',
                text: 'Compra agregada correctamente',
                confirmButtonText: 'Aceptar'
              })
              .then(() => { window.location.reload();});
            } 
            else 
            {
              Swal.fire(
              {
                icon: 'error',
                title: 'No se pudo ingresar la Compra',
                text: 'Hubo un error al ingresar la Compra, verifique los datos e intentelo nuevamente x',
                confirmButtonText: 'Aceptar'
              })
            }
          })
          .catch( error => 
          {
            Swal.fire(
            {
              icon: 'error',
              title: 'No se pudo ingresar la Compra',
              text: 'Hubo un error al ingresar la Compra, verifique los datos e intentelo nuevamente',
              confirmButtonText: 'Aceptar'
            })
          });
        }
        else
        {showAlert('Falta Informacion','No ha agregado precio a uno de los producto a Comprar, por favor agregue el precio e intentelo nuevamente','warning');}
      }   
      else
      {showAlert('No ha agregado Productos','No ha agregado ningun producto a la Compra, por favor agregue productos e intentelo nuevamente','warning');}
    }
    else {showAlert('¡Faltan Datos!','Aun faltan datos por agregar, aun no ha agregado al Gerente', 'warning'); }
  }
  else
  { showAlert('¡Faltan Datos!','Aun faltan datos por agregar, aun no ha agregado al Proveedor', 'warning'); }



 


}

function showAlert(Titulo,Mensaje, icono)
{
  Swal.fire({
    title: Titulo,
    text: Mensaje,
    icon: icono,
    showConfirmButton: true,
    timer: false,
  });
}

function AddProductoTabla (Producto,Cantidad,Precio_Compra, Precio_Venta,SubTotal)
{
  var tabla = document.getElementById("tablaDetalleCompra").getElementsByTagName('tbody')[1];
  
  var nuevaFila = document.createElement("tr");

  var celda_Producto = document.createElement("td");
  var celda_Cantidad = document.createElement("td");
  var celda_Vacia = document.createElement("td");
  var celda_Precio_compra = document.createElement("td");
  var celda_Precio_venta = document.createElement("td");
  var celda_Subtotal = document.createElement("td");

  // Agregar contenido a las celdas
  celda_Producto.textContent = Producto;
  celda_Cantidad.textContent = Cantidad;
  celda_Precio_compra.textContent = 'C$ '+Precio_Compra;
  celda_Precio_venta.textContent = 'C$ '+Precio_Venta;
  celda_Subtotal.textContent = 'C$ '+ SubTotal;

  // Agregar las celdas a la fila
  nuevaFila.appendChild(celda_Producto);
  nuevaFila.appendChild(celda_Cantidad);
  nuevaFila.appendChild(celda_Vacia);
  nuevaFila.appendChild(celda_Precio_compra);
  nuevaFila.appendChild(celda_Precio_venta);
  nuevaFila.appendChild(celda_Subtotal);
  
  // Agregar la fila a la tabla
  tabla.appendChild(nuevaFila);
  var fila = {
    Producto: Producto,
    cantidad: Cantidad,
    precio_compra:Precio_Compra,
    precio_venta:Precio_Venta,
    subtotal:SubTotal
  };
  filasAgregadas.push(fila);
}

document.addEventListener('DOMContentLoaded', function() 
{
  // Obtener la referencia al elemento de fecha
  const fechaVentaInput = document.getElementById('FCompra');

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

async function genPDF() 
{
  try
  {
    const response = await fetch(`/buscar-Compra?id=${encodeURIComponent(id_de_compra)}`);
    const data = await response.json();

    const Datos= data.Info[0]; 

    console.log(Datos.Comercio)

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const totalSubTotal = filasAgregadas.reduce((acumulador, fila) => acumulador + fila.subtotal, 0);
    const fechacompra= convertirFecha(fecha_compra);

    // Obtener la fecha actual
    var fechaActual = new Date();

    // Obtener el día, mes y año
    var dia = fechaActual.getDate();
    var mes = fechaActual.getMonth() + 1; // Los meses empiezan desde 0, por lo que se suma 1
    var año = fechaActual.getFullYear();

    // Asegurarse de que el día y el mes tengan dos dígitos
    if (dia < 10) 
    { dia = '0' + dia; }
    if (mes < 10) {
        mes = '0' + mes;
    }

    // Formatear la fecha en dia/mes/año
    var fechaFormateada = dia + '/' + mes + '/' + año;

    //var fechaFormateada = new Date().toLocaleDateString('es-mx', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
    //var fechaFormateada= new Date().toLocaleDateString('es-mx');

    var Y_desplazador = 8;

    // Crear una imagen HTML para cargar el logo
    var img = new Image();
    img.src = '/resources/images/Logo.png'; // Ruta de la imagen

    img.onload = function() 
    {
        // Añadir la imagen al PDF una vez que esté cargada
        doc.addImage(img, 'PNG', 10, 10, 30, 30); // Ajusta las coordenadas y el tamaño de la imagen según sea necesario

        // Título centrado del documento y fecha que se generó el archivo PDF
        doc.setFont("times");
        doc.setFontSize(18);
        doc.text("FACTURA COMPRA No " + id_de_compra, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text("Fecha: " + fechacompra, 180, 20, { align: 'center' });

        // Info de la Empresa
        doc.setFont("times", "bold");
        doc.setFontSize(20);
        doc.text(`${Datos.Comercio}`, doc.internal.pageSize.getWidth() / 2, 34, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont("times", "normal");
        doc.text(`${Datos.Dirección}`, doc.internal.pageSize.getWidth() / 2, 36 + Y_desplazador, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Número Telefónico: 2232-3159`, doc.internal.pageSize.getWidth() / 2, 44 + Y_desplazador, { align: 'center' });
        doc.text(`RUC: 004 160851 0001F`, doc.internal.pageSize.getWidth() / 2, 49 + Y_desplazador, { align: 'center' });

        doc.text("Comprador: " + comprador, 20, 64);
        doc.text("Proveedor: " + proveedor, 20, 70);

        const headers2 = ['Producto', 'Cantidad','Precio de Compra', 'Precio de Venta', 'SubTotal'];
        const data2 = filasAgregadas.map(fila => [fila.Producto,fila.cantidad,fila.precio_compra,fila.precio_venta,fila.subtotal]);
  
        doc.autoTable({
          head: [headers2],
          body: data2,
          startY: 80, // Añadir espacio entre las tablas
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
      
      doc.setFontSize(10);
      doc.text(`Total C$:    ${totalSubTotal}`, 150, 13 + finalY);
      
      doc.setDrawColor(0,0,0);
      doc.setLineWidth(0.3);var linex=10; 
      doc.line(25+linex, 255, 75+linex, 255);
      doc.line(115+linex, 255, 165+linex, 255);
      doc.text("RECIBI CONFORME                                                               ENTREGUE CONFORME",doc.internal.pageSize.getWidth() / 2,260,{ align: 'center' });
      
        // Guardar el PDF
        doc.save(`Factura_${Datos.Comercio}.pdf`);
      }

  }
  catch (error)
  { console.log('Error al General el PDF => ', error) }

  
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


document.addEventListener('DOMContentLoaded', function () 
{
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
};