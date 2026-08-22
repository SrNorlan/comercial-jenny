let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange(); //llamando a la función (opcional)
  });
}

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    // La barra lateral se abre al hacer clic en el ícono de búsqueda.
    sidebar.classList.toggle("open");
    menuBtnChange(); //llamando a la función (opcional)
  });
}
//codigo para cambiar el botón de la barra lateral (opcional)
function menuBtnChange() {
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); //reemplazando la clase de iconos
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); //reemplazando la clase de iconos
  }
}

document.querySelector("clientes.html").addEventListener("click", function () {
  window.location = "clientes.html";
});

document.querySelector("vendedores.html").addEventListener("click", function () {
  window.location = "vendedores.html";
});

document.querySelector("productos.html").addEventListener("click", function () {
  window.location = "productos.html";
});

var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, 
{
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Meses Anteriores",
        data: valores,
        backgroundColor: ["#12C9E5", "#12C9E5", "#12C9E5", "#12C9E5", "#111B54"],
        maxBarThickness: 30,
        maxBarLength: 2,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
});
var ctx2 = document.getElementById("myChart2").getContext("2d");
var myChart2 = new Chart(ctx2, 
{
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Meses Anteriores",
        data: valores,
        backgroundColor: ["#12C9E5", "#12C9E5", "#12C9E5", "#12C9E5", "#111B54"],
        maxBarThickness: 30,
        maxBarLength: 2,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
});

async function genPDF(ingresos, productosnuevos, clientesactivos) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

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

  var Y_desplazador = 60;
  // Encabezado
  const logoImg = '/resources/images/Logo.png'; // Ruta de la imagen del logo
  const title = "REPORTE DE VENTAS";
  const address = "De la Nestlé 1 cuadra al sur, 2 cuadras abajo 2 cuadras al sur";

  // Agregar el logo en la esquina superior izquierda
  doc.addImage(logoImg, 'PNG', 10, 10, 30, 30); // Ajusta la posición y tamaño según necesites

  // Título centrado
  doc.setFontSize(18);
  doc.text(title,doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  doc.setFontSize(18);
  doc.text("ALMACEN COMERCIAL JENNIFER", doc.internal.pageSize.getWidth() / 2, 34, { align: 'center' });
  // Dirección debajo del título
  doc.setFontSize(12);
  doc.text(address,doc.internal.pageSize.getWidth() / 2, 44, { align: 'center' });
  doc.setFontSize(12);
  doc.text("Número Telefónico: 2232-3159", doc.internal.pageSize.getWidth() / 2, 52, { align: 'center' });
  doc.setFontSize(12);
  doc.text("Fecha: "+fechaFormateada,180, 20, { align: 'center' });

  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx codigo marco de las graficas xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  //propiedades del cuadro
  const x = 118; // Posición X del rectángulo
  const y = 5+Y_desplazador; // Posición Y del rectángulo
  const width = 90; // Ancho del rectángulo
  const height = 286; // Alto del rectángulo
  const borderColor = [192, 192, 192]; // Color del borde (negro)
  const fillColor = [255, 255, 255];// Color de relleno (blanco)

  doc.setDrawColor(...borderColor); // Establece el color del borde
  doc.setFillColor(...fillColor); // Establece el color de relleno
  doc.rect(x, y, width, height, 'FD'); // Dibuja el rectángulo con relleno (F) y borde (D)

  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx codigo marco de los textos xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  const x2 = 3; // Posición X del rectángulo
  const y2 = 5+Y_desplazador; // Posición Y del rectángulo
  const width2 = 114; // Ancho del rectángulo
  const height2 = 286; // Alto del rectángulo
  const borderColor2 = [192, 192, 192]; // Color del borde (negro)
  const fillColor2 = [192, 192, 192];// Color de relleno (blanco)

  doc.setDrawColor(...borderColor2); // Establece el color del borde
  doc.setFillColor(...fillColor2); // Establece el color de relleno
  doc.rect(x2, y2, width2, height2, 'FD'); // Dibuja el rectángulo con relleno (F) y borde (D)


  // Convertir los canvas a imagen y agregarlas al PDF
  const canvas = document.getElementById('myChart');
  const canvas2 = document.getElementById('myChart2');
  const canvasImg = canvas.toDataURL('image/png', 1.0);
  const canvasImg2 = canvas2.toDataURL('image/png', 1.0);
  
  // Ajusta las posiciones y tamaños según necesites
  const imgWidth = 80;
  const imgHeight = 65;
  const margin = 10; // margen entre las imágenes

  // Añadir texto arriba de la primera imagen
  doc.text("VENTAS AL CONTADO", x+(90/2), y+10,{ align: 'center' });

  // Añadir primera imagen
  doc.addImage(canvasImg, 'PNG', x+5, y+17, imgWidth, imgHeight);


  
  // Añadir texto entre las dos imágenes
  const secondTextY = 95 + imgHeight + margin - 5;
  doc.text("VENTAS AL CRÉDITO", x+(90/2), secondTextY,{ align: 'center' });

  // Añadir segunda imagen con un espacio entre ambas
  const secondImageY = 65 + imgHeight + margin;
  doc.addImage(canvasImg2, 'PNG', x+5, secondImageY+30, imgWidth, imgHeight);

  // Título del documento
  doc.text("REGISTRO DE VENTAS", x2+(114/2), 20+Y_desplazador,{ align: 'center' });

  const introText = ` Este informe detalla el desempeño de ventas a lo largo de los meses, destacando los ingresos mensuales, los productos activos y el número de clientes activos. 

  Los datos se presentan con gráficos que permiten una visualización clara de las tendencias y el crecimiento de las ventas al crédito y al contado de cada mes.

   A continuacion se mostrará a más detalle información sobre los ingresos generados en este mes, la cantidad de productos que estan activos, es decir que han sido comprados en los ultimos dias
  y que son bastante solicitados; La cantidad de Clientes activos que tiene la empresa, es decir el número de clientes que han hecho una compra a la empresa en los ultimos dias.`;

  var textdetallesY2 = 150+Y_desplazador;

  const splitIntroText = doc.splitTextToSize(introText, 100);
  doc.setFontSize(12);
  doc.text(splitIntroText, x2+9, 35+Y_desplazador);

  // Agregar datos del mes
  const monthIncome = "En este mes tenemos un ingreso de ";
  const activeProducts = "La cantidad de Productos activos son ";
  const activeClients = "La cantidad de clientes activos es de ";

  

  doc.text(`${monthIncome} ${ingresos} .`, x2+9, textdetallesY2+10);
  doc.text(`${activeProducts} ${productosnuevos} .`, x2+9, textdetallesY2+20);
  doc.text(`${activeClients} ${clientesactivos} .`, x2+9, textdetallesY2+30);
  
  // Guardar el documento
  doc.save('Reporte.pdf');
}
