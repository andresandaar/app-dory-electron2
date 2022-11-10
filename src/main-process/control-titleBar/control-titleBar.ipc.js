const electron = require('electron');
const BrowserWindow = electron.BrowserWindow 
const BrowserView= electron.BrowserView
const globalShortcut =electron.globalShortcut
const ipcMain = electron.ipcMain 


module.exports = function () { 
  this.controlMinMaxClo = () => {
    try {
         ipcMain.on("activeCustomTitleBarElectronInAngular", (event) => {
    event.reply("activateCustomTitleBarnElectron", "CustomTitleBarActivated");
  });
  ipcMain.on("min-button", (event) => {
    var window = BrowserWindow.getFocusedWindow();
    window.minimize();
  });
  ipcMain.on("max-button", (event) => {
     var window = BrowserWindow.getFocusedWindow();
    if(window.isMaximized()){
       window.unmaximize();
      }else{
       window.maximize();
     }
  });
  ipcMain.on("close-button", (event) => {
    var window = BrowserWindow.getFocusedWindow();
    window.close();
  });
        
    } catch (error) { 
    }
  }
  this.controlAvansRetro = (ventanaPrincipal=BrowserView) => {
   try {
    let ventanaMinimize =false
      /* Teclas de Acceso Rapido avasar y retroceder  y control de botones*/
   globalShortcut.register('Alt+Left', () => {
  if (ventanaPrincipal.webContents.canGoBack() && !ventanaMinimize ) {
    /* Retrocede una pagina */
    ventanaPrincipal.webContents.goBack()
  }
    })
   globalShortcut.register('Alt+Right', () => {
     if (ventanaPrincipal.webContents.canGoForward() && !ventanaMinimize) {
      /*Avanza una pagina */
       ventanaPrincipal.webContents.goForward()
     }
    })
    /* ventanaPrincipal.webContents.openDevTools(); */
    ventanaPrincipal.on("blur",()=>{
      /* Evento se activa cuando la ventana pierde el focus */
     ventanaMinimize=true
    })
    ventanaPrincipal.on("focus",()=>{
      /* Evento se activa cuando la ventana gana el focus */
     ventanaMinimize=false
    })
    // Realizamos una navegacion de cualquier cuadro
    ventanaPrincipal.webContents.on("did-navigate-in-page",()=>{
      let canGoForward= ventanaPrincipal.webContents.canGoForward() 
      /* Verifica si se puede avanzar una pagina:Boolean, eviamos la respuesta
      a la pagina*/
        ventanaPrincipal.webContents.send(
          "canGoForward",
           canGoForward
        );
        /* Verifica si se puede retroceder en la pagina:Boolean, eviamos la respuesta
      a la pagina*/
      let canGoBack= ventanaPrincipal.webContents.canGoBack()
       ventanaPrincipal.webContents.send(
          "canGoBack",
           canGoBack
        );
    })
    /* Fin */
    
   } catch (error) {
    
   }
  }
    }
