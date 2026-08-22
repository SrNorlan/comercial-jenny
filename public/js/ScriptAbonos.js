//MOSTRAR FORMULARIO PARA REALIZAR ABONOS
function mostrarPanelAbono(Id_Venta, Cliente,Vendedor,Saldo_Restante,fecha_venta) 
{
  var panel = document.getElementById("panelAbono");
  panel.style.display = "block";

  document.getElementById('Abono_Title').innerText = 'Realizar abono a la Venta N° '+Id_Venta;

  document.getElementById('Id_Venta_Abono').value = Id_Venta;
  document.getElementById('Nombre_cliente_Abono').value = Cliente;
  document.getElementById('Nombre_cliente_Abono').disabled = true;

  document.getElementById('Nombre_vendedor_Abono').value = Vendedor;
  document.getElementById('Nombre_vendedor_Abono').disabled = true;

  var Monto_Abonando = document.getElementById("Monto_Abono");
  var fechaAbonoInput = document.getElementById("Fecha_Abono");

  var fechaConvertida = convertirFecha(fecha_venta);

  Fecha_Actual('Fecha_Abono')

  var fechaActual = new Date();
  

  // Obtener la hora y los minutos actuales
  const horaActual = fechaActual.getHours();
  const minutosActuales = fechaActual.getMinutes();

  // Definir la hora y minutos de corte (6:45 PM)
  const horaCorte = 17; // 6 PM en formato militar
  const minutosCorte = 0; //  minutos

  // Verificar si la hora actual es después de las 6:45 PM
  const esDespuesDeLas645PM = horaActual > horaCorte || (horaActual === horaCorte && minutosActuales >= minutosCorte);

  var fechavalidacionhoraria = new Date();
  // Calcular la fecha mínima permitida
  if (esDespuesDeLas645PM) {
    // Si es después de las 6 PM, permitir seleccionar a partir del día siguiente
    fechavalidacionhoraria.setDate(fechaActual.getDate() - 1);
  } else {
    // Si es antes de las 6 PM, permitir seleccionar a partir de hoy
    fechavalidacionhoraria.setDate(fechaActual.getDate());
  }

  var fechaActualConvertida = fechavalidacionhoraria.toISOString().split('T')[0];
  

  

  fechaAbonoInput.min = fechaConvertida;

  Monto_Abonando.addEventListener('keypress', (e) => {
    // Obtener el valor actual del input como un número
    const cantidadIngresada = parseFloat(Monto_Abonando.value + e.key);
    
    if(fechaActualConvertida === fechaConvertida)
    {
      if(cantidadIngresada === (Saldo_Restante-1) || cantidadIngresada > (Saldo_Restante-1)){
        Swal.fire({
          title: "ADVERTENCIA",
          text: "No puede abonar todo el mismo día de la venta.",
          icon: 'warning',
          showConfirmButton: true,
          timer: false,
        });
        cerrarPanelAbono();
        Limpiar();
        
      }
      
    }
    if(cantidadIngresada > Saldo_Restante){
      e.preventDefault(); // Prevenir la entrada de más caracteres
      Swal.fire({
        title: "ADVERTENCIA",
        text: `C$ "${Saldo_Restante}" Es el monto mínimo a ingresar.`,
        icon: 'warning',
        showConfirmButton: true,
        timer: false,
      });
    }
  });

  Monto_Abonando.onchange = function() 
  {
    var Cantidad = parseInt(Monto_Abonando.value);
    if (Cantidad < 1) {
      // Si es negativa, establecer la cantidad a 1 (o al valor mínimo aceptable)
      Monto_Abonando.value = 1;
      Cantidad = 1;
    }
  };
}

  function cerrarPanelAbono() {
    var panel = document.getElementById("panelAbono");
    panel.style.display = "none";
  }


  //FIN FORMULARIO

  //MOSTAR HISTORIAL DE ABONOS
  function mostrarPanelHistorialAbonos() {
    var panel = document.getElementById("panelHistorialAbonos");
    panel.style.display = "block";
  }

  function cerrarPanelHistorialAbonos() {
    var panel = document.getElementById("panelHistorialAbonos");
    panel.style.display = "none";

    var tabla = document.getElementById("Tabla_Historial_Abonos").getElementsByTagName('tbody')[0];
    
    while (tabla.firstChild) 
    { tabla.removeChild(tabla.firstChild);}
  }
  //FIN MOSTRAR HISTORIAL



  //MOSTAR HISTORIAL DE ABONOS
  function mostrarPanelHistorialAbonosUnico(Id,Cliente,Vendedor) 
  {
    var panel = document.getElementById("panelHistorialAbonosUnico");
    panel.style.display = "block";

    document.getElementById('TitleHistorial').innerText = 'Historial de abonos Venta N° '+Id;

    fetch(`/buscar-abonos?id=${encodeURIComponent(Id)}`)
  .then(response => response.json())
  .then(data => {

    data.Abonos.forEach((abono) => {
      AgregarAbonosHistorial(Cliente,Vendedor,abono.Fecha_Abono,abono.Monto_Abonado,abono.Saldo_Restante);
    })
      


  })
  .catch(error => console.error('Error:', error));


  }

  function cerrarPanelHistorialAbonosUnico() {
    var panel = document.getElementById("panelHistorialAbonosUnico");
    panel.style.display = "none";

    var tabla = document.getElementById("Tabla_Historial_Abonos").getElementsByTagName('tbody')[0];
    
    while (tabla.firstChild) 
    { tabla.removeChild(tabla.firstChild);}

  }
  //FIN MOSTRAR HISTORIAL

  const inputnumero = document.querySelectorAll('input[type="number"]');
  inputnumero.forEach(input => {
    // Agrega un evento "keypress" a cada input
    input.addEventListener("keypress", (e) => {
      let expre;
  
      expre = /^[\d]+$/; // Solo números del 0-9
      
      // Verifica si la tecla presionada cumple con la expresión regular
      if (!expre.test(e.key)) {
          e.preventDefault(); // Evita que se ingrese la tecla en el input
      }
    });
  });
  
  function AgregarAbonosHistorial(Cliente,Vendedor,Fecha,Monto,Saldo)
  {
    var tabla = document.getElementById("Tabla_Historial_Abonos").getElementsByTagName('tbody')[0];

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
    let fechaFormateada = `${año}-${mes}-${dia}`;

    return fechaFormateada;
}
function Limpiar()
{
  document.getElementById("Monto_Abono").value = '';
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