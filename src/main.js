const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  net,
  BrowserView,
  globalShortcut,
  dialog
} = require("electron");
const contextMenu = require('electron-context-menu');
const path = require("path");
const userPrompt = require('./alertDialog/index');
var destruirVentanaView =false
let ventanaMinimize =false
function crearVentanaPrincipal() {
  let ventanaPrincipal = new BrowserWindow({
    icon: path.join(__dirname, "./assets/icons/win/icon.ico"),
    title: "Dory",
    width: 800,
    height: 768,
    minWidth: 750,
    minHeight: 320,
    show: false,
    frame:false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      spellcheck: true
    },
  });
  ventanaPrincipal.maximize();
  ventanaPrincipal.setMenu(null);
  contextMenu(
  {
    labels: {
        cut: 'Cortar',
        copy: 'Copiar',
        paste: 'Pegar',
    },
    showInspectElement:false,
    showCopyImage:false,
    showSearchWithGoogle:false,
    showLearnSpelling:false,
    prepend: (defaultActions, parameters, browserWindow) => [
		{
			label: 'Buscar en Google',
			visible: parameters.selectionText.trim().length > 0,
			click: () => {
				shell.openExternal(`https://google.com/search?q=${encodeURIComponent(parameters.selectionText)}`);
			}
		}
	]
});
function controlGoBackAndGoForward() {
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
}
function controlMinMaxCloseAndCustomTitleBar () {
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
}
function dialogoventan () {
  ipcMain.on("dialog", (event,arg) => {
    const urlValue= arg
const icon = path.join(__dirname, "./assets/icons/win/icon.ico");
userPrompt('Insertar la URL', 'https://www.google.com', icon,urlValue)
  .then(input => {
    event.reply("onDialog", input);
  })
  .catch(err => {
    /* console.log(err); */
  });   
  });
}
function ViewCheckInternet() { 
const view = new BrowserView({
      frame:true,
      webPreferences: {
        preload: path.join(__dirname, "./checkInternet/preload.js")
      },
    });
    ventanaPrincipal.setBrowserView(view);
    let tamaños = ventanaPrincipal.getContentSize();
    view.setAutoResize({ width: true, height: true ,horizontal:true,vertical:true});
    view.setBounds({ x: 0, y: 0, width: tamaños[0]+14, height: tamaños[1]+18 });
    view.webContents.loadFile(
      path.join(__dirname, "./checkInternet/checkInternet.html")
    );
   /*  view.webContents.openDevTools() */
    ipcMain.on("destruirVentanaView", function () {
      destruirVentanaView=true
      ventanaPrincipal.webContents.reload();
      ventanaPrincipal.webContents.on("did-finish-load",()=>{
        if (destruirVentanaView) {
            destruirVentanaView=false
            setTimeout(() => {
              view.webContents.destroy()
              ventanaPrincipal.setBrowserView(null);
            }, 5000);
        }
      })
    });
}
controlGoBackAndGoForward()
controlMinMaxCloseAndCustomTitleBar()
dialogoventan()

  ventanaPrincipal.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      if (
        errorDescription === "ERR_NAME_NOT_RESOLVED" ||
        errorDescription === "ERR_INTERNET_DISCONNECTED" ||
        errorDescription === "ERR_TIMED_OUT" ||
        errorDescription === "ERR_CONNECTION_TIMED_OUT"
      ) {
        ViewCheckInternet() 
      }
    }
  );
  if (net.online) {
    ViewCheckInternet() 
  }
  /* Me permite abrir una url en mi navegador predeterminado */
  ventanaPrincipal.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes("https://accounts.google.com")) {
      let win = {
        action: "allow",
        overrideBrowserWindowOptions: {
          width: 500,
          height: 620,
          titleBarOverlay: true,
          titleBarStyle: "hidden",
        },
      };
      return win;
    } else {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });
  ventanaPrincipal.webContents.openDevTools() 
   ventanaPrincipal.loadURL("https://dory-web-app-pruebas.herokuapp.com");
   /* ventanaPrincipal.loadURL("http://localhost:4200/dashboard/perfil"); */
}
//Evento que muestra la IU
app.whenReady().then(() => {
  crearVentanaPrincipal();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      crearVentanaPrincipal();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
