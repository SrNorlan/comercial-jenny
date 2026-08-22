function mostrarPanelRegistroProveedor() {
    var panel = document.getElementById("panelRegistroProveedor");
    panel.style.display = "block";
  }
  
 
  const inputLetra = document.querySelectorAll('input[type="text"]');
  // Recorre cada input encontrado
  inputLetra.forEach(input => {
    // Agrega un evento "keypress" a cada input
    input.addEventListener("keypress", (e) => {
      let expre;
      if(input.id === 'Cedula'){
        document.getElementById('Cedula').addEventListener('input', function (e) {
          let value = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); // Elimina caracteres no alfanuméricos
          let formattedValue = '';

          // Agrega guiones en las posiciones adecuadas y limita el tamaño del input
          if (value.length > 0) formattedValue += value.substring(0, 3);
          if (value.length > 3) formattedValue += '-' + value.substring(3, 9);
          if (value.length > 9) formattedValue += '-' + value.substring(9, 13);
          if (value.length > 13) formattedValue += value.substring(13, 14);

          e.target.value = formattedValue.toUpperCase(); // Asegura que la última letra sea mayúscula
        });

        document.getElementById('Cedula').addEventListener('keydown', function (e) {
          // Permitir teclas de control como retroceso, suprimir, flechas, etc.
          let allowedKeys = [
              'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'
          ];

          // Permitir números y letras, y evitar otros caracteres
          let validKey = (e.key >= '0' && e.key <= '9') || (e.key >= 'A' && e.key <= 'Z') || (e.key >= 'a' && e.key <= 'z');

          if (!allowedKeys.includes(e.key) && !validKey) {
              e.preventDefault();
          }
        });
      
      }else if (input.id === 'Residencia' || input.id === 'PuntoReferencia' || input.id === 'Distancia' || input.id === 'Casa') { // Supongamos que el input de la cédula tiene el ID 'cedulaInput'
          // Expresión regular para permitir números y guion "-"
          expre = /^[a-zA-Z0-9\sñÑ]+$/; // Solo números del 0-9 y guion "-"
      }else{ 
          expre = /^[a-zA-Z\sñÑáéíóúÁÉÍÓÚÜü]+$/; 
      } 
      // Verifica si la tecla presionada cumple con la expresión regular
      if (!expre.test(e.key)) {
          e.preventDefault(); // Evita que se ingrese la tecla en el input
      }
    });
  });
  const numberInput = document.getElementById('Telefono');

    numberInput.addEventListener('input', function() {
      // Limitar el valor a 8 dígitos
      this.value = this.value.slice(0, 8);
    });

    // Validación del formulario
    (function() {
      'use strict';
      window.addEventListener('load', function() {
        var forms = document.getElementsByClassName('needs-validation');
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    })();
    // Validar que el número de teléfono tenga 8 dígitos
    var phoneInput = document.getElementById('Telefono');
    phoneInput.addEventListener('input', function() {
      var value = phoneInput.value.replace(/\D/g, '');
      if (value.length !== 8) {
        phoneInput.setCustomValidity("El número de teléfono debe tener 8 dígitos.");
      } else {
        phoneInput.setCustomValidity('');
      }
    });
    // Validar que la cédula tenga el formato 000-000000-0000A
    var cedulaInput = document.getElementById('Cedula');
    cedulaInput.addEventListener('input', function() {
      var value = cedulaInput.value.replace(/\D/g, '');
      var pattern = /^(\d{3})-(\d{6})-(\d{4})([A-Z])$/;
      if (!pattern.test(cedulaInput.value)) {
        cedulaInput.setCustomValidity("La cédula debe tener el formato 000-000000-0000A.");
      } else {
        cedulaInput.setCustomValidity('');
      }
    });

  function cerrarPanelRegistroProveedor() {
    var panel = document.getElementById("panelRegistroProveedor");
    panel.style.display = "none";
  };