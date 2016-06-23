// Documento de identidad del usuario
var documento = window.localStorage.getItem('rsc_doc');
// Estado de registro del usuario
var verificado = window.localStorage.getItem('rsc_ver');
var latitud;
var longitud;
var datos_enviados = 0;
var gps = 0;

switch(verificado) {
    // Usuario aprobado
    case "ec01ce":
      // Obtener geolocalización (GPS)
      function disp(pos) { latitud = pos.coords.latitude; longitud = pos.coords.longitude; gps = 1; }
      function error(msg){ alert('Por favor activa tu GPS para informar tu posición y enviar la alerta.'); }
      navigator.geolocation.watchPosition(disp,error,{maximumAge: 0, timeout: 5000, enableHighAccuracy: true});
      // Mostrar alertas
      document.getElementById('principal').innerHTML = "<img class='background' src='img/background.jpg'><div style='padding-top:55%;'></div><img src='img/img_1.png' class='w-100' onclick='enviar_alerta(\"b1\");'>";
    break;
    // Verificar si fue aprobado
    case "ec02ce":
      $.ajax({
        type: 'POST',
        data: 'documento='+documento,
        url: 'http://alertasanmiguel.tecnicom.pe/scripts/reg_12100624.php',
      success: function(data){
        // Registro aprobado, actualizar acceso y mostrar alertas
        if (data == "1C01SCL"){
          window.localStorage.setItem('rsc_ver','ec01ce');
          // Mostrar alertas
          document.getElementById('principal').innerHTML = "<img class='background' src='img/background.jpg'><div style='padding-top:55%;'></div><img src='img/img_1.png' class='w-100' onclick='enviar_alerta(\"b1\");'>";
        // Registro por aprobar, mostrar mensaje y salir
        }else{
          alert("Estamos verificando sus datos");
          navigator.app.exitApp();
        }
      },
      error: function(data){
        alert("Sin conexión a la red");
        navigator.app.exitApp();
      }
      });
    break;
    // Mostrar formulario para registro de usuario
    default:
      document.getElementById('principal').innerHTML = "<div id='registro'><br><h1>Completa el registro</h1><br><form><span class='text-1'>Nombres y Apellidos</span><input class='input-1' type='text' id='nombre' name='nombre'><span class='text-1'>Número Documento</span><input class='input-1' type='text' id='documento' name='documento'><span class='text-1'>Número Teléfono</span><input class='input-1' type='text' id='telefono' name='telefono'><span class='text-1'>E-mail</span><input class='input-1' type='text' id='email' name='email'><input class='submit-1' type='button' value='Enviar' onclick='obtener_form();'></form></div>";
      console.log("formulario");
}


function obtener_form(){

	var nombre = document.getElementById("nombre").value;
	var documento = document.getElementById("documento").value;
	var telefono = document.getElementById("telefono").value;
	var email = document.getElementById("email").value;

  if (nombre.length < 10){
    alert("Por favor, ingresa tu nombre completo.");
  }else if (documento.length < 8){
    alert("Por favor, ingresa tu documento de identidad");
  }else if(telefono.length < 9){
    alert("Por favor, ingresa tu número de celular.")
  }else if(email.length < 10){
    alert("Por favor, ingresa tu correo electrónico.")
  }else{
    if (datos_enviados == 0 && gps == 1) {
      datos_enviados = 1;
      alert("¡Bienvenido!.");
      window.localStorage.setItem('rsc_doc', documento);
      window.localStorage.setItem('rsc_ver','ec01ce');
      //window.localStorage.setItem('rsc_ver','ec01ce');
      $.ajax({
        type: 'POST',
        data: 'nombre='+nombre+'&documento='+documento+'&telefono='+telefono+'&email='+email,
        url: 'http://alertasanmiguel.tecnicom.pe/scripts/reg_11101949.php',
      success: function(data){
        document.getElementById('principal').innerHTML = "<img class='background' src='img/background.jpg'><div style='padding-top:55%;'></div><img src='img/img_1.png' class='w-100' onclick='enviar_alerta(\"b1\");'>";
        datos_enviados = 0;
      },
      error: function(data){
        console.log("Sin conexión a la red");
        //navigator.app.exitApp();
      }
      });
      //navigator.app.exitApp();
    }
  }
}

function enviar_alerta(boton){

  if (datos_enviados == 0) {
    datos_enviados = 1;

  /*  // Verificar red
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'N';
    states[Connection.ETHERNET] = 'S';
    states[Connection.WIFI]     = 'S';
    states[Connection.CELL_2G]  = 'S';
    states[Connection.CELL_3G]  = 'S';
    states[Connection.CELL_4G]  = 'S';
    states[Connection.CELL]     = 'S';
    states[Connection.NONE]     = 'N';

    // ¿Dispone de datos para enviar/recibir?
    if (states[networkState] == "S"){
      $.ajax({
        async: false,
        type: 'POST',
        data: 'test=1',
        url: 'http://alertasanmiguel.tecnicom.pe/index.php',
      success: function(data){
        boton = boton+"S";
      },
      error: function(data){
        boton = boton+"N";
      }
      });
    }else{
      boton = boton+"N";
    }
    tipo_alerta(boton);*/
     document.getElementById('principal').innerHTML = "<h3>Enviando alerta, un momento por favor.</h3>";
      navigator.geolocation.watchPosition(disp,error,{maximumAge: 0, timeout: 5000, enableHighAccuracy: true});
      $.ajax({
        type: 'POST',
        data: 'documento='+documento+'&alerta=1'+'&latitud='+latitud+'&longitud='+longitud,
        url: 'http://alertasanmiguel.tecnicom.pe/scripts/reg_13102039.php',
      success: function(data){
        document.getElementById('principal').innerHTML = "<h3>Alerta enviada, nos comunicaremos en breve.</h3>";
        setTimeout(function(){ navigator.app.exitApp(); }, 2000);
         /*document.getElementById('principal').innerHTML = "<img class='background' src='img/background.jpg'><div style='padding-top:55%;'></div><img src='img/img_1.png' class='w-100' onclick='enviar_alerta(\"b1\");'><img src='img/img_2.png' class='w-100' onclick='window.open(\"tel:105\", \"_system\");'><img src='img/img_3.png' class='w-100' onclick='window.open(\"tel:116\", \"_system\");'>";*/
      },
      error: function(data){
        alert('error_');
      }
      });
  }
}

function tipo_alerta(alerta){
  switch(alerta) {
    case "b1N":
      window.open('tel:9999999', '_system');
    break;
    case "b1S":
      alert('Alerta enviada, nos comunicaremos en breve');
      navigator.geolocation.watchPosition(disp,error,{maximumAge: 0, timeout: 5000, enableHighAccuracy: true});
      $.ajax({
        type: 'POST',
        data: 'documento='+documento+'&alerta=1'+'&latitud='+latitud+'&longitud='+longitud,
        url: 'http://alertasanmiguel.tecnicom.pe/scripts/reg_13102039.php',
      success: function(data){
         document.getElementById('principal').innerHTML = "<img class='background' src='img/background.jpg'><div style='padding-top:55%;'></div><img src='img/img_1.png' class='w-100' onclick='enviar_alerta(\"b1\");'><img src='img/img_2.png' class='w-100' onclick='window.open(\"tel:999999999\", \"_system\");'><img src='img/img_3.png' class='w-100' onclick='window.open(\"tel:888888888\", \"_system\");'>";
      },
      error: function(data){
        console.log('error_');
      }
      });
    break;
    default:
      console.log('default');
  }
}
