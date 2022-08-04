
const { contextBridge, ipcRenderer } = require("electron");
const http2 = require("http2");
contextBridge.exposeInMainWorld("electron", {
  checkInternet: function () {
    var timeout=false
    var connect=false
    var error =false
      let Extableciendoconexion = document.getElementById("extableciendoconexion");
      let cargaSinExito = document.getElementById("cargaSinExito");
      let intentandoconectar = document.getElementById("intentandoconectar");
      let sinInternet = document.getElementById("sinInternet");
      let botonActualizar = document.getElementById("botonActualizardiv");
    function checkInternet() {
      return new Promise((resolve) => {
           if ( timeout || error ) {  
             timeout=false
             connect=false
             error =false
             intentandoconectar.style.display ="flex";
             botonActualizar.style.display = "none";
             cargaSinExito.style.display = "none";
             sinInternet.style.display = "none";
             Extableciendoconexion.style.display="none";
           }
           const client = http2.connect("https://www.google.com");
           client.setTimeout(20000);
           client.on("timeout", () => {
            resolve(false);
             client.destroy();
             timeout=true
             connect=false
             error =false
             botonActualizar.style.display = "flex";
             cargaSinExito.style.display = "flex";
             Extableciendoconexion.style.display="none";
             intentandoconectar.style.display ="none";
             sinInternet.style.display = "none"
           });
           client.on("connect", () => {
               client.destroy();
               resolve(true);
               connect=true
               timeout=false
               error =false
               Extableciendoconexion.style.display = "flex";
               cargaSinExito.style.display = "none";
               intentandoconectar.style.display ="none";
               sinInternet.style.display = "none";
               botonActualizar.style.display = "none";
               ipcRenderer.send("destruirVentanaView");
          
           });
           client.on("error", () => {
             client.destroy();
             timeout=false
             connect=false
             error =true
             resolve(false);
             sinInternet.style.display = "flex";
             botonActualizar.style.display = "flex";
             cargaSinExito.style.display = "none";
             Extableciendoconexion.style.display="none";
             intentandoconectar.style.display ="none";
           });
        
      });
    }
    checkInternet();
    document.getElementById("botonActualizar").addEventListener("click", () => {
     if (window.navigator.onLine) {
       checkInternet();
     }
    });
  },
});
